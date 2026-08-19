import type { OrnamentId } from './ornament-art.generated.ts'

export interface OrnamentState {
  wide: boolean
  selectedNav: boolean
  dialog: boolean
  composerEngaged: boolean
  heading: boolean
  mascot: boolean
}

export function chooseOrnaments(state: OrnamentState): OrnamentId[] {
  const selected: OrnamentId[] = ['swordEmblem']

  if (state.selectedNav) selected.push('redCrest')

  if (!state.wide) {
    if (state.dialog) selected.push('flame')
    return selected
  }

  selected.push(state.composerEngaged ? 'heart' : 'sword')
  if (state.dialog || state.heading) selected.push('flame')
  if (state.mascot) selected.push('redOrb')

  return selected
}
