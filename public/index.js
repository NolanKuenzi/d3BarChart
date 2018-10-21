"use strict";

getGDP();
function getGDP() {
  var req = new XMLHttpRequest();
  req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
  req.send();
  req.onload = function () {
    var json = JSON.parse(req.responseText);

    var data = json.data.map(function (data) {
      return data;
    });

    var width = 900;
    var height = 600;

    var svg = d3.select("svg").attr("id", "svg").attr("width", width).attr("height", height);

    var margin = { top: 85, right: 100, bottom: 90, left: 90 };
    var viewWidth = +svg.attr("width") - margin.left - margin.right;
    var viewHeight = +svg.attr("height") - margin.top - margin.bottom;

    var xAxisScale = d3.scaleLinear().domain([d3.min(data, function (d) {
      return d[0].slice(0, 4);
    }), d3.max(data, function (d) {
      return d[0].slice(0, 4);
    })]).range([0, viewWidth]);

    var yAxisScale = d3.scaleLinear().domain([d3.min(data, function (d) {
      return d[1];
    }), d3.max(data, function (d) {
      return d[1];
    })]).range([viewHeight, 0]);

    var xAxisCall = d3.axisBottom(xAxisScale).tickFormat(d3.format("d"));

    var yAxisCall = d3.axisLeft(yAxisScale);

    var G = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    G.append("g").attr("id", "x-axis").attr("transform", "translate(" + 0 + "," + viewHeight + ")").call(xAxisCall);

    G.append("g").attr("id", "y-axis").style("color", "purple").call(yAxisCall);

    svg.append("text").attr("class", "y-label").attr("text-anchor", "end").attr("y", 110).attr("x", -120).attr("transform", "rotate(-90)").text("Gross Domestic Product");

    var ticks = d3.selectAll("tick, text");
    ticks.attr("class", "tick");
    ticks.style("fill", "purple");

    var toolTip = d3.select("body").append("div").attr("id", "toolTip");

    var bars = d3.select("svg").append("g").selectAll("rect").data(data).enter().append("rect").attr("class", "bar").attr("data-date", function (d) {
      return d[0];
    }).attr("data-gdp", function (d) {
      return d[1];
    }).attr("x", function (d, i) {
      return i * viewWidth / data.length + 90;
    }).attr("y", function (d) {
      return yAxisScale(d[1]) + margin.top - 5;
    }).attr("height", function (d, i) {
      return 430 - yAxisScale(d[1]);
    }).attr("width", viewWidth / data.length).style("fill", "purple").on("mouseover", function (d) {
      var quater = void 0;
      if (d[0][6] === "1") {
        quater = "Q1";
      } else if (d[0][6] === "4") {
        quater = "Q2";
      } else if (d[0][6] === "7") {
        quater = "Q3";
      } else {
        quater = "Q4";
      }
      var format = d3.format(",");
      toolTip.attr("data-date", d[0]).style("left", d3.event.pageX + 3 + "px").style("top", d3.event.pageY + "px").style("display", "inline-block").html(function () {
        return d[0].slice(0, 4) + " quater:<br>$" + format(d[1]) + " Billion";
      });
      d3.select(this).style("fill", "white");
    }).on("mouseleave", function (d) {
      toolTip.style("display", "none");
      d3.select(this).style("fill", "purple");
    });
    /* For Mobile Devices */
    var clear = document.querySelector("body");
    clear.addEventListener("touchstart", function (e) {
      if (e.target.className.baseVal !== "bar") {
        var barColor = document.getElementsByClassName("bar");
        for (var i = 0; i < barColor.length; i++) {
          barColor[i].style.fill = "purple";
        }
        toolTip.style("display", "none");
      }
    });
  };
}