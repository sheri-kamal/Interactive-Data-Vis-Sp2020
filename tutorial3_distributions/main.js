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
  selectedborough: "All"
};

/* LOAD DATA */
d3.csv("../tutorial3_distributions/311 Data - Water Quality and Illness.csv", d3.autoType).then(raw_data => {
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

  // + AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // + UI ELEMENT SETUP
  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log("new selected borough is", this.value);
    // `this` === the selectElement
    // this.value holds the dropdown value a user just selected
    state.selectedborough = this.value;
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data(["All", "Bronx", "Brooklyn", "Queens", "Manhattan", "Staten Island"]) // unique data values-- (hint: to do this programmatically take a look `Sets`)
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
    .attr("Queens", "50%")
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
  if (state.selectedborough
 !== "All") {
    filteredData = state.data.filter(d => d.Borough === state.selectedborough);
  }

  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.Borough)
    .join(
      enter =>
        enter
          .append("circle")
          .attr("class", "dot") 
          .attr("stroke", "lightgrey")
          .attr("opacity", 0.5)
          .attr("fill", d => {
            if (d.Borough === "Bronx") return "blue";
            else if (d.Borough === "Brooklyn") return "green";
            else if (d.Borough === "Queens") return "orange";
            else if (d.Borough === "Manhattan") return "red"; 
            else return "purple";
          })
          .attr("r", radius)
          .attr("cy", d => yScale(d["Waterborne Illness"]))
          .attr("cx", d => margin.left) // initial value - to be transitioned
          .call(enter =>
              enter
                .attr("cx", d => xScale(d["Water Quality"])) // + HANDLE ENTER SELECTION
                .transition()
                .delay(d => 500 * d["Water Quality"]) // delay on each element    
            ),
        update =>
          update.call(update =>
            update
              .transition()
              .duration(250)
              .attr("stroke", "black")
              .transition()
              .duration(250)
              .attr("stroke", "lightgrey") // + HANDLE UPDATE SELECTION
          ),
        exit =>
          exit.call(exit =>
            exit
              .attr("cx", width)
              .remove() // + HANDLE EXIT SELECTION
        )
    );
}

d3.select("body")
  .append("div")
  .attr("class", "source");
d3.select(".source")
  .append("a")
  .attr("href", "https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9/data")
  .text("Source: 311 Service Requests from 2010 to Present");