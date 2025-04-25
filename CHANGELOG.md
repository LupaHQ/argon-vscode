# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), that adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

[Unreleased]: https://github.com/LupaHQ/argon-vscode/compare/0.0.29...HEAD

## [0.0.29] - 2024-07-25

### Added

- Suggest installation of the Luau Language Server extension (`JohnnyMorganz.luau-lsp`) on activation if it's not already installed, improving the Luau development experience.

## [0.0.28] - 2024-07-25

### Fixed

- Fixed automatic update checks which were failing due to passing an invalid `--auto` flag to the `argon update` command. Checks now run without extra flags, while manual updates correctly use `--force`.

## [0.0.27] - 2024-07-25

### Fixed

- Reduced excessive notifications during updates and other background tasks. Logs are now primarily directed to the 'Lemonade' output channel, with only errors triggering visible notifications.
- Prevented Roblox Studio from automatically launching after the 'Start Lemonade' command completes, respecting the `argon.autoLaunchStudio` and `argon.autoRun` settings.

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

- Use native `connect-mcp` command to handle MCP SSE connections.

[0.0.12]: https://github.com/LupaHQ/argon-vscode/compare/0.0.11...0.0.12

## [0.0.11] - YYYY-MM-DD

### Added

### Changed

### Fixed

### Removed

[0.0.27]: https://github.com/LupaHQ/argon-vscode/compare/0.0.26...0.0.27
[0.0.28]: https://github.com/LupaHQ/argon-vscode/compare/0.0.27...0.0.28
[0.0.29]: https://github.com/LupaHQ/argon-vscode/compare/0.0.28...0.0.29
