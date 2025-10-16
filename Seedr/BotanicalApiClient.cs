using System.Text.Json;
using System.Text.Json.Serialization;
using System.Net.Http;
using Seedr.Models;

namespace Seedr;

public class BotanicalApiClient
{
    private readonly HttpClient _httpClient;
    private readonly string _perenualApiKey;
    private readonly string _plantIdApiKey;
    private bool _perenualRateLimited = false;
    
    public BotanicalApiClient(string perenualApiKey = "", string plantIdApiKey = "")
    {
        _httpClient = new HttpClient();
        // Set User-Agent header required by Wikimedia Commons API
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "SeedrApp/1.0 (Plant seed database application)");
        _perenualApiKey = perenualApiKey;
        _plantIdApiKey = plantIdApiKey;
    }
    
    public async Task<string?> GetCommonNameAsync(string botanicalName)
    {
        // Try multiple APIs in order of preference
        var commonName = await TryPerenualApiAsync(botanicalName);
        if (!string.IsNullOrEmpty(commonName))
            return commonName;
            
        commonName = await TryPlantIdApiAsync(botanicalName);
        if (!string.IsNullOrEmpty(commonName))
            return commonName;
            
        commonName = await TryUsdaPlantsApiAsync(botanicalName);
        if (!string.IsNullOrEmpty(commonName))
            return commonName;
            
        return null;
    }
    
    /// <summary>
    /// Retrieves plant image URLs from various APIs
    /// </summary>
    /// <returns>Tuple of (imageUrl, source, license) or null if not found</returns>
    public async Task<(string? imageUrl, string? source, string? license)?> GetPlantImageAsync(string botanicalName)
    {
        // Try APIs in order of preference - Wikimedia Commons prioritized for plant coverage
        var result = await TryWikimediaCommonsImageAsync(botanicalName);
        if (result.HasValue)
            return result;
            
        result = await TryINaturalistImageAsync(botanicalName);
        if (result.HasValue)
            return result;
            
        result = await TryPerenualImageAsync(botanicalName);
        if (result.HasValue)
            return result;
            
        result = await TryGbifImageAsync(botanicalName);
        if (result.HasValue)
            return result;
            
        result = await TryCalfloraImageAsync(botanicalName);
        if (result.HasValue)
            return result;
            
        return null;
    }
    
    private async Task<string?> TryPerenualApiAsync(string botanicalName)
    {
        try
        {
            // Perenual API - Free tier: 30 requests per day
            var url = $"https://perenual.com/api/species-list?key={_perenualApiKey}&q={Uri.EscapeDataString(botanicalName)}";
            var response = await _httpClient.GetStringAsync(url);
            var data = JsonSerializer.Deserialize<PerenualResponse>(response);
            
            if (data?.Data?.Any() == true)
            {
                var plant = data.Data.First();
                return plant.CommonName;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Perenual API error for {botanicalName}: {ex.Message}");
        }
        
        return null;
    }
    
    private async Task<string?> TryPlantIdApiAsync(string botanicalName)
    {
        try
        {
            // Plant.id API - Requires API key
            if (string.IsNullOrEmpty(_plantIdApiKey))
                return null;
                
            var url = "https://api.plant.id/v3/identification";
            var request = new
            {
                images = new[] { "" }, // We're not using images, just text
                plant_details = new[] { "common_names", "url" }
            };
            
            var json = JsonSerializer.Serialize(request);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            _httpClient.DefaultRequestHeaders.Add("Api-Key", _plantIdApiKey);
            
            var response = await _httpClient.PostAsync(url, content);
            var responseText = await response.Content.ReadAsStringAsync();
            
            // Note: Plant.id is primarily for image identification, not text lookup
            // This is a placeholder for future implementation
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Plant.id API error for {botanicalName}: {ex.Message}");
        }
        
        return null;
    }
    
    private async Task<string?> TryUsdaPlantsApiAsync(string botanicalName)
    {
        try
        {
            // USDA PLANTS Database - Free, no API key required
            var url = $"https://plants.usda.gov/api/plants/search?q={Uri.EscapeDataString(botanicalName)}";
            var response = await _httpClient.GetStringAsync(url);
            var data = JsonSerializer.Deserialize<UsdaResponse>(response);
            
            if (data?.Data?.Any() == true)
            {
                var plant = data.Data.First();
                return plant.CommonName?.FirstOrDefault();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"USDA API error for {botanicalName}: {ex.Message}");
        }
        
        return null;
    }
    
    private async Task<(string? imageUrl, string? source, string? license)?> TryPerenualImageAsync(string botanicalName)
    {
        try
        {
            // Skip if no API key or already rate limited
            if (string.IsNullOrEmpty(_perenualApiKey) || _perenualRateLimited)
                return null;
                
            // Perenual API includes default_image field
            var url = $"https://perenual.com/api/species-list?key={_perenualApiKey}&q={Uri.EscapeDataString(botanicalName)}";
            var httpResponse = await _httpClient.GetAsync(url);
            
            // Handle rate limiting - log once and skip for future calls
            if (httpResponse.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
            {
                if (!_perenualRateLimited)
                {
                    Console.WriteLine("⚠️  Perenual API rate limit reached. Falling back to GBIF and Wikimedia Commons for remaining plants.");
                    _perenualRateLimited = true;
                }
                return null;
            }
            
            // If other error, also fall back
            if (!httpResponse.IsSuccessStatusCode)
            {
                return null;
            }
            
            var response = await httpResponse.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<PerenualResponse>(response);
            
            if (data?.Data?.Any() == true)
            {
                var plant = data.Data.First();
                if (!string.IsNullOrEmpty(plant.DefaultImage?.OriginalUrl))
                {
                    return (plant.DefaultImage.OriginalUrl, "perenual", plant.DefaultImage.License ?? "Unknown");
                }
            }
        }
        catch (Exception)
        {
            // Silently fail and let fallback APIs handle it
            return null;
        }
        
        return null;
    }
    
    private async Task<(string? imageUrl, string? source, string? license)?> TryGbifImageAsync(string botanicalName)
    {
        try
        {
            // GBIF (Global Biodiversity Information Facility) - Free
            // First search for species key
            var searchUrl = $"https://api.gbif.org/v1/species/match?name={Uri.EscapeDataString(botanicalName)}";
            var searchResponse = await _httpClient.GetStringAsync(searchUrl);
            var searchData = JsonSerializer.Deserialize<GbifSearchResponse>(searchResponse);
            
            if (searchData?.UsageKey.HasValue == true)
            {
                // Get images for the species
                var imagesUrl = $"https://api.gbif.org/v1/species/{searchData.UsageKey}/media";
                var imagesResponse = await _httpClient.GetStringAsync(imagesUrl);
                var imagesData = JsonSerializer.Deserialize<GbifMediaResponse>(imagesResponse);
                
                if (imagesData?.Results?.Any() == true)
                {
                    var firstImage = imagesData.Results.First();
                    return (firstImage.Identifier, "gbif", firstImage.License ?? "Unknown");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"GBIF image API error for {botanicalName}: {ex.Message}");
        }
        
        return null;
    }
    
    private async Task<(string? imageUrl, string? source, string? license)?> TryINaturalistImageAsync(string botanicalName)
    {
        try
        {
            // iNaturalist API - Free, community observations with excellent plant coverage
            // Search for observations with photos
            var searchUrl = $"https://api.inaturalist.org/v1/taxa?q={Uri.EscapeDataString(botanicalName)}&rank=species,subspecies,variety&is_active=true";
            var searchResponse = await _httpClient.GetStringAsync(searchUrl);
            var searchData = JsonSerializer.Deserialize<INaturalistTaxaResponse>(searchResponse);
            
            if (searchData?.Results?.Any() == true)
            {
                var taxon = searchData.Results.First();
                
                // Get the default photo from the taxon
                if (taxon.DefaultPhoto?.MediumUrl != null)
                {
                    var license = taxon.DefaultPhoto.License ?? "CC BY-NC 4.0"; // Default iNaturalist license
                    return (taxon.DefaultPhoto.MediumUrl, "inaturalist", license);
                }
                
                // If no default photo, try to get observations with photos
                if (taxon.Id.HasValue)
                {
                    var obsUrl = $"https://api.inaturalist.org/v1/observations?taxon_id={taxon.Id}&quality_grade=research&photos=true&order=desc&order_by=votes&per_page=1";
                    var obsResponse = await _httpClient.GetStringAsync(obsUrl);
                    var obsData = JsonSerializer.Deserialize<INaturalistObservationsResponse>(obsResponse);
                    
                    if (obsData?.Results?.Any() == true && obsData.Results.First().Photos?.Any() == true)
                    {
                        var photo = obsData.Results.First().Photos.First();
                        var license = photo.License ?? "CC BY-NC 4.0";
                        return (photo.Url?.Replace("square", "medium"), "inaturalist", license);
                    }
                }
            }
        }
        catch (Exception)
        {
            // Silently fail and let fallback APIs handle it
            return null;
        }
        
        return null;
    }
    
    private async Task<(string? imageUrl, string? source, string? license)?> TryCalfloraImageAsync(string botanicalName)
    {
        try
        {
            // Calflora API - Free, California native plants
            // Note: Calflora doesn't have a public REST API for images
            // We'll construct direct image URLs based on their naming convention
            // This is best-effort and may not work for all plants
            
            // Calflora uses a specific URL pattern for plant photos
            // Format: https://www.calflora.org/entry/wdetail.html?tid=taxon_id
            // But we need to search first to get the taxon ID
            
            var searchUrl = $"https://www.calflora.org/app/taxalist?namesoup={Uri.EscapeDataString(botanicalName)}";
            var response = await _httpClient.GetStringAsync(searchUrl);
            
            // Calflora returns HTML, not JSON, so this is a simple check
            // If the response contains the botanical name, we can try to construct an image URL
            // This is a simplified implementation - a full implementation would parse the HTML
            
            if (response.Contains(botanicalName, StringComparison.OrdinalIgnoreCase))
            {
                // For now, we'll return null as Calflora requires more complex HTML parsing
                // or screen scraping which is not ideal for API integration
                // Consider this a placeholder for future enhancement
                return null;
            }
        }
        catch (Exception)
        {
            // Silently fail and let fallback APIs handle it
            return null;
        }
        
        return null;
    }
    
    private async Task<(string? imageUrl, string? source, string? license)?> TryWikimediaCommonsImageAsync(string botanicalName)
    {
        try
        {
            // Wikimedia Commons - Free, extensive plant image collection
            var searchUrl = $"https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=search&gsrsearch={Uri.EscapeDataString(botanicalName)}&gsrnamespace=6&gsrlimit=5&iiprop=url|extmetadata&iiurlwidth=800";
            var response = await _httpClient.GetStringAsync(searchUrl);
            var data = JsonSerializer.Deserialize<WikimediaResponse>(response);
            
            if (data?.Query?.Pages != null)
            {
                var firstPage = data.Query.Pages.Values.FirstOrDefault();
                if (firstPage?.ImageInfo?.Any() == true)
                {
                    var imageInfo = firstPage.ImageInfo.First();
                    var license = "CC BY-SA"; // Default for Wikimedia Commons
                    
                    // Try to get the actual license from metadata
                    if (imageInfo.ExtMetadata?.LicenseShortName?.Value != null)
                    {
                        license = imageInfo.ExtMetadata.LicenseShortName.Value;
                    }
                    
                    return (imageInfo.Url ?? imageInfo.ThumbUrl, "wikimedia", license);
                }
            }
        }
        catch (Exception)
        {
            // Silently fail and let fallback APIs handle it
            return null;
        }
        
        return null;
    }
    
    public void Dispose()
    {
        _httpClient?.Dispose();
    }
}

// Response models for different APIs
public class PerenualResponse
{
    public PerenualPlant[]? Data { get; set; }
}

public class PerenualPlant
{
    public int Id { get; set; }
    public string? CommonName { get; set; }
    public string? ScientificName { get; set; }
    public string[]? OtherName { get; set; }
    public PerenualImage? DefaultImage { get; set; }
}

public class PerenualImage
{
    public string? OriginalUrl { get; set; }
    public string? RegularUrl { get; set; }
    public string? MediumUrl { get; set; }
    public string? SmallUrl { get; set; }
    public string? Thumbnail { get; set; }
    public string? License { get; set; }
}

public class UsdaResponse
{
    public UsdaPlant[]? Data { get; set; }
}

public class UsdaPlant
{
    public string? Symbol { get; set; }
    public string? ScientificName { get; set; }
    public string[]? CommonName { get; set; }
    public string? Family { get; set; }
}

public class GbifSearchResponse
{
    public int? UsageKey { get; set; }
    public string? ScientificName { get; set; }
    public string? CanonicalName { get; set; }
}

public class GbifMediaResponse
{
    public GbifMedia[]? Results { get; set; }
}

public class GbifMedia
{
    public string? Identifier { get; set; }
    public string? Type { get; set; }
    public string? License { get; set; }
}

public class WikimediaResponse
{
    [JsonPropertyName("query")]
    public WikimediaQuery? Query { get; set; }
}

public class WikimediaQuery
{
    [JsonPropertyName("pages")]
    public Dictionary<string, WikimediaPage>? Pages { get; set; }
}

public class WikimediaPage
{
    [JsonPropertyName("pageid")]
    public int PageId { get; set; }
    
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    
    [JsonPropertyName("imageinfo")]
    public WikimediaImageInfo[]? ImageInfo { get; set; }
}

public class WikimediaImageInfo
{
    [JsonPropertyName("url")]
    public string? Url { get; set; }
    
    [JsonPropertyName("thumburl")]
    public string? ThumbUrl { get; set; }
    
    [JsonPropertyName("width")]
    public int Width { get; set; }
    
    [JsonPropertyName("height")]
    public int Height { get; set; }
    
    [JsonPropertyName("extmetadata")]
    public WikimediaExtMetadata? ExtMetadata { get; set; }
}

public class WikimediaExtMetadata
{
    [JsonPropertyName("LicenseShortName")]
    public WikimediaMetadataValue? LicenseShortName { get; set; }
    
    [JsonPropertyName("Artist")]
    public WikimediaMetadataValue? Artist { get; set; }
    
    [JsonPropertyName("License")]
    public WikimediaMetadataValue? License { get; set; }
}

public class WikimediaMetadataValue
{
    [JsonPropertyName("value")]
    public string? Value { get; set; }
}

public class INaturalistTaxaResponse
{
    [JsonPropertyName("results")]
    public INaturalistTaxon[]? Results { get; set; }
}

public class INaturalistTaxon
{
    [JsonPropertyName("id")]
    public int? Id { get; set; }
    
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    
    [JsonPropertyName("rank")]
    public string? Rank { get; set; }
    
    [JsonPropertyName("default_photo")]
    public INaturalistPhoto? DefaultPhoto { get; set; }
}

public class INaturalistPhoto
{
    [JsonPropertyName("id")]
    public int? Id { get; set; }
    
    [JsonPropertyName("license_code")]
    public string? License { get; set; }
    
    [JsonPropertyName("url")]
    public string? Url { get; set; }
    
    [JsonPropertyName("medium_url")]
    public string? MediumUrl { get; set; }
    
    [JsonPropertyName("small_url")]
    public string? SmallUrl { get; set; }
    
    [JsonPropertyName("square_url")]
    public string? SquareUrl { get; set; }
}

public class INaturalistObservationsResponse
{
    [JsonPropertyName("results")]
    public INaturalistObservation[]? Results { get; set; }
}

public class INaturalistObservation
{
    [JsonPropertyName("id")]
    public int? Id { get; set; }
    
    [JsonPropertyName("photos")]
    public INaturalistObservationPhoto[]? Photos { get; set; }
}

public class INaturalistObservationPhoto
{
    [JsonPropertyName("id")]
    public int? Id { get; set; }
    
    [JsonPropertyName("license_code")]
    public string? License { get; set; }
    
    [JsonPropertyName("url")]
    public string? Url { get; set; }
}
