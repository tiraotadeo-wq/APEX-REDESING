# X7 EXTERNAL / MOONX7 — Branding assets

Place the owner's original brand assets in this folder before release.

## Expected structure

- `Appicon/` — source app icon artwork (prefer a 1024×1024 PNG without pre-rounded corners; verify the Xcode AppIcon asset catalog before replacing generated sizes).
- `MOONX7logo/` — transparent PNG logo and approved variants.
- `Banners/` — original animated GIF banner(s) for the app and website.

The uploaded assets should replace the existing app icon through `ThreeOneOSFive/Assets.xcassets/AppIcon.appiconset/` and be wired into the SwiftUI/web views only after checking actual filenames and dimensions. Keep source artwork here for traceability. Do not commit signing certificates, provisioning profiles, API keys, Supabase service-role keys, or other secrets.

## Brand direction

- Product name: **X7 EXTERNAL**
- Brand mark: **MOONX7**
- Palette: near-black surfaces, vivid red/crimson accents, white/light-gray text.
- Preserve the existing bundle identifier unless a deliberate migration is planned; changing it may affect installation and existing integrations.

## Release checklist

1. Confirm source artwork is present and valid.
2. Update the Xcode AppIcon catalog and verify all references.
3. Check GIF playback and file size on the website and app.
4. Build with the configured macOS/Xcode CI runner.
5. Inspect the generated IPA and website deployment before release.