/* CONSTANTS AND GLOBALS*/
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

let svg;

/*APPLICATION STATE*/
let state = {
  root: null,// + INITIALIZE STATE
};

/*LOAD DATA*/
d3.csv("../tutorial6_hierarchical/Mother Jones - Mass Shootings Data, 1982 - 2020.csv", d3.autotype).then(data => {
  state.data = data;
  init();
});

/*INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in*/
function init() {
  const container = d3.select("#d3-container").style("position", "relative");

  svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // + INITIALIZE TOOLTIP IN YOUR CONTAINER ELEMENT
  tooltip = container
    .append("div")
    .attr("class", "tooltip")
    .attr("width", 5)
    .attr("height", 5)
    .style("position", "absolute")
    .style("background-color", "white");

  // + CREATE YOUR ROOT HIERARCHY NODE
  const race = [...new Set(state.data.map(d => d.race))];
  const colorScale = d3
    .scaleOrdinal()
    .domain(race)
    .range(d3.schemeTableau10);

  const rolledUp = d3.rollups(
    state.data,
    v => ({ count: v.length, case: v }), // reduce function,
    d => d.race,
    d => d.type,
    d => d.total_victims
  );

  console.log("rolledUp", rolledUp);

  const root = d3
    .hierarchy([null, rolledUp], ([key, values]) => values) // children accessor, tell it to grab the second element
    .sum(([key, values]) => values.count) // sets the 'value' of each level
    .sort((a, b) => b.value - a.value);

  // + CREATE YOUR LAYOUT GENERATOR
  const pack = d3
    .pack()
    .size([width, height])
    .padding(1)
    //.round(true);

  // + CALL YOUR LAYOUT FUNCTION ON YOUR ROOT DATA
  pack(root);

  console.log(root);

  // + CREATE YOUR GRAPHICAL ELEMENTS
  const leaf = svg
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x},${d.y})`);

  leaf
    .append("circle")
    .attr("fill-opacity", 0.6)
    .attr("fill", d => colorScale(d.data[1].case[0].race))
    .attr("r", d => d.r)
    .on("mouseover", d => {
      console.log("d", d);
      state.hover = {
        translate: [
          d.x + width/15,
          d.y + 10,
        ],
        name: d
          .ancestors()
          .reverse()
          .map(d => d.data[0])
          .join("/"),
        value: d.value,
      };
      draw();
    });

  draw(); // calls the draw function
}

/*DRAW FUNCTION
 * we call this everytime there is an update to the data/state*/
function draw() {
  if (state.hover) {
    tooltip
    .html(
      `
      <div>Hierarchy Path: ${state.hover.name}</div>
      <div>Value: ${state.hover.value}</div>
    `
    )
    .transition()
    .duration(500)
    .style(
      "transform",
      `translate(${state.hover.translate[0]}px,${state.hover.translate[1]}px)`
    );
  }// + UPDATE TOOLTIP
}

d3.select("body")
  .append("div")
  .attr("class", "source");
d3.select(".source")
  .append("a")
  .attr("href", "https://docs.google.com/spreadsheets/d/1b9o6uDO18sLxBqPwl_Gh9bnhW-ev_dABH83M5Vb5L8o/edit#gid=0")
  .text("Source: Mother Jones - Mass Shootings Database, 1982 - 2020");