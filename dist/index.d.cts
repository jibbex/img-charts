import * as echarts from 'echarts';

/**
 * ECharts Wrapper Library
 *
 * This module provides a high-level abstraction for creating, managing, and exporting ECharts visualizations.
 * It handles common chart operations like initialization, updates, resizing, and image export while providing
 * strong type safety and error handling.
 *
 * Key features:
 * - Fluent interface for method chaining
 * - Built-in performance monitoring
 * - Automatic memory management
 * - Type-safe configuration
 * - Error handling with custom error types
 *
 * @module echarts-wrapper
 */

/**
 * Defines the dimensions for chart rendering.
 * Separating dimensions from other chart options improves type safety and makes
 * the dimension requirements explicit in the codebase.
 */
interface ChartDimensions {
    /** Width in pixels - must be a positive number */
    width: number;
    /** Height in pixels - must be a positive number */
    height: number;
}
/**
 * Extends the base ECharts configuration with optional dimension settings.
 * Using Partial<ChartDimensions> allows dimensions to be optional while maintaining
 * type safety for the core ECharts configuration.
 */
interface ChartOption extends echarts.EChartsOption, Partial<ChartDimensions> {
}
/**
 * Supported image export formats.
 * These formats represent the most commonly used web image formats:
 * - PNG: Best for charts with transparency
 * - JPEG: Optimal for charts with photos or complex gradients
 * - SVG: Perfect for resolution-independent vector graphics
 * - WebP: Modern format with good compression and quality
 */
type ChartImageType = 'png' | 'jpeg' | 'svg' | 'webp';
/**
 * Configuration options for image generation.
 * This interface provides a structured way to specify image export parameters
 * and allows for future extensibility without breaking changes.
 */
interface ImageGenerationOptions {
    /** The desired output format */
    type: ChartImageType;
    /** Quality setting (0-3), where higher values indicate better quality but larger file size */
    quality?: number;
}
/**
 * Base error class for chart-related errors.
 * Provides a foundation for more specific error types and helps with
 * error handling and debugging.
 */
declare class ChartError extends Error {
    constructor(message: string);
}
/**
 * Specific error type for dimension-related issues.
 * Helps distinguish dimension validation errors from other chart errors,
 * making error handling more precise.
 */
declare class ChartDimensionError extends ChartError {
    constructor(message: string);
}
/**
 * Core chart management class.
 * Provides a complete API for chart lifecycle management including:
 * - Chart initialization with type-safe options
 * - Dimension management
 * - Chart updates with state preservation
 * - Image export capabilities
 * - Performance monitoring
 * - Resource cleanup
 */
declare class Chart {
    /** The underlying ECharts instance */
    private chart;
    /** Current chart configuration */
    private option;
    /** Canvas element used for rendering */
    private canvas;
    /**
     * Creates a new Chart instance.
     * Initializes the chart with provided options and sets up the canvas
     * with proper dimensions.
     *
     * @param option - Initial chart configuration
     * @throws {ChartDimensionError} If dimensions are invalid
     */
    constructor(option: ChartOption);
    /**
     * Updates chart configuration.
     * Preserves existing configuration while applying new options.
     * Handles dimension updates separately from chart options.
     *
     * @param option - New configuration to apply
     * @returns The Chart instance for method chaining
     */
    update(option: ChartOption): Chart;
    /**
     * Sets chart dimensions and triggers a resize.
     * Updates both canvas dimensions.
     *
     * @param dimensions - New width and height
     * @returns The Chart instance for method chaining
     * @throws {ChartDimensionError} If dimensions are invalid
     */
    setDimensions({ width, height }: ChartDimensions): Chart;
    /**
     * Generates an image from the current chart state.
     * Converts the chart to a blob in the specified format.
     *
     * @param options - Image generation configuration
     * @returns Promise resolving to image blob
     * @throws {ChartError} If image generation fails or quality is invalid
     */
    generateImage({ type, quality }: ImageGenerationOptions): Promise<Blob>;
    /**
     * Provides access to the underlying chart object.
     * Allows for advanced chart manipulation and customization.
     *
     * @returns The ECharts instance used for rendering
     */
    getChart(): echarts.ECharts;
    /**
     * Provides access to the underlying canvas element.
     * Useful for custom rendering or advanced manipulations.
     *
     * @returns The canvas element used for rendering
     */
    getCanvas(): HTMLCanvasElement;
    /**
     * Cleans up resources used by the chart.
     * Should be called when the chart is no longer needed to prevent memory leaks.
     */
    dispose(): void;
    /**
     * Validates chart options.
     * Ensures dimensions are positive numbers when provided.
     *
     * @param option - Options to validate
     * @throws {ChartDimensionError} If dimensions are invalid
     */
    private validateOptions;
    /**
     * Logs performance metrics for chart operations.
     * Helps with debugging and performance optimization.
     *
     * @param operation - Name of the operation being measured
     * @param startTime - Start time of the operation
     */
    private logPerformance;
}
/**
 * Creates a new chart instance.
 * Factory function providing a simpler interface for chart creation.
 *
 * @param option - Chart configuration
 * @returns A new Chart instance
 */
declare const createChart: (option: ChartOption) => Chart;
/**
 * Creates a chart and exports it as an image blob.
 * Handles proper resource cleanup after image generation.
 *
 * @param params - Chart configuration and image generation options
 * @returns Promise resolving to image blob
 */
declare const createChartImage: ({ option, type, quality }: {
    option: ChartOption;
    type: ChartImageType;
    quality: number;
}) => Promise<Blob>;
/**
 * Creates a chart and returns it as a data URL.
 * Combines chart creation and blob URL generation.
 *
 * @param params - Chart configuration and image generation options
 * @returns Promise resolving to blob URL string
 */
declare const createChartImgSrc: ({ option, type, quality }: {
    option: ChartOption;
    type: ChartImageType;
    quality: number;
}) => Promise<string>;

export { ChartDimensionError, type ChartDimensions, ChartError, type ChartImageType, type ChartOption, type ImageGenerationOptions, createChart, createChartImage, createChartImgSrc };
