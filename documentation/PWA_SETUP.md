# PWA Setup Guide

## Icons Required

The PWA requires the following icon files in `/public/icons/`:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

## Icon Generation

1. **Design your icon** with the following specifications:
   - Background: #00C38A (primary green)
   - Letter: "L" in white
   - Rounded corners (20% border radius)
   - High contrast for visibility

2. **Generate icons** using one of these methods:
   - **Online tools**: PWA Builder, RealFaviconGenerator
   - **Design tools**: Figma, Adobe XD, Sketch
   - **Command line**: ImageMagick, Sharp

3. **Example ImageMagick command**:
   ```bash
   # Generate all sizes from a 512x512 source
   for size in 72 96 128 144 152 192 384 512; do
     convert source-icon.png -resize ${size}x${size} public/icons/icon-${size}x${size}.png
   done
   ```

## PWA Features Enabled

- ✅ **Service Worker**: Offline caching and background sync
- ✅ **Web App Manifest**: Install prompts and app-like experience
- ✅ **Add to Home Screen**: iOS and Android support
- ✅ **Offline Support**: Cached resources for offline usage
- ✅ **Push Notifications**: Ready for future implementation
- ✅ **App Shortcuts**: Quick access to Send Money and Dashboard

## Testing PWA

1. **Chrome DevTools**:
   - Open DevTools → Application → Manifest
   - Check "Add to homescreen" in Application tab

2. **Mobile Testing**:
   - Open in mobile browser
   - Look for "Add to Home Screen" prompt
   - Test offline functionality

3. **Lighthouse**:
   - Run Lighthouse audit
   - Check PWA score and recommendations

## Deployment Notes

- Ensure all icon files are present before deployment
- Test PWA functionality on actual devices
- Configure proper caching headers for static assets
- Set up proper HTTPS (required for PWA)

## Troubleshooting

- **Icons not showing**: Check file paths and formats
- **Install prompt not appearing**: Ensure HTTPS and valid manifest
- **Offline not working**: Check service worker registration
- **App shortcuts not working**: Verify manifest.json shortcuts section
