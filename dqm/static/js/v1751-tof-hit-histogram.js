$(document).ready(function() {

  var margin = {top: 20, right: 80, bottom: 50, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

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
      .x(function(d) { return x(d.bin); })
      .y(function(d) { return y(d.counts); });

  var svg = d3.select("#v1751-tof-hit-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json($SCRIPT_ROOT + '/json?q=v1751-tof-hit-histogram', function(json) {

    var data = json.data;

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "bin"; }));

    var devices = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {bin: d.bin, counts: +d[name]};
        })
      };
    });

    x.domain(d3.extent(data, function(d) { return d.bin; }));

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
        .attr("x", width - 25 - 45)
        .attr("y", function(d, i) { return i * 20; })
        //.attr("x", function(d, i) { return i * 80; })
        //.attr("x", function(d, i) { return i * (width/2/4); })
        //.attr("y", height + (margin.bottom/2) + 5)
        .attr("width", 10)
        .attr("height", 10)
        .attr("class", "legend rect")
        .style("fill", function(d) { 
            return color(d.name);
        });

    legend.append("text")
        .attr("x", width - 8 - 45)
        .attr("y", function(d, i) { return (i * 20) + 9;})
        //.attr("x", function(d, i) { return i * 80 + 15; })
        //.attr("x", function(d, i) { return i * (width/2/4) + 15; })
        //.attr("y", height + (margin.bottom/2) + 15)
        .attr("class", "legend text")
        .text(function(d) { return d.name; });

    legend.append("rect")
        .attr("x", width - 25 - 45)
        .attr("y", function(d, i) { return i * 20;})
        //.attr("x", function(d, i) { return i * 80; })
        //.attr("x", function(d, i) { return i * (width/2/4); })
        //.attr("y", height + (margin.bottom/2) + 5)
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
        .attr("y", 40)
        .attr("text-anchor", "end")
        //.style("font-size", "10px")
        .html("Sample number; &nbsp;&nbsp;&nbsp; 1 ns/sample; &nbsp;&nbsp;&nbsp; 14.336 &mu;s total");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of hits per sample");

    var device = svg.selectAll(".device")
        .data(devices)
      .enter().append("g")
        .attr("class", "device");

    device.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .attr("id", function(d) { return "line-" + d.name.replace(/\s+/g, ""); } )
        .style("opacity", 0.5)
        .style("stroke-width", "1px")
        .style("stroke", function(d) { return color(d.name); });

  });

  function update() {
    d3.json($SCRIPT_ROOT + '/json?q=v1751-tof-hit-histogram', function(json) {

      var data = json.data;

      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "bin"; }));

      var devices = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return {bin: d.bin, counts: +d[name]};
          })
        };
      });

      x.domain(d3.extent(data, function(d) { return d.bin; }));

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

    selection.select("path.line")
        .transition().duration(1000)
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); });

    });
  }

  var binout;
  function loadNext() {
      update();
      binout = setTimeout(loadNext, 15000);
  }

  $.getJSON($SCRIPT_ROOT + '/json?q=selected-run-spill', function(data) {
      if (data.selected_run == data.latest_run && data.selected_spill == "All") {
          setTimeout(loadNext, 15000);
      }
  });

});
