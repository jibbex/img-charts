const getOption = data => ({
    dataset: [
        {
            id: 'dataset_raw',
            source: data,
        },
        {
            id: 'dataset_since_1950_of_germany',
            fromDatasetId: 'dataset_raw',
            transform: {
                type: 'filter',
                config: {
                    and: [
                        { dimension: 'Year', gte: 1950 },
                        { dimension: 'Country', '=': 'Germany' }
                    ]
                }
            }
        },
        {
            id: 'dataset_since_1950_of_france',
            fromDatasetId: 'dataset_raw',
            transform: {
                type: 'filter',
                config: {
                    and: [
                        { dimension: 'Year', gte: 1950 },
                        { dimension: 'Country', '=': 'France' }
                    ]
                }
            }
        }
    ],
    title: {
        text: 'Income of Germany and France since 1950'
    },
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        type: 'category',
        nameLocation: 'middle'
    },
    yAxis: {
        name: 'Income'
    },
    series: [
        {
            type: 'line',
            datasetId: 'dataset_since_1950_of_germany',
            showSymbol: false,
            animation: false,
            encode: {
                x: 'Year',
                y: 'Income',
                itemName: 'Year',
                tooltip: ['Income']
            }
        },
        {
            type: 'line',
            datasetId: 'dataset_since_1950_of_france',
            showSymbol: false,
            animation: false,
            encode: {
                x: 'Year',
                y: 'Income',
                itemName: 'Year',
                tooltip: ['Income']
            }
        }
    ],
    with: 800,
    height: 600
});