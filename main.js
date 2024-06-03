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
    const economicData = data.data;
    const parsedData = economicData.map((d) => ({
      date: new Date(d[0]),
      value: d[1],
    }));

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.date))
      .range([margin.left, width - margin.left]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, (d) => d.value)])
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
      .data(parsedData)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.date))
      .attr("y", (d) => yScale(d.value))
      .attr(
        "width",
        (width - margin.left - margin.right) / parsedData.length - 1
      )
      .attr("height", (d) => height - margin.bottom - yScale(d.value))
      .attr("fill", "skyblue")
      .on("mouseover", (e, d) => d3.select(this).attr("fill", "orange"))
      .on("mouseout", (e, d) => d3.select(this).attr("fill", "skyblue"));

    svg
      .append("text")
      .attr("class", "x label")
      .attr("x", width / 2)
      .attr("y", height - 30)
      .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
      .style("font-size", "15px");

    svg
      .append("text")
      .attr("class", "y label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 90)
      .text("Gross Domestic Product")
      .style("font-size", "16px");
  })
  .catch((err) => console.error("Error fetching data", err));
