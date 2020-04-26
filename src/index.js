import "./styles.scss";
import { displayBarChart } from "./barChart";
import { displayScatterplotGraph } from "./scatterplotGraph";
import { displayHeatMap } from "./heatMap";

const projects = [
  [0, "all"],
  [1, "barChart"],
  [2, "scatterplotGraph"],
  [3, "heatMap"],
];

const removeGraphContainerContent = () => {
  const containers = document.getElementsByClassName("graph-container");
  for (let i = 0; i < containers.length; i++) {
    containers[i].innerHTML = "";
  }
};

const displayContainers = (displayValue) => {
  const charts = document.getElementsByClassName("project-container");
  for (let i = 0; i < charts.length; i++) {
    charts[i].style.display = displayValue;
  }
};

const displayGraph = (id) => {
  displayContainers("none");
  removeGraphContainerContent();
  switch (id) {
    case 1:
      displayBarChart();
      document.getElementById(id).style.display = "block";
      break;
    case 2:
      displayScatterplotGraph();
      document.getElementById(id).style.display = "block";
      break;
    case 3:
      displayHeatMap();
      document.getElementById(id).style.display = "block";
      break;
    default:
      displayBarChart();
      displayScatterplotGraph();
      displayHeatMap();
      displayContainers("block");
  }
};

const onGraphSelected = (evt) => {
  const value = Number(evt.target.value);
  const newPathname = projects.find((route) => route[0] === value);
  if (typeof newPathname === "undefined") {
    history.pushState(undefined, undefined, `${location.pathname}?project=all`);
    displayGraph(0);
  } else {
    history.pushState(
      undefined,
      undefined,
      `${location.pathname}?project=${newPathname[1]}`
    );
    displayGraph(value);
    return;
  }
  displayGraph(0);
};

window.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("chartSelector");
  selector.addEventListener("change", onGraphSelected);

  const projectQuery = new URLSearchParams(location.search).get("project");
  const project = projects.find((route) => route[1] === projectQuery);
  if (typeof project === "undefined") {
    history.pushState(undefined, undefined, `${location.pathname}?project=all`);
    selector.value = "0";
    displayGraph();
  } else {
    selector.value = project[0].toString();
    displayGraph(project[0]);
  }
});
