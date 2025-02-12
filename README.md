# img-charts

img-charts is a lightweight TypeScript library that provides a fluent API for managing ECharts visualizations. It simplifies chart initialization, updates, dimension handling, and exporting charts as images with type safety and built-in error handling. See the [Example](https://jibbex.github.io/img-charts/).

## Features

- **Fluent API:** Chain methods for updating and exporting charts.
- **Type Safety:** Strong TypeScript definitions for chart options and dimensions.
- **Image Export:** Easily generate images (PNG, JPEG, SVG, WebP) from charts.
- **Performance Logging:** Built-in performance monitoring for debugging.
- **Error Handling:** Custom errors for precise error management.

## Installation

1. Add the package with any package manager, e.g. `npm`:
   ```bash
   npm install https://github.com/jibbex/img-charts.git
   ```

## Usage

### Create a Chart

```typescript
// Create a chart instance using a type-safe configuration.
import { createChart, ChartOption } from './src/index';

const option: ChartOption = {
    // ...existing code for ECharts configuration...
    width: 1024,
    height: 768,
};

const chart = createChart(option);
```

### Update a Chart

```typescript
// Update chart dimensions or options.
chart.update({
    width: 1200,
    // ...other ECharts options...
});
```

### Export as Image

```typescript
import { createChartImage, ChartImageType } from './src/index';

(async () => {
    const blob = await createChartImage({
        option,
        type: 'png' as ChartImageType,
        quality: 2,
    });
    // Use the blob (e.g., create a URL or download the image)
})();
```

### Get Image URL

```typescript
import { createChartImgSrc, ChartImageType } from './src/index';

(async () => {
    const imageUrl = await createChartImgSrc({
        option,
        type: 'jpeg' as ChartImageType,
        quality: 2,
    });
    // Use imageUrl (e.g., set as an img src)
})();
```

## Project Structure

- **/src:** Core library code, including chart management, options validation, and image export API.
- **/tsconfig.json:** TypeScript configuration.
- **/package.json:** Project metadata, scripts, and dependencies.

## Contributing

Contributions are welcome! Please follow these steps:
- Fork the repository.
- Create a feature branch.
- Ensure code quality with tests and linting.
- Submit a pull request with detailed descriptions.

## License

This project is licensed under the MIT License.
