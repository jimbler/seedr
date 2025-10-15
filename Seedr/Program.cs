using Seedr;

namespace Seedr;

class Program
{
    static async Task Main(string[] args)
    {
        Console.WriteLine("=== Seedr Plant Data Pipeline ===");
        Console.WriteLine("Running complete plant data processing pipeline...\n");

        try
        {
            // Step 1: Parse catalog files and create initial plant data
            Console.WriteLine("🔄 Step 1: Parsing catalog files...");
            CatalogParser.RunCatalogParser(args);
            Console.WriteLine("✅ Step 1 Complete: Catalog parsing finished\n");

            // Step 2: Apply common names from lookup table
            Console.WriteLine("🔄 Step 2: Applying common names from lookup table...");
            CommonNameUpdater.RunCommonNameUpdater(args);
            Console.WriteLine("✅ Step 2 Complete: Common name lookup applied\n");

            // Step 3: Enhance with API data for remaining plants
            Console.WriteLine("🔄 Step 3: Enhancing with botanical API data...");
            await ApiCommonNameUpdater.RunApiCommonNameUpdater(args);
            Console.WriteLine("✅ Step 3 Complete: API enhancement finished\n");

            Console.WriteLine("🎉 Pipeline Complete!");
            Console.WriteLine("All plant data has been fully processed and saved to ParsedData/all_catalogs_parsed.json");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Pipeline Error: {ex.Message}");
            Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        }

        Console.ReadLine();
    }
}
