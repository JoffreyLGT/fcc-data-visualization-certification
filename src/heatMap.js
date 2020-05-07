import * as d3 from "d3";

const canvas = {
  width: 500,
  height: 300,
};
const margin = { top: 40, right: 20, bottom: 40, left: 40 };

const monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const rectColors = [
  "#6495ed",
  "#8bafe6",
  "#b1c9de",
  "#d8e3d7",
  "#fffdd0",
  "#ffdeb0",
  "#ffbe90",
  "#ff9e70",
  "#ff7f50",
  "#FA8072",
];

const format2Digits = d3.format(".2f");

/**
 * Draw the x axis to the bottom and add the ticks.
 * @param {*} g container
 * @param {*} xScale to calculate the positions
 */
const drawXAxis = (g, xScale) =>
  g
    .attr("id", "x-axis")
    .attr("class", "axis")
    .attr("transform", `translate(0,${canvas.height - margin.bottom})`)
    .call(
      d3
        .axisBottom(xScale)
        .tickValues(xScale.domain().filter((d, i) => !(i % 20))) // every 20 years
        .tickSizeOuter(0)
    );

/**
 * Draw the y axis to the left and add the ticks.
 * @param {*} g container
 * @param {*} yScale to calculate the positions
 */
const drawYAxis = (g, yScale) =>
  g
    .attr("id", "y-axis")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(
      d3
        .axisLeft(yScale)
        .tickFormat((d) => monthNames[d])
        .tickSizeOuter(0)
    );

/**
 * Draw the title of the map.
 * @param {*} g
 */
const drawTitle = (g) =>
  g
    .append("text")
    .attr("id", "title")
    .attr("class", "title")
    .attr("x", canvas.width / 2)
    .attr("y", margin.top / 3)
    .attr("text-anchor", "middle")
    .text("Monthly Global Land-Surface Temperature");

/**
 * Draw the description of the map.
 * @param {*} g
 */
const drawDescription = (g, min, max, base) =>
  g
    .append("text")
    .attr("id", "description")
    .attr("class", "description")
    .attr("x", canvas.width / 2)
    .attr("y", margin.top - margin.top / 3)
    .attr("text-anchor", "middle")
    .text(`${min} - ${max}: base temperature ${base}°C`);

/**
 * Draw the legend in the g element.
 * @param {*} g
 * @param {*} range
 * @returns the threshold created
 */
const drawLegend = (g, range) => {
  // Note: this was drawn using this example
  // https://bl.ocks.org/mbostock/4573883

  const valuePerColor = (range[1] - range[0]) / (rectColors.length - 1);
  let domain = [];
  for (let i = 0; i < rectColors.length; i++) {
    domain.push(range[0] + valuePerColor * i);
  }

  const threshold = d3.scaleThreshold().domain(domain).range(rectColors);

  const legendXScale = d3
    .scaleLinear()
    .domain([range[0], range[1]])
    .range([margin.left, canvas.width / 2]);

  const yPosition = canvas.height - 20;

  const xAxis = d3
    .axisBottom(legendXScale)
    .tickSize(8)
    .tickValues(threshold.domain())
    .tickFormat((d) => format2Digits(d));

  g.attr("id", "legend");

  // Draw the axis
  g.attr("transform", `translate(0,${yPosition})`).call(xAxis);

  // Remove the axis to keep only the ticks
  g.select(".domain").remove();
  // Draw each rectangle and fill them with their color
  g.selectAll("rect")
    .data(
      threshold.range().map((color) => {
        var d = threshold.invertExtent(color);
        if (d[0] == null) d[0] = legendXScale.domain()[0];
        if (d[1] == null) d[1] = legendXScale.domain()[1];
        return d;
      })
    )
    .enter()
    .insert("rect", ".tick")
    .attr("height", 8)
    .attr("x", (d) => legendXScale(d[0]))
    .attr("width", (d) => legendXScale(d[1]) - legendXScale(d[0]))
    .attr("fill", (d) => threshold(d[0]))
    .attr("stroke", "black")
    .attr("stroke-width", ".5");

  g.append("text")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .attr("y", yPosition);

  return threshold;
};

/**
 * Draw the chart in the element with the id heatMap.
 * @param {*} data
 */
const drawChart = (data) => {
  const xDomain = [
    d3.min(data.monthlyVariance, (data) => data.year),
    d3.max(data.monthlyVariance, (data) => data.year),
  ];

  const legendRange = [
    d3.min(data.monthlyVariance, (data) => data.temperature),
    d3.max(data.monthlyVariance, (data) => data.temperature),
  ];

  const xScale = d3
    .scaleBand()
    .domain(data.monthlyVariance.map((variance) => variance.year))
    .range([margin.left, canvas.width - margin.right]);
  const yScale = d3
    .scaleBand()
    .domain(data.monthlyVariance.map((variance) => variance.month))
    .range([margin.top, canvas.height - margin.bottom]);

  const svg = d3
    .select("#heatMap")
    .append("svg")
    .attr("viewBox", `0 0 ${canvas.width} ${canvas.height}`);

  drawTitle(svg.append("g"));
  drawDescription(
    svg.append("g"),
    xDomain[0],
    xDomain[1],
    data.baseTemperature
  );
  drawXAxis(svg.append("g"), xScale);
  drawYAxis(svg.append("g"), yScale);

  const threshold = drawLegend(svg.append("g"), legendRange);

  svg
    .append("g")
    .selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("fill", (d, i) => threshold(d.temperature))
    .attr("height", yScale.bandwidth())
    .attr("width", (d) => xScale.bandwidth())
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month))
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => d.temperature);
};

/**
 * Add a temperature property to the monthlyVariance values.
 * @param {*} rawData data from API
 */
const addTemperature = (rawData) => ({
  baseTemperature: rawData.baseTemperature,
  monthlyVariance: rawData.monthlyVariance.map((entry) => ({
    ...entry,
    temperature: rawData.baseTemperature + entry.variance,
  })),
});

/**
 * Fetch the data from server and draw the chart.
 */
export const displayHeatMap = () => {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  )
    .then((response) => response.json())
    .then((data) => {
      drawChart(addTemperature(data));
    });
};
