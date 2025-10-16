using System.Text.Json;
using Seedr.Models;

namespace Seedr;

public class PlantImageRetriever
{
    private readonly BotanicalApiClient _apiClient;
    private readonly ImageDownloader _imageDownloader;
    private readonly Dictionary<string, (string imageUrl, string thumbnailUrl, string source, string license)> _manualOverrides;
    private readonly string _outputPath;
    private readonly bool _enableImageRetrieval;
    private readonly int _dailyLimit;
    private int _apiCallCount = 0;

    public PlantImageRetriever(string perenualApiKey, string outputPath, bool enableImageRetrieval = true, int dailyLimit = 100)
    {
        _apiClient = new BotanicalApiClient(perenualApiKey);
        _imageDownloader = new ImageDownloader(outputPath);
        _outputPath = outputPath;
        _enableImageRetrieval = enableImageRetrieval;
        _dailyLimit = dailyLimit;
        _manualOverrides = LoadManualOverrides();
    }

    public static void RunImageRetrieval(List<Plant> plants)
    {
        Console.WriteLine("\n=== Plant Image Retrieval ===");
        
        // Load settings
        var settings = LoadSettings();
        var enableRetrieval = settings.ApiSettings?.EnableImageRetrieval ?? false;
        
        if (!enableRetrieval)
        {
            Console.WriteLine("Image retrieval is disabled in appsettings.json");
            return;
        }

        // Get API key from environment variable
        var perenualApiKey = Environment.GetEnvironmentVariable("PERENUAL_API_KEY") ?? "";
        if (string.IsNullOrEmpty(perenualApiKey))
        {
            Console.WriteLine("⚠️  PERENUAL_API_KEY environment variable not set. Using manual overrides only.");
        }

        // Get output path (SeedrApp/public/plant-images)
        var executablePath = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
        var outputPath = Path.Combine(executablePath!, "..", "..", "..", "..", "SeedrApp", "public", "plant-images");
        outputPath = Path.GetFullPath(outputPath);

        var retriever = new PlantImageRetriever(perenualApiKey, outputPath, enableRetrieval, settings.ApiSettings?.DailyImageLimit ?? 100);
        
        int retrieved = 0;
        int failed = 0;
        int skipped = 0;

        Console.WriteLine($"Processing {plants.Count} plants...");
        Console.WriteLine($"Daily API limit: {settings.ApiSettings?.DailyImageLimit ?? 100}");

        foreach (var plant in plants)
        {
            // Skip if already has image
            if (!string.IsNullOrEmpty(plant.ImageUrl))
            {
                skipped++;
                continue;
            }

            var result = retriever.GetPlantImageAsync(plant.BotanicalName).Result;
            
            if (result.HasValue)
            {
                plant.ImageUrl = result.Value.mediumPath;
                plant.ThumbnailUrl = result.Value.thumbnailPath;
                plant.ImageSource = result.Value.source;
                plant.ImageLicense = result.Value.license;
                retrieved++;
                Console.WriteLine($"✓ Retrieved image for {plant.BotanicalName}");
            }
            else
            {
                failed++;
                if (failed <= 10) // Only show first 10 failures
                {
                    Console.WriteLine($"✗ No image found for {plant.BotanicalName}");
                }
            }

            // Check if we've hit the daily limit
            if (retriever._apiCallCount >= retriever._dailyLimit)
            {
                Console.WriteLine($"\n⚠️  Reached daily API limit of {retriever._dailyLimit}. Stopping image retrieval.");
                Console.WriteLine("Run again tomorrow or increase the limit in appsettings.json");
                break;
            }
        }

        Console.WriteLine($"\n=== Image Retrieval Complete ===");
        Console.WriteLine($"✓ Successfully retrieved: {retrieved}");
        Console.WriteLine($"✗ Failed to find: {failed}");
        Console.WriteLine($"⊘ Skipped (already have images): {skipped}");
        Console.WriteLine($"📊 API calls made: {retriever._apiCallCount}");
        Console.WriteLine($"💾 Coverage: {((retrieved + skipped) * 100.0 / plants.Count):F1}%");
        
        retriever.Dispose();
    }

    public async Task<(string mediumPath, string thumbnailPath, string source, string license)?> GetPlantImageAsync(string botanicalName)
    {
        if (!_enableImageRetrieval)
            return null;

        // Check manual overrides first
        if (_manualOverrides.TryGetValue(botanicalName.ToLower(), out var manualOverride))
        {
            Console.WriteLine($"Using manual override for {botanicalName}");
            return (manualOverride.imageUrl, manualOverride.thumbnailUrl, manualOverride.source, manualOverride.license);
        }

        // Try API retrieval
        if (_apiCallCount < _dailyLimit)
        {
            _apiCallCount++;
            var imageResult = await _apiClient.GetPlantImageAsync(botanicalName);
            
            if (imageResult.HasValue)
            {
                var (imageUrl, source, license) = imageResult.Value;
                
                // Download and resize the image
                var (mediumPath, thumbnailPath) = await _imageDownloader.DownloadAndResizeImageAsync(imageUrl!, botanicalName);
                
                if (mediumPath != null && thumbnailPath != null)
                {
                    return (mediumPath, thumbnailPath, source!, license!);
                }
            }
        }

        return null;
    }

    private Dictionary<string, (string imageUrl, string thumbnailUrl, string source, string license)> LoadManualOverrides()
    {
        var overrides = new Dictionary<string, (string, string, string, string)>();
        
        try
        {
            var csvPath = Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location)!, "Data", "plant-image-overrides.csv");
            
            if (!File.Exists(csvPath))
            {
                Console.WriteLine($"Manual overrides file not found: {csvPath}");
                return overrides;
            }

            var lines = File.ReadAllLines(csvPath);
            foreach (var line in lines.Skip(1)) // Skip header
            {
                if (string.IsNullOrWhiteSpace(line) || line.StartsWith("#"))
                    continue;

                var parts = line.Split(',');
                if (parts.Length >= 5)
                {
                    var botanicalName = parts[0].Trim().ToLower();
                    var imageUrl = parts[1].Trim();
                    var thumbnailUrl = parts[2].Trim();
                    var source = parts[3].Trim();
                    var license = parts[4].Trim();
                    
                    overrides[botanicalName] = (imageUrl, thumbnailUrl, source, license);
                }
            }
            
            Console.WriteLine($"Loaded {overrides.Count} manual image overrides");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error loading manual overrides: {ex.Message}");
        }

        return overrides;
    }

    private static AppSettings LoadSettings()
    {
        try
        {
            var settingsPath = Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location)!, "appsettings.json");
            
            if (!File.Exists(settingsPath))
            {
                Console.WriteLine("appsettings.json not found, using defaults");
                return new AppSettings();
            }

            var json = File.ReadAllText(settingsPath);
            return JsonSerializer.Deserialize<AppSettings>(json) ?? new AppSettings();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error loading settings: {ex.Message}");
            return new AppSettings();
        }
    }

    public void Dispose()
    {
        _apiClient?.Dispose();
        _imageDownloader?.Dispose();
    }
}

// Settings models
public class AppSettings
{
    public ImageSettings? ImageSettings { get; set; }
    public ApiSettings? ApiSettings { get; set; }
}

public class ImageSettings
{
    public int MediumMaxWidth { get; set; } = 800;
    public int ThumbnailMaxWidth { get; set; } = 300;
    public int JpegQuality { get; set; } = 85;
    public int DownloadTimeout { get; set; } = 30;
}

public class ApiSettings
{
    public int DailyImageLimit { get; set; } = 100;
    public bool EnableImageRetrieval { get; set; } = true;
}

