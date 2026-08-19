# dsh-lansi-webUI

English | [中文](README.md)

A "Rance crimson-black adventure" theme plugin rebuilt on top of [dsh-maid-whale-webUI](https://github.com/yunxiiQwQ/dsh-maid-whale-webUI/): a deep-red primary palette, cream-paper light / crimson-black dark dual modes, the Rance 35th-anniversary group illustration as a blurred full-screen background, RPG-style sword / heart / flame ornaments, and a persistent pink-haired Q-version mascot in the bottom-left corner.

## Installation

```powershell
cd dsh-lansi-webUI
dsh plugin --profile web add ./lansi-webui
```

Refresh or restart the DeepSeek Harness Web UI after installation. Enabling only one UI theme at a time is recommended.

## Development

```powershell
pnpm install
pnpm art:embed
pnpm test
pnpm build
```

The plugin uses only the official DSH client plugin mechanism. It does not modify the DeepSeek Harness source code or affect model requests.

## Static assets

- `assets/background/rance-35th-group.jpeg` — full-page background illustration
- `assets/mascot/rance-mascot.png` — bottom-left pink-haired Q-version mascot (transparent background)
- `assets/ornaments/light|dark/*.svg` — RPG ornaments (sword emblem, red crest, sword, heart, flame, red orb)

Assets are read by `scripts/embed.mjs` and inlined as base64 data URIs into `src/client/*-art.generated.ts`, following the original project's resource wiring.

## Credits

Thanks to the author (yunxiiQwQ) of [dsh-maid-whale-webUI](https://github.com/yunxiiQwQ/dsh-maid-whale-webUI/); this plugin is rebuilt on top of that project's architecture.

## License and Disclaimer

The code is licensed under BSD-3-Clause. This is an unofficial community theme whose assets originate from community fan creations. It is not affiliated with DeepSeek.
