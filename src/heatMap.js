import * as d3 from "d3";

const canvas = {
  width: 400,
  height: 250,
};
const margin = { top: 40, right: 20, bottom: 20, left: 40 };

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

const getFillColor = (temperature, reference) => {
  if (temperature >= reference - 1 && temperature <= reference + 1) {
    return "#FFFDD0";
  } else if (temperature > reference) {
    return temperature < reference + 3 ? "#FDD0FF" : "#D690D9";
  } else {
    return temperature > reference - 3 ? "#D0D2FF" : "#9093D9";
  }
};

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
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")).tickSizeOuter(0));

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
 * Draw the chart in the element with the id heatMap.
 * @param {*} data
 */
const drawChart = (data) => {
  const xDomain = [
    d3.min(data.monthlyVariance, (data) => data.year),
    d3.max(data.monthlyVariance, (data) => data.year),
  ];

  console.log(d3.min(data.monthlyVariance, (data) => data.temperature));
  console.log(d3.max(data.monthlyVariance, (data) => data.temperature));

  const xScale = d3
    .scaleLinear()
    .domain(xDomain)
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

  const rectWidth = canvas.width / (xDomain[1] - xDomain[0]);
  svg
    .append("g")
    .selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr(
      "fill",
      (d) =>
        `${getFillColor(Number(d.temperature), Number(data.baseTemperature))}`
    )
    .attr("height", yScale.bandwidth())
    .attr("width", (d) => rectWidth)
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month))
    .attr("data-month", (d) => d.month)
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
