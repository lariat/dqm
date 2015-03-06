(function() {

  var json_url = "/json?q=mwpc-tdc-histograms";

  // Set the dimensions of the canvas / graph
  var margin = {top: 10, right: 70, bottom: 35, left: 70},
      width = 300 - margin.left - margin.right,
      height = 175 - margin.top - margin.bottom;

  // Set the title position
  var x_title = 6 * width/7,
      y_title = 15;

  // Set histogram binning
  var min_bin = 0,
      max_bin = 320,
      bin_step = 1;

  var bin_width = 1;

  //var bin_array = [];
  //for (var i = min_bin; i <= max_bin + bin_step; i += bin_step) {
  //  bin_array.push(i);
  //}

  //var bin_ticks = [];
  //for (var i = min_bin; i <= max_bin + bin_step; i += bin_step) {
  //  bin_ticks.push(i);
  //}

  //var bin_width = parseFloat(width / (bin_array.length - 1)) - 1;

  // Set the ranges
  var x_tdc_01 = d3.scale.linear().range([0, width]);
  var y_tdc_01 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_01 = d3.svg.axis().scale(x_tdc_01).orient("bottom");
  var y_axis_tdc_01 = d3.svg.axis().scale(y_tdc_01).orient("left");

  var svg_tdc_01 = d3.select("#mwpc-tdc-01-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_01 = svg_tdc_01.selectAll(".bar");

  svg_tdc_01.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 01");

  d3.json(json_url, function(json) {

    var bins_tdc_01 = json.tdc01data.map(function (d) { return +d.bin; })
    var counts_tdc_01 = json.tdc01data.map(function (d) { return +d.count; })
    var data_tdc_01 = [];

    for (var bin in bins_tdc_01) {
      data_tdc_01.push({"x": bins_tdc_01[bin], "y": counts_tdc_01[bin]});
    }

    // Scale the range of the data
    x_tdc_01.domain([min_bin, max_bin + bin_step]);
    y_tdc_01.domain([0, d3.max(data_tdc_01, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_01 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TOF: " + d.x + " ns <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_01.call(tip_tdc_01);

    // Add the bars
    bar_tdc_01.data(data_tdc_01)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_01(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_01(d.y); })
        .attr("height", function(d) { return height - y_tdc_01(d.y); })
        .on('mouseover', tip_tdc_01.show)
        .on('mouseout', tip_tdc_01.hide);

    // Add the x-axis
    svg_tdc_01.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_01)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC count");

    // Add the y-axis
    svg_tdc_01.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_01)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC count");

  })

  function update() {

    // Get the data again
    d3.json(json_url, function(json) {

      var bins_tdc_01 = json.tdc01data.map(function (d) { return +d.bin; })
      var counts_tdc_01 = json.tdc01data.map(function (d) { return +d.count; })
      var data_tdc_01 = [];

      for (var bin in bins_tdc_01) {
        data_tdc_01.push({"x": bins_tdc_01[bin], "y": counts_tdc_01[bin]});
      }

      // Scale the range of the data again 
      x_tdc_01.domain([min_bin, max_bin + bin_step]);
      y_tdc_01.domain([0, d3.max(data_tdc_01, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_01 = svg_tdc_01.selectAll(".bar")
           .data(data_tdc_01);

      // new data:
      selection_tdc_01.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_01(d.y); });
      // removed data:
      selection_tdc_01.exit().remove();
      // updated data:
      selection_tdc_01
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_01(d.y); })
          .attr("height", function(d) { return height - y_tdc_01(d.y); });

      // change the x-axis
      svg_tdc_01.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_01);

      // change the y-axis
      svg_tdc_01.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_01);

    });
  }

  var timeout;
  function load_next() {
    update();
    timeout = setTimeout(load_next, 15000);
  }

  load_next();

}) ();
