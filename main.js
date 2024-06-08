import "./style.css";
import * as d3 from "d3";

const width = 950;
const height = 560;
const margin = { top: 60, right: 20, bottom: 80, left: 70 };

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((res) => res.json())
  .then((data) => {
    const gdpData = data.data.map((d) => [new Date(d[0]), d[1]]);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .attr("width", "40px")
      .attr("height", "20px")
      .style("position", "absolute")
      .style("display", "none")
      .style("background-color", "rgba(255, 255, 255, 0.8)")
      .style("color", "black")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("box-shadow", "2px 2px 5px black")
      .style("text-align", "center");

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(gdpData, (d) => d[0]))
      .range([margin.left, width - margin.left]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(gdpData, (d) => d[1])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg
      .append("text")
      .attr("id", "title")
      .attr("x", width / 2)
      .attr("y", 60)
      .attr("text-anchor", "middle")
      .style("font-size", "36px")
      .style("fill", "black")
      .text("United States GDP");

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    svg
      .append("g")
      .selectAll("rect")
      .data(gdpData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d[0]))
      .attr("y", (d) => yScale(d[1]))
      .attr("data-date", (d, i) => d[0].toISOString().split("T")[0])
      .attr("data-gdp", (d, i) => d[1])
      .attr("width", (width - margin.left - margin.right) / gdpData.length - 1)
      .attr("height", (d) => height - margin.bottom - yScale(d[1]))
      .attr("fill", "brown")
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).style("fill", "white");
        tooltip
          .style("display", "block")
          .html(
            `${d[0].toISOString().split("-")[0]} ${
              d[0].toISOString().split("-")[1] === "01"
                ? "Q1"
                : d[0].toISOString().split("-")[1] === "04"
                ? "Q2"
                : d[0].toISOString().split("-")[1] === "07"
                ? "Q3"
                : "Q4"
            }<br/>$${d[1]} Billion`
          )
          .attr('data-date', d[0].toISOString().split("T")[0])
          .style("left", `${event.pageX + 20}px`)
          .style("bottom", "250px");
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).style("fill", "brown");
        tooltip.style("display", "none");
      });

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 30)
      .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
      .style("font-size", "15px");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 90)
      .text("Gross Domestic Product")
      .style("font-size", "16px");
  })
  .catch((err) => console.error("Error fetching data", err));
