# Product gallery assets and motion

Generated 2026-10-17 with the built-in image generation tool, one call per image. No CLI, API key or external image host. Original generated PNGs are retained in Codex generated_images; selected copies are included in the project. These are illustrative fictional sample products, not photographs of real inventory.

Eight generated photos (two per product) appear only in demo mode for the four known sample-product slugs while their stored gallery still contains only the original generic sample assets. Real products and administrator replacement photo galleries are not modified. No database records or product prices are changed. Existing generic files are preserved, but not mixed into the new sample product views.

The generated cover and a coherent second detail/angle photograph form each example gallery. An administrator replacement gallery takes precedence. The same presentation mapping is used by the mixed home feed, ViiShop cards and product detail.

All saved paths below are relative to the repository root. Exact prompt set:

The four reference-guided second photographs and their saved paths/prompts are documented in [PRODUCT-GALLERY-DETAIL-PROMPTS.md](PRODUCT-GALLERY-DETAIL-PROMPTS.md).

## Gallery behavior and checks

- Product and property galleries now use a shared full-screen photo viewer, image-only crossfade/slide transitions, numbered previews and thumbnail navigation.
- Opening enlarges the selected image; closing shrinks it toward a visible thumbnail, with a gentle fallback when the thumbnail is offscreen.
- Left/right arrows, keyboard arrows, Escape, horizontal swipes and focus restoration are supported. A failed next-image download leaves the current image in place and shows a retry message. Loading and animation waits are bounded.
- Selecting a card records only its local geometry and destination for a progressive image expansion into detail. Real links, modified clicks, checkout actions and browser history remain native. Back links have a short reduction effect.
- Reduced-motion preferences disable the added effects. No payment, email, authentication or inventory behavior changed.
- 57 focused local tests passed; the final eight gallery tests were repeated after the layout refinements. Build syntax checks covered 248 JavaScript files. Browser checks covered property and product galleries, image/thumbnail changes, Escape, click-to-close, pointer swipes, mobile card navigation and desktop return to the catalogue. No browser console errors observed.
- Verified 320 px and 390 px mobile layouts, including long product names: the title truncates and the close button stays inside the viewport. Also checked the desktop catalogue shows all four generated sample covers. No commit, push or deployment performed.
- Final browser pass confirmed the new Terra detail photograph loads at its native resolution, only one main photo remains after transitions, and closing leaves zero viewer/flight overlays while restoring focus. The desktop two-photo grid was also checked for positive image-button dimensions after resolving an inherited grid-row conflict.

## terra

Use case: product-mockup. Asset: additional gallery photograph for a fictional VIICASA ViiShop sample product. Terra Ceramic Vase: a single elegant handmade warm ivory ceramic vase, rounded organic body, narrow opening, matte lightly speckled stoneware glaze, photographed on a pale travertine console. Close three-quarter view emphasizing texture and silhouette. No flowers hiding the shape. Premium editorial homeware product photography, photorealistic, warm diffused window light, ivory stone and walnut neutrals, realistic tactile materials, quiet luxury. Portrait 4:5 composition with the complete product visible and comfortable breathing room for responsive cropping, soft natural shadows and an uncluttered upscale home background. No people, no text, no logos, no price labels, no watermark, no collage. A single photograph, not multiple panels. Illustrative demo product, not an existing branded item.

Saved asset: `viicasa-frontend-prototype/assets/viishop-terra-gallery.png`.

## linen

Use case: product-mockup. Asset: additional gallery photograph for a fictional VIICASA ViiShop sample product. Natural Linen Throw: an oatmeal natural woven linen throw with subtle fringe, beautifully folded over the arm of a cream contemporary chair, close view of tactile fabric weave and soft drape, warm walnut side table subtly blurred. Premium editorial homeware product photography, photorealistic, warm diffused window light, ivory stone and walnut neutrals, realistic tactile materials, quiet luxury. Portrait 4:5 composition with the complete product visible and comfortable breathing room for responsive cropping, soft natural shadows and an uncluttered upscale home background. No people, no text, no logos, no price labels, no watermark, no collage. A single photograph, not multiple panels. Illustrative demo product, not an existing branded item.

Saved asset: `viicasa-frontend-prototype/assets/viishop-linen-gallery.png`.

## wood

Use case: product-mockup. Asset: additional gallery photograph for a fictional VIICASA ViiShop sample product. Sculptural Wood Object: a single refined abstract looping carved walnut wood sculpture, soft organic curves and rich visible wood grain, on a light limestone pedestal. Three-quarter product close-up, believable artisanal physical object. Premium editorial homeware product photography, photorealistic, warm diffused window light, ivory stone and walnut neutrals, realistic tactile materials, quiet luxury. Portrait 4:5 composition with the complete product visible and comfortable breathing room for responsive cropping, soft natural shadows and an uncluttered upscale home background. No people, no text, no logos, no price labels, no watermark, no collage. A single photograph, not multiple panels. Illustrative demo product, not an existing branded item.

Saved asset: `viicasa-frontend-prototype/assets/viishop-wood-gallery.png`.

## ritual

Use case: product-mockup. Asset: additional gallery photograph for a fictional VIICASA ViiShop sample product. Home Ritual Set: an elegant calm-living decorative grouping of a small ivory ceramic candle vessel with no label, a matching small handmade bowl, and a natural linen folded cloth, arranged on an oval light stone tray on an oak table. Balanced simple composition. Premium editorial homeware product photography, photorealistic, warm diffused window light, ivory stone and walnut neutrals, realistic tactile materials, quiet luxury. Portrait 4:5 composition with the complete product visible and comfortable breathing room for responsive cropping, soft natural shadows and an uncluttered upscale home background. No people, no text, no logos, no price labels, no watermark, no collage. A single photograph, not multiple panels. Illustrative demo product, not an existing branded item.

Saved asset: `viicasa-frontend-prototype/assets/viishop-ritual-gallery.png`.
