import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const generatedPath = resolve(process.cwd(), 'src/client/frame-art.generated.ts')

describe('generated frame placeholders', () => {
  it('ships six light and six dark frame placeholders as embedded SVG', () => {
    expect(existsSync(generatedPath)).toBe(true)
    if (!existsSync(generatedPath)) return

    const source = readFileSync(generatedPath, 'utf8')
    for (const id of ['selectedNav', 'composer', 'dialog', 'menu', 'panel', 'primaryButton']) {
      expect(source).toContain(`"${id}"`)
    }
    expect(source.match(/data:image\/svg\+xml;base64,/g)).toHaveLength(12)
    expect(source).toContain("export type FrameMode = 'light' | 'dark'")
    expect(source).not.toMatch(/https?:\/\//)
  })
})
