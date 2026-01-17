# Vertical Menu Simplified - Requirements

## Overview
Simplify the vertical navigation menu to include only essential menu items, and move language settings into the menu structure.

## Requirements

### 1. Hide Existing Navigation Bar
- Keep the existing horizontal navigation bar in code but hide it visually
- The top header should remain minimal with only the hamburger menu button and app title
- Remove language switcher and profile dropdown from the header

### 2. Simplified Menu Structure
The vertical menu should contain only 4 main items:

```
📱 Vertical Menu
├── 🏠 Home (/)
├── ℹ️ About (/about)
├── 🧪 Test (/test)
└── ⚙️ Settings (expandable)
    ├── 👤 Profile (/profile)
    └── 🌐 Language
        ├── 🇺🇸 English
        └── 🇰🇷 Korean
```

### 3. Menu Item Details

#### Home
- Icon: `home`
- Route: `/`
- Simple navigation item

#### About
- Icon: `info`
- Route: `/about`
- Simple navigation item

#### Test
- Icon: `science`
- Route: `/test`
- Simple navigation item

#### Settings (Expandable)
- Icon: `settings`
- Expandable group containing:
  - **Profile**: Navigate to `/profile` page
  - **Language**: Dropdown or nested menu to switch between Korean and English

### 4. Language Settings Implementation
- Display as a sub-item under Settings
- Show current language with flag or indicator
- Click to show dropdown with:
  - 🇰🇷 Korean (한국어)
  - 🇺🇸 English
- Should update `locale` using vue-i18n
- Current selection should be highlighted

### 5. UI/UX Specifications
- Menu maintains existing mini/expanded modes
- Settings group should remember expanded/collapsed state
- Language selector should be visually distinct (perhaps with a dropdown indicator)
- Active route highlighting still applies
- Tooltips in mini mode for all items

## Technical Implementation

### Files to Modify
1. **`layouts/default.vue`**
   - Hide language switcher and profile menu from header
   - Keep header minimal (hamburger + title only)

2. **`config/menu.ts`**
   - Replace existing menu items with simplified structure
   - Add settings group with profile and language sub-items

3. **`components/navigation/MenuItem.vue`**
   - May need to handle language switching as a special case
   - Add support for language dropdown within menu

4. **`plugins/i18n.ts`**
   - Ensure translations for new menu structure exist

### Data Structure
```typescript
{
  id: 'settings',
  label: 'Settings',
  icon: 'settings',
  children: [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'person',
      route: '/profile'
    },
    {
      id: 'language',
      label: 'Language',
      icon: 'language',
      type: 'language-selector' // Special type for language switching
    }
  ]
}
```

## Testing Checklist
- [ ] Header shows only hamburger button and title
- [ ] Vertical menu displays 4 items: Home, About, Test, Settings
- [ ] Settings menu expands to show Profile and Language
- [ ] Clicking Profile navigates to /profile page
- [ ] Language selector shows dropdown with Korean and English
- [ ] Selecting a language updates the app locale
- [ ] Current language is visually indicated
- [ ] Mini mode works with tooltips
- [ ] Mobile responsive behavior maintained

## Success Criteria
1. Simplified menu structure with only essential items
2. Language settings accessible from vertical menu
3. Clean, minimal header without navigation clutter
4. All navigation functionality preserved
5. Smooth user experience with proper visual feedback
