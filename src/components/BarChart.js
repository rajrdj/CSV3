import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data, column }) => {
  const svgRef = useRef();
  const [sort, setSort] = useState('none'); // 'none', 'ascending', or 'descending'

  useEffect(() => {
    if (!data || !column) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the data
    const chartData = data.map(d => ({
      label: d[Object.keys(d)[0]], // Assume first column is the label
      value: +d[column] // Convert to number
    })).filter(d => !isNaN(d.value)); // Filter out any NaN values

    // Sort data if needed
    if (sort === 'ascending') {
      chartData.sort((a, b) => a.value - b.value);
    } else if (sort === 'descending') {
      chartData.sort((a, b) => b.value - a.value);
    }

    x.domain(chartData.map(d => d.label));
    y.domain([0, d3.max(chartData, d => d.value)]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g")
      .call(d3.axisLeft(y));

    g.selectAll(".bar")
      .data(chartData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.label))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", "steelblue");

  }, [data, column, sort]);

  const handleSort = () => {
    setSort(prevSort => {
      if (prevSort === 'none') return 'ascending';
      if (prevSort === 'ascending') return 'descending';
      return 'none';
    });
  };

  return (
    <div>
      <button onClick={handleSort} className="mb-2 bg-blue-500 text-white px-4 py-2 rounded">
        Sort: {sort === 'none' ? 'None' : sort === 'ascending' ? 'Ascending' : 'Descending'}
      </button>
      <svg ref={svgRef} width="600" height="400"></svg>
    </div>
  );
};

export default BarChart;