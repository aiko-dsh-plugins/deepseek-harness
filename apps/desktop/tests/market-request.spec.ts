import { describe, expect, it } from 'vitest'
import { desktopMarketRequestDetail, parseDesktopMarketRequest } from '../src/market-request.ts'

describe('market package proposals', () => {
  it('preserves dependency order and every remote source in the confirmation', () => {
    const specs = ['ontology@https://github.com/org/kernel/releases/download/v1/kernel.tgz', 'bid@1.0.0']
    const proposal = parseDesktopMarketRequest({ type: 'plugins-add', specs })
    expect(proposal).toEqual({ type: 'plugins-add', specs })
    expect(desktopMarketRequestDetail(proposal)).toBe(specs.join('\n\n'))
  })

  it.each([
    null, {}, { type: 'plugins-add', specs: [] },
    { type: 'plugins-add', specs: ['file:../plugin'] },
    { type: 'plugins-add', specs: ['plugin@https://user:password@example.com/plugin.tgz'] },
    { type: 'plugins-add', specs: ['plugin@1', 'plugin@2'] },
    { type: 'plugins-add', specs: [true] },
    { type: 'plugin-remove', name: 'plugin@1' },
    { type: 'plugin-remove', name: '../plugin' },
    { type: 'plugin-update', name: 'plugin', version: '1' },
  ])('rejects malformed proposals before native confirmation: %j', (value) => {
    expect(() => parseDesktopMarketRequest(value)).toThrow()
  })

  it('names the exact package in a removal confirmation', () => {
    const proposal = parseDesktopMarketRequest({ type: 'plugin-remove', name: '@org/bid' })
    expect(desktopMarketRequestDetail(proposal)).toBe('@org/bid')
  })
})
