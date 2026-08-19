import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const assetPath = resolve(process.cwd(), 'assets/background/rance-35th-group.jpeg')
const generatedPath = resolve(process.cwd(), 'src/client/background-art.generated.ts')

describe('user-supplied illustrated background', () => {
  it('ships the conversation and sidebar backgrounds as embedded data URLs without machine paths', () => {
    expect(existsSync(assetPath)).toBe(true)
    expect(existsSync(generatedPath)).toBe(true)
    if (!existsSync(assetPath) || !existsSync(generatedPath)) return

    expect(readFileSync(assetPath).subarray(0, 3).toString('hex')).toBe('ffd8ff')
    const source = readFileSync(generatedPath, 'utf8')
    expect(source.match(/data:image\/jpeg;base64,/g)).toHaveLength(2)
    expect(source).toContain('export const ILLUSTRATED_BACKGROUND')
    expect(source).toContain('export const SIDEBAR_CRIMSON_BACKGROUND')
    expect(source).not.toMatch(/https?:\/\/|[CD]:[\\/]/i)
  })
})
