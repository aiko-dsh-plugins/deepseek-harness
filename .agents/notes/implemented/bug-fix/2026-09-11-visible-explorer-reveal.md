# Agent Note: Visible Explorer file selection

Status: implemented

English | [中文](2026-09-11-visible-explorer-reveal.zh.md)

## Problem

The native command runner's Windows hide flag can suppress Explorer's file-manager window even when Explorer selects the requested file and acknowledges the command. A successful subprocess exit therefore does not establish that a user can see the selected file.

## Decision

[`revealNativePath`](../../../../packages/util/native-command/src/path-opener.ts) requests `{ windowsHide: false }` from the shared runner for Explorer on Windows and WSL. Other native helper commands retain the hidden default. Path encoding, authorization, cancellation, and Explorer's delegated exit handling retain their existing semantics.

## Alternatives considered

**Show every native command window.** This also exposes transient PowerShell and other helper windows. An explicit runner option confines visibility to the executable that supplies the requested UI.

**Replace Explorer dispatch with Electron IPC.** File revealing also serves browser clients and WSL Hosts. Keeping visibility in the shared native adapter fixes those consumers without requiring an Electron-only implementation.

## Consequences

The file-manager action can display Explorer without exposing helper consoles. Injected runners must forward the optional window setting. Windows and WSL adapter tests assert the actual `execFile` visibility option; a Windows desktop smoke verifies selected path, visible window, and foreground state through Shell automation and Win32 window queries. Desktop visibility remains a platform integration check rather than a guarantee derived from the process exit code.
