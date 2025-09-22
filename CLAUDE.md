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

### Data Management
- **Persistence**: All data stored in LocalStorage with automatic daily reset
- **Data Structure**: Each drink record contains `{type, volume, alcoholPercent, pureAlcohol, timestamp}`
- **Settings**: Body weight, daily limits, pace targets, and reminder intervals

### Key Features
- **Blood Alcohol Calculation**: Real-time BAC calculation based on body weight and consumption
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
- `calculateBloodAlcohol()` - BAC calculation using Widmark formula
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