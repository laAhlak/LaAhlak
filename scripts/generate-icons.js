const fs = require('fs')
const path = require('path')

// Simple script to create placeholder icons
// In production, you would use a proper icon generator or design tool

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512]

const createPlaceholderIcon = (size) => {
  // This is a placeholder - in production you'd generate actual icons
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#00C38A" rx="${size * 0.2}"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white">L</text>
    </svg>
  `
  return svg
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons')

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

iconSizes.forEach(size => {
  const svg = createPlaceholderIcon(size)
  const filename = `icon-${size}x${size}.png`
  const filepath = path.join(iconsDir, filename)
  
  // For now, we'll create a simple text file as placeholder
  // In production, you'd convert SVG to PNG
  fs.writeFileSync(filepath.replace('.png', '.svg'), svg)
  console.log(`Created ${filename}`)
})

console.log('Icon generation complete!')
console.log('Note: In production, convert SVG files to PNG format for better compatibility.')
