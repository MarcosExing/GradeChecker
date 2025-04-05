export function createDonutGraph(labels, colors, values, title, divId) {
    const layout = {
        title: {
            text: title
        },
        paper_bgcolor: colors["bgColor"],
        font: {
            color: colors["textColor"]
        },
        showlegend: false
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
