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

import * as echarts from 'echarts';

/**
 * Defines the dimensions for chart rendering.
 * Separating dimensions from other chart options improves type safety and makes
 * the dimension requirements explicit in the codebase.
 */
export interface ChartDimensions {
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
export interface ChartOption extends echarts.EChartsOption, Partial<ChartDimensions> {
    /** Activate debug mode - default false */
    debug?: boolean;
}

/**
 * Supported image export formats.
 * These formats represent the most commonly used web image formats:
 * - PNG: Best for charts with transparency
 * - JPEG: Optimal for charts with photos or complex gradients
 * - SVG: Perfect for resolution-independent vector graphics
 * - WebP: Modern format with good compression and quality
 */
export type ChartImageType = 'png' | 'jpeg' | 'svg' | 'webp';

/**
 * Configuration options for image generation.
 * This interface provides a structured way to specify image export parameters
 * and allows for future extensibility without breaking changes.
 */
export interface ImageGenerationOptions {
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
export class ChartError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ChartError';
    }
}

/**
 * Specific error type for dimension-related issues.
 * Helps distinguish dimension validation errors from other chart errors,
 * making error handling more precise.
 */
export class ChartDimensionError extends ChartError {
    constructor(message: string) {
        super(message);
        this.name = 'ChartDimensionError';
    }
}

/**
 * Utility class for performance monitoring.
 * Provides a simple way to measure the duration of operations
 * and log the results to the console.
 */
class Timing {
    private startTime: number = 0;
    private endTime: number = 0;
    private verbose: boolean = false;

    constructor(verbose: boolean = false) {
        this.verbose = verbose;
    }

    /**
     * Starts the timer.
     * Sets the start time to the current timestamp.
     * 
     * @returns The Timing instance for method chaining
     */ 
    start() {
        this.call(() => this.startTime = performance.now());
        return this;
    }

    /**
     * Ends the timer.
     * Sets the end time to the current timestamp.
     * 
     * @returns The Timing instance for method chaining
     */
    end() {
        this.call(() => this.endTime = performance.now());
        return this;
    }

    /**
     * Calculates the duration of the operation.
     * Returns the difference between the end and start times.
     * 
     * @returns The duration in milliseconds
     */
    get duration() {
        return this.endTime - this.startTime;
    }

    /**
     * Logs the operation duration to the console.
     * Outputs a formatted message with the operation label and duration.
     * Stops the timer, if running, and resets the start and end times.
     * 
     * @param label - The label for the operation
     */
    log(label: string) {
        this.call(() => {
            if (this.startTime > 0 && this.endTime === 0) {
                this.end();
            }

            console.log(`%c⏱️ ${label} took ${this.duration.toPrecision(4)}ms`, 'color: lightblue; font-weight: bold');
            this.startTime = 0;
            this.endTime = 0;
        });
    }

    /**
     * Internal utility function for conditional logging.
     * Calls the provided function if verbose mode is enabled.
     * 
     * @param fn - Function to call if verbose mode is enabled
     * @param args - Additional arguments to pass to the function
     */
    private call = (fn: (args: unknown[]) => void, ...args: unknown[]) => {
        if (this.verbose) {
            fn(args);
        }
    }
}

/**
 * Converts ChartImageType to corresponding MIME type.
 * This internal utility function ensures consistent MIME type usage
 * across the library.
 * 
 * @param type - The image format to convert
 * @returns The corresponding MIME type string
 * @throws {ChartError} If an invalid image type is provided
 */
function chartImageTypeToMime(type: ChartImageType) {
    switch (type) {
        case 'png':
            return 'image/png';
        case 'jpeg':
            return 'image/jpeg';
        case 'svg':
            return 'image/svg+xml';
        case 'webp':
            return 'image/webp';
        default:
            throw new ChartError('Invalid image type');
    }
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
class Chart {
    /** The underlying ECharts instance */
    private chart: echarts.EChartsType;
    /** Current chart configuration */
    private option: echarts.EChartsOption;
    /** Canvas element used for rendering */
    private canvas: HTMLCanvasElement;
    private timing: Timing;

    /**
     * Creates a new Chart instance.
     * Initializes the chart with provided options and sets up the canvas
     * with proper dimensions.
     * 
     * @param option - Initial chart configuration
     * @throws {ChartDimensionError} If dimensions are invalid
     */
    constructor(option: ChartOption) {
        this.timing = new Timing(option.debug || true);

        this.timing.start();
        this.validateOptions(option);

        this.option = option;
        this.canvas = document.createElement('canvas');

        this.setDimensions({
            width: option.width || 800, 
            height: option.height || 600
        });

        this.chart = echarts.init(this.canvas);
        this.update(option);
        this.timing.log('initialization');
    }
 
    /**
     * Updates chart configuration.
     * Preserves existing configuration while applying new options.
     * Handles dimension updates separately from chart options.
     * 
     * @param option - New configuration to apply
     * @returns The Chart instance for method chaining
     */
    update(option: ChartOption): Chart {
        this.timing.start();
        if (option.width || option.height) {
            this.setDimensions({
                width: option.width || this.canvas.width,
                height: option.height || this.canvas.height
            });
        }
    
        const chartOption = {...option};
        delete chartOption.width;
        delete chartOption.height;

        if (Array.isArray(chartOption.series)) {
            chartOption.series?.forEach((series: echarts.SeriesOption) => {
                series.animation = false;
            });
        } else if (chartOption.series) {
            chartOption.series.animation = false;
        }
    
        this.option = {
            ...this.option,
            ...chartOption
        };

        this.chart.setOption(this.option);
        this.timing.log('update');
        return this;
    }

    /**
     * Sets chart dimensions and triggers a resize.
     * Updates both canvas dimensions.
     * 
     * @param dimensions - New width and height
     * @returns The Chart instance for method chaining
     * @throws {ChartDimensionError} If dimensions are invalid
     */
    setDimensions({width, height}: ChartDimensions): Chart {
        this.validateOptions({width, height});
        this.canvas.width = width;
        this.canvas.height = height;
        // this.chart.resize({width, height});
        return this;
    }

    /**
     * Generates an image from the current chart state.
     * Converts the chart to a blob in the specified format.
     * 
     * @param options - Image generation configuration
     * @returns Promise resolving to image blob
     * @throws {ChartError} If image generation fails or quality is invalid
     */
    generateImage({type, quality}: ImageGenerationOptions): Promise<Blob> {
        if (quality && (quality < 0 || quality > 3)) {
            throw new ChartError('Quality must be between 0 and 3');
        }

        this.timing.start();
        return new Promise((resolve, reject) => {
            this.canvas.toBlob((blob) => {
                this.timing.log('image generation');
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new ChartError('Failed to generate image'));
                }
            }, chartImageTypeToMime(type), quality);
        });
    }

    /**
     * Generates a data URL for the current chart state.
     * Converts the chart to a base64-encoded image string.
     * 
     * @param ratio - Optional pixel ratio for high-DPI displays
     * @returns The data URL string
     */
    generateSvg(ratio?: number): string {
        return this.chart.getConnectedDataURL({
            type: 'svg',
            backgroundColor: 'transparent',
            pixelRatio: ratio
        });
    }

    /**
     * Provides access to the underlying chart object.
     * Allows for advanced chart manipulation and customization.
     * 
     * @returns The ECharts instance used for rendering
     */
    getChart() {
        return this.chart;
    }

    on(eventName: string, handler: (...args: unknown[]) => void) {
        this.chart.on(eventName, handler);
    }

    /**
     * Provides access to the underlying canvas element.
     * Useful for custom rendering or advanced manipulations.
     * 
     * @returns The canvas element used for rendering
     */
    getCanvas() {
        return this.canvas;
    }

    /**
     * Cleans up resources used by the chart.
     * Should be called when the chart is no longer needed to prevent memory leaks.
     */
    dispose() {
        this.chart.dispose();
    }

    /**
     * Validates chart options.
     * Ensures dimensions are positive numbers when provided.
     * 
     * @param option - Options to validate
     * @throws {ChartDimensionError} If dimensions are invalid
     */
    private validateOptions(option: ChartOption) {
        if (option.width && option.width <= 0) {
            throw new ChartDimensionError('Width must be positive');
        }

        if (option.height && option.height <= 0) {
            throw new ChartDimensionError('Height must be positive');
        }
    }
}

/**
 * Creates a new chart instance.
 * Factory function providing a simpler interface for chart creation.
 * 
 * @param option - Chart configuration
 * @returns A new Chart instance
 */
export const createChart = (option: ChartOption) => new Chart(option);

/**
 * Creates a chart and exports it as an image blob.
 * Handles proper resource cleanup after image generation.
 * 
 * @param params - Chart configuration and image generation options
 * @returns Promise resolving to image blob
 */
export const createChartImage = async ({
    option, 
    type, 
    quality
}: {
    option: ChartOption,
    type: ChartImageType,
    quality: number,
}): Promise<Blob> => {
    const chart = new Chart(option);
    try {
        const blob = await chart.generateImage({type, quality});
        return blob;
    } finally {
        chart.dispose();
    }
}

/**
 * Creates a chart and returns it as a data URL.
 * Combines chart creation and blob URL generation.
 * 
 * @param params - Chart configuration and image generation options
 * @returns Promise resolving to blob URL string
 */
export const createChartImgSrc = async ({
    option, 
    type, 
    quality
}: {
    option: ChartOption,
    type: ChartImageType,
    quality: number,
}): Promise<string> => {
    const blob = await createChartImage({option, type, quality});
    return URL.createObjectURL(blob);
}

/**
 * Creates a chart and exports it as an SVG string.
 * Handles proper resource cleanup after SVG generation.
 * 
 * @param option - Chart configuration
 * @returns SVG string
 */
export const createChartSvg = (
    option: ChartOption, 
    ratio?: number
) => {
    const perf = new Timing(true);
    perf.start();
    const chart = new Chart(option);
    try {
        const svg = chart.generateSvg(ratio);
        perf.log('SVG generation');
        return svg;
    } finally {
        chart.dispose();
    }
}

/**
 * Creates a chart and instance.
 * Provides access to the chart object for advanced customization.
 */
export default Chart;