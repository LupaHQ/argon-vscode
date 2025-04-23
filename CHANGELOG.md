# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), that adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

[Unreleased]: https://github.com/LupaHQ/argon-vscode/compare/0.0.26...HEAD

## [0.0.26] - 2025-04-27

### Changed

- Updated extension to work with renamed Roblox plugin file (now "Lemonade.rbxm")
- Improved plugin installation and update processes to use the new filename

[0.0.26]: https://github.com/LupaHQ/argon-vscode/compare/0.0.25...0.0.26

## [0.0.25] - 2024-03-21

### Changed

- Simplified installer logging for better user experience
- Improved Windows installation reliability
- Removed unnecessary debug messages during installation

### Fixed

- Fixed PATH variable handling on Windows systems
- Improved error handling during installation process

## [0.0.23] - 2024-03-21

### Changed

- Simplified installer logging for better user experience
- Improved Windows installation reliability
- Removed unnecessary debug messages during installation

### Fixed

- Fixed PATH variable handling on Windows systems
- Improved error handling during installation process

## [0.0.22] - YYYY-MM-DD

### Security

- Removed Pinecone API key from `.cursor/mcp.json` generation; key is now hardcoded in the CLI.

## [0.0.21] - YYYY-MM-DD

### Added

### Changed

### Fixed

### Removed

## [0.0.20] - 2025-04-30

### Added

- Support for simplified MCP server configuration in `.cursor/mcp.json`
- Added Pinecone API integration via environment variables for local RAG

### Changed

- Improved update process to maintain user configuration when updating MCP settings

[0.0.20]: https://github.com/LupaHQ/argon-vscode/compare/0.0.17...0.0.20

## [0.0.17] - 2025-04-22

### Fixed

- Enhanced error handling for Argon CLI communication
- Fixed MCP configuration to improve stability with Cursor IDE integration
- Updated dependencies to address potential security vulnerabilities

[0.0.17]: https://github.com/LupaHQ/argon-vscode/compare/0.0.16...0.0.17

## [0.0.16] - 2025-04-22

### Fixed

- Enhanced error handling for Argon CLI communication
- Fixed MCP configuration to improve stability with Cursor IDE integration
- Updated dependencies to address potential security vulnerabilities

[0.0.16]: https://github.com/LupaHQ/argon-vscode/compare/0.0.15...0.0.16

## [0.0.15] - 2025-04-21

### Changed

- Updated MCP configuration to use the new local Pinecone RAG implementation in Argon CLI 0.0.15
- Simplified `.cursor/mcp.json` configuration to remove unnecessary URL and client flag arguments
- Compatible with Argon CLI's reimplemented MCP server using `mcpr` library

[0.0.15]: https://github.com/LupaHQ/argon-vscode/compare/0.0.14...0.0.15

## [0.0.14] - 2025-04-17

### Improved

- Added `--client` flag support to `connect-mcp` command for better MCP server integration
- Enhanced compatibility with Argon CLI 0.0.14's improved MCP client implementation

[0.0.14]: https://github.com/LupaHQ/argon-vscode/compare/0.0.13...0.0.14

## [0.0.13] - 2025-04-14

### Added

- Add `connect-mcp` command to handle MCP SSE connections natively.

[0.0.13]: https://github.com/LupaHQ/argon-vscode/compare/0.0.12...0.0.13

## [0.0.12] - 2025-04-14

### Changed

- Use native `argon connect-mcp` command instead of `npx` for Cursor MCP integration, removing Node.js dependency for this feature.

## [0.0.11] - 2025-04-12

### Added

- Add `RUST_YES` environment variable support.

## [0.0.10] - 2025-04-14

### Fixed

- Fixed `argon.ts` update command arguments to use `--mode` flag correctly.
- Added `vscode` update mode type definition to `argon.ts`.

## [0.0.9] - 2025-04-14

### Added

- Added extension self-update functionality for automatic updates
- Improved update command to update CLI and plugin components before updating the extension

### Changed

- Modified update process sequence to update CLI and plugins first, then extension

## [0.0.8] - 2025-04-09

### Changed

- Fixed code formatting issues across multiple files
- Improved code consistency and readability

## [0.0.7] - 2025-04-09

### Fixed

- Fixed Windows installation issue where reg.exe command was not found by using absolute path
- Added error handling to PATH variable updates for improved reliability across different environments

## [0.0.6] - 2024-04-12

### Added

- New `Update Lemonade` command to manually trigger CLI and plugin updates
- Added update option to the Lemonade menu for easier access

## [0.0.5] - 2025-04-10

### Fixed

- Made MCP server configuration cross-platform compatible to fix the "spawn npx ENOENT" error on Windows
- Improved error handling for MCP remote server connections
- Fixed log clearing when game starts by updating the Roblox client to use the correct log endpoint
- Fixed project initialization error with "Cannot read properties of undefined (reading 'toString')"

### Changed

- Removed unused `log/game_started` endpoint in favor of a more consolidated approach using the standard log endpoint

## [0.0.4] - 2024-04-09

### Changed

- Updated dependency management and internal configurations
- Improved compatibility with latest Roblox Studio plugin (0.0.4)
- Enhanced documentation and developer workflow

## [0.0.3] - 2024-04-09

### Changed

- Renamed Argon visual elements to Lemonade.
- Updated internal project configuration and dependencies.
- Fixed directory structure references.

## [0.0.2] - 2025-04-08

## [0.0.1] - 2024-04-08

### Added

- New `Output` command to quickly see Argon output channel

### Changed

- Reset version to 0.0.1 for initial Lemonade release
- Fixed linting issues in codebase
- Renamed LemonadeRAG to lemonadeRag for improved ESLint compliance

## [2.0.18] - 2025-02-05

### Added

- Option to disable auto-update of the Argon CLI

## [2.0.17] - 2025-01-26

### Added

- Completion for `rename_instances` setting
- `Show Output`

[0.0.21]: https://github.com/LupaHQ/argon-vscode/compare/0.0.20...0.0.21
[0.0.22]: https://github.com/LupaHQ/argon-vscode/compare/0.0.21...0.0.22
[0.0.23]: https://github.com/LupaHQ/argon-vscode/compare/0.0.22...0.0.23
[0.0.24]: https://github.com/LupaHQ/argon-vscode/compare/0.0.23...0.0.24
