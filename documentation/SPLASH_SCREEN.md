# Splash Screen Implementation

## Overview
The splash screen provides a professional loading experience when users first visit the app or when the app is loading.

## Features

### 🎨 **Visual Design**
- **Logo Display**: Shows the app logo with smooth animations
- **Brand Colors**: Uses the app's color scheme (Dark Charcoal, Jordan Red)
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Animations**: Fade in/out transitions with scale effects

### ⚡ **Loading Experience**
- **Progress Bar**: Realistic loading progress with percentage display
- **Loading Steps**: Dynamic text showing current loading phase
- **Animated Elements**: Bouncing dots and rotating rings
- **Background Effects**: Subtle gradient patterns and glow effects

### 🔧 **Technical Features**
- **Session Storage**: Only shows on first visit per session
- **Performance Optimized**: Uses Next.js Image component with priority loading
- **Accessibility**: Proper alt text and semantic HTML
- **PWA Ready**: Works with Progressive Web App installation

## Components

### `SplashScreen.tsx`
Main splash screen component with:
- Logo display with animations
- Progress bar with realistic loading simulation
- Dynamic loading text
- Smooth fade out transition

### `SplashScreenWrapper.tsx`
Wrapper component that manages splash screen visibility:
- Integrates with the app layout
- Handles splash screen state
- Manages completion callback

### `useSplashScreen.ts`
Custom hook for splash screen logic:
- Session storage management
- Loading state control
- Completion handling

## Usage

The splash screen is automatically integrated into the app layout and will show:
1. **First-time visitors**: Shows for 3 seconds
2. **Returning visitors**: Skips splash screen (stored in session)
3. **App loading**: Shows during initial app load

## Customization

### Loading Steps
Modify the `loadingSteps` array in `SplashScreen.tsx`:
```typescript
const loadingSteps = [
  'جاري التحميل...',
  'جاري إعداد التطبيق...',
  'جاري التحقق من الاتصال...',
  'جاري تحميل البيانات...',
  'تم التحميل بنجاح!'
]
```

### Duration
Change the splash screen duration in `useSplashScreen.ts`:
```typescript
const timer = setTimeout(() => {
  setShowSplash(false)
  setIsLoading(false)
  sessionStorage.setItem('splash-shown', 'true')
}, 3000) // Change this value (in milliseconds)
```

### Colors
Update colors in the component to match your theme:
- Background: `bg-gradient-to-br from-primary-500 via-primary-600 to-primary-500`
- Accent: `bg-accent-500`
- Text: `text-white`, `text-secondary-300`

## Testing

Run the splash screen test:
```bash
npm run test-splash
```

## PWA Integration

The splash screen works seamlessly with PWA features:
- Shows when app is installed
- Respects PWA manifest settings
- Integrates with service worker caching

## Performance

- **Optimized Images**: Uses Next.js Image component with proper sizing
- **Efficient Animations**: CSS-based animations for smooth performance
- **Memory Management**: Proper cleanup of intervals and timeouts
- **Session Storage**: Lightweight storage for state management

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers
- ✅ PWA environments
