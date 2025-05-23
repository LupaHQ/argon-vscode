# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.32] - 2025-05-06

## [0.0.31] - 2024-09-06

### Fixed

- Improved reliability of "Start Lemonade" on Windows by enabling `AutoReconnect` in the Roblox plugin by default. This helps mitigate connection timing issues where the plugin attempted connection before the server was fully ready.
- Changed child process spawning to use `shell: false` for better cross-platform consistency (though the primary fix was `AutoReconnect`).

## [0.0.30] - 2024-09-06

### Added

- Synchronize extension `assets/docs` folder content to workspace `docs/` folder on startup.

### Changed

- Modified the "Start Lemonade" command (`startLemonade`) to no longer automatically launch Roblox Studio after starting the server.
- Updated rule synchronization (`syncRules`) to delete the existing `.cursor/rules` directory before copying new rules, ensuring removal of old/stale files.

## [0.0.29] - 2024-09-01

### Changed

- Integrated `rmcp` library for Multi-Cursor Protocol configuration.
- Updated dependencies.

### Fixed

- Corrected relative paths for module imports.

## [0.0.28] - 2024-08-20

### Added

- Initial `mcpConfig.ts` for handling Multi-Cursor Protocol settings.

### Changed

- Improved logging and error handling.

[unreleased]: https://github.com/LupaHQ/argon-vscode/compare/0.0.32...HEAD
[0.0.32]: https://github.com/LupaHQ/argon-vscode/compare/0.0.31...0.0.32
[0.0.31]: https://github.com/LupaHQ/argon-vscode/compare/0.0.30...0.0.31
[0.0.30]: https://github.com/LupaHQ/argon-vscode/compare/0.0.29...0.0.30
[0.0.29]: https://github.com/LupaHQ/argon-vscode/compare/0.0.28...0.0.29
[0.0.28]: https://github.com/LupaHQ/argon-vscode/releases/tag/0.0.28
