import React, { Component } from "react";
import * as d3 from "d3";
import "./waaromGraph.css";

class WaaromGraph extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef(props.id);
    console.log(props);
  }

  componentDidMount() {
    console.log(this.props.userLevel * 420);
    // Width, height and margin of D3 chart
    const w = 420;
    const h = 200;
    const margin = { top: 0, right: 10, bottom: 20, left: 20 };

    // We can set different states & update based on states
    let chartState = {
      measure: "difficulty",
      scale: "scaleLinear",
      legend: "Niveau",
    };

    //Set colos based on certain feature
    let colors = d3.scaleOrdinal().domain([1, 0]).range(["#E0BB76", "#8A76A8"]);

    d3.select("#recommendedColor").style("color", colors(1));
    d3.select("#notRecommendedColor").style("color", colors(0));

    // Setting width & height of D3 graph
    let accessToRef = d3
      .select(this.myRef.current)
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // Create tooltip div and make it invisible
    let tooltip = d3
      .select(this.myRef.current)
      .append("div")
      .attr("class", "tooltip");

    let userLevelSvg = d3
      .select(this.myRef.current)
      .append("div")
      .attr("class", "userLevelSvg");

    // Create line that connects node and point on X axis
    let xLine = accessToRef
      .append("line")
      .attr("stroke", "rgb(96,125,139)")
      .attr("stroke-dasharray", "1,2");

    let userSkillLevel = this.props.userLevel * 420;

    let levelName = this.props.levelName;
    console.log(levelName);

    let userLevelsSvgLeft = 0;
    if (Number(userSkillLevel) > w - 150 + margin.right / 2) {
      userLevelsSvgLeft =
        Number(userSkillLevel) - 150 - margin.right / 2 - 4 - 4;
    } else {
      userLevelsSvgLeft = Number(userSkillLevel) + margin.right / 2;
    }

    userLevelSvg
      .html(`<i class="fas fa-user-alt"></i><p> ${levelName}  </p>`)
      .style("position", "relative")
      .style("left", userLevelsSvgLeft + "px")
      .style("top", -h + margin.bottom + 20 + "px");

    // Show tooltip when hovering over circle (data for respective country)
    d3.selectAll(".exercise-circle")
      .on("mousemove", function (d) {
        tooltip
          .html(
            "<div class=tooltip-style>" +
              "<h3>Oefening 10</h3>" +
              //"<iframe src=https://wezoozacademy.h5p.com/content/1291038566660684527/embed height=200 width=300 title=Iframe Example id=myFrame>" +
              //"</iframe>" +
              "<div class=niveau-container>" +
              "<h3>Niveau</h3>" +
              "<p>Moeilijk</p>" +
              "</div>" +
              "</div>"
          )
          .style("position", "absolute")
          .style("top", d.pageY - 100 + "px")
          .style("left", d.pageX + 20 + "px")
          .style("opacity", 1);

        xLine
          .attr("x1", accessToRef.select("circle").attr("cx"))
          .attr("y1", accessToRef.select("circle").attr("cy"))
          .attr("y2", h - margin.bottom)
          .attr("x2", accessToRef.select("circle").attr("cx"))
          .attr("opacity", 1);
      })
      .on("mouseout", function (_) {
        tooltip.style("opacity", 0);
        xLine.attr("opacity", 0);
      });

    accessToRef
      .append("line")
      .attr("class", "level-line")
      .attr("x1", Number(userSkillLevel) + margin.right / 2 - 2) // -2 because of strokewidth
      .attr("y1", 2)
      .attr("y2", h - margin.bottom)
      .attr("x2", Number(userSkillLevel) + margin.right / 2 - 2)
      .attr("opacity", 1);

    // Set the xScale based on data feature, here chartState.measure which is "total" feature
    let xScale = d3.scaleLinear().range([margin.left, w - margin.right]);
    xScale.domain([0, 1]);

    //g element is used for setting X axis and its ticks
    accessToRef
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (h - margin.bottom) + ")");

    // Set X axis based on new scale. If chart is set to "per capita" use numbers with one decimal point
    let xAxis;
    xAxis = d3
      .axisBottom(xScale)
      .ticks(10, ".1s")
      .tickSizeInner([-5])
      .tickSizeOuter([0]);

    accessToRef
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead-right")
      .attr("refX", 5)
      .attr("refY", 5)
      .attr("markerWidth", 16)
      .attr("markerHeight", 13)
      .append("path")
      .attr("d", "M 0 0 L 5 5 L 0 10")
      .attr("stroke", "#D4D4D4")
      .attr("stroke-width", 1)
      .attr("fill", "none");

    accessToRef.select(".x-axis").transition().duration(1000).call(xAxis);

    accessToRef
      .select(".x-axis path.domain")
      .attr("marker-end", "url(#arrowhead-right)");

    // Simulation, moving nodes along desired X and Y positions
    let simulation = d3
      .forceSimulation(this.props.data)
      .force(
        "x",
        d3
          .forceX(function (d) {
            return xScale(+d[chartState.measure]);
          })
          .strength(2)
      )
      .force("y", d3.forceY(h / 2 - margin.bottom / 2))
      .force("collide", d3.forceCollide(9))
      .stop();

    // Manually run simulation
    for (let i = 0; i < this.props.data.length; ++i) {
      simulation.tick(10);
    }

    // Query all nodes & join country names
    let countriesCircles = accessToRef
      .selectAll(".exercise")
      .data(this.props.data, function (d) {
        return d.exercise;
      });

    // deal with situation where nodes are removed
    countriesCircles
      .exit()
      .transition()
      .duration(1000)
      .attr("cx", 0)
      .attr("cy", h / 2 - margin.bottom / 2)
      .remove();

    // Deal with situation where nodes are added
    countriesCircles
      .enter()
      .append("circle")
      .attr("class", "exercise-circle") // exercise was name
      .attr("cx", 0)
      .attr("cy", h / 2 - margin.bottom / 2)
      .attr("r", 6)
      .attr("fill", function (d) {
        return colors(d.recommended);
      })
      .merge(countriesCircles)
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  }

  render() {
    return (
      <div className="waarom-container">
        <div className="waarom-text-container">
          <h3>{this.props.name}</h3>
          <p>{this.props.deel}</p>
        </div>
        <div className="waarom-graph-cont">
          <div ref={this.myRef}></div>
          <div className="waarom-labels">
            <p>Gemakkelijk</p>
            <p>Moeilijk</p>
          </div>
        </div>
      </div>
    );
  }
}

export default WaaromGraph;
