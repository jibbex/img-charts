# Changelog

## [0.2.1] - 2025-02-14
### Added
- Support for debugging via the new debug flag in ChartOption.
- Timing class now logs detailed performance metrics.
- Added generateSvg and createChartSvg for SVG export.
- Added on() method for event handling on charts.

### Changed
- Chart update now disables animations by default.
- Refined configuration merging during updates.

### Fixed
- Improved dimension validation to catch negative values more accurately.

## [0.1.1] - 2025-02-13
### Added
- New fluent API for chart management.
- Enhanced type safety with updated TypeScript definitions.
- Support for generating images in multiple formats (PNG, JPEG, SVG, WebP).

### Changed
- Improved performance logging with more detailed metrics.
- Refined error handling with specific error types for dimensions and chart operations.

### Fixed
- Minor bugs in chart update handling and configuration merging.

## [0.1.0] - 2025-02-08
### Added
- Initial release with basic chart rendering functionality.
- Support for line charts, bar charts, and pie charts.
- Export charts as PNG images.
- Basic configuration options for charts.
- Documentation for setup and usage.
