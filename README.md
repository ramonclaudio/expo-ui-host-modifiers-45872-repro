# @expo/ui Host modifiers — iOS repro

Minimal SDK 56 project that reproduces the `<Host modifiers={...}>` fix from [expo/expo#45872](https://github.com/expo/expo/pull/45872).

## The bug

`@expo/ui`'s `HostProps` (TypeScript) extends `CommonViewModifierProps`, and the JS in `Host/index.tsx` forwards `modifiers` to the native view. The Swift side, `HostViewProps`, did not declare a `modifiers` field, so the prop was silently dropped during deserialization. Every `<Host modifiers={[tint(...)]}>` typechecked but rendered as if no modifier had been passed.

## The fix

Two changes in `node_modules/@expo/ui/ios/`:

- **`HostView.swift`** — adds `@Field var modifiers: ModifierArray?` to `HostViewProps` and chains `.applyModifiers(...)` inside `body`, between the host's environment modifiers and `GeometryChangeModifier`. The chain order matters: layout-affecting modifiers (`frame`, `padding`) must run before `GeometryChangeModifier` so the resulting size feeds back into the React Native shadow tree.
- **`ExpoUIModule.swift`** — adds a comment explaining why `HostView` / `TextView` register via `View(...)` rather than `ExpoUIView(...)` (they apply common view modifiers internally).

The full patch is at `patches/@expo+ui+56.0.8.patch` and is applied by `npm postinstall`.

## What the demo proves

`App.tsx` renders 15 side-by-side cards. Each card mounts the same SwiftUI subtree twice — once in a default `Host` (no modifiers), once in a `Host` wrapped in a modifier chain. With the patch applied, the right column visibly differs. Remove the patch and both columns are identical.

The cards cover every modifier category:

- **Environment**: `tint`, `font`, `foregroundStyle`, `disabled`
- **Layout**: `padding` (also feeds back through `GeometryChangeModifier` so the Host's RN-side size matches)
- **Chrome**: `background`, `cornerRadius`, `border`, `shadow`
- **Transforms**: `rotationEffect`, `scaleEffect`
- **Filters**: `blur`, `opacity`, `grayscale`
- **Interaction**: `onTapGesture` (round-trips JS → SwiftUI gesture → JS state)
- **iOS 26 Liquid Glass**: `glassEffect`

## Expected non-changes

A couple of controls won't visually change under `tint`. This is iOS behavior, not a bug of the patch:

- **`Stepper`** — `+ / -` chrome uses `secondaryFill` regardless of tint.
- **`Picker(.segmented)`** — segment background uses `secondarySystemFill`, label uses `label`. `Picker(.menu)` does respect tint (chevron + selected check), which is what §3 demonstrates.

## Prerequisites

- Node 22+
- Xcode 16+ (tested on 26.5)
- iOS Simulator on iOS 16+ for everything except §15
- iOS 26 simulator (or device) for §15 `glassEffect`

## Run

```bash
npm install                              # postinstall applies the patch
npx expo prebuild --platform ios --clean
npm run ios
```

## Verify the bug

Remove the patch, reinstall, rebuild — every "WITH MODIFIER" column should now look identical to the "DEFAULT" column:

```bash
trash patches/@expo+ui+56.0.8.patch
rm -rf node_modules ios                  # patch-package needs a clean install to skip the patch
npm install
npx expo prebuild --platform ios --clean
npm run ios
```

## Layout

```
.
├── App.tsx                          # the demo (15 sections)
├── CLAUDE.md
├── README.md
├── app.json
├── index.js                         # registerRootComponent(App)
├── package.json                     # 6 runtime + 3 dev deps
├── tsconfig.json
└── patches/
    └── @expo+ui+56.0.8.patch        # auto-applied by npm postinstall
```

## Dependency floor

Six runtime deps, can't go lower without breaking `@expo/ui`:

- `@expo/ui` — the subject
- `expo` — framework
- `react`, `react-native` — core
- `react-native-reanimated`, `react-native-worklets` — declared `@expo/ui` peer deps (imported at module top-level for worklet-marked callbacks on `TextField`, `Slider`, and `useNativeState`)
