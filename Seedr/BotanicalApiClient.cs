using System.Text.Json;
using System.Net.Http;
using Seedr.Models;

namespace Seedr;

public class BotanicalApiClient
{
    private readonly HttpClient _httpClient;
    private readonly string _perenualApiKey;
    private readonly string _plantIdApiKey;
    
    public BotanicalApiClient(string perenualApiKey = "", string plantIdApiKey = "")
    {
        _httpClient = new HttpClient();
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
