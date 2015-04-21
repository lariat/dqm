$(document).ready(function() {

  var margin = {top: 20, right: 80, bottom: 50, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  //var toggle = function (d) {
  //    // determine if current line is visible 
  //    var active = d.active ? false : true,
  //        line_opacity = active ? 0 : 0.5;
  //        legend_opacity = active ? 0.5 : 1;
  //    // hide or show the elements based on the id
  //    d3.select("#line-" + d.name.replace(/\s+/g, ""))
  //        .transition().duration(100)
  //        .style("opacity", line_opacity);
  //    d3.select("#legend-" + d.name.replace(/\s+/g, ""))
  //        .transition().duration(100)
  //        .style("opacity", legend_opacity);
  //    // update whether or not the elements are active
  //    d.active = active;
  //}

  var mouseover = function (d) {
      var name = d.name;
      d3.selectAll("path.line, .legend.rect, .legend.text")
          .transition().duration(500)
          .style("opacity", function(d) {
              return d.name == name ? 1 : 0.1;
          });
  }

  var mouseout = function (d) {
      d3.selectAll("path.line")
          .transition().duration(500)
          .style("opacity", 0.5);
      d3.selectAll(".legend.rect, .legend.text")
          .transition().duration(500)
          .style("opacity", 1);
  }

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      //.interpolate("linear")
      //.interpolate("basis")
      //.interpolate("monotone")
      .x(function(d) { return x(d.time); })
      .y(function(d) { return y(d.counts); });

  //var area = d3.svg.area()
  //    .interpolate("basis")
  //    .x(function(d) { return x(d.time); })
  //    .y0(height)
  //    .y1(function(d) { return y(d.counts); });

  var svg = d3.select("#data-block-time-stamps").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json($SCRIPT_ROOT + '/json?q=data-block-time-stamps', function(json) {

    var data = json.data;

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "time"; }));

    var devices = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {time: d.time, counts: +d[name]};
        })
      };
    });

    x.domain(d3.extent(data, function(d) { return d.time; }));

    y.domain([
      d3.min(devices, function(c) { return d3.min(c.values, function(v) { return v.counts; }); }),
      d3.max(devices, function(c) { return d3.max(c.values, function(v) { return v.counts; }); })
    ]);

    var legend = svg.selectAll("legend")
        .data(devices)
        .enter()
      .append("g")
        .attr("cursor", "pointer")
        //.on("click", toggle)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .attr("id", function(d) { return "legend-" + d.name.replace(/\s+/g, ""); } )
        .attr("class", "legend");

    legend.append("rect")
        //.attr("x", width - 25 - 45)
        //.attr("y", function(d, i) { return i * 20; })
        //.attr("x", function(d, i) { return i * 80; })
        .attr("x", function(d, i) { return i * (width/2/4); })
        .attr("y", height + (margin.bottom/2) + 5)
        .attr("width", 10)
        .attr("height", 10)
        .attr("class", "legend rect")
        .style("fill", function(d) { 
            return color(d.name);
        });

    legend.append("text")
        //.attr("x", width - 8 - 45)
        //.attr("y", function(d, i) { return (i * 20) + 9;})
        //.attr("x", function(d, i) { return i * 80 + 15; })
        .attr("x", function(d, i) { return i * (width/2/4) + 15; })
        .attr("y", height + (margin.bottom/2) + 15)
        .attr("class", "legend text")
        .text(function(d) { return d.name; });

    legend.append("rect")
        //.attr("x", width - 25 - 45)
        //.attr("y", function(d, i) { return i * 20;})
        //.attr("x", function(d, i) { return i * 80; })
        .attr("x", function(d, i) { return i * (width/2/4); })
        .attr("y", height + (margin.bottom/2) + 5)
        .style("fill", "#000")
        .style("fill-opacity", 0)
        .attr("width", 70)
        .attr("height", 10);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        //.attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        //.style("font-size", "10px")
        .text("Time stamp [s]");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of data blocks per 0.1 s");

    var device = svg.selectAll(".device")
        .data(devices)
      .enter().append("g")
        .attr("class", "device");

    //device.append("path")
    //    .attr("class", "area")
    //    //.attr("id", function(d) { return "area-" + d.name.replace(/\s+/g, ""); } )
    //    .attr("d", function(d) { return area(d.values); })
    //    .style("fill", function(d) { return color(d.name); });

    device.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        //.style("stroke-dasharray", ("3, 3"))
        .attr("id", function(d) { return "line-" + d.name.replace(/\s+/g, ""); } )
        .style("opacity", 0.5)
        .style("stroke", function(d) { return color(d.name); });

  });

  function update() {
    d3.json($SCRIPT_ROOT + '/json?q=data-block-time-stamps', function(json) {

      var data = json.data;

      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "time"; }));

      var devices = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return {time: d.time, counts: +d[name]};
          })
        };
      });

      x.domain(d3.extent(data, function(d) { return d.time; }));

      y.domain([
        d3.min(devices, function(c) { return d3.min(c.values, function(v) { return v.counts; }); }),
        d3.max(devices, function(c) { return d3.max(c.values, function(v) { return v.counts; }); })
      ]);

    svg.select(".y.axis")
        .transition()
        .duration(1000)
        .ease("linear")
        .call(yAxis);

    var selection = svg.selectAll(".device")
        .data(devices);

    //selection.enter().append("g")
    //    .attr("class", "device");

    selection.select("path.line")
        .transition().duration(1000)
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); });

    selection.exit.remove();

    });
  }

  var timeout;
  function loadNext() {
      update();
      timeout = setTimeout(loadNext, 15000);
  }

  $.getJSON($SCRIPT_ROOT + '/json?q=selected-run-spill', function(data) {
      if (data.selected_run == data.latest_run && data.selected_spill == "All") {
          setTimeout(loadNext, 15000);
      }
  });

});
