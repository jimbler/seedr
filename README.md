# Seedr - Plant Seed Database Management System

A comprehensive plant seed database system consisting of a .NET data processing pipeline and a React web application for browsing and managing plant information.

**🌐 [View Live Demo](https://mrseedr.netlify.app/)** - Try the deployed SeedrApp to browse, filter, and favorite plants from the catalog.

---

## 📦 Project Overview

### Business Summary

**Seedr** is a dual-application system designed to collect, process, and display detailed information about plant seeds from external catalogs. The system provides:

- **Data Processing**: Automated parsing and enrichment of plant seed catalog data
- **Web Interface**: User-friendly browsing, filtering, and favoriting of plant information
- **Comprehensive Details**: Plant characteristics including hardiness zones, germination requirements, pricing, and botanical information

The system currently manages **2,205 plant entries** with 25.9% common name coverage, supporting both active and archived catalog data.

### Target Users

- **Gardeners & Horticulturists**: Browse and search for plant seeds by characteristics
- **Seed Companies**: Maintain and distribute catalog information
- **Botanical Researchers**: Access detailed plant germination and growing data
- **Home Gardeners**: Discover plants suitable for their hardiness zones and growing conditions

---

## 🌱 Seedr (.NET Application)

### Business Purpose

The Seedr .NET console application is a **data processing pipeline** that:
- Parses plant seed information from text-based catalog files
- Enriches data with common names using lookup tables and botanical APIs
- Validates and structures plant data into a standardized JSON format
- Manages both current and archived catalog entries

### Technical Implementation

**Technology Stack:**
- **.NET 9.0** Console Application
- **C#** with nullable reference types enabled
- **System.Text.Json** for JSON serialization
- **System.Text.RegularExpressions** for text parsing

**Key Components:**

1. **Data Models** (`Models/Plant.cs`)
   - Core `Plant` class with 19 properties
   - Unique GUID-based identification (`plantGuid`)
   - Support for external catalog codes and references
   - Data annotations for validation (e.g., `[MaxLength(10)]`)

2. **Reference Enums** (`ReferenceEnums/`)
   - `Zone`: USDA Hardiness Zones 1-13
   - `Seasonality`: Perennial, Annual, Biennial
   - `PreTreatment`: Flags enum for seed treatment requirements
   - `Germination`: 7 germination method types
   - `ExternalCatalog`: Catalog source tracking

3. **Data Pipeline** (Sequential Processing)
   - **CatalogParser.cs**: Parses raw text catalogs using regex patterns
     - Handles complex multi-line entries
     - Extracts botanical names, families, characteristics, pricing, and descriptions
     - Supports multiple elevation formats and edge cases
     - Separates active vs. archived catalog data
   
   - **CommonNameUpdater.cs**: Enriches data with common names
     - Uses hardcoded lookup table for 570 plants
     - Updates JSON file in-place
   
   - **ApiCommonNameUpdater.cs**: API-based enrichment
     - Integrates with Perenual, Plant.id, and USDA PLANTS APIs
     - Fallback system for reliability
     - Rate-limited to respect free tier constraints

4. **Parsing Features**
   - Regex-based extraction with multiple pattern support
   - Characteristic parsing: `(Size, Zone, Seasonality, PreTreatment, Germination:Weeks)`
   - Elevation handling in both feet and meters
   - Wild origin detection
   - Price and quantity extraction
   - Multi-line description support

**Input/Output:**
- **Input**: `catalog.txt` and `archived_catalog.txt` (text format)
- **Output**: `ParsedData/all_catalogs_parsed.json` (2,205 plant records)

**Execution:**
```bash
cd Seedr
dotnet run
```

The pipeline runs three sequential steps automatically, outputting statistics and progress information to the console.

---

## 🌿 SeedrApp (React Application)

### Business Purpose

SeedrApp is a **modern web application** that provides:
- Intuitive browsing of the plant database
- Advanced filtering by family, zone, seasonality, and status
- Dual viewing modes (cards and table)
- Favorites management with localStorage persistence
- Real-time search and sorting capabilities
- Detailed plant information with expandable views

### Technical Implementation

**Technology Stack:**
- **React 18.2.0** with functional components
- **TypeScript 4.9.5** for type safety
- **CSS3** with Flexbox and Grid layouts
- **localStorage API** for client-side persistence

**Key Features:**

1. **Component Architecture**
   - **App.tsx**: Main application container with state management
   - **PlantList.tsx**: Sortable list with view mode toggle
   - **PlantCard.tsx**: Expandable card view for individual plants
   - **PlantTable.tsx**: Sortable, expandable table view
   - **PlantFilters.tsx**: Multi-criteria filtering UI
   - **PlantStats.tsx**: Real-time statistics dashboard

2. **Data Services**
   - **plantService.ts**: Data loading, statistics, and formatting
   - **favoritesService.ts**: GUID-based favorites management with localStorage

3. **Type System** (`types/Plant.ts`)
   - Comprehensive TypeScript interfaces
   - Enum definitions matching C# backend
   - Type-safe filtering and statistics

4. **Filtering & Search**
   - **Text Search**: Botanical name, common name, family
   - **Family Filter**: 100+ plant families
   - **Seasonality Filter**: Perennial, Annual, Biennial
   - **Zone Filter**: All USDA zones (1-13)
   - **Status Filter**: Active, Archived, or All
   - **Favorites Filter**: Show favorites only

5. **Favorites System**
   - GUID-based unique identification
   - localStorage persistence across sessions
   - Visual indicators (⭐/☆)
   - Filter to show favorites only
   - Works in both card and table views

6. **View Modes**
   - **Card View**: Rich, expandable cards with full details
   - **Table View**: Compact, sortable table format
   - Click-to-expand for detailed information
   - Sortable by any field

7. **UI/UX Features**
   - Responsive design for all screen sizes
   - Loading states and error handling
   - Real-time statistics updates
   - Clear visual hierarchy
   - Accessible controls and labels

**Data Format:**
- Loads from `public/plant-data.json` (2,205 records)
- Mixed PascalCase/camelCase properties to match C# serialization

**Development:**
```bash
cd SeedrApp
npm install
npm start          # Development server
npm run build      # Production build
npx tsc --noEmit   # TypeScript type checking
```

**Deployment:**
- Configured for Netlify deployment
- `netlify.toml` with build settings
- Client-side routing support
- Legacy peer dependencies for compatibility

---

## 📊 Data Schema

### Plant Object Structure

```typescript
{
  CommonName: string              // Common name (25.9% coverage)
  BotanicalName: string          // Scientific name
  Family: string                 // Plant family
  Description: string            // Detailed description
  externalPlantCode: string      // External catalog code
  plantGuid: string              // Unique GUID identifier
  Size: string                   // Plant size (e.g., "12x14")
  Origin: string                 // Geographic origin
  Elevation: number              // Elevation in feet
  ElevationMeters: number        // Elevation in meters
  Quantity: string               // Seed quantity
  Price: number                  // Price in dollars
  WildOrigin: boolean           // Wild-collected seed
  IsArchived: boolean           // Archived status
  ExternalCatalog: number       // Catalog source (1 = AlPlains)
  Seasonality: number           // 0=Perennial, 1=Annual, 2=Biennial
  Zone: number                  // USDA Hardiness Zone (1-13)
  PreTreatment: number          // Flags enum for seed treatment
  Germination: number           // Germination method (0-7)
}
```

---

## 🚀 Getting Started

### Prerequisites

- **.NET 9.0 SDK** or later
- **Node.js 18.x** or later
- **npm** or **yarn**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd seedr
   ```

2. **Run the data pipeline** (if needed)
   ```bash
   cd Seedr
   dotnet run
   cd ..
   ```

3. **Start the web application**
   ```bash
   cd SeedrApp
   npm install
   npm start
   ```

4. **Open in browser**
   - Navigate to http://localhost:3000
   - Browse, filter, and favorite plants!

---

## 📁 Project Structure

```
seedr/
├── Seedr/                      # .NET Console Application
│   ├── Models/
│   │   └── Plant.cs           # Core plant data model
│   ├── ReferenceEnums/        # Enum definitions
│   │   ├── Zone.cs
│   │   ├── Seasonality.cs
│   │   ├── PreTreatment.cs
│   │   ├── Germination.cs
│   │   └── ExternalCatalog.cs
│   ├── CatalogParser.cs       # Text parsing logic
│   ├── CommonNameUpdater.cs   # Lookup table enrichment
│   ├── ApiCommonNameUpdater.cs # API enrichment
│   ├── BotanicalApiClient.cs  # API integration
│   ├── Program.cs             # Pipeline orchestration
│   ├── catalog.txt            # Active catalog data
│   ├── archived_catalog.txt   # Archived catalog data
│   └── ParsedData/
│       └── all_catalogs_parsed.json
│
├── SeedrApp/                   # React Web Application
│   ├── public/
│   │   ├── plant-data.json    # Plant database
│   │   ├── index.html
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── PlantCard.tsx
│   │   │   ├── PlantList.tsx
│   │   │   ├── PlantTable.tsx
│   │   │   ├── PlantFilters.tsx
│   │   │   └── PlantStats.tsx
│   │   ├── services/          # Business logic
│   │   │   ├── plantService.ts
│   │   │   └── favoritesService.ts
│   │   ├── types/
│   │   │   └── Plant.ts       # TypeScript definitions
│   │   ├── App.tsx            # Main application
│   │   ├── App.css            # Styling
│   │   └── index.tsx          # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── netlify.toml
│
├── ROADMAP.md                  # Feature roadmap
├── Roadmap Ideas.md            # Extended ideas
└── README.md                   # This file
```

---

## 🗺️ Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features including:
- Shopping list functionality
- Plant photo integration
- Enhanced favorites filtering

---

## 🔧 Technical Notes

### C# Backend
- Uses nullable reference types for compile-time safety
- Async/await patterns for API calls (currently limited by free tiers)
- Robust error handling with try-catch blocks
- Flexible regex patterns for varied input formats
- Preserves data structure through the pipeline

### React Frontend
- TypeScript for type safety across 2,205 records
- localStorage for client-side persistence
- No backend required (static JSON serving)
- Responsive CSS Grid/Flexbox layouts
- Optimized re-rendering with React hooks

### Data Flow
```
Text Catalogs → C# Parser → JSON → React App → User Browser
     ↓              ↓
  Regex       API Enrichment
 Extraction   (Common Names)
```

---

## 📄 License

This project is for educational and personal use.

---

## 🌟 Key Statistics

- **Total Plants**: 2,205
- **Plant Families**: 100+
- **Hardiness Zones**: 1-13 (USDA)
- **Common Name Coverage**: 25.9% (570 plants)
- **Active Plants**: 1,200
- **Archived Plants**: 1,005
- **Success Rate**: 100% parsing accuracy

---

**Built with ❤️ for plant enthusiasts and seed collectors**

