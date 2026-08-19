import { describe, expect, it } from 'vitest'
import { chooseOrnaments } from '../src/client/ornament-policy.ts'

describe('ornament policy', () => {
  it('keeps the sword emblem alongside all normal-page ornaments', () => {
    expect(chooseOrnaments({
      wide: true,
      selectedNav: true,
      dialog: false,
      composerEngaged: false,
      heading: true,
      mascot: true,
    })).toEqual(['swordEmblem', 'redCrest', 'sword', 'flame', 'redOrb'])
  })

  it('swaps the composer sword for a heart and anchors the flame to the dialog', () => {
    expect(chooseOrnaments({
      wide: true,
      selectedNav: true,
      dialog: true,
      composerEngaged: true,
      heading: true,
      mascot: true,
    })).toEqual(['swordEmblem', 'redCrest', 'heart', 'flame', 'redOrb'])
  })

  it('keeps the sword emblem, crest, and flame on narrow screens', () => {
    expect(chooseOrnaments({
      wide: false,
      selectedNav: true,
      dialog: true,
      composerEngaged: false,
      heading: true,
      mascot: true,
    })).toEqual(['swordEmblem', 'redCrest', 'flame'])
  })

  it('keeps the sword emblem when no selected navigation target exists', () => {
    expect(chooseOrnaments({
      wide: true,
      selectedNav: false,
      dialog: false,
      composerEngaged: true,
      heading: false,
      mascot: false,
    })).toEqual(['swordEmblem', 'heart'])
  })
})
