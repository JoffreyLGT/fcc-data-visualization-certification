import * as d3 from "d3";
import "./styles.css";

// Fetch the data from server
fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((response) => response.json())
  .then((data) => {
    displayGraph(data);
  });

const width = 500;
const height = 300;
const margin = { top: 20, right: 20, bottom: 20, left: 40 };

function displayGraph(data) {
  const tooltip = d3
    .select("#app")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip");

  let svg = d3
    .select("#app")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", margin.top)
    .attr("text-anchor", "middle")
    .text(data.name);

  // Create the ranges
  const xRange = [
    d3.min(data.data, (data) => new Date(data[0])),
    d3.max(data.data, (data) => new Date(data[0])),
  ];
  const yRange = [0, d3.max(data.data, (data) => Math.trunc(data[1]))];

  // Create the scales
  const xScale = d3
    .scaleTime()
    .domain(xRange)
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain(yRange)
    .range([height - margin.bottom, margin.top]);

  // Create the axises
  svg // x
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));

  svg // y
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale).tickFormat(d3.format("d")));

  const barWidth = (width - margin.left - margin.right) / data.data.length;

  svg
    .selectAll("rect")
    .data(data.data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => xScale(new Date(d[0])))
    .attr("y", (d, i) => yScale(d[1]))
    .attr("width", (d, i) => barWidth)
    .attr("height", (d, i) => yScale(yRange[0]) - yScale(d[1]))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", (d) => {
      tooltip.text(d[0]);
      tooltip.attr("data-date", d[0]);
      tooltip.style("visibility", "visible");
    })
    .on("mousemove", () => {
      tooltip
        .style("top", d3.event.pageY - 10 + "px")
        .style("left", d3.event.pageX + 10 + "px");
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"));
}
