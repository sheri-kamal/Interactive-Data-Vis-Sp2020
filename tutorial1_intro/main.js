d3.csv("../../tutorial1_intro/311 Data - Water Quality and Illness.csv").then(data => {
  console.log("data", data);
  
  const table = d3.select("#d3-table");
  
  const thead = table.append("thead");
  thead
    .append("tr")
    .append("th")
    .attr("colspan", data.columns.length)
    .text("Water Quality and Waterborne Illness Complaints in NYC");
  
  thead
    .append("tr")
    .selectAll("th")
    .data(data.columns)
    .join("th")
    .text(d => d);
  
  const rows = table
    .append("tbody")
    .selectAll("tr")
    .data(data)
    .join("tr");
  
  rows
    .selectAll("td")
    .data(d => Object.values(d))
    .join("td")
    .attr("class", (d, i) => {
      if((i = 2 && d > 21)||(i = 3 && d > 1762)) {
        return "above-average"
      }
    })
    .text(d => d);
});

d3.select("body")
  .append("div")
  .attr("class","source")
d3.select(".source")
  .append("a")
  .attr("href", "https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9/data")
  .text("Source: 311 Service Requests from 2010 to Present")