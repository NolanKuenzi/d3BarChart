d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then(function(response) {
  const data = response.data.map(d => d);
  const width = 900;
  const height = 600;

  const svg = d3.select("svg")
                .attr("id", "svg")
                .attr("width", width)
                .attr("height", height);

  const margin = {top: 85, right: 100, bottom: 90, left: 90};
  const viewWidth = +svg.attr("width") - margin.left - margin.right;
  const viewHeight = +svg.attr("height") - margin.top - margin.bottom;

  const xAxisScale = d3.scaleLinear()
                       .domain([d3.min(data, d => d[0].slice(0, 4)), d3.max(data, d => d[0].slice(0, 4))])
                       .range([0, viewWidth]); 

  const yAxisScale = d3.scaleLinear()
                       .domain([d3.min(data, d => d[1]), d3.max(data, d => d[1])])
                       .range([viewHeight, 0]);

  const xAxisCall = d3.axisBottom(xAxisScale)                 
                      .tickFormat(d3.format("d")); 
                                
  const yAxisCall = d3.axisLeft(yAxisScale);

  const G  =  svg.append("g")
                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
               
  G.append("g")
   .attr("id", "x-axis")
   .attr("transform", "translate(" + 0 + "," + viewHeight + ")")
   .call(xAxisCall);

  G.append("g")
   .attr("id", "y-axis")
   .style("color", "purple")
   .call(yAxisCall);                 

  svg.append("text")
     .attr("class", "y-label")
     .attr("text-anchor", "end")
     .attr("y", 110)
     .attr("x", -120)
     .attr("transform", "rotate(-90)")
     .text("Gross Domestic Product");

  const ticks = d3.selectAll("tick, text")
             ticks.attr("class", "tick")
             ticks.style("fill", "purple");

  const toolTip = d3.select("body")
                    .append("div")
                    .attr("id", "toolTip");

  const bars = d3.select("svg").append("g")
                 .selectAll("rect")
                 .data(data)
                 .enter()
                 .append("rect")
                 .attr("class", "bar")
                 .attr("data-date", d => d[0])
                 .attr("data-gdp", d => d[1])
                 .attr("x", (d, i) => ((i * viewWidth) / data.length) + 90)
                 .attr("y", d => yAxisScale(d[1]) + margin.top - 5)
                 .attr("height", (d, i) => 430 - yAxisScale(d[1]))
                 .attr("width", viewWidth / data.length)
                 .style("fill", "purple")
                 .on("mouseover", function(d) {
                 let quater
                   if (d[0][6] === "1") {
                    quater = "Q1";
                   } else if (d[0][6] === "4") {
                    quater = "Q2";
                   } else if (d[0][6] === "7") {
                    quater = "Q3";
                   } else {
                    quater = "Q4";
                   }
                 const format = d3.format(",");
                   toolTip
                     .attr("data-date", d[0])
                     .style("left", d3.event.pageX + 3 + "px")
                     .style("top", d3.event.pageY + "px")
                     .style("display", "inline-block")
                     .html(() => `${d[0].slice(0, 4)} quater:<br>$${format(d[1])} Billion`);
                   d3.select(this)
                     .style("fill", "white")
                 })   
                 .on("mouseleave", function(d) {
                   toolTip
                     .style("display", "none");  
                   d3.select(this)
                     .style("fill", "purple");
                 });

}).catch(function(error) {
  alert("Data failed to load, please try again.");
});

/* For Mobile Devices */
const clear = document.getElementById("body");
clear.addEventListener("touchstart", function(e) {
  if (e.target.className.baseVal !== "bar") {
    const barColor = document.getElementsByClassName("bar");
    const toolT = document.getElementById("toolTip"); 
      for (let i = 0; i < barColor.length; i++) {
        barColor[i].style.fill = "purple";
      }
    toolT.style.display = "none";
  } 
}); 