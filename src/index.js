import "./styles.scss";
import { displayBarChart } from "./barChart";
import { displayScatterplotGraph } from "./scatterplotGraph";

const routes = [
  [0, "/"],
  [1, "/barChart"],
  [2, "/scatterplotGraph"],
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
    default:
      displayBarChart();
      displayScatterplotGraph();
      displayContainers("block");
  }
};

const onGraphSelected = (evt) => {
  const value = Number(evt.target.value);
  const newPathname = routes.find((route) => route[0] === value);
  console.log(newPathname);
  if (typeof newPathname === "undefined") {
    history.pushState(undefined, undefined, "/");
    displayGraph(0);
  } else {
    history.pushState(undefined, undefined, newPathname[1]);
    displayGraph(value);
    return;
  }
  displayGraph(0);
};

window.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("chartSelector");
  selector.addEventListener("change", onGraphSelected);
  const route = routes.find((route) => route[1] === location.pathname);
  if (typeof route === "undefined") {
    selector.value = "0";
    displayGraph();
  } else {
    selector.value = route[0].toString();
    displayGraph(route[0]);
  }
});
