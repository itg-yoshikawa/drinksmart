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
- Regenerate both drink cards and dashboard display when favorites change
- Handle empty favorites state with instructional messages

### UI State Management
- Tab switching updates both navigation and content visibility classes
- Bottom sheets use overlay and body scroll lock patterns
- Real-time updates use immediate DOM manipulation rather than framework reactivity