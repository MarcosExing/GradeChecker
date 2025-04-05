export function createDonutGraph(labels, colors, values, title, divId) {
    const layout = {
        title: {
            text: title
        },
        paper_bgcolor: colors["bgColor"],
        font: {
            color: colors["textColor"]
        },
        showlegend: false,
        margin: {
            l: 20,
            r: 20,
            b: 20,
            t: 90,
            pad: 4
        }
    };

    const plotColors = labels.map(label => colors[label] || '#fff');

    const data = [{
        labels: labels, 
        values: values, 
        hole: 0.4, 
        type: 'pie',
        marker: {
            colors: plotColors
        }
    }];
    Plotly.newPlot(divId, data, layout, {responsive: true});
}
