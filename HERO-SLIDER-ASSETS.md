# Vii home hero — four-image slideshow

Local demo only. Original hero image retained. The other three images are AI-generated illustrations, not photographs of actual properties or products for sale. They must not be represented as real inventory. Generated with the built-in image-generation tool on 2026-10-17, one independent image per brief; no external API or API key was used. Original generated files are retained under the Codex generated_images folder.

## Assets

All paths relative to `viicasa-frontend-prototype/assets/`:

1. `exterior.png`: existing Vii hero; unchanged.
2. `vii-hero-shop.png`: curated home objects, warm contemporary living room, ceramics and linen.
3. `vii-hero-life.png`: immaculate guest-ready bedroom, folded towels, home-care finishing touches.
4. `vii-hero-concierge.png`: refined lake-view residence, hospitality and welcoming interiors.

Generated PNGs are 1672 × 941 and approximately 2.5–2.7 MB each. Only the original image loads initially; each subsequent image loads and decodes when requested. Original-resolution PNGs retained; no destructive image manipulation. Future production optimization can add compressed responsive variants.

## Prompt set

Shared direction: premium editorial architectural lifestyle photography, wide landscape 16:9, full bleed, photorealistic, no text, no logos, no collage, no people. Restrained natural stone, warm wood, ivory and gold palette. Realistic material textures, natural light and soft shadows. Calm left third for existing website copy; middle/right subject placement suitable for portrait mobile cropping. Upscale architecture-magazine composition, not product cutouts.

- **ViiShop:** sophisticated Canadian home/hospitality brand; handmade cream ceramic vessels, sculptural dark-wood side table, tactile ivory linen throw on a chair, subtle artisan objects and muted beige sofa. Rich afternoon sunlight, understated luxury.
- **ViiLife:** sophisticated Canadian home-care brand; impeccably cared-for airy modern home, guest-ready bed with crisp ivory linens, folded plush towels on an oak bench, soft curtains and a subtle green branch. Hotel-standard care expressed through finishing touches rather than cleaning bottles. Warm natural morning light, cream, oak and sage.
- **ViiConcierge:** sophisticated Canadian residence/hospitality brand; serene contemporary lakeside residence inspired by British Columbia, expansive windows, lake and forested hills, cream furniture, wood ceiling, stone fireplace, guest-ready details and coffee-table tray. Golden late-afternoon light and soft blue lake tones; welcoming rather than ostentatious.

## Behavior

- Four selectors with current-image labels, plus a compact pause/play icon.
- Seven-second autoplay; image-only crossfade and slow zoom. Headlines and navbar do not move with the slideshow.
- Previous image stays visible until the next image decodes; an image failure never removes the current image.
- Autoplay pauses during mouse hover, keyboard focus, hidden tab, offscreen hero or manual pause. Reduced-motion preferences disable autoplay, zoom and crossfade.
- Timer, observer and event listeners are disposed when leaving the home feed. No payments, mail, backend data or external integrations changed.

## Local verification

49 focused tests passed, including navigation, scrolling, catalogue preparation, traffic limits and the new slideshow. Build syntax checks passed for 244 JavaScript files. Browser inspection covered 320 px and 390 px mobile layouts and 1440 px desktop; all four image selectors, automatic advance, pause, language change and navigation away/back were verified. No browser console errors observed. No horizontal overflow at the tested widths. Official phase-1 checkout untouched; no commit, push or deployment performed.
