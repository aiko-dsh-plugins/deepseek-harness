/** Validated package proposals from the application renderer. */

import { packageNameFromSpec, type DesktopProjectMutation } from './project-manager.ts'

/** Market operations require a native confirmation before package state changes. */
export type DesktopMarketRequest = Extract<DesktopProjectMutation, { type: 'plugins-add' | 'plugin-remove' }>

/**
 * Decode an IPC proposal without accepting local sources or duplicate packages.
 * @param value - Untrusted renderer payload.
 * @returns A validated transaction proposal for native confirmation.
 */
export function parseDesktopMarketRequest(value: unknown): DesktopMarketRequest {
  if (typeof value !== 'object' || value === null) throw new Error('desktop market: invalid request')
  if (!('type' in value)) throw new Error('desktop market: missing operation')
  if (value.type === 'plugin-remove' && 'name' in value && typeof value.name === 'string') {
    if (packageNameFromSpec(value.name) !== value.name) throw new Error('desktop market: expected a package name')
    return { type: 'plugin-remove', name: value.name }
  }
  if (value.type === 'plugins-add' && 'specs' in value && Array.isArray(value.specs) && value.specs.length > 0) {
    const names = new Set<string>()
    const specs = value.specs.map((spec: unknown) => {
      if (typeof spec !== 'string') throw new Error('desktop market: expected a package spec')
      const name = packageNameFromSpec(spec)
      if (name === undefined || names.has(name)) throw new Error('desktop market: duplicate or missing package name')
      names.add(name)
      return spec
    })
    return { type: 'plugins-add', specs }
  }
  throw new Error('desktop market: unsupported operation')
}

/**
 * Show every affected package and source in the desktop-owned confirmation.
 * @param request - Validated proposal.
 * @returns Plain text listing the exact sources or removed package.
 */
export function desktopMarketRequestDetail(request: DesktopMarketRequest): string {
  return request.type === 'plugins-add' ? request.specs.join('\n\n') : request.name
}
