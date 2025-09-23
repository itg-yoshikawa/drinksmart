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
- **Persistence**: All data stored in LocalStorage with session-aware daily reset
- **Session Management**: Drinking sessions persist across date changes for continuous tracking
- **Data Structure**: Each drink record contains `{type, volume, alcoholPercent, pureAlcohol, timestamp}`
- **Daily Memo**: Personal reflection notes stored with 200-character limit and real-time validation
- **Settings**: Body weight, daily limits, pace targets, and reminder intervals

### Key Features
- **Blood Alcohol Calculation**: Real-time BAC calculation using Widmark formula with medical accuracy
- **BAC Status Display**: Visual alcohol impairment level indicators with medical terminology
- **Hydration Guidance**: Dynamic water intake recommendations based on alcohol consumption
- **Pace Tracking**: Monitors drinking speed (minutes per drink) with warnings
- **Smart Reminders**: Water intake reminders and pace warnings
- **Favorites System**: Dynamic dashboard showing user's preferred drinks
- **Last Drink Awareness**: Displays previous consumption time and elapsed duration for responsible pacing
- **Daily Memo System**: Personal reflection notes with character limits and auto-save functionality
- **Data Export**: Comprehensive export functionality supporting JSON, CSV, and human-readable text formats
- **Session Management**: Cross-date session tracking for extended drinking events
- **Record Reminders**: Intelligent reminders to prevent missed records during drinking
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
- Current version: 1.9.0 (displayed in app header)
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
- `updateLastDrinkInfo()` - Updates last drink time and elapsed duration display
- `formatElapsedTime(milliseconds)` - Converts time differences to human-readable format (hours/minutes/seconds)
- `startLastDrinkUpdateTimer()` - 30-second interval timer for real-time elapsed time updates
- `setupSwipeToClose()` - Touch gesture handling for mobile bottom sheet interactions
- `hideAllBottomSheets()` - Universal modal closing function for emergency situations
- `updateMemoDisplay()` - Initializes and updates daily memo display with character counting
- `exportData(format)` - Main export orchestrator supporting multiple output formats
- `generateJSONExport()` - Creates comprehensive JSON export with metadata and statistics
- `generateCSVExport()` - Produces spreadsheet-compatible CSV with timeline data
- `generateTextExport()` - Generates human-readable report with summary and detailed timeline
- `checkAndResumeSession()` - Validates and restores previous drinking sessions on app launch
- `startNewSession()` - Initiates new drinking session with unique ID and timestamp
- `updateSessionActivity()` - Updates session activity timestamp for continuation logic
- `endSession()` - Terminates current session and clears session data
- `updateSessionInfo()` - Updates session UI display with duration and start time
- `checkRecordReminder()` - Monitors time since last activity and shows reminder prompts
- `showRecordReminder()` - Displays reminder card with elapsed time and vibration feedback

### Event Handling Patterns
- **Event Delegation**: Use event delegation for dynamically generated elements
- **Event Bubbling Control**: For nested interactive elements (like favorite buttons inside drink cards), use `preventDefault()` and `stopPropagation()` to prevent parent element interference
- **Z-index Management**: Interactive buttons in nested layouts need `position: relative; z-index: 2` to ensure clickability
- **Priority Handling**: Process specific button clicks (favorites, add) before general container clicks
- **Mobile Touch Events**: Combine `click` and `touchend` events for reliable mobile interaction, especially for modal close buttons
- **Swipe Gestures**: Implement swipe-to-close for bottom sheets with distance (100px) and time (300ms) thresholds
- **Multiple Close Methods**: Provide ESC key, swipe down, overlay tap, and button tap for maximum accessibility

### UI/UX Design Patterns
- **Progressive Enhancement**: Start with basic functionality, then layer on advanced features
- **Mobile-First Design**: Design for smallest screens first, then scale up
- **Touch-Friendly Interactions**: Minimum 44px touch targets, hover states disabled on touch devices
- **Visual Hierarchy**: Use font size progression (48px → 28px → 20px) for information importance
- **Conditional UI Elements**: Show/hide sections based on data availability (favorites bar appears only when favorites exist)
- **Haptic Feedback**: Different vibration patterns for different actions (50ms for drinks, 30ms for tracking, custom patterns for favorites)
- **Last Drink Tracking**: Discrete display of previous drink time and elapsed duration for pacing awareness

### Styling Conventions
- Uses CSS custom properties for theming
- Mobile-first responsive design with hover states disabled on touch devices
- iOS/Android-inspired design patterns with smooth animations
- **Dark Mode Support**: Complete dark mode implementation through CSS media queries (`prefers-color-scheme: dark`)
- **Dark Mode Colors**: Proper contrast ratios for all UI elements including new features like last drink info
- **Accessibility**: Ensures text visibility and contrast in both light and dark themes

### Data Persistence Strategy
- LocalStorage keys: `drinkingApp_data`, `drinkingApp_settings`, `drinkingApp_favorites`, `drinkingSession`
- Data includes: drinks, waterIntakes, toiletVisits, dailyMemo, and timestamp information
- Session-aware data reset: Only resets when no active session exists
- Error handling for corrupted localStorage data
- Real-time saving for memo input with character limit validation
- Session persistence across app restarts and date changes

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

### Last Drink Awareness System
**Purpose**: Helps users maintain responsible drinking pace by showing when they last consumed alcohol and how much time has elapsed.

**Implementation**:
```javascript
// Discrete display between main stats and secondary stats
<div class="last-drink-info" id="lastDrinkInfo">
    <div class="last-drink-time">
        <span class="last-drink-label">前回:</span>
        <span class="last-drink-value" id="lastDrinkTime">14:30</span>
    </div>
    <div class="last-drink-elapsed">
        <span class="elapsed-value" id="timeSinceLastDrink">45分</span>
        <span class="elapsed-label">経過</span>
    </div>
</div>
```

**Key Features**:
- **Conditional Visibility**: Only shows when drinks have been recorded
- **Real-time Updates**: Elapsed time updates every 30 seconds via `setInterval()`
- **Time Formatting**: Smart display (seconds → minutes → hours/minutes)
- **Discrete Design**: Subtle background with muted colors to avoid UI clutter
- **Dark Mode Compatible**: Proper contrast ratios for both light and dark themes

**Design Rationale**:
- **Positioning**: Between main stats and secondary stats for high visibility without interference
- **Subtle Styling**: Uses `rgba(142, 142, 147, 0.1)` background to remain unobtrusive
- **Information Architecture**: Time on left, elapsed duration on right for logical flow
- **Color Coding**: Blue accent for elapsed time to draw attention to pacing information

### Daily Memo System
**Purpose**: Provides users with a space for personal reflection, notes about their drinking experience, and lessons learned.

**Implementation**:
```javascript
// Real-time character counting with visual feedback
dailyMemoTextarea.addEventListener('input', (e) => {
    const text = e.target.value;
    const length = text.length;

    if (length > 200) {
        e.target.value = text.substring(0, 200);
        return;
    }

    // Visual feedback based on character count
    if (length >= 180) charCountElement.classList.add('error');
    else if (length >= 150) charCountElement.classList.add('warning');

    this.dailyMemo = text;
    this.saveData(); // Auto-save on every keystroke
});
```

**Key Features**:
- **200 Character Limit**: Encourages concise, meaningful reflection
- **Real-time Validation**: Prevents exceeding character limit with immediate feedback
- **Visual Indicators**: Warning at 150 chars (orange), error at 180+ chars (red)
- **Auto-save**: Immediate persistence to localStorage on every keystroke
- **Daily Reset**: Memo resets with daily data cycle
- **Placeholder Guidance**: "飲み会の感想や反省点をメモ..." suggests appropriate content

### Data Export System
**Purpose**: Enables users to export their drinking data for personal analysis, medical consultations, or record keeping.

**Supported Formats**:

1. **JSON Export**: Complete technical data dump
   ```json
   {
     "exportDate": "2025-09-22T...",
     "appVersion": "1.5.0",
     "dailyMemo": "楽しい飲み会でした...",
     "summary": {
       "totalAlcohol": 28,
       "bloodAlcoholContent": 0.04,
       "totalWater": 600,
       "toiletVisits": 3,
       "drinksCount": 2
     },
     "drinks": [/* detailed records */],
     "waterIntakes": [/* timestamps and amounts */],
     "toiletVisits": [/* timestamps */]
   }
   ```

2. **CSV Export**: Spreadsheet-compatible timeline format
   ```csv
   日時,種別,内容,量,アルコール度数,純アルコール量
   14:30,飲み物,ビール,500ml,5%,20g
   14:45,水分,水分摂取,300ml,0%,0g
   15:00,トイレ,トイレ訪問,-,-,-
   -,メモ,"楽しい飲み会でした",-,-,-
   ```

3. **Text Export**: Human-readable report
   ```
   === Drink Smart レポート ===
   日付: 2025年9月22日

   --- 今日のサマリー ---
   純アルコール量: 28g
   血中アルコール濃度: 0.04%

   --- 今日の一言 ---
   楽しい飲み会でした...

   --- 詳細記録 ---
   1. 14:30 - ビール (500ml, 5%, 純アルコール20g)
   2. 14:45 - 水分摂取 (300ml)
   ```

**Technical Implementation**:
- **File Naming**: `DrinkSmart_YYYYMMDD.extension` format for easy organization
- **UTF-8 Encoding**: Proper Japanese character support across all formats
- **Blob API**: Client-side file generation without server dependencies
- **MIME Types**: Correct content types for proper application association
- **Memory Management**: Automatic URL.revokeObjectURL() after download
- **User Feedback**: Vibration feedback on successful export

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

## Session Management System (v1.8.0+)

### Problem Solved
Traditional daily data reset at midnight caused issues for drinking sessions that span across dates (e.g., parties until 2 AM). This resulted in:
- Lost blood alcohol concentration tracking
- Interrupted session continuity
- Artificial data breaks during continuous drinking

### Solution: Intelligent Session Management

**Session Concept**: A drinking session represents continuous alcohol-related activity with automatic timeout after 4 hours of inactivity.

**Key Components**:
```javascript
// Session data structure
{
  id: 'session_' + timestamp,
  startTime: Date,
  lastActivity: Date,
  startDate: string // Original start date
}
```

**Session Lifecycle**:
1. **Auto-start**: First drink/water/toilet record creates new session
2. **Activity tracking**: All user actions update `lastActivity` timestamp
3. **Persistence**: Session survives app restarts and date changes
4. **Auto-timeout**: Session ends after 4 hours of inactivity
5. **Manual end**: User can explicitly end session via UI button

**Date Change Behavior**:
- **With Active Session**: Data persists across midnight, BAC calculation continues
- **Without Session**: Normal daily reset occurs as before

### UI Integration

**Session Status Display**:
- Orange gradient card showing "飲酒セッション継続中" (Drinking session in progress)
- Start time and duration information
- Manual end button with confirmation dialog

**Session End Confirmation**:
```javascript
// User-friendly confirmation with session details
const confirmed = confirm(`飲酒セッションを終了しますか？
継続時間: ${durationText}

注意: セッション終了後は血中アルコール濃度の継続計算も停止されます。`);
```

### Implementation Benefits

1. **Medical Accuracy**: Continuous BAC tracking regardless of date changes
2. **User Experience**: No data loss during extended drinking events
3. **Flexibility**: Manual session control when needed
4. **Safety**: Automatic timeout prevents indefinite sessions

### Development Considerations

**Session Recovery Logic**:
```javascript
checkAndResumeSession() {
  const timeSinceLastActivity = now - lastActivity;
  if (timeSinceLastActivity < this.sessionTimeout) {
    // Resume session
    this.currentSession = session;
  } else {
    // Session expired, clear data
    this.endSession();
  }
}
```

**Activity Updates**: All user interactions call `updateSessionActivity()` to maintain session liveness:
- Drink additions
- Water intake recording
- Toilet visit logging

**Session Termination**: Occurs through:
- 4-hour inactivity timeout
- Manual user termination
- Application-level reset (if needed)

## Record Reminder System (v1.8.0+)

### Problem Addressed
As alcohol consumption progresses, users often forget to record subsequent drinks, water intake, or bathroom visits, leading to:
- Inaccurate blood alcohol calculations
- Poor hydration tracking
- Unreliable pace monitoring

### Intelligent Reminder Implementation

**Core Logic**:
```javascript
checkRecordReminder() {
  const timeSinceLastActivity = now - this.getLastActivity();
  const reminderThreshold = recordReminderMinutes * 60 * 1000;

  if (timeSinceLastActivity > reminderThreshold) {
    this.showRecordReminder(timeSinceLastActivity);
  }
}
```

**Multi-Activity Tracking**:
- Monitors drinks, water intake, and toilet visits collectively
- Uses most recent activity timestamp across all categories
- Configurable reminder interval (default: 45 minutes)

**User Experience Features**:
- Visual reminder card with pulsing animation
- Elapsed time display in human-readable format (hours/minutes)
- Vibration feedback for attention (if enabled)
- Dismissible with "了解" (Understood) button
- 5-minute check interval for timely reminders

**Settings Integration**:
- Configurable reminder interval in settings panel
- Toggle for notification enable/disable
- Respects existing vibration preferences

**Technical Implementation**:
```javascript
// Reminder card styling with attention-grabbing design
.reminder-card {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  animation: fadeIn 0.3s ease, pulse 2s ease-in-out infinite;
  box-shadow: 0 8px 32px rgba(255, 152, 0, 0.3);
}
```

### Design Philosophy

**Progressive Intervention**: Gentle reminders that don't interrupt the social experience but maintain safety awareness.

**Contextual Timing**: 45-minute default based on:
- Typical pace recommendations (20-30 minutes per drink)
- Social drinking conversation gaps
- Memory impairment onset timing

**User Control**: Full configurability allows users to adjust based on personal drinking patterns and social contexts.

### Future Enhancement Opportunities

**Push Notifications**: Browser notification API integration for background reminders when app is minimized.

**Smart Timing**: Machine learning from user patterns to optimize reminder timing.

**Social Features**: Group drinking session coordination with shared reminders.