import React, { Component } from "react";
import * as d3 from "d3";
import "./whatifGraph.css";

class WhatifGraph extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    // Width, height and margin of D3 chart
    const w = 420;
    const h = 200;
    const margin = { top: 0, right: 10, bottom: 20, left: 20 };

    // Setting width & height of D3 graph
    let accessToRef = d3
      .select(this.myRef.current)
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    let userLevelSvg = d3
      .select(this.myRef.current)
      .append("div")
      .attr("class", "userLevelSvgWhatif");

    let updatedUserLevelSvg = d3
      .select(this.myRef.current)
      .append("div")
      .attr("class", "updatedUserLevelSvg");

    // Create line that connects node and point on X axis
    let xLine = accessToRef
      .append("line")
      .attr("stroke", "rgb(96,125,139)")
      .attr("stroke-dasharray", "1,2");

    let userSkillLevel = this.props.userLevel * 420;
    let updatedUserSkillLevel = this.props.updatedUserLevel * 420;

    let levelName = this.props.levelName;
    console.log(levelName);

    let userLevelsSvgLeft = 0;
    if (Number(userSkillLevel) > w - 150 + margin.right / 2) {
      userLevelsSvgLeft =
        Number(userSkillLevel) - 150 - margin.right / 2 - 4 - 2;
    } else {
      userLevelsSvgLeft = Number(userSkillLevel) + margin.right / 2;
    }

    userLevelSvg
      .html(`<i class="fas fa-user-alt"></i><p> ${levelName}  </p>`)
      .style("position", "relative")
      .style("left", userLevelsSvgLeft + "px")
      .style("top", -h + margin.bottom + 20 + "px");

    accessToRef
      .append("line")
      .attr("class", "level-line-whatif")
      .attr("x1", Number(userSkillLevel) + margin.right / 2 - 2) // -2 because of strokewidth
      .attr("y1", 2)
      .attr("y2", h - margin.bottom)
      .attr("x2", Number(userSkillLevel) + margin.right / 2 - 2)
      .attr("opacity", 1);

    let updatedUserLevelsSvgLeft = 0;
    if (Number(updatedUserSkillLevel) > w - 150 + margin.right / 2) {
      updatedUserLevelsSvgLeft =
        Number(updatedUserSkillLevel) - 150 - margin.right / 2 - 4 - 2;
    } else {
      updatedUserLevelsSvgLeft =
        Number(updatedUserSkillLevel) + margin.right / 2;
    }

    updatedUserLevelSvg
      .html(`<i class="fas fa-user-alt"></i><p> ${levelName}  </p>`)
      .style("position", "relative")
      .style("left", updatedUserLevelsSvgLeft + "px")
      .style("top", -h + margin.bottom + 20 + "px");

    accessToRef
      .append("line")
      .attr("class", "level-line-updated")
      .attr("x1", Number(updatedUserSkillLevel) + margin.right / 2 - 2) // -2 because of strokewidth
      .attr("y1", 2)
      .attr("y2", h - margin.bottom)
      .attr("x2", Number(updatedUserSkillLevel) + margin.right / 2 - 2)
      .attr("opacity", 1);

    accessToRef
      .append("line")
      .attr("class", "progressArrow")
      .attr("x1", Number(userSkillLevel) + margin.right / 2 - 10) // -2 because of strokewidth
      .attr("y1", h - margin.bottom + 10)
      .attr("y2", h - margin.bottom + 10)
      .attr("x2", Number(updatedUserSkillLevel) + margin.right / 2 - 2)
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
            <p>Hoog niveau</p>
            <p>Laag niveau</p>
          </div>
        </div>
      </div>
    );
  }
}

export default WhatifGraph;
