import * as d3 from "d3";
import "../styles.scss";

const canvas = {
  width: 500,
  height: 250,
};
const margin = { top: 20, right: 20, bottom: 20, left: 40 };

/**
 * Draw the title of the chart centered on top.
 * @param {*} g container
 * @param {*} text to display
 */
const drawTitle = (g, text) =>
  g
    .append("text")
    .attr("id", "title")
    .attr("x", canvas.width / 2)
    .attr("y", margin.top)
    .attr("text-anchor", "middle")
    .text(text);

/**
 * Draw the x axis to the left and add the ticks.
 * @param {*} g container
 * @param {*} xScale to calculate the positions
 */
const drawXAxis = (g, xScale) =>
  g
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${canvas.height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));

/**
 * Draw the y axis to the left and add the ticks.
 * @param {*} g container
 * @param {*} yScale to calculate the positions
 */
const drawYAxis = (g, yScale) =>
  g
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale).tickFormat(d3.format("d")));

/**
 * Draw the bar chart with the data provided.
 * @param {*} data coming from the api.
 */
const drawChart = (data) => {
  // Create the tooltip div inside and append it to the main div.
  // It has an absolute value and will be positionned next to the
  // cursor on top of the chart.
  const tooltip = d3
    .select("#barChart")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip");

  // Create the ranges that will be used to know the amplitude of
  // the graph.
  const xRange = [
    d3.min(data.data, (data) => new Date(data[0])),
    d3.max(data.data, (data) => new Date(data[0])),
  ];
  const yRange = [0, d3.max(data.data, (data) => Math.trunc(data[1]))];

  // Create the scales function that we'll use to draw the bars.
  const xScale = d3
    .scaleTime()
    .domain(xRange)
    .range([margin.left, canvas.width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain(yRange)
    .range([canvas.height - margin.bottom, margin.top]);

  // To calculate the bar width, we have to calculate the space
  // available on the canvas to create the bars and divide it
  // by the number of bars to draw.
  const barWidth =
    (canvas.width - margin.left - margin.right) / data.data.length;

  // Create a SVG document with the canvas defined in the constant
  // and append it to the main div.
  const svg = d3
    .select("#barChart")
    .append("svg")
    .attr("viewBox", [0, 0, canvas.width, canvas.height]);

  drawTitle(svg.append("g"), data.name);
  drawXAxis(svg.append("g"), xScale);
  drawYAxis(svg.append("g"), yScale);

  // Now we draw all the rectangles.
  svg
    .selectAll("rect")
    .data(data.data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", barWidth)
    .attr("height", (d) => yScale(yRange[0]) - yScale(d[1]))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])

    // As explained next to the tooltip creation, we have to set
    // the div coordinates to have them next to the cursor and
    // hide it when we mouse out.
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
};

/**
 * Fetch the data from server and draw the chart.
 */
export const displayBarChart = () => {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      drawChart(data);
    });
};

displayBarChart();
