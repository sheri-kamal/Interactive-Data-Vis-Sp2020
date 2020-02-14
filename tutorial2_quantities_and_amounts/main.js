d3.csv("../tutorial2_quantities_and_amounts/311 Data - Air Quality.csv", d3.autoType).then(data => {
    console.log(data);

    const width = window.innerWidth * 0.9,
        height = window.innerHeight / 1.5,
        paddingInner = 0.2,
        margin = { top: 20, bottom: 40, left: 40, right: 40 };

    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.Complaints)])
        .range([width - margin.left, margin.right]);

    const yScale = d3
        .scaleBand()
        .domain(data.map(d => d.Borough))
        .range([height - margin.top, margin.bottom])
        .paddingInner(paddingInner);
    
    const colorScale = d3
        .scaleOrdinal(d3.schemeTableau10)
        .domain(data.map(d => d.Borough));

    const yAxis = d3.axisLeft(yScale).ticks(data.length);

    const svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const rect = svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", 0, d => xScale(d.Complaints))
        .attr("y", d => yScale(d.Borough))
        .attr("height", yScale.bandwidth())
        .attr("width", d => width - margin.left - xScale(d.Complaints))
        .attr("transform", `translate(130, ${height - margin.bottom, margin.top})`)
        .attr("fill", d => colorScale(d.Borough));

    const text = svg
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("class", "label")
        .attr("y", d => yScale(d.Borough) + yScale.bandwidth())
        .attr("x", 0, d => xScale(d.Complaints))
        .text(d => d.Complaints)
        .attr("dx","160");

    svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(120, ${height - margin.bottom, margin.top})`)
        .call(yAxis)
        .style("text-anchor", "left")
        .text(d.Borough);
});

d3.select("body")
  .append("div")
  .attr("class", "source");
d3.select(".source")
  .append("a")
  .attr("href", "https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9/data")
  .text("Source: 311 Service Requests from 2010 to Present");