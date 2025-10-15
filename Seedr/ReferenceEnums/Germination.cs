namespace Seedr.ReferenceEnums;

public enum Germination
{
    Default = 0,
    NoColdStrat = 1,           // No cold stratification necessary: germination is usually complete within a month or less
    NoColdStratStaggered = 2,  // No cold stratification necessary: germination may be staggered over several weeks. Flushes may occur at intervals, especially if the sowing medium is allowed to dry out gradually and then re-wetted
    ColdStratWeeks = 3,        // Cold stratification required for the number of weeks indicated, followed by exposure to warmth, after which germination is usually complete within a month or less
    ColdStratWeeksStaggered = 4, // Cold stratification required for the number of weeks indicated, followed by exposure to warmth, after which germination may be staggered over several weeks. Another period of cold may be helpful to encourage remaining seeds to sprout. Alternatively, seed may be exposed to outdoor winter conditions for germination in the spring
    WarmMoistStrat = 5,        // Warm, moist stratification required for 3 to 4 months, followed by 2 to 3 months cold stratification during which germination takes place while cold. Expose to warmth when germination is complete
    Ferns = 6,                 // Germination of fern spores — sterilize soil medium with boiling water, sow spores and keep moist with plastic or glass. A green film (prothalli) develops in several weeks, followed by baby ferns which can be transplanted when big enough to handle
    Orchids = 7                // Germination of orchid seeds requires specialized equipment -- consult a reference
}
