using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using Seedr.ReferenceEnums;

namespace Seedr.Models;

public class Plant
{
    public string CommonName { get; set; } = string.Empty;
    public string BotanicalName { get; set; } = string.Empty;
    public string Family { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    [MaxLength(10)]
    [JsonPropertyName("externalPlantCode")]
    public string ExternalPlantCode { get; set; } = string.Empty;
    
    [JsonPropertyName("plantGuid")]
    public string PlantGuid { get; set; } = Guid.NewGuid().ToString();
    
    [MaxLength(10)]
    public string Size { get; set; } = string.Empty;
    
    public string Origin { get; set; } = string.Empty;
    public int Elevation { get; set; }
    public int ElevationMeters { get; set; }
    public string Quantity { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool WildOrigin { get; set; }
    public bool IsArchived { get; set; }
    public ExternalCatalog ExternalCatalog { get; set; }
    
    public Seasonality Seasonality { get; set; }
    public Zone Zone { get; set; }
    public PreTreatment PreTreatment { get; set; }
    public Germination Germination { get; set; }
    
    // Image properties
    [JsonPropertyName("imageUrl")]
    public string ImageUrl { get; set; } = string.Empty;
    
    [JsonPropertyName("thumbnailUrl")]
    public string ThumbnailUrl { get; set; } = string.Empty;
    
    [JsonPropertyName("imageSource")]
    public string ImageSource { get; set; } = string.Empty;
    
    [JsonPropertyName("imageLicense")]
    public string ImageLicense { get; set; } = string.Empty;

    /// <summary>
    /// Parses plant data from the catalog text format using flexible parsing
    /// </summary>
    public static Plant ParseFromCatalogText(string catalogText)
    {
        var plant = new Plant();
        
        try
        {
            // Use a more flexible approach - parse components step by step
            ParsePlantFlexibly(plant, catalogText);
            
            // Set ExternalCatalog to AlPlains (1) for all parsed entries
            plant.ExternalCatalog = ExternalCatalog.AlPlains;
        }
        catch (Exception ex)
        {
            throw new ArgumentException($"Error parsing catalog text: {ex.Message}", ex);
        }
        
        return plant;
    }
    
    private static void ParsePlantFlexibly(Plant plant, string catalogText)
    {
        // Try to match the full format: Botanical Name (Family) (Characteristics)
        var fullFormatMatch = Regex.Match(catalogText, @"^(.+?)\s+\(([^)]+)\)\s+\(([^)]+)\)");
        if (fullFormatMatch.Success)
        {
            plant.BotanicalName = fullFormatMatch.Groups[1].Value.Trim();
            plant.Family = fullFormatMatch.Groups[2].Value.Trim();
            var characteristics = fullFormatMatch.Groups[3].Value.Trim();
            ParseCharacteristics(plant, characteristics);
        }
        else
        {
            // Try to match the format without family: Botanical Name (Characteristics)
            var noFamilyMatch = Regex.Match(catalogText, @"^(.+?)\s+\(([^)]+)\)");
            if (noFamilyMatch.Success)
            {
                plant.BotanicalName = noFamilyMatch.Groups[1].Value.Trim();
                plant.Family = ""; // No family information available
                var characteristics = noFamilyMatch.Groups[2].Value.Trim();
                ParseCharacteristics(plant, characteristics);
            }
        }
        
        // Extract quantity and price
        var priceMatch = Regex.Match(catalogText, @"([^$]+)\s+\$([0-9.]+)");
        if (priceMatch.Success)
        {
            var quantityText = priceMatch.Groups[1].Value.Trim();
            var seedMatch = Regex.Match(quantityText, @"(\d+\s+seeds)");
            plant.Quantity = seedMatch.Success ? seedMatch.Groups[1].Value : quantityText;
            plant.Price = decimal.Parse(priceMatch.Groups[2].Value);
        }
        
        // Extract plant code and wild origin
        var codeMatch = Regex.Match(catalogText, @"\$([0-9.]+)\s+([^\s]+)\s+\(([W]?)\)");
        if (codeMatch.Success)
        {
            plant.ExternalPlantCode = codeMatch.Groups[2].Value.Trim();
            plant.WildOrigin = !string.IsNullOrEmpty(codeMatch.Groups[3].Value);
        }
        
        // Extract origin, elevation, and description - be very flexible
        var remainingText = catalogText;
        if (codeMatch.Success)
        {
            remainingText = catalogText.Substring(codeMatch.Index + codeMatch.Length);
        }
        
        // Try to extract elevation information
        var elevationMatch = Regex.Match(remainingText, @"(\d+)ft(?:,\s*(\d+)m)?");
        if (elevationMatch.Success)
        {
            plant.Elevation = int.Parse(elevationMatch.Groups[1].Value);
            if (elevationMatch.Groups[2].Success)
            {
                plant.ElevationMeters = int.Parse(elevationMatch.Groups[2].Value);
            }
            else
            {
                plant.ElevationMeters = (int)Math.Round(plant.Elevation * 0.3048);
            }
        }
        else
        {
            // Try meters only
            var metersMatch = Regex.Match(remainingText, @"(\d+)m");
            if (metersMatch.Success)
            {
                plant.ElevationMeters = int.Parse(metersMatch.Groups[1].Value);
                plant.Elevation = (int)Math.Round(plant.ElevationMeters / 0.3048);
            }
            else
            {
                plant.Elevation = 0;
                plant.ElevationMeters = 0;
            }
        }
        
        // Extract origin - everything before elevation
        var originText = remainingText;
        if (elevationMatch.Success)
        {
            originText = remainingText.Substring(0, elevationMatch.Index);
        }
        else
        {
            var metersMatch = Regex.Match(remainingText, @"(\d+)m");
            if (metersMatch.Success)
            {
                originText = remainingText.Substring(0, metersMatch.Index);
            }
        }
        
        // Clean up origin text
        originText = originText.Trim().TrimEnd(',').Trim();
        plant.Origin = originText;
        
        // Extract description - everything after elevation
        var descriptionStart = 0;
        if (elevationMatch.Success)
        {
            descriptionStart = elevationMatch.Index + elevationMatch.Length;
        }
        else
        {
            var metersMatch = Regex.Match(remainingText, @"(\d+)m");
            if (metersMatch.Success)
            {
                descriptionStart = metersMatch.Index + metersMatch.Length;
            }
        }
        
        if (descriptionStart > 0 && descriptionStart < remainingText.Length)
        {
            var descriptionText = remainingText.Substring(descriptionStart).Trim();
            // Remove leading period and clean up
            descriptionText = descriptionText.TrimStart('.').Trim();
            plant.Description = descriptionText;
        }
        else
        {
            plant.Description = "";
        }
    }
    
    private static void ParseCharacteristics(Plant plant, string characteristics)
    {
        // Split by comma to get individual components
        var parts = characteristics.Split(',');
        
        if (parts.Length >= 5)
        {
            // Size (first part)
            plant.Size = parts[0].Trim();
            
            // Zone (second part, format: Z5)
            var zoneMatch = Regex.Match(parts[1].Trim(), @"Z(\d+)");
            if (zoneMatch.Success && int.TryParse(zoneMatch.Groups[1].Value, out int zoneNumber))
            {
                plant.Zone = (Zone)zoneNumber;
            }
            
            // Seasonality (third part, single letter like P)
            var seasonalityText = parts[2].Trim();
            plant.Seasonality = ParseSeasonality(seasonalityText);
            
            // PreTreatment (fourth part, single letter like C)
            var pretreatmentText = parts[3].Trim();
            plant.PreTreatment = ParsePreTreatment(pretreatmentText);
            
            // Germination (fifth part, format: 3:4w)
            var germinationText = parts[4].Trim();
            plant.Germination = ParseGermination(germinationText);
        }
    }
    
    private static Seasonality ParseSeasonality(string seasonalityText)
    {
        return seasonalityText.Trim().ToUpper() switch
        {
            "P" => Seasonality.Perennial,
            "A" => Seasonality.Annual,
            "B" => Seasonality.Biennial,
            _ => Seasonality.Perennial // Default fallback
        };
    }
    
    private static PreTreatment ParsePreTreatment(string pretreatmentText)
    {
        return pretreatmentText.Trim().ToUpper() switch
        {
            "L" => PreTreatment.Light,
            "S" => PreTreatment.Scarify,
            "C" => PreTreatment.Cover,
            "R" => PreTreatment.Rub,
            "E" => PreTreatment.Edgewise,
            "G" => PreTreatment.GibberelicAcid,
            "W" => PreTreatment.Water,
            _ => PreTreatment.None
        };
    }
    
    private static Germination ParseGermination(string germinationText)
    {
        // Format: 3:4w (type 3, 4 weeks)
        var match = Regex.Match(germinationText, @"(\d+):(\d+)w?");
        if (match.Success && int.TryParse(match.Groups[1].Value, out int germinationType))
        {
            return (Germination)germinationType;
        }
        
        return Germination.Default;
    }
}