# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Progressive Web App (PWA) called "Drink Smart" for preventing overdrinking at parties. It's a pure client-side application built with vanilla HTML, CSS, and JavaScript that helps users track alcohol consumption, calculate blood alcohol content, and promote responsible drinking.

## Architecture

### File Structure
- `overdrinking-app/index.html` - Main application shell with tab-based navigation
- `overdrinking-app/js/app.js` - Single-class application logic (`DrinkingApp`)
- `overdrinking-app/css/style.css` - Mobile-first responsive styling
- `overdrinking-app/manifest.json` - PWA configuration

### Core Application Class (`DrinkingApp`)
The entire application is encapsulated in a single `DrinkingApp` class with key properties:
- `drinks[]` - Array of consumed alcoholic beverages with timestamps
- `waterIntakes[]` - Water consumption tracking
- `toiletVisits[]` - Toilet visit frequency tracking
- `drinkTypes[]` - Predefined drink database with alcohol content and volumes
- `favoriteDrinks[]` - User's favorite drinks for quick access
- `bacLevels[]` - Medical blood alcohol concentration ranges with status indicators

### Data Management
- **Persistence**: All data stored in LocalStorage with automatic daily reset
- **Data Structure**: Each drink record contains `{type, volume, alcoholPercent, pureAlcohol, timestamp}`
- **Settings**: Body weight, daily limits, pace targets, and reminder intervals

### Key Features
- **Blood Alcohol Calculation**: Real-time BAC calculation using Widmark formula with medical accuracy
- **BAC Status Display**: Visual alcohol impairment level indicators with medical terminology
- **Hydration Guidance**: Dynamic water intake recommendations based on alcohol consumption
- **Pace Tracking**: Monitors drinking speed (minutes per drink) with warnings
- **Smart Reminders**: Water intake reminders and pace warnings
- **Favorites System**: Dynamic dashboard showing user's preferred drinks
- **Mobile-First UI**: Smartphone app-like interface with bottom sheets and tab navigation

### UI Architecture
- **Tab System**: Dashboard, Drinks, History tabs with dynamic content switching
- **Bottom Sheets**: Modal-style forms for custom inputs and settings
- **Event Delegation**: Dynamic drink cards use event delegation for favorites and add buttons
- **Responsive Grid**: Adapts to different screen sizes with CSS Grid

## Development Notes

### Running the Application
- Open `index.html` directly in a browser (no build process required)
- For development, use a local server to avoid CORS issues with PWA features
- Live demo: https://itg-yoshikawa.github.io/drinksmart/overdrinking-app/

### Repository Management
- GitHub repository: https://github.com/itg-yoshikawa/drinksmart.git
- Main branch tracks origin/main for seamless deployment
- Standard Git workflow: commit locally, then `git push` to deploy

### Version Management
- Current version: 1.3.0 (displayed in app header)
- Version locations to update on each release:
  - `overdrinking-app/manifest.json` - "version" field
  - `overdrinking-app/index.html` - `.app-version` span content
- Versioning strategy: Semantic versioning (MAJOR.MINOR.PATCH)
  - PATCH: Bug fixes, minor improvements
  - MINOR: New features, UI enhancements
  - MAJOR: Breaking changes, major rewrites

### Key Methods
- `addDrink(type, volume, alcohol)` - Core consumption tracking
- `calculateBloodAlcoholContent()` - BAC calculation using Widmark formula with time-based metabolism
- `getBacStatus(bac)` - Maps BAC percentage to medical impairment levels
- `getRecommendedWaterIntake()` - Calculates optimal hydration based on alcohol consumption
- `generateDrinkCards()` - Dynamic UI generation for drink selection
- `toggleFavorite(drinkType)` - Favorites management with persistence
- `updateFavoriteDrinksDisplay()` - Dashboard favorite drinks sync

### Event Handling Patterns
- **Event Delegation**: Use event delegation for dynamically generated elements
- **Event Bubbling Control**: For nested interactive elements (like favorite buttons inside drink cards), use `preventDefault()` and `stopPropagation()` to prevent parent element interference
- **Z-index Management**: Interactive buttons in nested layouts need `position: relative; z-index: 2` to ensure clickability
- **Priority Handling**: Process specific button clicks (favorites, add) before general container clicks

### UI/UX Design Patterns
- **Progressive Enhancement**: Start with basic functionality, then layer on advanced features
- **Mobile-First Design**: Design for smallest screens first, then scale up
- **Touch-Friendly Interactions**: Minimum 44px touch targets, hover states disabled on touch devices
- **Visual Hierarchy**: Use font size progression (48px → 28px → 20px) for information importance
- **Conditional UI Elements**: Show/hide sections based on data availability (favorites bar appears only when favorites exist)
- **Haptic Feedback**: Different vibration patterns for different actions (50ms for drinks, 30ms for tracking, custom patterns for favorites)

### Styling Conventions
- Uses CSS custom properties for theming
- Mobile-first responsive design with hover states disabled on touch devices
- iOS/Android-inspired design patterns with smooth animations
- Dark mode support through CSS media queries

### Data Persistence Strategy
- LocalStorage keys: `drinkingApp_data`, `drinkingApp_settings`, `drinkingApp_favorites`
- Automatic daily data reset based on date comparison
- Error handling for corrupted localStorage data

### PWA Configuration
- Configured for standalone mobile app experience
- Japanese language support with English app title ("Drink Smart")
- Health/lifestyle category classification
- Portrait orientation lock

## Common Development Patterns

### Dynamic Content Generation
- Use `generateDrinkCards()` to create drink selection UI from `drinkTypes` array
- Implement event delegation on parent containers for dynamic elements
- Update LocalStorage immediately after state changes for persistence

### Favorites System Implementation
- Store favorites as array of drink type strings in `favoriteDrinks[]`
- Use `toggleFavorite()` to add/remove items with immediate save to LocalStorage
- Quick access bar shows up to 5 favorites in horizontal layout between navigation and content
- Conditional visibility: `.quick-favorites.show` class controls display based on favorites availability
- Regenerate both drink cards and quick access bar when favorites change
- Auto-hide when no favorites exist to maintain clean UI

### UI State Management
- Tab switching updates both navigation and content visibility classes
- Bottom sheets use overlay and body scroll lock patterns
- Real-time updates use immediate DOM manipulation rather than framework reactivity
- Conditional rendering: Use CSS classes (`.show`, `.active`) to control element visibility
- State-driven UI: Display elements based on data availability (favorites, drink history)

### Version Increment Workflow
When making significant changes, follow this pattern:
1. **Update version numbers** in two locations:
   - `manifest.json`: "version" field
   - `index.html`: `.app-version` span content
2. **Update CLAUDE.md**: Current version reference
3. **Commit with detailed changelog**: Include version in commit message and describe all changes
4. **Use semantic versioning**: PATCH for fixes, MINOR for features, MAJOR for breaking changes

## Critical Medical Calculations

### Blood Alcohol Content (BAC) Calculation
**Widmark Formula Implementation**: The app uses the medically accurate Widmark formula for BAC calculation:

```javascript
// Correct Widmark formula with proper unit conversion
const initialBAC = (totalAlcohol * 0.8) / (this.bodyWeight * bodyFactor) / 10;
```

**Key Implementation Details**:
- **Unit Conversion Critical**: The factor of 0.8 (alcohol density) and division by 10 are essential for correct percentage calculation
- **Gender Factors**: Male = 0.7, Female = 0.6 (body water content coefficients)
- **Metabolism Rate**: 0.015%/hour (standard alcohol elimination rate)
- **Common Error**: Using `(totalAlcohol / (bodyWeight * bodyFactor))` without proper conversion yields incorrect results 10x higher

**Medical BAC Reference Ranges**:
- 0.00-0.02%: 正常 (Normal)
- 0.02-0.05%: 爽快期 (Euphoric stage)
- 0.05-0.11%: ほろ酔い期 (Light intoxication)
- 0.11-0.16%: 酩酊初期 (Early intoxication)
- 0.16-0.31%: 酩酊極期 (Severe intoxication)
- 0.31-0.41%: 泥酔期 (Stupor)
- 0.41%+: 昏睡期 (Coma risk)

**Validation Example**:
- Beer 500ml (20g alcohol), 77kg male → 0.03% BAC (爽快期)
- This should result in "爽快期" (euphoric stage), not higher levels

### Hydration Recommendation System
**Water Intake Calculation**: The app provides dynamic hydration guidance to prevent dehydration and reduce hangover risk:

```javascript
// Multi-factor approach for optimal hydration
getRecommendedWaterIntake() {
    const alcoholBasedWater = totalAlcohol * 12; // 12ml per gram of alcohol
    const volumeBasedWater = totalDrinkVolume;   // Match alcohol drink volume
    const minimumWater = 300;                    // Baseline hydration
    return Math.max(alcoholBasedWater, volumeBasedWater, minimumWater);
}
```

**Implementation Guidelines**:
- **Alcohol-Based Formula**: 12ml of water per gram of pure alcohol (evidence-based ratio)
- **Volume Matching**: Minimum water intake should equal total alcoholic beverage volume
- **Baseline Requirement**: Always recommend at least 300ml regardless of alcohol consumption
- **Visual Feedback**: Color-coded status (red: <70% target, blue: 70-99%, green: ≥100%)

**Hydration Status Logic**:
- **Insufficient** (Red): Less than 70% of recommended intake
- **Adequate** (Blue): 70-99% of recommended intake
- **Sufficient** (Green): 100% or more of recommended intake

**Real-world Example**:
- Beer 500ml (20g alcohol) → Recommended: 500ml water (max of 240ml, 500ml, 300ml)
- User drinks 600ml water → Status: "Sufficient" (green, 120% of target)

## Deployment and Distribution

### GitHub Pages Deployment
- Static site deployment via GitHub Pages
- Setup: Repository Settings → Pages → Deploy from branch → main → / (root)
- Live URL: https://itg-yoshikawa.github.io/drinksmart/
- App access: https://itg-yoshikawa.github.io/drinksmart/overdrinking-app/
- No build process required - pure static files deployment
- Automatic deployment on push to main branch (updates within minutes)

### PWA Distribution
- Installable as standalone app on mobile devices
- Manifest.json configured for app store-like experience
- Works offline once cached (service worker can be added for enhanced offline support)