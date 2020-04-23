import * as d3 from "d3";
import "./styles.css";

const title = "Doping in Professional Bicycle Racing";

const canvas = {
  width: 500,
  height: 250,
};

const margin = {
  top: 20,
  right: 10,
  bottom: 20,
  left: 40,
};

/**
 * Convert the seconds into a minutes:seconds format.
 * ex: 121 => 02:01
 * @param {number} totalSeconds seconds to convert
 */
const secondsToMinsSeconds = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const drawTitle = (g) => {
  g.append("text")
    .attr("id", "title")
    .attr("x", canvas.width / 2)
    .attr("y", margin.top)
    .attr("text-anchor", "middle")
    .text(title);
};

const drawXAxis = (g, xScale) => {
  g.attr("id", "x-axis")
    .attr("transform", `translate(0,${canvas.height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
};

const drawYAxis = (g, yScale) => {
  g.attr("id", "y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale).tickFormat(secondsToMinsSeconds));
};

const drawGraph = (data) => {
  console.log(data);

  const xRange = [d3.min(data, (d) => d.Year), d3.max(data, (d) => d.Year)];
  const yRange = [
    d3.min(data, (d) => d.Seconds),
    d3.max(data, (d) => d.Seconds),
  ];
  console.log(yRange);
  const xScale = d3
    .scaleLinear()
    .domain(xRange)
    .range([margin.left, canvas.width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain(yRange)
    .range([canvas.height - margin.bottom, margin.top]);

  const svg = d3
    .select("#scatterplotChart")
    .append("svg")
    .attr("viewBox", `0,0, ${canvas.width}, ${canvas.height}`);

  drawTitle(svg.append("g"));
  drawXAxis(svg.append("g"), xScale);
  drawYAxis(svg.append("g"), yScale);
};

export const displayScatterplotGraph = () => {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((response) => response.json())
    .then((data) => drawGraph(data));
};
