import * as d3 from 'd3';

export function clearChart() {
  const chart = d3.select('#month-chart > *').remove();
}

export function drawChart(height, width, data, highestPoint) {
  const margin = { top: 50, bottom: 50, left: 50, right: 50 };
  const chart = d3
    .select('#month-chart')
    .append('svg')
    .attr('width', width - margin.left - margin.right)
    .attr('height', height - margin.top - margin.bottom)
    .attr('viewBox', [0, 0, width, height])
    .style('border', '4px solid #93E9BE')
    .style('border-radius', '15px');
  const x = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);
  chart.select('svg').remove();

  const y = d3
    .scaleLinear()
    .domain([0, highestPoint])
    .range([height - margin.bottom, margin.top]);
  chart
    .append('g')
    .attr('fill', '#93E9BE')
    .selectAll('rect')
    .data(data.sort((a, b) => d3.ascending(a.spent, b.spent)))
    .join('rect')
    .attr('x', (d, i) => x(i))
    .attr('y', (d) => y(d.spent))
    .attr('height', (d) => y(0) - y(d.spent))
    .attr('width', x.bandwidth());
  function xAxis(g) {
    g.attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat((i) => data[i].name))
      .attr('font-size', '20px');
  }

  function yAxis(g) {
    g.attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).ticks(null, data.format))
      .attr('font-size', '20px');
  }

  var line = chart
    .append('line')
    .attr('x1', margin.left)
    .attr('x2', width - margin.right)
    .attr('y1', y(100))
    .attr('y2', y(100))
    .attr('stroke-width', 4)
    .attr('stroke', 'black')
    .attr('stroke-dasharray', '8,8');

  chart.append('g').call(xAxis);
  chart.append('g').call(yAxis);
  chart.node();
}
