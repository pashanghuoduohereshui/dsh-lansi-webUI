import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const generatedPath = resolve(process.cwd(), 'src/client/ornament-art.generated.ts')

describe('RPG ornament assets', () => {
  it('ships every light and dark asset as embedded SVG', () => {
    expect(existsSync(generatedPath)).toBe(true)
    if (!existsSync(generatedPath)) return

    const source = readFileSync(generatedPath, 'utf8')
    const ids = [
      'swordEmblem', 'redCrest', 'sword', 'heart', 'flame', 'redOrb',
    ]
    for (const id of ids) expect(source).toContain(`"${id}"`)
    expect(source.match(/data:image\/svg\+xml;base64,/g)).toHaveLength(12)
    expect(source).toContain("export type OrnamentMode = 'light' | 'dark'")
  })
})
