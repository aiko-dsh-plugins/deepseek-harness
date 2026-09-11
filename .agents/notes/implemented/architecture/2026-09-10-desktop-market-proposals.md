# Agent Note: Desktop market package proposals

Status: implemented

English | [中文](2026-09-10-desktop-market-proposals.zh.md)

## Problem

Independent plugin catalogs distribute dependencies and GitHub release archives, while Desktop owns an isolated package project and exposes installation only to its trusted management window. A market plugin cannot use Web routes or mutate the reserved profile through the CLI.

## Decision

The application renderer can submit structured installation and removal proposals. Electron validates the sender and payload, displays every package source in a native confirmation, and performs accepted proposals through its existing transactional project manager. Batches preserve dependency order and have one health check and activation. Package metadata records remote sources for offline release reconciliation; release-owned packages cannot be replaced and required plugins cannot be removed.

Catalog loading, dependency planning, and business interfaces remain independently distributed plugins. The shell has no organization catalog or business package names. Sandboxed preloads build separately so their shared IPC constants cannot become local CommonJS chunks.

The release's preinstalled plugin map adds published optional bundles to the offline seed. First installation activates them; reconciliation restores the active plugin list, including removals and independently updated sources. Preinstallation grants no release-owned protection: the native manager can remove a default, and a later application release cannot silently restore it. This keeps the market available on first use without making it a permanent core dependency. The market omits its own distribution records from catalog cards and retains its installed version in the header.

## Alternatives considered

Giving the market direct filesystem or pnpm access would bypass staging and recovery. Loading workspace plugins would make published catalog provenance unverifiable. Restricting distribution to npm would exclude the organization's existing release artifacts. A native confirmation keeps installation authority in Electron while allowing a catalog to propose sources.

## Consequences

Desktop carries a small integration change that must accompany compatible market releases. Marketplace install proposals can restart the backend and reload the application only after approval. Source-development profiles remain immutable. Focused tests cover proposal rejection, dependency order, retained sources, protected dependencies, first-install defaults, retained removals, and rollback; installed-artifact checks exercise the private Host and actual bundled package manager.
