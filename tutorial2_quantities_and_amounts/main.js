d3.csv("../tutorial2_quantities_and_amounts/311 Data - Air Quality.csv", d3.autoType).then(data => {
    console.log(data);

    const width = window.innerWidth * 0.9,
        height = window.innerHeight / 1.5,
        paddingInner = 0.2,
        margin = { top: 20, bottom: 40, left: 40, right: 40 };

    const xScale = d3
        .scaleBand()
        .domain(data.map(d => d.Borough))
        .range([margin.left, width - margin.right])
        .paddingInner(paddingInner);

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.Complaints)])
        .range([height - margin.bottom, margin.top]);
    
    const colorScale = d3
        .scaleOrdinal(d3.schemeTableau10)
        .domain(data.map(d => d.Borough));

    const xAxis = d3.axisBottom(xScale).ticks(data.length);

    const svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const rect = svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("y", d => yScale(d.Complaints))
        .attr("x", d => xScale(d.Borough))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom - yScale(d.Complaints))
        .attr("fill", d => colorScale(d.Borough));

    const text = svg
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("class", "label")
        .attr("x", d => xScale(d.Borough) + (xScale.bandwidth() / 2))
        .attr("y", d => yScale(d.Complaints))
        .text(d => d.Complaints)
        .attr("dy", "1.25em");

    svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis);
});

d3.select("body")
  .append("div")
  .attr("class", "source");
d3.select(".source")
  .append("a")
  .attr("href", "https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9/data")
  .text("Source: 311 Service Requests from 2010 to Present");