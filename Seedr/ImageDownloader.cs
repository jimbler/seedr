using SkiaSharp;
using System.Text.RegularExpressions;

namespace Seedr;

public class ImageDownloader
{
    private readonly HttpClient _httpClient;
    private readonly int _mediumMaxWidth;
    private readonly int _thumbnailMaxWidth;
    private readonly int _jpegQuality;
    private readonly int _downloadTimeout;
    private readonly string _outputBasePath;

    public ImageDownloader(string outputBasePath, int mediumMaxWidth = 800, int thumbnailMaxWidth = 300, int jpegQuality = 85, int downloadTimeout = 30)
    {
        _httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(downloadTimeout)
        };
        // Add User-Agent header required by Wikimedia Commons and other sources
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "SeedrApp/1.0 (Plant seed database application; https://github.com/seedr)");
        _mediumMaxWidth = mediumMaxWidth;
        _thumbnailMaxWidth = thumbnailMaxWidth;
        _jpegQuality = jpegQuality;
        _downloadTimeout = downloadTimeout;
        _outputBasePath = outputBasePath;
    }

    /// <summary>
    /// Downloads an image from a URL, resizes it to medium and thumbnail sizes, and saves them
    /// </summary>
    /// <param name="imageUrl">URL of the image to download</param>
    /// <param name="botanicalName">Botanical name of the plant (used for filename)</param>
    /// <returns>Tuple of (mediumPath, thumbnailPath) relative to public directory, or (null, null) if failed</returns>
    public async Task<(string? mediumPath, string? thumbnailPath)> DownloadAndResizeImageAsync(string imageUrl, string botanicalName)
    {
        try
        {
            // Download the image
            var imageBytes = await _httpClient.GetByteArrayAsync(imageUrl);
            
            // Normalize botanical name for filename
            var normalizedName = NormalizeBotanicalName(botanicalName);
            var firstLetter = normalizedName[0].ToString().ToLower();
            
            // Create directory if it doesn't exist
            var letterDir = Path.Combine(_outputBasePath, firstLetter);
            Directory.CreateDirectory(letterDir);
            
            // Define output paths
            var mediumFilename = $"{normalizedName}_medium.jpg";
            var thumbnailFilename = $"{normalizedName}_thumb.jpg";
            var mediumPath = Path.Combine(letterDir, mediumFilename);
            var thumbnailPath = Path.Combine(letterDir, thumbnailFilename);
            
            // Process and save medium image
            using (var inputStream = new MemoryStream(imageBytes))
            using (var original = SKBitmap.Decode(inputStream))
            {
                if (original == null)
                {
                    Console.WriteLine($"Failed to decode image for {botanicalName}");
                    return (null, null);
                }
                
                // Resize and save medium image
                var mediumBitmap = ResizeImage(original, _mediumMaxWidth);
                SaveAsJpeg(mediumBitmap, mediumPath, _jpegQuality);
                mediumBitmap.Dispose();
                
                // Resize and save thumbnail
                var thumbnailBitmap = ResizeImage(original, _thumbnailMaxWidth);
                SaveAsJpeg(thumbnailBitmap, thumbnailPath, _jpegQuality);
                thumbnailBitmap.Dispose();
            }
            
            // Return relative paths from public directory
            var relativeMediumPath = $"/plant-images/{firstLetter}/{mediumFilename}";
            var relativeThumbnailPath = $"/plant-images/{firstLetter}/{thumbnailFilename}";
            
            return (relativeMediumPath, relativeThumbnailPath);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error downloading/processing image for {botanicalName}: {ex.Message}");
            return (null, null);
        }
    }

    /// <summary>
    /// Normalizes botanical name for use as filename
    /// </summary>
    private string NormalizeBotanicalName(string botanicalName)
    {
        // Convert to lowercase
        var normalized = botanicalName.ToLower();
        
        // Replace spaces with hyphens
        normalized = normalized.Replace(" ", "-");
        
        // Remove special characters except hyphens
        normalized = Regex.Replace(normalized, @"[^a-z0-9\-]", "");
        
        // Remove multiple consecutive hyphens
        normalized = Regex.Replace(normalized, @"-+", "-");
        
        // Trim hyphens from start and end
        normalized = normalized.Trim('-');
        
        return normalized;
    }

    /// <summary>
    /// Resizes an image maintaining aspect ratio
    /// </summary>
    private SKBitmap ResizeImage(SKBitmap original, int maxWidth)
    {
        // Calculate new dimensions maintaining aspect ratio
        int newWidth = original.Width;
        int newHeight = original.Height;
        
        if (original.Width > maxWidth)
        {
            newWidth = maxWidth;
            newHeight = (int)((float)original.Height * maxWidth / original.Width);
        }
        
        // Create resized bitmap using new SKSamplingOptions
        var samplingOptions = new SKSamplingOptions(SKFilterMode.Linear, SKMipmapMode.Linear);
        var resizedBitmap = original.Resize(new SKImageInfo(newWidth, newHeight), samplingOptions);
        return resizedBitmap ?? original;
    }

    /// <summary>
    /// Saves a bitmap as JPEG with specified quality
    /// </summary>
    private void SaveAsJpeg(SKBitmap bitmap, string path, int quality)
    {
        using var image = SKImage.FromBitmap(bitmap);
        using var data = image.Encode(SKEncodedImageFormat.Jpeg, quality);
        using var stream = File.OpenWrite(path);
        data.SaveTo(stream);
    }

    public void Dispose()
    {
        _httpClient?.Dispose();
    }
}

