import "./styles.css";
import * as d3 from "d3";

// Fetch the data from server
fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then(response => response.json())
  .then(data => {
    displayGraph(data);
  });

const width = 500;
const height = 300;
const margin = { top: 20, right: 20, bottom: 20, left: 40 };

function displayGraph(data) {
  let svg = d3
    .select("#app")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", margin.top)
    .attr("text-anchor", "middle")
    .text(data.name);

  // Create the ranges
  const xRange = [
    d3.min(data.data, data => new Date(data[0]).getFullYear()),
    d3.max(data.data, data => new Date(data[0]).getFullYear())
  ];
  const yRange = [
    d3.min(data.data, data => Math.trunc(data[1])),
    d3.max(data.data, data => Math.trunc(data[1]))
  ];

  // Create the scales

  const xScale = d3
    .scaleLinear()
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
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

  svg // y
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale).tickFormat(d3.format("d")));

  const rectWidth = (width - margin.left) / data.data.length;

  svg
    .selectAll("rect")
    .data(data.data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => {
      const value = i * rectWidth + margin.left;
      return value;
    })
    .attr("y", (d, i) => height - (height - yScale(d[1])))
    .attr("width", rectWidth)
    .attr("height", (d, i) => height - yScale(d[1]) - margin.bottom);
}

// <text x="20" y="35" class="small">My</text>
