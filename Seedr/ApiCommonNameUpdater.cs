using System.Text.Json;
using Seedr.Models;

namespace Seedr;

public class ApiCommonNameUpdater
{
    public static async Task RunApiCommonNameUpdater(string[] args)
    {
        Console.WriteLine("=== API-Powered Plant Common Name Updater ===");
        
        // Load the parsed data
        var executableDir = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
        string jsonPath = Path.Combine(executableDir, "ParsedData", "all_catalogs_parsed.json");
        if (!File.Exists(jsonPath))
        {
            Console.WriteLine($"File not found: {jsonPath}");
            return;
        }
        
        string json = File.ReadAllText(jsonPath);
        var plants = JsonSerializer.Deserialize<List<Plant>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        
        if (plants == null)
        {
            Console.WriteLine("Failed to deserialize plant data");
            return;
        }
        
        Console.WriteLine($"Loaded {plants.Count} plants");
        
        // Analyze current common name status
        var plantsWithoutCommonNames = plants.Where(p => string.IsNullOrEmpty(p.CommonName)).ToList();
        var plantsWithCommonNames = plants.Where(p => !string.IsNullOrEmpty(p.CommonName)).ToList();
        
        Console.WriteLine($"\nCurrent Status:");
        Console.WriteLine($"  Plants with common names: {plantsWithCommonNames.Count}");
        Console.WriteLine($"  Plants without common names: {plantsWithoutCommonNames.Count}");
        
        if (plantsWithoutCommonNames.Count == 0)
        {
            Console.WriteLine("All plants already have common names!");
            return;
        }
        
        // Initialize API client
        // Note: You'll need to get API keys from:
        // - Perenual: https://perenual.com/docs/api (free tier: 30 requests/day)
        // - Plant.id: https://plant.id/ (requires registration)
        var apiClient = new BotanicalApiClient(
            perenualApiKey: "", // Add your Perenual API key here
            plantIdApiKey: ""   // Add your Plant.id API key here
        );
        
        // Process plants without common names
        int updatedCount = 0;
        int processedCount = 0;
        int totalToProcess = Math.Min(plantsWithoutCommonNames.Count, 30); // Limit to 30 for free tier
        
        Console.WriteLine($"\nProcessing first {totalToProcess} plants without common names...");
        Console.WriteLine("(Limited to 30 for Perenual free tier)");
        
        foreach (var plant in plantsWithoutCommonNames.Take(totalToProcess))
        {
            processedCount++;
            Console.Write($"Processing {processedCount}/{totalToProcess}: {plant.BotanicalName}... ");
            
            try
            {
                var commonName = await apiClient.GetCommonNameAsync(plant.BotanicalName);
                if (!string.IsNullOrEmpty(commonName))
                {
                    plant.CommonName = commonName;
                    updatedCount++;
                    Console.WriteLine($"✓ Found: {commonName}");
                }
                else
                {
                    Console.WriteLine("✗ No common name found");
                }
                
                // Add delay to respect rate limits
                await Task.Delay(1000); // 1 second delay between requests
            }
            catch (Exception ex)
            {
                Console.WriteLine($"✗ Error: {ex.Message}");
            }
        }
        
        // Also try our local lookup table for remaining plants
        var remainingPlants = plantsWithoutCommonNames.Skip(totalToProcess).ToList();
        if (remainingPlants.Count > 0)
        {
            Console.WriteLine($"\nTrying local lookup table for remaining {remainingPlants.Count} plants...");
            var localLookup = CreateLocalLookup();
            int localUpdated = 0;
            
            foreach (var plant in remainingPlants)
            {
                if (localLookup.TryGetValue(plant.BotanicalName.ToLower(), out string commonName))
                {
                    plant.CommonName = commonName;
                    localUpdated++;
                }
            }
            
            Console.WriteLine($"Updated {localUpdated} plants from local lookup table");
            updatedCount += localUpdated;
        }
        
        // Save updated data
        var options = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        
        string updatedJson = JsonSerializer.Serialize(plants, options);
        File.WriteAllText(jsonPath, updatedJson);
        
        Console.WriteLine($"\nUpdated data saved to {jsonPath}");
        
        // Final statistics
        var finalWithoutCommonNames = plants.Where(p => string.IsNullOrEmpty(p.CommonName)).Count();
        var finalWithCommonNames = plants.Where(p => !string.IsNullOrEmpty(p.CommonName)).Count();
        
        Console.WriteLine($"\nFinal Status:");
        Console.WriteLine($"  Plants with common names: {finalWithCommonNames}");
        Console.WriteLine($"  Plants without common names: {finalWithoutCommonNames}");
        Console.WriteLine($"  Coverage: {(double)finalWithCommonNames / plants.Count * 100:F1}%");
        Console.WriteLine($"  Newly updated: {updatedCount}");
        
        // Show some examples of newly updated plants
        var newlyUpdated = plantsWithoutCommonNames.Where(p => !string.IsNullOrEmpty(p.CommonName)).Take(5).ToList();
        if (newlyUpdated.Count > 0)
        {
            Console.WriteLine($"\nExamples of newly updated plants:");
            foreach (var plant in newlyUpdated)
            {
                Console.WriteLine($"  {plant.BotanicalName} → {plant.CommonName}");
            }
        }
        
        apiClient.Dispose();
    }
    
    private static Dictionary<string, string> CreateLocalLookup()
    {
        // Extended local lookup table with more entries
        return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            // Additional entries for plants not covered by APIs
            { "abronia glabrifolia", "Smooth-leaved Sand Verbena" },
            { "abronia fragrans", "Fragrant Sand Verbena" },
            { "abronia nana", "Dwarf Sand Verbena" },
            { "abronia villosa", "Desert Sand Verbena" },
            { "abutilon incanum", "Hoary Abutilon" },
            { "acacia angustissima", "Prairie Acacia" },
            { "acacia constricta", "Whitethorn Acacia" },
            { "acacia roemeriana", "Roemer's Acacia" },
            { "acer grandidentatum", "Bigtooth Maple" },
            { "achillea tomentosa", "Woolly Yarrow" },
            { "agastache breviflora", "Short-flowered Giant Hyssop" },
            { "agastache micrantha", "Small-flowered Giant Hyssop" },
            { "agastache neomexicana", "New Mexico Giant Hyssop" },
            { "agastache occidentalis", "Western Giant Hyssop" },
            { "agastache pallidiflora", "Pale-flowered Giant Hyssop" },
            { "agave deserti", "Desert Agave" },
            { "agave lechuguilla", "Lechuguilla" },
            { "agave mckelveyana", "McKelvey's Agave" },
            { "agave parryi", "Parry's Agave" },
            { "agave toumeyana", "Toumey's Agave" },
            { "agave utahensis", "Utah Agave" },
            { "allium acuminatum", "Taper-tip Onion" },
            { "allium atroviolaceum", "Dark Violet Onion" },
            { "allium campanulatum", "Sierra Onion" },
            { "allium cratericola", "Crater Onion" },
            { "allium crenulatum", "Oregon Onion" },
            { "allium falcifolium", "Sickle-leaf Onion" },
            { "allium fimbriatum", "Fringed Onion" },
            { "allium geyeri", "Geyer's Onion" },
            { "allium haematochiton", "Red-skin Onion" },
            { "allium hoffmanii", "Hoffman's Onion" },
            { "allium howellii", "Howell's Onion" },
            { "allium macropetalum", "Large-petaled Onion" },
            { "allium membranaceum", "Papery Onion" },
            { "allium parvum", "Small Onion" },
            { "allium platycaule", "Broad-stemmed Onion" },
            { "allium robinsonii", "Robinson's Onion" },
            { "allium simillimum", "Similar Onion" },
            { "amelanchier alnifolia", "Saskatoon Serviceberry" },
            { "amelanchier utahensis", "Utah Serviceberry" },
            { "amorpha californica", "California False Indigo" },
            { "amorpha canescens", "Lead Plant" },
            { "amorpha fruticosa", "False Indigo" },
            { "amorpha nana", "Dwarf False Indigo" },
            { "amsonia arenaria", "Sand Bluestar" },
            { "amsonia eastwoodiana", "Eastwood's Bluestar" },
            { "amsonia fugatei", "Fugate's Bluestar" },
            { "amsonia grandiflora", "Large-flowered Bluestar" },
            { "amsonia illustris", "Ozark Bluestar" },
            { "amsonia jonesii", "Jones' Bluestar" },
            { "amsonia palmeri", "Palmer's Bluestar" },
            { "amsonia peeblesii", "Peebles' Bluestar" },
            { "amsonia tharpii", "Tharp's Bluestar" },
            { "amsonia tomentosa", "Woolly Bluestar" },
            { "aquilegia barnebyi", "Barneby's Columbine" },
            { "aquilegia chrysantha", "Golden Columbine" },
            { "aquilegia coerulea", "Colorado Blue Columbine" },
            { "aquilegia desertorum", "Desert Columbine" },
            { "aquilegia flabellata", "Fan Columbine" },
            { "aquilegia flavescens", "Yellow Columbine" },
            { "aquilegia jonesii", "Jones' Columbine" },
            { "aquilegia laramiensis", "Laramie Columbine" },
            { "aquilegia scopulorum", "Rocky Mountain Columbine" },
            { "arctostaphylos canescens", "Hoary Manzanita" },
            { "arctostaphylos coloradensis", "Colorado Manzanita" },
            { "arctostaphylos columbiana", "Hairy Manzanita" },
            { "arctostaphylos glauca", "Bigberry Manzanita" },
            { "arctostaphylos nevadensis", "Pinemat Manzanita" },
            { "arctostaphylos patula", "Greenleaf Manzanita" },
            { "arctostaphylos pringlei", "Pringle's Manzanita" },
            { "arctostaphylos pungens", "Pointleaf Manzanita" },
            { "asclepias arenaria", "Sand Milkweed" },
            { "asclepias cryptoceras", "Pallid Milkweed" },
            { "asclepias erosa", "Desert Milkweed" },
            { "asclepias hallii", "Hall's Milkweed" },
            { "asclepias latifolia", "Broadleaf Milkweed" },
            { "asclepias speciosa", "Showy Milkweed" },
            { "asclepias sullivantii", "Prairie Milkweed" },
            { "asclepias tuberosa", "Butterfly Weed" },
            { "aster alpigenus", "Alpine Aster" },
            { "aster alpinus", "Alpine Aster" },
            { "aster coloradoensis", "Colorado Aster" },
            { "aster ericoides", "Heath Aster" },
            { "astragalus alopecurus", "Foxtail Milkvetch" },
            { "astragalus alpinus", "Alpine Milkvetch" },
            { "astragalus amphioxys", "Crescent Milkvetch" },
            { "astragalus argophyllus", "Silver-leaved Milkvetch" },
            { "astragalus asclepiadoides", "Milkweed Milkvetch" },
            { "astragalus barrii", "Barr's Milkvetch" },
            { "astragalus calycosus", "Beautiful Milkvetch" },
            { "astragalus castaneiformis", "Chestnut Milkvetch" },
            { "astragalus chamaeleuce", "White Milkvetch" },
            { "astragalus chloodes", "Green Milkvetch" },
            { "astragalus coccineus", "Scarlet Milkvetch" },
            { "astragalus crassicarpus", "Ground Plum" },
            { "astragalus desperatus", "Desperate Milkvetch" },
            { "astragalus detritalis", "Detrital Milkvetch" },
            { "astragalus flavus", "Yellow Milkvetch" },
            { "astragalus iodanthus", "Violet Milkvetch" },
            { "astragalus iodopetalus", "Violet-petaled Milkvetch" },
            { "astragalus jejunus", "Starved Milkvetch" },
            { "astragalus mollissimus", "Woolly Milkvetch" },
            { "astragalus musiniensis", "Musinea Milkvetch" },
            { "astragalus naturitensis", "Naturita Milkvetch" },
            { "astragalus neglectus", "Cooper's Milkvetch" },
            { "astragalus newberryi", "Newberry's Milkvetch" },
            { "astragalus penduliflorus", "Pendulous Milkvetch" },
            { "astragalus purshii", "Pursh's Milkvetch" },
            { "astragalus saurinus", "Lizard Milkvetch" },
            { "astragalus simplicifolius", "Simple-leaved Milkvetch" },
            { "astragalus succumbens", "Prostrate Milkvetch" },
            { "astragalus utahensis", "Utah Milkvetch" },
            { "astragalus waterfallii", "Waterfall's Milkvetch" },
            { "astragalus whitneyi", "Whitney's Milkvetch" },
            { "balsamorhiza hispidula", "Hairy Balsamroot" },
            { "balsamorhiza hookeri", "Hooker's Balsamroot" },
            { "balsamorhiza sagittata", "Arrowleaf Balsamroot" },
            { "balsamorhiza sericea", "Silky Balsamroot" },
            { "baptisia australis", "Blue Wild Indigo" },
            { "baptisia bracteata", "Long-bracted Wild Indigo" },
            { "baptisia lactea", "White Wild Indigo" },
            { "baptisia minor", "Small Wild Indigo" },
            { "baptisia sphaerocarpa", "Yellow Wild Indigo" },
            { "baptisia tinctoria", "Yellow Wild Indigo" },
            { "calochortus albus", "White Globe Lily" },
            { "calochortus amabilis", "Diogenes' Lantern" },
            { "calochortus ambiguus", "Doubting Mariposa Lily" },
            { "calochortus aureus", "Golden Mariposa Lily" },
            { "calochortus bruneaunis", "Brown Mariposa Lily" },
            { "calochortus coeruleus", "Blue Mariposa Lily" },
            { "calochortus eurycarpus", "Wide-fruited Mariposa Lily" },
            { "calochortus gunnisonii", "Gunnison's Mariposa Lily" },
            { "calochortus kennedyi", "Desert Mariposa Lily" },
            { "calochortus nuttallii", "Sego Lily" },
            { "camassia cusickii", "Cusick's Camas" },
            { "camassia leichtlinii", "Leichtlin's Camas" },
            { "camassia quamash", "Common Camas" },
            { "camassia scilloides", "Wild Hyacinth" },
            { "campanula barbata", "Bearded Bellflower" },
            { "campanula lanata", "Woolly Bellflower" },
            { "campanula rotundifolia", "Harebell" },
            { "campanula thyrsoides", "Yellow Bellflower" },
            { "castilleja applegatei", "Applegate's Paintbrush" },
            { "castilleja chromosa", "Desert Paintbrush" },
            { "castilleja covilleana", "Coville's Paintbrush" },
            { "castilleja integra", "Wholeleaf Paintbrush" },
            { "castilleja latifolia", "Broadleaf Paintbrush" },
            { "castilleja rhexifolia", "Alpine Paintbrush" },
            { "castilleja sessiliflora", "Downy Paintbrush" },
            { "ceanothus cordulatus", "Mountain Whitethorn" },
            { "ceanothus prostratus", "Prostrate Ceanothus" },
            { "ceanothus velutinus", "Snowbrush" },
            { "cercocarpus intricatus", "Littleleaf Mountain Mahogany" },
            { "cercocarpus montanus", "Mountain Mahogany" },
            { "clematis columbiana", "Rocky Mountain Clematis" },
            { "clematis heracleifolia", "Tube Clematis" },
            { "clematis hirsutissima", "Hairy Clematis" },
            { "clematis scottii", "Scott's Clematis" },
            { "clematis texensis", "Texas Clematis" },
            { "delphinium andersonii", "Anderson's Larkspur" },
            { "delphinium bicolor", "Little Larkspur" },
            { "delphinium burkei", "Burke's Larkspur" },
            { "delphinium carolinianum", "Carolina Larkspur" },
            { "delphinium geyeri", "Geyer's Larkspur" },
            { "delphinium glaucum", "Glaucous Larkspur" },
            { "delphinium gypsophilum", "Gypsum Larkspur" },
            { "delphinium hansenii", "Hansen's Larkspur" },
            { "delphinium menziesii", "Menzies' Larkspur" },
            { "delphinium novomexicanum", "New Mexico Larkspur" },
            { "delphinium occidentale", "Western Larkspur" },
            { "delphinium parishii", "Parish's Larkspur" },
            { "delphinium parryi", "Parry's Larkspur" },
            { "delphinium uliginosum", "Swamp Larkspur" },
            { "delphinium variegatum", "Variegated Larkspur" },
            { "delphinium virescens", "Green Larkspur" },
            { "delphinium viridescens", "Green Larkspur" },
            { "delphinium xantholeucum", "Yellow-white Larkspur" },
            { "echinocereus adustus", "Brown-spined Hedgehog Cactus" },
            { "echinocereus brandegeei", "Brandegee's Hedgehog Cactus" },
            { "echinocereus canus", "Gray Hedgehog Cactus" },
            { "echinocereus chloranthus", "Green-flowered Hedgehog Cactus" },
            { "echinocereus coccineus", "Scarlet Hedgehog Cactus" },
            { "echinocereus corellii", "Corell's Hedgehog Cactus" },
            { "echinocereus ctenoides", "Comb Hedgehog Cactus" },
            { "echinocereus dasyacanthus", "Texas Rainbow Cactus" },
            { "echinocereus englemannii", "Engelmann's Hedgehog Cactus" },
            { "echinocereus fasciculatus", "Pink-flowered Hedgehog Cactus" },
            { "echinocereus fendleri", "Fendler's Hedgehog Cactus" },
            { "echinocereus fitchii", "Fitch's Hedgehog Cactus" },
            { "echinocereus ledingii", "Leding's Hedgehog Cactus" },
            { "echinocereus milleri", "Miller's Hedgehog Cactus" },
            { "echinocereus pectinatus", "Comb Hedgehog Cactus" },
            { "echinocereus primolanatus", "Primrose Hedgehog Cactus" },
            { "echinocereus pseudopectinatus", "False Comb Hedgehog Cactus" },
            { "echinocereus rayonensis", "Rayon Hedgehog Cactus" },
            { "echinocereus reichenbachii", "Lace Hedgehog Cactus" },
            { "echinocereus rigidissimus", "Rainbow Hedgehog Cactus" },
            { "echinocereus scheeri", "Scheer's Hedgehog Cactus" },
            { "echinocereus stramineus", "Straw-colored Hedgehog Cactus" },
            { "echinocereus triglochidiatus", "Claret Cup Cactus" },
            { "echinocereus viereckii", "Viereck's Hedgehog Cactus" },
            { "echinocereus viridiflorus", "Green-flowered Hedgehog Cactus" },
            { "eriogonum bicolor", "Two-color Buckwheat" },
            { "eriogonum chrysops", "Golden-eyed Buckwheat" },
            { "eriogonum ovalifolium", "Cushion Buckwheat" },
            { "eriogonum tumulosum", "Tumulose Buckwheat" },
            { "eriogonum umbellatum", "Sulphur Buckwheat" },
            { "eriogonum villiflorum", "Villous Buckwheat" },
            { "eriogonum wrightii", "Wright's Buckwheat" },
            { "erythronium citrinum", "Lemon Fawn Lily" },
            { "erythronium elegans", "Elegant Fawn Lily" },
            { "erythronium grandiflorum", "Glacier Lily" },
            { "erythronium helenae", "Helen's Fawn Lily" },
            { "erythronium hendersonii", "Henderson's Fawn Lily" },
            { "erythronium idahoense", "Idaho Fawn Lily" },
            { "erythronium klamathense", "Klamath Fawn Lily" },
            { "erythronium multiscapoideum", "Many-stemmed Fawn Lily" },
            { "erythronium oregonum", "Oregon Fawn Lily" },
            { "erythronium purpurascens", "Purple Fawn Lily" },
            { "erythronium revolutum", "Pink Fawn Lily" },
            { "erythronium taylorii", "Taylor's Fawn Lily" },
            { "erythronium tuolumnense", "Tuolumne Fawn Lily" },
            { "fritillaria affinis", "Checker Lily" },
            { "fritillaria atropurpurea", "Purple Fritillary" },
            { "fritillaria biflora", "Chocolate Lily" },
            { "fritillaria camschatcensis", "Kamchatka Fritillary" },
            { "fritillaria lanceolata", "Lance-leaved Fritillary" },
            { "fritillaria pallidiflora", "Pale-flowered Fritillary" },
            { "fritillaria pudica", "Yellow Fritillary" },
            { "fritillaria purdyi", "Purdy's Fritillary" },
            { "fritillaria recurva", "Scarlet Fritillary" },
            { "gaillardia aristata", "Blanketflower" },
            { "gaillardia pulchella", "Firewheel" },
            { "gentiana affinis", "Pleated Gentian" },
            { "gentiana algida", "Arctic Gentian" },
            { "gentiana andrewsii", "Closed Gentian" },
            { "gentiana asclepiadea", "Willow Gentian" },
            { "gentiana calycosa", "Bog Gentian" },
            { "gentiana lutea", "Great Yellow Gentian" },
            { "gentiana parryi", "Parry's Gentian" },
            { "gentiana puberulenta", "Downy Gentian" },
            { "gentiana setigera", "Mendocino Gentian" },
            { "gentiana triflora", "Three-flowered Gentian" },
            { "heuchera hallii", "Hall's Alumroot" },
            { "heuchera pulchella", "Beautiful Alumroot" },
            { "heuchera rubescens", "Pink Alumroot" },
            { "heuchera sanguinea", "Coral Bells" },
            { "iris bracteata", "Siskiyou Iris" },
            { "iris innominata", "Del Norte County Iris" },
            { "iris missouriensis", "Western Blue Flag" },
            { "iris setosa", "Bristle-pointed Iris" },
            { "iris tenax", "Oregon Iris" },
            { "lewisia brachycalyx", "Short-sepaled Lewisia" },
            { "lewisia columbiana", "Columbia Lewisia" },
            { "lewisia cotyledon", "Cliff Maids" },
            { "lewisia leana", "Lea's Lewisia" },
            { "lewisia oppositifolia", "Opposite-leaved Lewisia" },
            { "lewisia pygmaea", "Pygmy Lewisia" },
            { "lewisia rediviva", "Bitterroot" },
            { "lewisia stebbinsii", "Stebbins' Lewisia" },
            { "lewisia tweedyi", "Tweedy's Lewisia" },
            { "lilium bolanderi", "Bolander's Lily" },
            { "lilium canadense", "Canada Lily" },
            { "lilium columbianum", "Columbia Lily" },
            { "lilium concolor", "Morning Star Lily" },
            { "lilium formosanum", "Formosa Lily" },
            { "lilium humboldtii", "Humboldt Lily" },
            { "lilium japonicum", "Japanese Lily" },
            { "lilium pardalinum", "Leopard Lily" },
            { "lilium pumilum", "Coral Lily" },
            { "lilium rubescens", "Redwood Lily" },
            { "lilium washingtonianum", "Washington Lily" },
            { "lupinus aridus", "Arid Lupine" },
            { "lupinus arizonicus", "Arizona Lupine" },
            { "lupinus breweri", "Brewer's Lupine" },
            { "lupinus lepidus", "Pacific Lupine" },
            { "lupinus leucophyllus", "Velvet Lupine" },
            { "lupinus obtusilobus", "Blunt-lobed Lupine" },
            { "mammillaria grahamii", "Graham's Nipple Cactus" },
            { "mammillaria heyderi", "Heyder's Nipple Cactus" },
            { "mammillaria lasiacantha", "Lasiacantha Nipple Cactus" },
            { "mammillaria meiacantha", "Half-spined Nipple Cactus" },
            { "mammillaria meridiorosei", "Meridiorosei Nipple Cactus" },
            { "mammillaria wrightii", "Wright's Nipple Cactus" },
            { "mertensia arizonica", "Arizona Bluebells" },
            { "mertensia bakeri", "Baker's Bluebells" },
            { "mertensia brevistyla", "Short-styled Bluebells" },
            { "mertensia campanulata", "Bell-shaped Bluebells" },
            { "mertensia ciliata", "Fringed Bluebells" },
            { "mertensia longiflora", "Long-flowered Bluebells" },
            { "mertensia macdougalii", "MacDougal's Bluebells" },
            { "mertensia viridis", "Green Bluebells" },
            { "mimulus aurantiacus", "Sticky Monkey Flower" },
            { "mimulus cupreus", "Copper Monkey Flower" },
            { "mimulus guttatus", "Common Monkey Flower" },
            { "mimulus jungermannioides", "Jungermannia-like Monkey Flower" },
            { "mimulus longiflorus", "Long-flowered Monkey Flower" },
            { "mimulus palmeri", "Palmer's Monkey Flower" },
            { "mimulus primuloides", "Primrose Monkey Flower" },
            { "mimulus pulchellus", "Beautiful Monkey Flower" },
            { "mimulus rupicola", "Rock Monkey Flower" },
            { "opuntia aurea", "Golden Prickly Pear" },
            { "opuntia englemannii", "Engelmann's Prickly Pear" },
            { "opuntia erinacea", "Mojave Prickly Pear" },
            { "opuntia macrorhiza", "Big-root Prickly Pear" },
            { "opuntia phaeacantha", "Brown-spined Prickly Pear" },
            { "opuntia pinkavae", "Pinkava's Prickly Pear" },
            { "opuntia pottsii", "Potts' Prickly Pear" },
            { "opuntia pulchella", "Beautiful Prickly Pear" },
            { "opuntia spinosior", "Cane Cholla" },
            { "penstemon absarokensis", "Absaroka Penstemon" },
            { "penstemon acaulis", "Stemless Penstemon" },
            { "penstemon acuminatus", "Sharpleaf Penstemon" },
            { "penstemon alamosensis", "Alamos Penstemon" },
            { "penstemon albidus", "White Penstemon" },
            { "penstemon aridus", "Arid Penstemon" },
            { "penstemon barbatus", "Beardlip Penstemon" },
            { "penstemon bicolor", "Two-color Penstemon" },
            { "penstemon caesius", "Blue Penstemon" },
            { "penstemon caespitosus", "Mat Penstemon" },
            { "penstemon cobaea", "Cobaea Penstemon" },
            { "penstemon crandallii", "Crandall's Penstemon" },
            { "penstemon davidsonii", "Davidson's Penstemon" },
            { "penstemon debilis", "Weak Penstemon" },
            { "penstemon eatonii", "Firecracker Penstemon" },
            { "penstemon eriantherus", "Fuzzytongue Penstemon" },
            { "penstemon frutescens", "Shrubby Penstemon" },
            { "penstemon gairdneri", "Gairdner's Penstemon" },
            { "penstemon glaber", "Smooth Penstemon" },
            { "penstemon humilis", "Low Penstemon" },
            { "penstemon janishiae", "Janish's Penstemon" },
            { "penstemon kingii", "King's Penstemon" },
            { "penstemon laricifolius", "Larchleaf Penstemon" },
            { "penstemon leonardii", "Leonard's Penstemon" },
            { "penstemon linarioides", "Toadflax Penstemon" },
            { "penstemon montanus", "Mountain Penstemon" },
            { "penstemon newberryi", "Newberry's Penstemon" },
            { "penstemon nitidus", "Waxy Penstemon" },
            { "penstemon ophianthus", "Snake-flowered Penstemon" },
            { "penstemon ovatus", "Oval-leaved Penstemon" },
            { "penstemon pachyphyllus", "Thick-leaved Penstemon" },
            { "penstemon palmeri", "Palmer's Penstemon" },
            { "penstemon petiolatus", "Petioled Penstemon" },
            { "penstemon pinifolius", "Pine-leaved Penstemon" },
            { "penstemon procumbens", "Trailing Penstemon" },
            { "penstemon pseudospectabilis", "Desert Beardtongue" },
            { "penstemon pumilus", "Dwarf Penstemon" },
            { "penstemon retrorsus", "Retrorse Penstemon" },
            { "penstemon richardsonii", "Richardson's Penstemon" },
            { "penstemon roezlii", "Roezl's Penstemon" },
            { "penstemon rostriflorus", "Beaked Penstemon" },
            { "penstemon rupicola", "Rock Penstemon" },
            { "penstemon scapoides", "Stemless Penstemon" },
            { "penstemon strictus", "Rocky Mountain Penstemon" },
            { "penstemon subulatus", "Awl-leaved Penstemon" },
            { "penstemon thompsoniae", "Thompson's Penstemon" },
            { "penstemon triflorus", "Three-flowered Penstemon" },
            { "penstemon utahensis", "Utah Penstemon" },
            { "penstemon virens", "Green Penstemon" },
            { "phlox aculeata", "Prickly Phlox" },
            { "phlox adsurgens", "Woodland Phlox" },
            { "phlox albomarginata", "White-margined Phlox" },
            { "phlox alyssifolia", "Alyssum-leaved Phlox" },
            { "phlox austromontana", "Southern Mountain Phlox" },
            { "phlox bryoides", "Moss Phlox" },
            { "phlox condensata", "Dense Phlox" },
            { "phlox diffusa", "Spreading Phlox" },
            { "phlox grayi", "Gray's Phlox" },
            { "phlox griseola", "Gray Phlox" },
            { "phlox hoodii", "Spiny Phlox" },
            { "phlox multiflora", "Many-flowered Phlox" },
            { "phlox nana", "Dwarf Phlox" },
            { "phlox opalensis", "Opal Phlox" },
            { "phlox pilosa", "Downy Phlox" },
            { "phlox pungens", "Sharp Phlox" },
            { "phlox speciosa", "Showy Phlox" },
            { "phlox stansburyi", "Stansbury's Phlox" },
            { "phlox tumulosa", "Tumulose Phlox" },
            { "primula angustifolia", "Narrow-leaved Primrose" },
            { "primula cusickiana", "Cusick's Primrose" },
            { "primula minima", "Least Primrose" },
            { "primula parryi", "Parry's Primrose" },
            { "primula sieboldii", "Siebold's Primrose" },
            { "primula suffrutescens", "Shrubby Primrose" },
            { "salvia chinensis", "Chinese Sage" },
            { "salvia dorrii", "Purple Sage" },
            { "salvia funerea", "Death Valley Sage" },
            { "salvia greggii", "Autumn Sage" },
            { "salvia henryi", "Henry's Sage" },
            { "salvia jurisicii", "Jurisic's Sage" },
            { "salvia mohavensis", "Mojave Sage" },
            { "salvia pachyphylla", "Thick-leaved Sage" },
            { "salvia spathacea", "Hummingbird Sage" },
            { "salvia summa", "Summa Sage" },
            { "sedum divergens", "Spreading Stonecrop" },
            { "sedum griffithsii", "Griffith's Stonecrop" },
            { "sedum japonicum", "Japanese Stonecrop" },
            { "sedum lanceolatum", "Lance-leaved Stonecrop" },
            { "sedum laxum", "Loose Stonecrop" },
            { "sedum moranii", "Moran's Stonecrop" },
            { "sedum obtusatum", "Obtuse Stonecrop" },
            { "sedum pilosum", "Hairy Stonecrop" },
            { "sedum sempervivoides", "Houseleek Stonecrop" },
            { "sedum stelliforme", "Star-shaped Stonecrop" },
            { "silene acaulis", "Moss Campion" },
            { "silene argaea", "Argaean Catchfly" },
            { "silene californica", "California Indian Pink" },
            { "silene fenzlii", "Fenzl's Catchfly" },
            { "silene hookeri", "Hooker's Catchfly" },
            { "silene plankii", "Plank's Catchfly" },
            { "silene salmonacea", "Salmon Catchfly" },
            { "silene serpentinicola", "Serpentine Catchfly" },
            { "yucca arizonica", "Arizona Yucca" },
            { "yucca baccata", "Banana Yucca" },
            { "yucca constricta", "Buckley's Yucca" },
            { "yucca elata", "Soaptree Yucca" },
            { "yucca faxoniana", "Eve's Needle" },
            { "yucca glauca", "Soapweed" },
            { "yucca harrimaniae", "Harriman's Yucca" },
            { "yucca nana", "Dwarf Yucca" },
            { "yucca pallida", "Pale Yucca" },
            { "yucca rupicola", "Twisted-leaf Yucca" },
            { "yucca schottii", "Schott's Yucca" },
            { "yucca thompsoniana", "Thompson's Yucca" },
            { "yucca toftiae", "Toft's Yucca" },
            { "zinnia acerosa", "Desert Zinnia" }
        };
    }
}
