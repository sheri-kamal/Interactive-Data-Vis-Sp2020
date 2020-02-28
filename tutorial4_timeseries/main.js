/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;
let yAxis;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedCountry: 'Afghanistan', // + YOUR FILTER SELECTION
};

/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv("../tutorial4_timeseries/GDP per Capita - Yearly Growth.csv", d => ({
  year: new Date(d.Year, 0, 1),
  country: d.Country,
  gdp: +d.GDPperCapita,
})).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
  xScale = d3
    .scaleTime()
    .domain(d3.extent(state.data, d => d.year))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain([d3.min(state.data, d => d.gdp), d3.max(state.data, d => d.gdp)])
    .range([height - margin.bottom, margin.top]);
  // + AXES
  const xAxis = d3.axisBottom(xScale);
  yAxis = d3.axisLeft(yScale)
  // + UI ELEMENT SETUP

  const selectElement = d3.select("#dropdown").on("change", function() {
    // `this` === the selectElement
    // 'this.value' holds the dropdown value a user just selected
    state.selection = this.value; // + UPDATE STATE WITH YOUR SELECTED VALUE
    console.log("new country is", this.value);
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data(Array.from(new Set(state.data.map(d => d.country)))) // + ADD DATA VALUES FOR DROPDOWN
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
  // add the xAxis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Year");

  // add the yAxis
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
    .text("GDP/Capita, Yearly Growth");

  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  // + FILTER DATA BASED ON STATE
  let filteredData;
  if (state.selectedCountry !== null) {
    filteredData = state.data.filter(d => d.country === state.selectedCountry);
  }
  // + UPDATE SCALE(S), if needed
  yScale.domain([d3.min(filteredData, d => d.gdp), d3.max(filteredData, d => d.gdp)]);
  // + UPDATE AXIS/AXES, if needed
  d3.select("g.y-axis")
    .transition()
    .duration(1000)
    .call(yAxis.scale(yScale));
  // + DRAW CIRCLES, if you decide to
  // const dot = svg
  //   .selectAll("circle")
  //   .data(filteredData, d => d.name)
  //   .join(
  //     enter => enter, // + HANDLE ENTER SELECTION
  //     update => update, // + HANDLE UPDATE SELECTION
  //     exit => exit // + HANDLE EXIT SELECTION
  //   );
  //
  // + DRAW LINE AND AREA
  const areaFunc = svg
    .area()
    .x(d => xScale(d.year))
    .y0(height-margin.bottom)
    .y1(d => yScale(d.gdp));
  
  const area = svg
    .append("path.trend")
    .data([filteredData], d => d.country)
    .join(
      enter =>
        enter
          .append("path")
          .attr("class", "trend")
          .attr("opacity", 0)
          .attr("fill", d => {
            if (d.gdp > 0) return "green";
            else return "red";
          }), 
      update => update, 
      exit => exit.remove()
    )
    .call(selection =>
      selection
        .transition() 
        .duration(1000)
        .attr("opacity", 1)
        .attr("d", areaFunc)
    );
  /*
  const lineFunc = svg
    .line()
    .x(d => d.year)
    .y(d => d.gdp)
    .curve(d3.curveMonotoneX);
  
  const line = svg
    .append("path.line")
    .data([filteredData])
    .join(
      enter =>
        enter
          .append("path")
          .attr("class", "line")
          .attr("opacity", 0)
          .attr("fill", "steelblue"), 
      update => update, 
      exit => exit.remove()
    )
    .call(selection =>
      selection
        .transition() 
        .duration(1000)
        .attr("opacity", 1)
        .attr("d", lineFunc(d))
    );*/
}

d3.select("body")
  .append("div")
  .attr("class", "source");
d3.select(".source")
  .append("a")
  .attr("href", "https://data.worldbank.org/indicator/NY.GDP.PCAP.KD.ZG")
  .text("Source: Gapminder's GDP per Capita, PPP");