using System.Text.Json;
using Seedr.Models;

namespace Seedr;

public class CatalogParser
{
    public static void RunCatalogParser(string[] args)
    {
        // Run the catalog file parser
        var allPlants = new List<Plant>();
        var allErrors = new List<string>();

        // Parse both catalog files
        var files = new[] { "catalog.txt", "archived_catalog.txt" };

        foreach (var fileName in files)
        {
            Console.WriteLine($"\n=== Parsing {fileName} ===");
            
            // Get the directory where the executable is located
            var exeDir = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
            var inputFilePath = Path.Combine(exeDir, fileName);
            
            if (!File.Exists(inputFilePath))
            {
                Console.WriteLine($"File {fileName} not found at {inputFilePath}, skipping...");
                continue;
            }
            
            var fileContent = File.ReadAllText(inputFilePath);
            var plantEntries = ExtractPlantEntries(fileContent);
            
            Console.WriteLine($"Found {plantEntries.Count} plant entries in {fileName}");
            
            var plants = new List<Plant>();
            var errors = new List<string>();
            
            for (int i = 0; i < plantEntries.Count; i++)
            {
                var catalogText = plantEntries[i];
                try
                {
                    // Parse the plant data
                    Plant plant = Plant.ParseFromCatalogText(catalogText);
                    
                    // Set IsArchived based on the source file
                    plant.IsArchived = fileName == "archived_catalog.txt";
                    
                    plants.Add(plant);
                    Console.WriteLine($"✓ Parsed: {plant.BotanicalName}");
                }
                catch (Exception ex)
                {
                    string error = $"Error parsing plant entry {i + 1} in {fileName}: {ex.Message}";
                    errors.Add(error);
                    Console.WriteLine($"✗ {error}");
                    Console.WriteLine($"  Text: {catalogText.Substring(0, Math.Min(100, catalogText.Length))}...");
                }
            }
            
            Console.WriteLine($"\n{fileName} Results:");
            Console.WriteLine($"  ✓ Successfully parsed: {plants.Count}");
            Console.WriteLine($"  ✗ Errors: {errors.Count}");
            
            allPlants.AddRange(plants);
            allErrors.AddRange(errors);
        }

        // Create JSON options for pretty printing
        var options = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        // Serialize to JSON
        string json = JsonSerializer.Serialize(allPlants, options);

        // Write to file
        var executableDir = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
        string filePath = Path.Combine(executableDir, "ParsedData", "all_catalogs_parsed.json");
        
        // Ensure the ParsedData directory exists
        var parsedDataDir = Path.GetDirectoryName(filePath);
        if (!Directory.Exists(parsedDataDir))
        {
            Directory.CreateDirectory(parsedDataDir);
        }
        
        File.WriteAllText(filePath, json);

        Console.WriteLine($"\n=== FINAL RESULTS ===");
        Console.WriteLine($"Total plants parsed successfully: {allPlants.Count}");
        Console.WriteLine($"Total errors encountered: {allErrors.Count}");
        Console.WriteLine($"Success rate: {(double)allPlants.Count / (allPlants.Count + allErrors.Count) * 100:F1}%");

        if (allErrors.Count > 0)
        {
            Console.WriteLine($"\nErrors encountered:");
            foreach (var error in allErrors.Take(10)) // Show first 10 errors
            {
                Console.WriteLine($"  - {error}");
            }
            if (allErrors.Count > 10)
            {
                Console.WriteLine($"  ... and {allErrors.Count - 10} more errors");
            }
        }

        Console.WriteLine($"\nAll plant data saved to ParsedData/all_catalogs_parsed.json");

        if (allPlants.Count > 0)
        {
            Console.WriteLine($"\nFirst plant data preview:");
            string firstPlantJson = JsonSerializer.Serialize(allPlants[0], options);
            Console.WriteLine(firstPlantJson);
        }
    }

    private static List<string> ExtractPlantEntries(string fileContent)
    {
        var entries = new List<string>();
        var lines = fileContent.Split('\n');
        
        var currentEntry = new System.Text.StringBuilder();
        
        foreach (var line in lines)
        {
            var trimmedLine = line.Trim();
            
            // Skip empty lines
            if (string.IsNullOrEmpty(trimmedLine))
            {
                if (currentEntry.Length > 0)
                {
                    entries.Add(currentEntry.ToString().Trim());
                    currentEntry.Clear();
                }
                continue;
            }
            
            // Check if this line starts a new plant entry (contains botanical name pattern)
            if (IsNewPlantEntry(trimmedLine))
            {
                // Save previous entry if it exists
                if (currentEntry.Length > 0)
                {
                    entries.Add(currentEntry.ToString().Trim());
                    currentEntry.Clear();
                }
            }
            else if (IsContinuationLine(trimmedLine))
            {
                // This is a continuation line (starts with plant code)
                // Skip it - we don't want to create separate entries for these
                continue;
            }
            
            // Add line to current entry
            if (currentEntry.Length > 0)
            {
                currentEntry.Append(" ");
            }
            currentEntry.Append(trimmedLine);
        }
        
        // Add the last entry if it exists
        if (currentEntry.Length > 0)
        {
            entries.Add(currentEntry.ToString().Trim());
        }
        
        return entries;
    }
    
    private static bool IsContinuationLine(string line)
    {
        // Check if line starts with a plant code pattern (numeric like "78657.17")
        return System.Text.RegularExpressions.Regex.IsMatch(line, @"^[0-9]+\.[0-9]+");
    }

    private static bool IsNewPlantEntry(string line)
    {
        // Skip lines that start with plant codes (numeric pattern like "78657.17")
        if (System.Text.RegularExpressions.Regex.IsMatch(line, @"^[0-9]+\.[0-9]+"))
        {
            return false; // This is a continuation line, not a new plant entry
        }
        
        // Check if line starts with a botanical name pattern (Capital letter followed by lowercase letters)
        // and contains parentheses with family name
        return System.Text.RegularExpressions.Regex.IsMatch(line, @"^[A-Z][a-z]+\s+[a-z]+\s+\([^)]+\)");
    }
}
