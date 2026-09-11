# Agent Note: 显示 Explorer 文件选择窗口

Status: implemented

[English](2026-09-11-visible-explorer-reveal.md) | 中文

## Problem

原生命令运行器的 Windows 隐藏标志可能抑制 Explorer 文件管理器窗口，即使 Explorer 已选中请求的文件并确认命令。子进程成功退出不能证明用户能看到选中的文件。

## Decision

[`revealNativePath`](../../../../packages/util/native-command/src/path-opener.ts) 在 Windows 和 WSL 上调用 Explorer 时，向共享运行器传入 `{ windowsHide: false }`。其他原生辅助命令保留默认隐藏行为。路径编码、授权、取消以及 Explorer 转交请求的退出码处理保持现有语义。

## Alternatives considered

**显示所有原生命令窗口。** 这也会暴露短暂的 PowerShell 等辅助窗口。显式运行器选项将窗口显示限定于提供用户所请求界面的可执行文件。

**用 Electron IPC 替代 Explorer 分派。** 文件定位也服务于浏览器客户端和 WSL Host。将窗口显示控制放在共享原生适配器中，可以修复这些调用方，而无需仅适用于 Electron 的实现。

## Consequences

文件管理器操作能够显示 Explorer，同时不暴露辅助控制台。注入的运行器必须转发可选的窗口设置。Windows 和 WSL 适配器测试断言实际 `execFile` 的窗口选项；Windows 桌面冒烟测试通过 Shell 自动化及 Win32 窗口查询验证所选路径、窗口可见性及前台状态。桌面窗口可见性仍由平台集成检查验证，不能根据进程退出码推导保证。
