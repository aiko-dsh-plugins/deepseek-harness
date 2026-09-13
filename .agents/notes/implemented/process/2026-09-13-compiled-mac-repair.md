# Agent Note: Native validation of compiled Mac repair artifacts

Status: implemented

English | [中文](2026-09-13-compiled-mac-repair.zh.md)

## Problem

The Apple Silicon desktop installer needs to migrate retired plugin artifact URLs. The existing Mac release already contains the validated runtime and core packages; the repair changes the desktop shell and preinstalled market.

## Decision

The manually selected repair branch runs a bounded native Mac job in the public distribution repository. It downloads the existing release and a digest-pinned compiled repair archive from the selected repair branch, updates the shell and npm seed, refreshes ASAR integrity, and signs the test application ad hoc. It checks offline first launch, native editing, preservation after failed staging and startup migration before uploading reviewable artifacts. Private source repositories and credentials are not build inputs. The job has read-only repository permission and cannot publish a release.

## Consequences

Release publication remains a separate step after native evidence is inspected. The repair retains the application's existing data directory, remains unnotarized and disables automatic updates. The repair archive digest must change when its compiled contents change.
