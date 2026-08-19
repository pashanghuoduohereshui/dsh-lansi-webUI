// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context, type Fiber } from '@deepseek-ai/cordis'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { apply } from '../src/client/index.ts'

let fiber: Fiber | undefined

async function mount(): Promise<Fiber> {
  const mounted = new Context().plugin({ apply })
  await mounted.await()
  return mounted
}

async function tick(): Promise<void> {
  await new Promise((resolve) => { setTimeout(resolve, 0) })
}

function installMatchMedia(initial: boolean): { set: (next: boolean) => void } {
  let matches = initial
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const query = {
    get matches() { return matches },
    media: '(min-width: 960px)',
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    dispatchEvent: () => true,
    addListener: (listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeListener: (listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
  } as unknown as MediaQueryList
  vi.stubGlobal('matchMedia', vi.fn(() => query))
  return {
    set(next) {
      matches = next
      const event = { matches, media: query.media } as MediaQueryListEvent
      listeners.forEach((listener) => listener(event))
    },
  }
}

afterEach(async () => {
  await fiber?.dispose()
  fiber = undefined
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
  document.body.style.cssText = ''
  document.body.removeAttribute('data-dsh-lansi')
  document.body.removeAttribute('data-ds-dark-theme')
  document.head.querySelectorAll('link[data-lansi-icon]').forEach((node) => node.remove())
  document.title = ''
})

describe('Rance crimson adventure skin', () => {
  it('mounts one mascot, backdrop, favicon, and title', async () => {
    installMatchMedia(true)
    document.title = 'DeepSeek Harness'
    fiber = await mount()

    expect(document.body.hasAttribute('data-dsh-lansi')).toBe(true)
    expect(document.body.querySelectorAll('[data-skin-chrome="mascot"]')).toHaveLength(1)
    expect(document.body.querySelector('[data-skin-chrome="backdrop"]')).not.toBeNull()
    expect(document.body.style.getPropertyValue('background-image')).toContain('linear-gradient')
    expect(document.head.querySelector('link[data-lansi-icon]')).not.toBeNull()
    expect(document.title).toBe('兰斯 红黑冒险')
  })

  it('switches the backdrop and mascot theme without duplicating DOM', async () => {
    installMatchMedia(true)
    fiber = await mount()
    const light = document.body.style.getPropertyValue('background-image')

    document.body.setAttribute('data-ds-dark-theme', '')
    await tick()

    const mascot = document.body.querySelector<HTMLElement>('[data-skin-chrome="mascot"]')
    expect(document.body.style.getPropertyValue('background-image')).not.toBe(light)
    expect(mascot?.dataset.theme).toBe('dark')
    expect(document.body.querySelectorAll('[data-skin-chrome="mascot"]')).toHaveLength(1)
  })

  it('mounts the illustrated background and retractable semantic frames in both modes', async () => {
    installMatchMedia(true)
    document.body.innerHTML = `
      <nav role="tree"><button role="treeitem" aria-selected="true">Chat</button></nav>
      <main>
        <textarea aria-label="Message"></textarea>
        <section><h2>Workspace</h2></section>
      </main>
      <section role="dialog"><button type="submit">Save</button></section>
      <div role="menu"><button role="menuitem">Open</button></div>
    `
    fiber = await mount()

    expect(document.querySelectorAll('[data-dsh-frame]')).toHaveLength(6)
    const backdrop = document.body.querySelector<HTMLElement>('[data-skin-chrome="backdrop"]')!
    expect(backdrop.style.getPropertyValue('background-image')).toContain('data:image/jpeg;base64,')
    expect(document.body.style.getPropertyValue('background-image')).toContain('linear-gradient')
    const lightDialog = document.body.style.getPropertyValue('--dsw-frame-dialog')
    expect(lightDialog).toContain('data:image/svg+xml;base64,')

    document.body.setAttribute('data-ds-dark-theme', '')
    await tick()
    expect(document.body.style.getPropertyValue('--dsw-frame-dialog')).not.toBe(lightDialog)
    expect(document.querySelectorAll('[data-dsh-frame]')).toHaveLength(6)

    await fiber.dispose()
    fiber = undefined
    expect(document.querySelector('[data-dsh-frame]')).toBeNull()
    expect(document.body.style.getPropertyValue('--dsw-frame-dialog')).toBe('')
    expect(document.body.style.getPropertyValue('background-image')).toBe('')
  })

  it('keeps the mascot absent on narrow screens and responds to query changes', async () => {
    const media = installMatchMedia(false)
    fiber = await mount()
    expect(document.body.querySelector('[data-skin-chrome="mascot"]')).toBeNull()

    media.set(true)
    expect(document.body.querySelector('[data-skin-chrome="mascot"]')).not.toBeNull()
    media.set(false)
    expect(document.body.querySelector('[data-skin-chrome="mascot"]')).toBeNull()
  })

  it('keeps the mascot static and integrates one light-dark ornament layer', async () => {
    installMatchMedia(true)
    document.body.innerHTML = `
      <nav role="tree"><button role="treeitem" aria-selected="true">Chat</button></nav>
      <main><h1>DeepSeek Harness</h1><textarea></textarea></main>
    `
    fiber = await mount()
    const mascot = document.body.querySelector<HTMLElement>('[data-skin-chrome="mascot"]')
    const lightCrest = document.body.querySelector<HTMLImageElement>('[data-dsh-ornament="redCrest"]')?.src

    window.dispatchEvent(new Event('focus'))
    window.dispatchEvent(new Event('blur'))
    expect(mascot?.hasAttribute('data-state')).toBe(false)
    expect(document.querySelectorAll('[data-skin-chrome="ornaments"]')).toHaveLength(1)

    document.body.setAttribute('data-ds-dark-theme', '')
    await tick()
    expect(document.body.querySelector<HTMLImageElement>('[data-dsh-ornament="redCrest"]')?.src).not.toBe(lightCrest)
  })

  it('anchors the mascot to the workspace tree right edge and follows resizes', async () => {
    installMatchMedia(true)
    document.body.innerHTML = '<nav role="tree"><button role="treeitem">Chat</button></nav>'
    const tree = document.querySelector<HTMLElement>('[role="tree"]')!
    let right = 320
    tree.getBoundingClientRect = vi.fn(() => ({
      x: 0, y: 100, left: 0, top: 100, right, bottom: 780, width: right, height: 680,
      toJSON: () => ({}),
    }))

    fiber = await mount()
    const mascot = document.body.querySelector<HTMLElement>('[data-skin-chrome="mascot"]')!
    expect(mascot.style.left).toBe('160px')

    right = 400
    window.dispatchEvent(new Event('resize'))
    expect(mascot.style.left).toBe('240px')
  })

  it('mounts the crimson art on the full sidebar surface and retracts it', async () => {
    installMatchMedia(true)
    document.body.innerHTML = `
      <div data-test-frame>
        <aside data-test-sidebar>
          <div><nav role="tree"><button role="treeitem">Chat</button></nav></div>
        </aside>
        <main>Conversation</main>
      </div>
    `
    const tree = document.querySelector<HTMLElement>('[role="tree"]')!
    const treeWrapper = tree.parentElement!
    const sidebar = document.querySelector<HTMLElement>('[data-test-sidebar]')!
    const frame = document.querySelector<HTMLElement>('[data-test-frame]')!
    tree.getBoundingClientRect = vi.fn(() => ({
      x: 10, y: 160, left: 10, top: 160, right: 280, bottom: 850, width: 270, height: 690,
      toJSON: () => ({}),
    }))
    treeWrapper.getBoundingClientRect = vi.fn(() => ({
      x: 10, y: 120, left: 10, top: 120, right: 280, bottom: 850, width: 270, height: 730,
      toJSON: () => ({}),
    }))
    sidebar.getBoundingClientRect = vi.fn(() => ({
      x: 0, y: 0, left: 0, top: 0, right: 280, bottom: 900, width: 280, height: 900,
      toJSON: () => ({}),
    }))
    frame.getBoundingClientRect = vi.fn(() => ({
      x: 0, y: 0, left: 0, top: 0, right: 1440, bottom: 900, width: 1440, height: 900,
      toJSON: () => ({}),
    }))

    fiber = await mount()

    expect(sidebar.hasAttribute('data-dsh-sidebar-surface')).toBe(true)
    expect(sidebar.style.getPropertyValue('--dsw-sidebar-crimson-background')).toContain('data:image/jpeg;base64,')
    expect(document.body.style.getPropertyValue('background-image')).not.toContain('data:image/jpeg')

    await fiber.dispose()
    fiber = undefined
    expect(sidebar.hasAttribute('data-dsh-sidebar-surface')).toBe(false)
    expect(sidebar.style.getPropertyValue('--dsw-sidebar-crimson-background')).toBe('')
  })

  it('restores prior writes and removes every owned resource', async () => {
    installMatchMedia(true)
    document.title = 'DeepSeek Harness'
    document.body.style.setProperty('background-image', 'url("https://example.test/prior.png")')
    document.body.style.setProperty('background-attachment', 'scroll')
    fiber = await mount()

    await fiber.dispose()
    fiber = undefined
    document.body.setAttribute('data-ds-dark-theme', '')
    await tick()

    expect(document.body.hasAttribute('data-dsh-lansi')).toBe(false)
    expect(document.body.querySelector('[data-skin-chrome="mascot"]')).toBeNull()
    expect(document.body.querySelector('[data-skin-chrome="backdrop"]')).toBeNull()
    expect(document.body.querySelector('[data-skin-chrome="ornaments"]')).toBeNull()
    expect(document.head.querySelector('link[data-lansi-icon]')).toBeNull()
    expect(document.body.style.getPropertyValue('background-image')).toContain('prior.png')
    expect(document.body.style.getPropertyValue('background-attachment')).toBe('scroll')
    expect(document.title).toBe('DeepSeek Harness')
  })
})

describe('Rance crimson stylesheet', () => {
  const stylesheet = readFileSync(resolve(process.cwd(), 'src/client/lansi-theme.module.css'), 'utf8')

  it('defines the cream-paper light and crimson-black dark token surfaces', () => {
    expect(stylesheet).toContain('body[data-dsh-lansi] {')
    expect(stylesheet).toContain('--dsw-alias-bg-base: rgba(244, 237, 225, 0.35)')
    expect(stylesheet).toContain('body[data-dsh-lansi][data-ds-dark-theme]')
    expect(stylesheet).toContain('--dsw-alias-bg-base: rgba(18, 12, 14, 0.40)')
  })

  it('keeps the backdrop, mascot, and generated ornament layer responsive', () => {
    expect(stylesheet).toContain('.backdrop')
    expect(stylesheet).toContain('.mascot')
    expect(stylesheet).toContain('.ornamentLayer')
    expect(stylesheet).toContain('.ornamentSwordEmblem')
    expect(stylesheet).toContain('.ornamentRedCrest')
    expect(stylesheet).toContain('.ornamentSword')
    expect(stylesheet).toContain('.ornamentHeart')
    expect(stylesheet).toContain('.ornamentFlame')
    expect(stylesheet).toContain('.ornamentRedOrb')
    expect(stylesheet).toContain('@media (max-width: 959px), print')
  })

  it('polishes semantic DSH components with red-black borders', () => {
    expect(stylesheet).toContain("body[data-dsh-lansi] [role='dialog']")
    expect(stylesheet).toContain("body[data-dsh-lansi] [role='treeitem'][aria-selected='true']")
    expect(stylesheet).toContain("body[data-dsh-lansi] [role='menu']")
    expect(stylesheet).toContain('body[data-dsh-lansi] button')
    expect(stylesheet).toContain("body[data-dsh-lansi] :is(textarea, [contenteditable='true'], input:not([type]))")
    expect(stylesheet).not.toContain('@keyframes deepseekCloudPaperFloat')
    expect(stylesheet).not.toContain('.cloud')
    expect(stylesheet).not.toContain('clip-path')
    expect(stylesheet).not.toContain('repeating-linear-gradient')
    expect(stylesheet).not.toContain('border-image-source')
  })

  it('uses solid crimson rounded borders for every semantic frame', () => {
    for (const frame of ['selected-nav', 'composer', 'composer-shell', 'dialog', 'menu', 'panel', 'primary-button', 'control', 'surface', 'message']) {
      expect(stylesheet).toContain(`[data-dsh-frame='${frame}']`)
    }
    expect(stylesheet).toContain("[data-dsh-message-role='user']")
    expect(stylesheet).toContain("[data-dsh-message-role='assistant']")
    expect(stylesheet).toContain('inset 0 0 0 1px')
    expect(stylesheet).toContain('border: 2px solid')
    expect(stylesheet).toContain('backdrop-filter')
  })

  it('layers the crimson art only on the discovered sidebar surface', () => {
    expect(stylesheet).toContain('[data-dsh-sidebar-surface]')
    expect(stylesheet).toContain('var(--dsw-sidebar-crimson-background)')
    expect(stylesheet).toContain('center bottom')
    expect(stylesheet).toContain('[data-ds-dark-theme] [data-dsh-sidebar-surface]')
  })
})
