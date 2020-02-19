/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selection: "All" // + YOUR FILTER SELECTION
};

/* LOAD DATA */
d3.json("../tutorial3_distributions/311 Data - Water Quality and Illness.json", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in 
function init() {
  // + SCALES
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d["Water Quality"]))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d["Waterborne Illness"]))
    .range([height - margin.bottom, margin.top]);

  const colorScale = d3
    .scaleOrdinal(d3.schemeTableau10)
    .domain(data.map(d => d.Borough));
  // + AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  // + UI ELEMENT SETUP

  const selectElement = d3.select("#dropdown").on("change", function() {
    // `this` === the selectElement
    // 'this.value' holds the dropdown value a user just selected

    state.selection = this.value
    console.log("new borough is", this.value);
    state.selection = this.value;
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data(["All", "Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"]) // + ADD UNIQUE VALUES
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // + CREATE SVG ELEMENT
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  // + CALL AXES
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Water Quality");
  
    svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-rl")
    .text("Waterborne Illness");
  draw(); // calls the draw function
}

/* DRAW FUNCTION */
 // we call this everytime there is an update to the data/state
function draw() {
  let filteredData = state.data;
  // + FILTER DATA BASED ON STATE
  if (state.selection !== "All") {
    filteredData = state.data.filter(d => d.Borough === state.selection);
  }
  const dot = svg
   .selectAll("circle")
   .data(filteredData, d => d.name)
   .join(
     enter => 
      enter
      .append("circle")
      .attr("class", "dot") 
      .attr("stroke", "lightgrey")
      .attr("opacity", 0.5)
      .attr("fill", d => colorScale(d.Borough))
      .attr("r", radius)
          .attr("cy", d => yScale(d["Waterborne Illness"]))
          .attr("cx", d => margin.left) // initial value - to be transitioned
          .call(enter =>
            enter
              .transition() // initialize transition
              .delay(d => 500 * d["Water Quality"]) // delay on each element
              .duration(500) // duration 500ms
              .attr("cx", d => xScale(d["Water Quality"]))), // + HANDLE ENTER SELECTION
     update => 
      update.call(update =>
        update
        .transition()
        .duration(250)
        .attr("stroke", "black")
        .transition()
        .duration(250)
        .attr("stroke", "lightgrey")), // + HANDLE UPDATE SELECTION
     exit => 
      exit.call(exit =>
        exit
        .transition()
        .delay(d => 50 * d["Water Quality"])
        .duration(500)
        .attr("cx", width)
        .remove()) // + HANDLE EXIT SELECTION
  );
}
