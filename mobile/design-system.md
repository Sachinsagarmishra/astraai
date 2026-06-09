# 🎨 Astrai Design System

> **Version**: 1.0.0  
> **Last Updated**: June 2026  
> **Philosophy**: मन से, डर से नहीं — "From the heart, not from fear."

This document is the **single source of truth** for all visual and interaction design decisions in the Astrai mobile application. Every screen, component, and micro-interaction must follow these guidelines to maintain a premium, cohesive experience.

---

## 1. Typography

### Font Families

| Role | Font | Weight | Fallback |
|------|------|--------|----------|
| **Display / H1** | Playfair Display | Bold (700) | Georgia, serif |
| **Heading / H2** | Playfair Display | SemiBold (600) | Georgia, serif |
| **Subheading / H3** | Playfair Display | Medium (500) | Georgia, serif |
| **Body** | Inter | Regular (400) | System Default |
| **Body Bold** | Inter | SemiBold (600) | System Default |
| **Caption** | Inter | Medium (500) | System Default |
| **Label / Overline** | Inter | Bold (700) | System Default |

### Font Sizes

```typescript
export const Typography = {
  display:    { fontSize: 32, lineHeight: 40, fontFamily: 'PlayfairDisplay-Bold' },
  h1:         { fontSize: 28, lineHeight: 36, fontFamily: 'PlayfairDisplay-Bold' },
  h2:         { fontSize: 24, lineHeight: 32, fontFamily: 'PlayfairDisplay-SemiBold' },
  h3:         { fontSize: 20, lineHeight: 28, fontFamily: 'PlayfairDisplay-Medium' },
  bodyLarge:  { fontSize: 18, lineHeight: 26, fontFamily: 'Inter-Regular' },
  body:       { fontSize: 16, lineHeight: 24, fontFamily: 'Inter-Regular' },
  bodySmall:  { fontSize: 14, lineHeight: 20, fontFamily: 'Inter-Regular' },
  caption:    { fontSize: 12, lineHeight: 16, fontFamily: 'Inter-Medium' },
  overline:   { fontSize: 11, lineHeight: 14, fontFamily: 'Inter-Bold', letterSpacing: 1.5, textTransform: 'uppercase' },
  buttonText: { fontSize: 18, lineHeight: 24, fontFamily: 'Inter-SemiBold' },
};
```

### Loading Fonts (Expo)

```typescript
import { useFonts } from 'expo-font';
import {
  PlayfairDisplay_700Bold,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_500Medium,
} from '@expo-google-fonts/playfair-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

const [fontsLoaded] = useFonts({
  'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
  'PlayfairDisplay-SemiBold': PlayfairDisplay_600SemiBold,
  'PlayfairDisplay-Medium': PlayfairDisplay_500Medium,
  'Inter-Regular': Inter_400Regular,
  'Inter-Medium': Inter_500Medium,
  'Inter-SemiBold': Inter_600SemiBold,
  'Inter-Bold': Inter_700Bold,
});
```

---

## 2. Color Palette

### Core Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#ea580c` | Primary CTA, active tabs, accent highlights |
| `primaryDark` | `#c2410c` | Pressed/active state of primary |
| `primaryLight` | `#fb923c` | Lighter variant for gradients |
| `secondary` | `#d97706` | Secondary accents, amber tones |

### Neutral / Stone Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#FDFBF7` | All screen backgrounds |
| `surface` | `#FFFFFF` | Cards, forms, modals, sheets |
| `surfaceTint` | `#FFF7ED` | Subtle warm tinted surfaces |
| `surfaceWarm` | `#FFEDD5` | Icon backgrounds, badges |
| `border` | `#f5f5f4` | Card borders, dividers |
| `borderStrong` | `#e7e5e4` | Input borders, separators |
| `textPrimary` | `#1c1917` | Headings, primary content |
| `textSecondary` | `#44403c` | Labels, secondary content |
| `textMuted` | `#78716c` | Descriptions, hints, captions |
| `textDisabled` | `#a8a29e` | Disabled states, placeholders |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#16a34a` | Good muhurta, success states |
| `successBg` | `#f0fdf4` | Success card backgrounds |
| `danger` | `#dc2626` | Rahu Kaal, error states |
| `dangerBg` | `#fff1f2` | Danger card backgrounds |
| `info` | `#2563eb` | Update buttons, links |
| `infoBg` | `#dbeafe` | Info card backgrounds |
| `love` | `#f43f5e` | Heart/devotion icons |

### StyleSheet Definition

```typescript
export const Colors = {
  primary:       '#ea580c',
  primaryDark:   '#c2410c',
  primaryLight:  '#fb923c',
  secondary:     '#d97706',

  background:    '#FDFBF7',
  surface:       '#FFFFFF',
  surfaceTint:   '#FFF7ED',
  surfaceWarm:   '#FFEDD5',

  border:        '#f5f5f4',
  borderStrong:  '#e7e5e4',

  textPrimary:   '#1c1917',
  textSecondary: '#44403c',
  textMuted:     '#78716c',
  textDisabled:  '#a8a29e',

  success:       '#16a34a',
  successBg:     '#f0fdf4',
  danger:        '#dc2626',
  dangerBg:      '#fff1f2',
  info:          '#2563eb',
  infoBg:        '#dbeafe',
  love:          '#f43f5e',

  white:         '#FFFFFF',
  black:         '#000000',
  transparent:   'transparent',
};
```

---

## 3. Gradient System

### Primary Gradient (CTA Buttons)

```
Direction: 135° (top-left to bottom-right)
Start:  #ea580c (Orange 600)
End:    #d97706 (Amber 600)
```

#### React Native Implementation

Since React Native doesn't support CSS gradients natively, use `expo-linear-gradient`:

```typescript
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={['#ea580c', '#d97706']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.gradientButton}
>
  <Text style={styles.gradientButtonText}>Continue</Text>
</LinearGradient>
```

### Secondary Gradient (Subtle Cards)

```
Direction: 180° (top to bottom)
Start:  #FFF7ED (Orange 50)
End:    #FFEDD5 (Orange 100)
```

### Gradient Tokens

```typescript
export const Gradients = {
  primaryButton: ['#ea580c', '#d97706'] as const,
  warmCard:      ['#FFF7ED', '#FFEDD5'] as const,
  sunset:        ['#ea580c', '#f59e0b'] as const,
  spiritual:     ['#7c3aed', '#a78bfa'] as const,
};
```

---

## 4. Spacing Scale

All spacing values follow a **4px base unit** system.

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | `4px` | Tight gaps, icon margins |
| `sm` | `8px` | Small gaps, chip spacing |
| `md` | `12px` | Card padding (compact), list gaps |
| `base` | `16px` | Standard padding, section gaps |
| `lg` | `20px` | Card internal padding |
| `xl` | `24px` | Section spacing, screen padding |
| `2xl` | `32px` | Large section gaps, hero spacing |
| `3xl` | `40px` | Screen-level top/bottom margins |
| `4xl` | `48px` | Major visual breaks |

```typescript
export const Spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  base: 16,
  lg:   20,
  xl:   24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};
```

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | `8px` | Chips, small tags, deity buttons |
| `md` | `12px` | Text inputs, small cards |
| `lg` | `16px` | Buttons, action cards |
| `xl` | `24px` | Main cards, panels, modals |
| `2xl` | `32px` | Onboarding cards, overlay cards |
| `full` | `9999px` | Avatars, circular icons, dots |

```typescript
export const BorderRadius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  '2xl': 32,
  full: 9999,
};
```

---

## 6. Shadow System

### Elevation Levels

```typescript
export const Shadows = {
  // Level 1: Subtle lift (action cards, festival cards)
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },

  // Level 2: Standard card (panchang card, forms)
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },

  // Level 3: Prominent (buttons, modals)
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  // CTA Button Shadow (colored)
  primaryButton: {
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
};
```

---

## 7. Component Patterns

### Buttons

#### Primary Gradient Button (CTA)
```typescript
const styles = StyleSheet.create({
  gradientButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  gradientButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
});
```

#### Secondary Button (Outline)
```typescript
secondaryButton: {
  height: 48,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#e7e5e4',
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
  alignItems: 'center',
},
secondaryButtonText: {
  color: '#44403c',
  fontSize: 16,
  fontFamily: 'Inter-SemiBold',
},
```

#### Dismiss / Ghost Button
```typescript
ghostButton: {
  backgroundColor: '#f5f5f4',
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: 'center',
},
ghostButtonText: {
  color: '#1c1917',
  fontFamily: 'Inter-SemiBold',
  fontSize: 14,
},
```

### Cards

#### Standard Card
```typescript
card: {
  backgroundColor: '#FFFFFF',
  borderRadius: 24,
  padding: 20,
  borderWidth: 1,
  borderColor: '#f5f5f4',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.02,
  shadowRadius: 8,
  elevation: 2,
},
```

#### Onboarding / Overlay Card
```typescript
overlayCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 32,
  padding: 32,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#f5f5f4',
  shadowColor: '#1c1917',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 12,
  elevation: 4,
  width: '100%',
  maxWidth: 340,
},
```

### Inputs

#### Standard Text Input
```typescript
inputWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#e7e5e4',
  borderRadius: 16,
  paddingHorizontal: 16,
  height: 56,
  backgroundColor: '#FFFFFF',
},
input: {
  flex: 1,
  fontSize: 16,
  color: '#1c1917',
  fontFamily: 'Inter-Regular',
},
```

### Selection Chips

#### Single / Multi-Select Chips
```typescript
chip: {
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#e7e5e4',
  backgroundColor: '#FFFFFF',
},
chipActive: {
  backgroundColor: '#FFF7ED',
  borderColor: '#FFEDD5',
},
chipText: {
  fontSize: 14,
  color: '#57534e',
  fontFamily: 'Inter-Medium',
},
chipTextActive: {
  color: '#c2410c',
  fontFamily: 'Inter-SemiBold',
},
```

### Progress Bar

```typescript
progressBarContainer: {
  height: 4,
  backgroundColor: '#f5f5f4',
  borderRadius: 2,
  marginBottom: 24,
  overflow: 'hidden',
},
progressBarFill: {
  height: '100%',
  borderRadius: 2,
  // Use LinearGradient with Gradients.primaryButton colors
},
```

---

## 8. Section Labels (Overline Pattern)

All section headings use the **overline** pattern:

```typescript
sectionLabel: {
  fontSize: 11,
  fontWeight: 'bold',
  fontFamily: 'Inter-Bold',
  color: '#ea580c',
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  marginBottom: 12,
},
```

---

## 9. Screen Layout Template

Every screen should follow this base structure:

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',  // Colors.background
  },
  scrollContent: {
    padding: 16,                   // Spacing.base
    paddingBottom: 100,            // Space for tab bar
  },
});
```

---

## 10. Icon System

- **Library**: `lucide-react-native`
- **Default Size**: 20–24px (navigation: 22px, inline: 16–20px)
- **Active Color**: `#ea580c` (Colors.primary)
- **Inactive Color**: `#a8a29e` (Colors.textDisabled)
- **Icon Button Container**: 32–48px circle with `Colors.surfaceTint` background

---

## 11. Animation Guidelines

- **Screen Transitions**: Use `Animated` API with 300ms duration, easeInOut
- **Button Press**: Scale down to 0.97 with 100ms duration
- **Card Entrance**: Fade in + translate Y from 20px, stagger 50ms per card
- **Progress Bar**: Animated width change with 400ms spring animation
- **Modal**: Fade overlay + scale card from 0.9 to 1.0

---

## 12. Accessibility

- **Minimum touch target**: 44x44px
- **Color contrast ratio**: Minimum 4.5:1 for body text
- **All interactive elements**: Must have `accessibilityLabel`
- **Status indicators**: Never rely on color alone

---

## Quick Reference Cheatsheet

```
Background:    #FDFBF7
Card:          #FFFFFF   border: #f5f5f4   radius: 24px
Button:        gradient(#ea580c → #d97706)  radius: 16px  height: 56px
Input:         border: #e7e5e4   radius: 16px   height: 56px
Heading:       Playfair Display Bold   #1c1917
Body:          Inter Regular           #44403c
Caption:       Inter Medium            #78716c
Active:        #ea580c
Disabled:      #a8a29e
Padding:       Screen: 16px   Card: 20-32px
```
