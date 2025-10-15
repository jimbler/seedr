using System;

namespace Seedr.ReferenceEnums;

[Flags]
public enum PreTreatment
{
    None = 0,
    Light = 1,           // Light is required or seed is so tiny that it should not be buried
    Scarify = 2,         // Scarify seed by rubbing lightly on sandpaper or nick seed coat
    Cover = 4,           // Cover seed to a depth of about 4 times the minimum seed dimension
    Rub = 8,             // Rub vigorously between hands to remove impermeable seed coat or fuzz, etc.
    Edgewise = 16,       // Seed is flat and wide — insert seed in sowing medium to stand on edge
    GibberelicAcid = 32, // Gibberelic Acid (GA3) treatment helpful in stimulating germination
    Water = 64           // Water treatment: germination takes place under water
}
