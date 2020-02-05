d3.csv("../../tutorial1_intro/311 Data - Water Quality.csv").then(data => {
    console.log("data", data);
  
    const table = d3.select("#d3-table");
  
    const thead = table.append("thead");
    thead
      .append("tr")
      .append("th")
      .attr("colspan", "7")
      .text("Water Quality Complaints in NYC");
  
    thead
      .append("tr")
      .selectAll("th")
      .data(data.columns)
      .join("td")
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
      .attr("class", d => d > 1762 ? 'above-average' : null)
      .text(d => d);
  });