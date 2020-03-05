/*CONSTANTS AND GLOBALS*/
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;

/*APPLICATION STATE*/
let state = {
  geojson: null,
  shootings: null,
  hover: {
    Location: null,
    Date: null,
    Case: null,
    Victims: null,
  },// + SET UP STATE
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../tutorial5_geographic/usState.json"),
  d3.csv("../tutorial5_geographic/Mother Jones - Mass Shootings Data, 1982 - 2020.csv", d3.autoType),
]).then(([geojson, shootings]) => {
  state.geojson = geojson;
  state.shootings = shootings;
  // + SET STATE WITH DATA
  //console.log("state: ", state);
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson);// + SET UP PROJECTION
  const path = d3.geoPath().projection(projection);// + SET UP GEOPATH

  svg
    .selectAll(".state")
    .data(state.geojson.features)
    .join("path")
    .attr("d", path)
    .attr("class", "state")
    .attr("fill", "transparent")
    

  svg
    .selectAll("circle")
    .data(state.shootings, d => d)
    .join("circle")
    .attr("r", 4)
    .attr("fill", "red")
    .attr("cx", d => projection([d["longitude"],d["latitude"]])[0])
    .attr("cy", d => projection([d["longitude"],d["latitude"]])[1])
    .on('mouseover',d=>{
      state.hover['Location']=d['location'];
      state.hover['Date']=d['date'];
      state.hover['Case']=d['case'];
      state.hover['Victims']=d['total_victims'];
      draw();
    });
    
  // + DRAW BASE MAP PATH
  // + ADD EVENT LISTENERS (if you want)

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  hoverData = Object.entries(state.hover);

  d3.select("#hover-content")
    .selectAll("div.row")
    .data(hoverData)
    .join("div")
    .attr("class", "row")
    .html(
      d =>
        d[1] 
          ? `${d[0]}: ${d[1]}` 
          : null 
    );
}

d3.select("body")
  .append("div")
  .attr("class", "source");
d3.select(".source")
  .append("a")
  .attr("href", "https://docs.google.com/spreadsheets/d/1b9o6uDO18sLxBqPwl_Gh9bnhW-ev_dABH83M5Vb5L8o/edit#gid=0")
  .text("Source: Mother Jones - Mass Shootings Database, 1982 - 2020");