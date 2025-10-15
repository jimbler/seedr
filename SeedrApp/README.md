# 🌱 Seedr Plant Database - React TypeScript Frontend

A modern React TypeScript application for browsing and managing your plant seed collection data.

## Features

- **📊 Plant Statistics Dashboard** - View comprehensive statistics about your plant collection
- **🔍 Advanced Filtering** - Filter plants by family, seasonality, hardiness zone, and status
- **🔎 Search Functionality** - Search by botanical name, common name, or family
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **📋 Detailed Plant Cards** - Expandable cards showing comprehensive plant information
- **🔄 Sorting Options** - Sort plants by various criteria (name, family, zone, price, etc.)
- **🔧 TypeScript Support** - Full type safety with comprehensive type definitions
- **⚡ Modern Development** - Latest React patterns with hooks and functional components

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the SeedrApp directory:
   ```bash
   cd SeedrApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `build` directory.

### TypeScript Development

This project uses TypeScript for enhanced development experience. Here are the key TypeScript commands:

#### Type Checking

To check for TypeScript errors without generating output files:

```bash
npx tsc --noEmit
```

This command:
- Compiles TypeScript files to check for type errors
- Does not generate JavaScript output files (`--noEmit` flag)
- Reports all type errors, warnings, and issues
- Useful for CI/CD pipelines and pre-commit hooks
- Runs automatically during `npm start` and `npm run build`

#### TypeScript Configuration

The project uses `tsconfig.json` with the following key settings:
- **Target**: ES2015 (for modern JavaScript features)
- **Strict Mode**: Enabled for maximum type safety
- **JSX**: React JSX transform support
- **Module Resolution**: Node.js style module resolution

#### Development Workflow

1. **Start Development Server**:
   ```bash
   npm start
   ```
   - Automatically runs TypeScript type checking
   - Hot reloads on file changes
   - Shows TypeScript errors in the browser console

2. **Check Types Before Committing**:
   ```bash
   npx tsc --noEmit
   ```
   - Run this before committing code
   - Ensures no type errors in the codebase
   - Can be added to pre-commit hooks

3. **Build for Production**:
   ```bash
   npm run build
   ```
   - Compiles TypeScript to JavaScript
   - Optimizes the build for production
   - Fails if there are TypeScript errors

#### Troubleshooting TypeScript Issues

**Common TypeScript Errors and Solutions:**

1. **Type Mismatch Errors**:
   ```bash
   npx tsc --noEmit
   ```
   - Check the error messages for specific type mismatches
   - Ensure enum values are properly converted (e.g., `parseInt()` for string to number)
   - Verify interface implementations match expected types

2. **JSX Namespace Errors**:
   - Remove explicit `JSX.Element` return types (TypeScript infers them)
   - Ensure React is properly imported in all component files

3. **Set Iteration Errors**:
   - Update `tsconfig.json` target to `es2015` or higher
   - Use `Array.from()` for older targets if needed

4. **Module Resolution Issues**:
   - Check import paths are correct
   - Ensure file extensions are properly specified (.ts, .tsx)
   - Verify `tsconfig.json` module resolution settings

**Useful TypeScript Commands:**

```bash
# Check types without emitting files
npx tsc --noEmit

# Check types with detailed output
npx tsc --noEmit --pretty

# Check types and show all files
npx tsc --noEmit --listFiles

# Check types with specific config
npx tsc --noEmit --project tsconfig.json
```

## Data Source

The app loads plant data from `/public/plant-data.json`. This file should contain an array of plant objects with the following structure:

```json
[
  {
    "botanicalName": "Plant botanical name",
    "commonName": "Common name",
    "family": "Plant family",
    "description": "Plant description",
    "plantCode": "Plant code",
    "size": "Plant size",
    "origin": "Origin location",
    "elevation": 1000,
    "elevationMeters": 305,
    "quantity": "Seed quantity",
    "price": 3.50,
    "wildOrigin": false,
    "isArchived": false,
    "externalCatalog": 1,
    "seasonality": 0,
    "zone": 5,
    "preTreatment": 4,
    "germination": 3
  }
]
```

## TypeScript Features

This application is built with TypeScript for enhanced development experience:

- **Type Safety** - Comprehensive type definitions for all Plant model properties
- **Enum Support** - Type-safe enums for Seasonality, Zone, PreTreatment, Germination, and ExternalCatalog
- **Interface Definitions** - Well-defined interfaces for components, services, and data structures
- **Generic Types** - Proper typing for React hooks, event handlers, and utility functions
- **IntelliSense Support** - Full IDE support with autocomplete and error detection

## Components

### App.tsx
Main application component that manages state and coordinates between components.

### PlantStats.tsx
Displays statistics about the plant collection including total count, common name coverage, and family distribution.

### PlantFilters.tsx
Provides filtering controls for searching and filtering plants by various criteria.

### PlantList.tsx
Displays the filtered and sorted list of plants with sorting controls.

### PlantCard.tsx
Individual plant card component that displays plant information in an expandable format.

## Services

### plantService.ts
Contains utility functions for:
- Loading plant data with proper TypeScript typing
- Calculating statistics with type-safe operations
- Formatting plant data for display using enum mappings
- Getting unique values for filter options with proper return types

## Type Definitions

### types/Plant.ts
Comprehensive TypeScript definitions including:
- **Plant Interface** - Complete type definition matching the C# Plant model
- **Enums** - Type-safe enums for Seasonality, Zone, PreTreatment, Germination, ExternalCatalog
- **Filter Types** - Proper typing for search and filter functionality
- **Statistics Types** - Type-safe interfaces for plant collection statistics

## Styling

The app uses modern CSS with:
- CSS Grid and Flexbox for layouts
- Custom CSS variables for consistent theming
- Responsive design principles
- Smooth animations and transitions
- Accessible color contrast ratios

## Integration with C# Backend

This React app is designed to work with the C# Seedr backend that processes plant catalog data. The backend:

1. Parses plant catalog files
2. Applies common name lookups
3. Enhances data with botanical API information
4. Outputs structured JSON data

The React app consumes this processed data to provide a user-friendly interface for browsing and managing the plant collection.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Seedr plant database system.