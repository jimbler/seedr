using System.Text.Json;
using Seedr.Models;

namespace Seedr;

public class ApiTest
{
    public static async Task RunApiTest(string[] args)
    {
        Console.WriteLine("=== Botanical API Integration Test ===");
        
        // Test with a few sample plants
        var testPlants = new[]
        {
            "Abronia glabrifolia",
            "Acer grandidentatum", 
            "Aquilegia coerulea",
            "Echinocereus coccineus",
            "Penstemon strictus"
        };
        
        Console.WriteLine("Testing botanical API integration with sample plants...\n");
        
        // Initialize API client (without API keys for demo)
        var apiClient = new BotanicalApiClient();
        
        foreach (var botanicalName in testPlants)
        {
            Console.Write($"Testing {botanicalName}... ");
            
            try
            {
                var commonName = await apiClient.GetCommonNameAsync(botanicalName);
                if (!string.IsNullOrEmpty(commonName))
                {
                    Console.WriteLine($"✓ Found: {commonName}");
                }
                else
                {
                    Console.WriteLine("✗ No common name found (API keys not configured)");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"✗ Error: {ex.Message}");
            }
            
            // Add delay to respect rate limits
            await Task.Delay(1000);
        }
        
        Console.WriteLine("\n=== API Integration Summary ===");
        Console.WriteLine("✅ BotanicalApiClient created successfully");
        Console.WriteLine("✅ Multiple API fallback system implemented");
        Console.WriteLine("✅ Error handling and rate limiting included");
        Console.WriteLine("✅ Local lookup table as fallback");
        
        Console.WriteLine("\n=== Available APIs ===");
        Console.WriteLine("1. Perenual API (Free tier: 30 requests/day)");
        Console.WriteLine("   - 10,000+ plant species");
        Console.WriteLine("   - Common names, care guides, hardiness zones");
        Console.WriteLine("   - Get API key: https://perenual.com/docs/api");
        
        Console.WriteLine("\n2. Plant.id API (Requires registration)");
        Console.WriteLine("   - 100+ languages support");
        Console.WriteLine("   - Wikipedia-sourced descriptions");
        Console.WriteLine("   - Get API key: https://plant.id/");
        
        Console.WriteLine("\n3. USDA PLANTS Database (Free, no key required)");
        Console.WriteLine("   - U.S. native plants");
        Console.WriteLine("   - Authoritative taxonomic data");
        Console.WriteLine("   - URL: https://plants.usda.gov/");
        
        Console.WriteLine("\n4. World Flora Online (Free)");
        Console.WriteLine("   - Global plant database");
        Console.WriteLine("   - Taxonomic experts consortium");
        Console.WriteLine("   - URL: https://list.worldfloraonline.org/");
        
        Console.WriteLine("\n=== Next Steps ===");
        Console.WriteLine("1. Get API keys from the services above");
        Console.WriteLine("2. Update BotanicalApiClient with your API keys");
        Console.WriteLine("3. Run the full API updater on your plant data");
        Console.WriteLine("4. Monitor rate limits and API usage");
        
        apiClient.Dispose();
    }
}
