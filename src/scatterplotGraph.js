import * as d3 from "d3";

const title = "Doping in Professional Bicycle Racing";

const canvas = {
  width: 450,
  height: 250,
};

const margin = {
  top: 40,
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

/**
 * Convert a string containing time to a string containing
 * a date with ISO format.
 * ex: 20:00 returns 2020-04-24T05:20:00.123Z
 * @param {string} time with format 20:00
 */
const timeToISODate = (time) => {
  const splittedTime = time.split(":");
  const date = new Date();
  date.setMinutes(splittedTime[0]);
  date.setSeconds(splittedTime[1]);
  return date.toISOString();
};

/**
 * Create the tooltip div inside and append it to the main div.
 * It has an absolute value and will be positionned next to the
 * cursor on top of the chart.
 */
const createTooltip = () => {
  return d3
    .select("#scatterplotChart")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip");
};

const addTextToTooltip = (tooltip, data) => {
  tooltip.html(`${data.Name} - ${data.Nationality}<br />
  Year: ${data.Year}, Time:${data.Time}<br /><br />
  ${data.Doping}`);
};

const drawTitle = (g) => {
  g.append("text")
    .attr("id", "title")
    .attr("x", canvas.width / 2)
    .attr("y", 20)
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

const drawLegend = (g) => {
  const x = canvas.width - margin.right;
  const y = (canvas.height - margin.top) / 2;

  const padding = {
    x: 5,
    y: 10,
  };
  const rectSize = 7;

  g.attr("id", "legend")
    .append("text")
    .text("No doping allegations")
    .attr("x", x - padding.x)
    .attr("y", y)
    .attr("class", "legend")
    .attr("text-anchor", "end");

  g.append("text")
    .text("With doping allegations")
    .attr("x", x - padding.x)
    .attr("y", y + padding.y)
    .attr("class", "legend")
    .attr("text-anchor", "end");

  g.append("rect")
    .attr("x", x)
    .attr("y", y - (rectSize - 1))
    .attr("width", rectSize)
    .attr("height", rectSize)
    .attr("class", "legend-rect-no-doping");

  g.append("rect")
    .attr("x", x)
    .attr("y", y + padding.y - (rectSize - 1))
    .attr("width", rectSize)
    .attr("height", rectSize)
    .attr("class", "legend-rect-doping");
};

const drawGraph = (data) => {
  console.log(data);

  const tooltip = createTooltip();

  const xRange = [
    d3.min(data, (d) => d.Year) - 1,
    d3.max(data, (d) => d.Year) + 1,
  ];
  const yRange = [
    d3.min(data, (d) => d.Seconds) - 10,
    d3.max(data, (d) => d.Seconds) + 10,
  ];
  console.log(yRange);
  const xScale = d3
    .scaleLinear()
    .domain(xRange)
    .range([margin.left, canvas.width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain(yRange)
    .range([margin.top, canvas.height - margin.bottom]);

  const svg = d3
    .select("#scatterplotChart")
    .append("svg")
    .attr("viewBox", `0,0, ${canvas.width}, ${canvas.height}`);

  drawTitle(svg.append("g"));
  drawXAxis(svg.append("g"), xScale);
  drawYAxis(svg.append("g"), yScale);
  drawLegend(svg.append("g"));

  svg
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.Seconds))
    .attr("r", "3")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => timeToISODate(d.Time))
    .attr("class", (d) =>
      d.Doping.length > 0 ? "dot dot-doping" : "dot dot-no-doping"
    )
    // As explained next to the tooltip creation, we have to set
    // the div coordinates to have them next to the cursor and
    // hide it when we mouse out.
    .on("mouseover", (d) => {
      addTextToTooltip(tooltip, d);
      tooltip.attr("data-year", d.Year);
      tooltip.style("visibility", "visible");
    })
    .on("mousemove", () => {
      tooltip
        .style("top", d3.event.pageY - 10 + "px")
        .style("left", d3.event.pageX + 10 + "px");
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"));
};

export const displayScatterplotGraph = () => {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((response) => response.json())
    .then((data) => drawGraph(data));
};
