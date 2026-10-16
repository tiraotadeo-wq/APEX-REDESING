# X7 EXTERNAL — MOONX7

Rebranding work is isolated on branch `rebrand/x7-external-moonx7`; `main` remains unchanged.

- iOS app project: `ThreeOneOSFive.xcodeproj`
- Website: `WEBSITE/`
- Branding asset intake: `BRANDING/README.md`
- iOS CI configuration: `codemagic.yaml`

## Branding

The visible product name and website theme are being migrated to X7 EXTERNAL / MOONX7 with a black-and-red palette. Original app icon, logo PNG, and animated GIF banners should be placed under `BRANDING/` as described in its README. Existing website configuration and app internals are being preserved where possible.

## Build status

A source change is not proof of a successful IPA build. Run the configured iOS build on a macOS/Xcode runner, then verify the build logs, generated IPA artifact, and install/runtime behavior before calling the release ready. Signing credentials must be configured securely in the CI provider.