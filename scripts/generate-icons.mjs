import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcSvg = path.join(__dirname, 'source-icon.svg')
const outDir = path.join(__dirname, '..', 'public', 'icons')

mkdirSync(outDir, { recursive: true })

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

for (const size of sizes) {
  await sharp(srcSvg)
    .resize(size, size)
    .png()
    .toFile(path.join(outDir, `icon-${size}x${size}.png`))
  console.log('generated', `icon-${size}x${size}.png`)
}

// Maskable icon: same art, but with extra transparent-safe padding baked into
// the background square so the OS mask never clips the checkmark.
const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#111111"/>
  <path d="M170 272 L232 334 L350 196" stroke="#ffffff" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>
`
await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile(path.join(outDir, 'maskable-512x512.png'))
console.log('generated maskable-512x512.png')

// Apple touch icon (no alpha, exact 180x180, iOS ignores rounded corners itself)
await sharp(srcSvg).resize(180, 180).flatten({ background: '#111111' }).png().toFile(path.join(outDir, 'apple-touch-icon.png'))
console.log('generated apple-touch-icon.png')

console.log('Done.')
