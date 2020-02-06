d3.csv("../311 Data - Water Quality and Illness.csv").then(function(data) {
  data.forEach(function(d) {
    d.Year = +d.Year;
    d["Waterborne Illness"] = +d["Waterborne Illness"];
    d["Water Quality"] = +d["Water Quality"];
  });
  
  console.log(data[0]);
  
  const table = d3.select("#d3-table");
  const thead = table.append("thead");
  const tbody = table.append("tbody");
  
  thead
    .append("tr")
    .append("th")
    .attr("colspan", data.columns.length)
    .text("Water Quality and Waterborne Illness Complaints in NYC");
  
  thead
    .append("tr")
    .selectAll("th")
    .data(data.columns)
    .join("td")
    .text(d => d);
  
  const rows = tbody
    .selectAll("tr")
    .data(data)
    .join("tr");
  
  rows
    .selectAll("td")
    .data(d => Object.values(d))
    .join("td")
    .attr("class", d => d == "Queens" ? 'queens' : 
    d == "Manhattan" ? 'manhattan' : d == "Bronx" ? 'bronx' : 
    d == "Brooklyn" ? 'brooklyn' : d == "Staten Island" ? 'staten-island' : null)
    .text(d => d);
});

d3.select("body")
  .append("div")
  .attr("class","source")
d3.select(".source")
  .append("a")
  .attr("href", "https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9/data")
  .text("Source: 311 Service Requests from 2010 to Present")