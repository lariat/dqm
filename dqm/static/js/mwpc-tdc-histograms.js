(function() {

  var json_url = $SCRIPT_ROOT + "/json?q=mwpc-tdc-histograms";

  // Set the dimensions of the canvas / graph
  var margin = {top: 10, right: 20, bottom: 35, left: 60},
      width = 270 - margin.left - margin.right,
      height = 175 - margin.top - margin.bottom;

  // Set the title position
  var x_title = 6 * width/7,
      y_title = 15;

  // Set histogram binning
  var min_bin = 200,
      max_bin = 520,
      bin_step = 1;

  var bin_width = 1;

  var bin_array = [];
  for (var i = min_bin; i <= max_bin + bin_step; i += bin_step) {
    bin_array.push(i);
  }

  var bin_ticks = [];
  for (var i = min_bin; i <= max_bin + bin_step; i += bin_step) {
    bin_ticks.push(i);
  }

  //var bin_width = parseFloat(width / (bin_array.length - 1)) - 1;

  ////////////////////////////////////////////////////////////
  // TDC 01
  ////////////////////////////////////////////////////////////

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

  ////////////////////////////////////////////////////////////
  // TDC 02
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_02 = d3.scale.linear().range([0, width]);
  var y_tdc_02 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_02 = d3.svg.axis().scale(x_tdc_02).orient("bottom");
  var y_axis_tdc_02 = d3.svg.axis().scale(y_tdc_02).orient("left");

  var svg_tdc_02 = d3.select("#mwpc-tdc-02-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_02 = svg_tdc_02.selectAll(".bar");

  svg_tdc_02.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 02");

  ////////////////////////////////////////////////////////////
  // TDC 03
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_03 = d3.scale.linear().range([0, width]);
  var y_tdc_03 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_03 = d3.svg.axis().scale(x_tdc_03).orient("bottom");
  var y_axis_tdc_03 = d3.svg.axis().scale(y_tdc_03).orient("left");

  var svg_tdc_03 = d3.select("#mwpc-tdc-03-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_03 = svg_tdc_03.selectAll(".bar");

  svg_tdc_03.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 03");

  ////////////////////////////////////////////////////////////
  // TDC 04
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_04 = d3.scale.linear().range([0, width]);
  var y_tdc_04 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_04 = d3.svg.axis().scale(x_tdc_04).orient("bottom");
  var y_axis_tdc_04 = d3.svg.axis().scale(y_tdc_04).orient("left");

  var svg_tdc_04 = d3.select("#mwpc-tdc-04-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_04 = svg_tdc_04.selectAll(".bar");

  svg_tdc_04.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 04");

  ////////////////////////////////////////////////////////////
  // TDC 05
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_05 = d3.scale.linear().range([0, width]);
  var y_tdc_05 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_05 = d3.svg.axis().scale(x_tdc_05).orient("bottom");
  var y_axis_tdc_05 = d3.svg.axis().scale(y_tdc_05).orient("left");

  var svg_tdc_05 = d3.select("#mwpc-tdc-05-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_05 = svg_tdc_05.selectAll(".bar");

  svg_tdc_05.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 05");

  ////////////////////////////////////////////////////////////
  // TDC 06
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_06 = d3.scale.linear().range([0, width]);
  var y_tdc_06 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_06 = d3.svg.axis().scale(x_tdc_06).orient("bottom");
  var y_axis_tdc_06 = d3.svg.axis().scale(y_tdc_06).orient("left");

  var svg_tdc_06 = d3.select("#mwpc-tdc-06-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_06 = svg_tdc_06.selectAll(".bar");

  svg_tdc_06.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 06");

  ////////////////////////////////////////////////////////////
  // TDC 07
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_07 = d3.scale.linear().range([0, width]);
  var y_tdc_07 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_07 = d3.svg.axis().scale(x_tdc_07).orient("bottom");
  var y_axis_tdc_07 = d3.svg.axis().scale(y_tdc_07).orient("left");

  var svg_tdc_07 = d3.select("#mwpc-tdc-07-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_07 = svg_tdc_07.selectAll(".bar");

  svg_tdc_07.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 07");

  ////////////////////////////////////////////////////////////
  // TDC 08
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_08 = d3.scale.linear().range([0, width]);
  var y_tdc_08 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_08 = d3.svg.axis().scale(x_tdc_08).orient("bottom");
  var y_axis_tdc_08 = d3.svg.axis().scale(y_tdc_08).orient("left");

  var svg_tdc_08 = d3.select("#mwpc-tdc-08-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_08 = svg_tdc_08.selectAll(".bar");

  svg_tdc_08.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 08");

  ////////////////////////////////////////////////////////////
  // TDC 09
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_09 = d3.scale.linear().range([0, width]);
  var y_tdc_09 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_09 = d3.svg.axis().scale(x_tdc_09).orient("bottom");
  var y_axis_tdc_09 = d3.svg.axis().scale(y_tdc_09).orient("left");

  var svg_tdc_09 = d3.select("#mwpc-tdc-09-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_09 = svg_tdc_09.selectAll(".bar");

  svg_tdc_09.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 09");

  ////////////////////////////////////////////////////////////
  // TDC 10
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_10 = d3.scale.linear().range([0, width]);
  var y_tdc_10 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_10 = d3.svg.axis().scale(x_tdc_10).orient("bottom");
  var y_axis_tdc_10 = d3.svg.axis().scale(y_tdc_10).orient("left");

  var svg_tdc_10 = d3.select("#mwpc-tdc-10-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_10 = svg_tdc_10.selectAll(".bar");

  svg_tdc_10.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 10");

  ////////////////////////////////////////////////////////////
  // TDC 11
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_11 = d3.scale.linear().range([0, width]);
  var y_tdc_11 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_11 = d3.svg.axis().scale(x_tdc_11).orient("bottom");
  var y_axis_tdc_11 = d3.svg.axis().scale(y_tdc_11).orient("left");

  var svg_tdc_11 = d3.select("#mwpc-tdc-11-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_11 = svg_tdc_11.selectAll(".bar");

  svg_tdc_11.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 11");

  ////////////////////////////////////////////////////////////
  // TDC 12
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_12 = d3.scale.linear().range([0, width]);
  var y_tdc_12 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_12 = d3.svg.axis().scale(x_tdc_12).orient("bottom");
  var y_axis_tdc_12 = d3.svg.axis().scale(y_tdc_12).orient("left");

  var svg_tdc_12 = d3.select("#mwpc-tdc-12-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_12 = svg_tdc_12.selectAll(".bar");

  svg_tdc_12.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 12");

  ////////////////////////////////////////////////////////////
  // TDC 13
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_13 = d3.scale.linear().range([0, width]);
  var y_tdc_13 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_13 = d3.svg.axis().scale(x_tdc_13).orient("bottom");
  var y_axis_tdc_13 = d3.svg.axis().scale(y_tdc_13).orient("left");

  var svg_tdc_13 = d3.select("#mwpc-tdc-13-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_13 = svg_tdc_13.selectAll(".bar");

  svg_tdc_13.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 13");

  ////////////////////////////////////////////////////////////
  // TDC 14
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_14 = d3.scale.linear().range([0, width]);
  var y_tdc_14 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_14 = d3.svg.axis().scale(x_tdc_14).orient("bottom");
  var y_axis_tdc_14 = d3.svg.axis().scale(y_tdc_14).orient("left");

  var svg_tdc_14 = d3.select("#mwpc-tdc-14-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_14 = svg_tdc_14.selectAll(".bar");

  svg_tdc_14.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 14");

  ////////////////////////////////////////////////////////////
  // TDC 15
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_15 = d3.scale.linear().range([0, width]);
  var y_tdc_15 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_15 = d3.svg.axis().scale(x_tdc_15).orient("bottom");
  var y_axis_tdc_15 = d3.svg.axis().scale(y_tdc_15).orient("left");

  var svg_tdc_15 = d3.select("#mwpc-tdc-15-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_15 = svg_tdc_15.selectAll(".bar");

  svg_tdc_15.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 15");

  ////////////////////////////////////////////////////////////
  // TDC 16
  ////////////////////////////////////////////////////////////

  // Set the ranges
  var x_tdc_16 = d3.scale.linear().range([0, width]);
  var y_tdc_16 = d3.scale.linear().range([height, 0]);

  // Define the axes
  var x_axis_tdc_16 = d3.svg.axis().scale(x_tdc_16).orient("bottom");
  var y_axis_tdc_16 = d3.svg.axis().scale(y_tdc_16).orient("left");

  var svg_tdc_16 = d3.select("#mwpc-tdc-16-histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar_tdc_16 = svg_tdc_16.selectAll(".bar");

  svg_tdc_16.append("text")
      .attr("x", x_title)
      .attr("y", y_title)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("TDC 16");

  ////////////////////////////////////////////////////////////

  d3.json(json_url, function(json) {

    //////////////////////////////////////////////////////////
    // TDC 01
    //////////////////////////////////////////////////////////

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
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
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
        .text("TDC time tick");

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
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 02
    //////////////////////////////////////////////////////////

    var bins_tdc_02 = json.tdc02data.map(function (d) { return +d.bin; })
    var counts_tdc_02 = json.tdc02data.map(function (d) { return +d.count; })
    var data_tdc_02 = [];

    for (var bin in bins_tdc_02) {
      data_tdc_02.push({"x": bins_tdc_02[bin], "y": counts_tdc_02[bin]});
    }

    // Scale the range of the data
    x_tdc_02.domain([min_bin, max_bin + bin_step]);
    y_tdc_02.domain([0, d3.max(data_tdc_02, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_02 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_02.call(tip_tdc_02);

    // Add the bars
    bar_tdc_02.data(data_tdc_02)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_02(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_02(d.y); })
        .attr("height", function(d) { return height - y_tdc_02(d.y); })
        .on('mouseover', tip_tdc_02.show)
        .on('mouseout', tip_tdc_02.hide);

    // Add the x-axis
    svg_tdc_02.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_02)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_02.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_02)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 03
    //////////////////////////////////////////////////////////

    var bins_tdc_03 = json.tdc03data.map(function (d) { return +d.bin; })
    var counts_tdc_03 = json.tdc03data.map(function (d) { return +d.count; })
    var data_tdc_03 = [];

    for (var bin in bins_tdc_03) {
      data_tdc_03.push({"x": bins_tdc_03[bin], "y": counts_tdc_03[bin]});
    }

    // Scale the range of the data
    x_tdc_03.domain([min_bin, max_bin + bin_step]);
    y_tdc_03.domain([0, d3.max(data_tdc_03, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_03 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_03.call(tip_tdc_03);

    // Add the bars
    bar_tdc_03.data(data_tdc_03)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_03(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_03(d.y); })
        .attr("height", function(d) { return height - y_tdc_03(d.y); })
        .on('mouseover', tip_tdc_03.show)
        .on('mouseout', tip_tdc_03.hide);

    // Add the x-axis
    svg_tdc_03.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_03)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_03.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_03)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 04
    //////////////////////////////////////////////////////////

    var bins_tdc_04 = json.tdc04data.map(function (d) { return +d.bin; })
    var counts_tdc_04 = json.tdc04data.map(function (d) { return +d.count; })
    var data_tdc_04 = [];

    for (var bin in bins_tdc_04) {
      data_tdc_04.push({"x": bins_tdc_04[bin], "y": counts_tdc_04[bin]});
    }

    // Scale the range of the data
    x_tdc_04.domain([min_bin, max_bin + bin_step]);
    y_tdc_04.domain([0, d3.max(data_tdc_04, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_04 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_04.call(tip_tdc_04);

    // Add the bars
    bar_tdc_04.data(data_tdc_04)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_04(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_04(d.y); })
        .attr("height", function(d) { return height - y_tdc_04(d.y); })
        .on('mouseover', tip_tdc_04.show)
        .on('mouseout', tip_tdc_04.hide);

    // Add the x-axis
    svg_tdc_04.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_04)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_04.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_04)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 05
    //////////////////////////////////////////////////////////

    var bins_tdc_05 = json.tdc05data.map(function (d) { return +d.bin; })
    var counts_tdc_05 = json.tdc05data.map(function (d) { return +d.count; })
    var data_tdc_05 = [];

    for (var bin in bins_tdc_05) {
      data_tdc_05.push({"x": bins_tdc_05[bin], "y": counts_tdc_05[bin]});
    }

    // Scale the range of the data
    x_tdc_05.domain([min_bin, max_bin + bin_step]);
    y_tdc_05.domain([0, d3.max(data_tdc_05, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_05 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_05.call(tip_tdc_05);

    // Add the bars
    bar_tdc_05.data(data_tdc_05)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_05(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_05(d.y); })
        .attr("height", function(d) { return height - y_tdc_05(d.y); })
        .on('mouseover', tip_tdc_05.show)
        .on('mouseout', tip_tdc_05.hide);

    // Add the x-axis
    svg_tdc_05.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_05)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_05.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_05)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 06
    //////////////////////////////////////////////////////////

    var bins_tdc_06 = json.tdc06data.map(function (d) { return +d.bin; })
    var counts_tdc_06 = json.tdc06data.map(function (d) { return +d.count; })
    var data_tdc_06 = [];

    for (var bin in bins_tdc_06) {
      data_tdc_06.push({"x": bins_tdc_06[bin], "y": counts_tdc_06[bin]});
    }

    // Scale the range of the data
    x_tdc_06.domain([min_bin, max_bin + bin_step]);
    y_tdc_06.domain([0, d3.max(data_tdc_06, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_06 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_06.call(tip_tdc_06);

    // Add the bars
    bar_tdc_06.data(data_tdc_06)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_06(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_06(d.y); })
        .attr("height", function(d) { return height - y_tdc_06(d.y); })
        .on('mouseover', tip_tdc_06.show)
        .on('mouseout', tip_tdc_06.hide);

    // Add the x-axis
    svg_tdc_06.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_06)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_06.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_06)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 07
    //////////////////////////////////////////////////////////

    var bins_tdc_07 = json.tdc07data.map(function (d) { return +d.bin; })
    var counts_tdc_07 = json.tdc07data.map(function (d) { return +d.count; })
    var data_tdc_07 = [];

    for (var bin in bins_tdc_07) {
      data_tdc_07.push({"x": bins_tdc_07[bin], "y": counts_tdc_07[bin]});
    }

    // Scale the range of the data
    x_tdc_07.domain([min_bin, max_bin + bin_step]);
    y_tdc_07.domain([0, d3.max(data_tdc_07, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_07 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_07.call(tip_tdc_07);

    // Add the bars
    bar_tdc_07.data(data_tdc_07)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_07(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_07(d.y); })
        .attr("height", function(d) { return height - y_tdc_07(d.y); })
        .on('mouseover', tip_tdc_07.show)
        .on('mouseout', tip_tdc_07.hide);

    // Add the x-axis
    svg_tdc_07.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_07)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_07.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_07)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 08
    //////////////////////////////////////////////////////////

    var bins_tdc_08 = json.tdc08data.map(function (d) { return +d.bin; })
    var counts_tdc_08 = json.tdc08data.map(function (d) { return +d.count; })
    var data_tdc_08 = [];

    for (var bin in bins_tdc_08) {
      data_tdc_08.push({"x": bins_tdc_08[bin], "y": counts_tdc_08[bin]});
    }

    // Scale the range of the data
    x_tdc_08.domain([min_bin, max_bin + bin_step]);
    y_tdc_08.domain([0, d3.max(data_tdc_08, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_08 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_08.call(tip_tdc_08);

    // Add the bars
    bar_tdc_08.data(data_tdc_08)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_08(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_08(d.y); })
        .attr("height", function(d) { return height - y_tdc_08(d.y); })
        .on('mouseover', tip_tdc_08.show)
        .on('mouseout', tip_tdc_08.hide);

    // Add the x-axis
    svg_tdc_08.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_08)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_08.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_08)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 09
    //////////////////////////////////////////////////////////

    var bins_tdc_09 = json.tdc09data.map(function (d) { return +d.bin; })
    var counts_tdc_09 = json.tdc09data.map(function (d) { return +d.count; })
    var data_tdc_09 = [];

    for (var bin in bins_tdc_09) {
      data_tdc_09.push({"x": bins_tdc_09[bin], "y": counts_tdc_09[bin]});
    }

    // Scale the range of the data
    x_tdc_09.domain([min_bin, max_bin + bin_step]);
    y_tdc_09.domain([0, d3.max(data_tdc_09, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_09 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_09.call(tip_tdc_09);

    // Add the bars
    bar_tdc_09.data(data_tdc_09)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_09(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_09(d.y); })
        .attr("height", function(d) { return height - y_tdc_09(d.y); })
        .on('mouseover', tip_tdc_09.show)
        .on('mouseout', tip_tdc_09.hide);

    // Add the x-axis
    svg_tdc_09.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_09)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_09.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_09)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 10
    //////////////////////////////////////////////////////////

    var bins_tdc_10 = json.tdc10data.map(function (d) { return +d.bin; })
    var counts_tdc_10 = json.tdc10data.map(function (d) { return +d.count; })
    var data_tdc_10 = [];

    for (var bin in bins_tdc_10) {
      data_tdc_10.push({"x": bins_tdc_10[bin], "y": counts_tdc_10[bin]});
    }

    // Scale the range of the data
    x_tdc_10.domain([min_bin, max_bin + bin_step]);
    y_tdc_10.domain([0, d3.max(data_tdc_10, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_10 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_10.call(tip_tdc_10);

    // Add the bars
    bar_tdc_10.data(data_tdc_10)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_10(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_10(d.y); })
        .attr("height", function(d) { return height - y_tdc_10(d.y); })
        .on('mouseover', tip_tdc_10.show)
        .on('mouseout', tip_tdc_10.hide);

    // Add the x-axis
    svg_tdc_10.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_10)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_10.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_10)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 11
    //////////////////////////////////////////////////////////

    var bins_tdc_11 = json.tdc11data.map(function (d) { return +d.bin; })
    var counts_tdc_11 = json.tdc11data.map(function (d) { return +d.count; })
    var data_tdc_11 = [];

    for (var bin in bins_tdc_11) {
      data_tdc_11.push({"x": bins_tdc_11[bin], "y": counts_tdc_11[bin]});
    }

    // Scale the range of the data
    x_tdc_11.domain([min_bin, max_bin + bin_step]);
    y_tdc_11.domain([0, d3.max(data_tdc_11, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_11 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_11.call(tip_tdc_11);

    // Add the bars
    bar_tdc_11.data(data_tdc_11)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_11(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_11(d.y); })
        .attr("height", function(d) { return height - y_tdc_11(d.y); })
        .on('mouseover', tip_tdc_11.show)
        .on('mouseout', tip_tdc_11.hide);

    // Add the x-axis
    svg_tdc_11.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_11)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_11.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_11)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 12
    //////////////////////////////////////////////////////////

    var bins_tdc_12 = json.tdc12data.map(function (d) { return +d.bin; })
    var counts_tdc_12 = json.tdc12data.map(function (d) { return +d.count; })
    var data_tdc_12 = [];

    for (var bin in bins_tdc_12) {
      data_tdc_12.push({"x": bins_tdc_12[bin], "y": counts_tdc_12[bin]});
    }

    // Scale the range of the data
    x_tdc_12.domain([min_bin, max_bin + bin_step]);
    y_tdc_12.domain([0, d3.max(data_tdc_12, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_12 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_12.call(tip_tdc_12);

    // Add the bars
    bar_tdc_12.data(data_tdc_12)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_12(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_12(d.y); })
        .attr("height", function(d) { return height - y_tdc_12(d.y); })
        .on('mouseover', tip_tdc_12.show)
        .on('mouseout', tip_tdc_12.hide);

    // Add the x-axis
    svg_tdc_12.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_12)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_12.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_12)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 13
    //////////////////////////////////////////////////////////

    var bins_tdc_13 = json.tdc13data.map(function (d) { return +d.bin; })
    var counts_tdc_13 = json.tdc13data.map(function (d) { return +d.count; })
    var data_tdc_13 = [];

    for (var bin in bins_tdc_13) {
      data_tdc_13.push({"x": bins_tdc_13[bin], "y": counts_tdc_13[bin]});
    }

    // Scale the range of the data
    x_tdc_13.domain([min_bin, max_bin + bin_step]);
    y_tdc_13.domain([0, d3.max(data_tdc_13, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_13 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_13.call(tip_tdc_13);

    // Add the bars
    bar_tdc_13.data(data_tdc_13)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_13(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_13(d.y); })
        .attr("height", function(d) { return height - y_tdc_13(d.y); })
        .on('mouseover', tip_tdc_13.show)
        .on('mouseout', tip_tdc_13.hide);

    // Add the x-axis
    svg_tdc_13.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_13)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_13.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_13)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 14
    //////////////////////////////////////////////////////////

    var bins_tdc_14 = json.tdc14data.map(function (d) { return +d.bin; })
    var counts_tdc_14 = json.tdc14data.map(function (d) { return +d.count; })
    var data_tdc_14 = [];

    for (var bin in bins_tdc_14) {
      data_tdc_14.push({"x": bins_tdc_14[bin], "y": counts_tdc_14[bin]});
    }

    // Scale the range of the data
    x_tdc_14.domain([min_bin, max_bin + bin_step]);
    y_tdc_14.domain([0, d3.max(data_tdc_14, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_14 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_14.call(tip_tdc_14);

    // Add the bars
    bar_tdc_14.data(data_tdc_14)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_14(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_14(d.y); })
        .attr("height", function(d) { return height - y_tdc_14(d.y); })
        .on('mouseover', tip_tdc_14.show)
        .on('mouseout', tip_tdc_14.hide);

    // Add the x-axis
    svg_tdc_14.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_14)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_14.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_14)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 15
    //////////////////////////////////////////////////////////

    var bins_tdc_15 = json.tdc15data.map(function (d) { return +d.bin; })
    var counts_tdc_15 = json.tdc15data.map(function (d) { return +d.count; })
    var data_tdc_15 = [];

    for (var bin in bins_tdc_15) {
      data_tdc_15.push({"x": bins_tdc_15[bin], "y": counts_tdc_15[bin]});
    }

    // Scale the range of the data
    x_tdc_15.domain([min_bin, max_bin + bin_step]);
    y_tdc_15.domain([0, d3.max(data_tdc_15, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_15 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_15.call(tip_tdc_15);

    // Add the bars
    bar_tdc_15.data(data_tdc_15)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_15(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_15(d.y); })
        .attr("height", function(d) { return height - y_tdc_15(d.y); })
        .on('mouseover', tip_tdc_15.show)
        .on('mouseout', tip_tdc_15.hide);

    // Add the x-axis
    svg_tdc_15.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_15)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_15.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_15)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////
    // TDC 16
    //////////////////////////////////////////////////////////

    var bins_tdc_16 = json.tdc16data.map(function (d) { return +d.bin; })
    var counts_tdc_16 = json.tdc16data.map(function (d) { return +d.count; })
    var data_tdc_16 = [];

    for (var bin in bins_tdc_16) {
      data_tdc_16.push({"x": bins_tdc_16[bin], "y": counts_tdc_16[bin]});
    }

    // Scale the range of the data
    x_tdc_16.domain([min_bin, max_bin + bin_step]);
    y_tdc_16.domain([0, d3.max(data_tdc_16, function(d) { return d.y; })]);

    // Initialize tooltips for bars
    var tip_tdc_16 = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "TDC time tick: " + d.x + " <br> <strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span>";
      })

    svg_tdc_16.call(tip_tdc_16);

    // Add the bars
    bar_tdc_16.data(data_tdc_16)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_tdc_16(d.x); })
        .attr("width", bin_width)
        .attr("y", function(d) { return y_tdc_16(d.y); })
        .attr("height", function(d) { return height - y_tdc_16(d.y); })
        .on('mouseover', tip_tdc_16.show)
        .on('mouseout', tip_tdc_16.hide);

    // Add the x-axis
    svg_tdc_16.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_tdc_16)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .style("font-size", "10px")
        .text("TDC time tick");

    // Add the y-axis
    svg_tdc_16.append("g")
        .attr("class", "y axis")
        .style("font-size", "10px")
        .call(y_axis_tdc_16)
      .append("text")
        .attr("class", "label")
        .attr("y", -50)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .style("font-size", "10px")
        .text("Entries per 1 TDC time tick");

    //////////////////////////////////////////////////////////

  })

  function update() {

    // Get the data again
    d3.json(json_url, function(json) {

      ////////////////////////////////////////////////////////
      // TDC 01
      ////////////////////////////////////////////////////////

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

      ////////////////////////////////////////////////////////
      // TDC 02
      ////////////////////////////////////////////////////////

      var bins_tdc_02 = json.tdc02data.map(function (d) { return +d.bin; })
      var counts_tdc_02 = json.tdc02data.map(function (d) { return +d.count; })
      var data_tdc_02 = [];

      for (var bin in bins_tdc_02) {
        data_tdc_02.push({"x": bins_tdc_02[bin], "y": counts_tdc_02[bin]});
      }

      // Scale the range of the data again 
      x_tdc_02.domain([min_bin, max_bin + bin_step]);
      y_tdc_02.domain([0, d3.max(data_tdc_02, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_02 = svg_tdc_02.selectAll(".bar")
           .data(data_tdc_02);

      // new data:
      selection_tdc_02.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_02(d.y); });
      // removed data:
      selection_tdc_02.exit().remove();
      // updated data:
      selection_tdc_02
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_02(d.y); })
          .attr("height", function(d) { return height - y_tdc_02(d.y); });

      // change the x-axis
      svg_tdc_02.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_02);

      // change the y-axis
      svg_tdc_02.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_02);

      ////////////////////////////////////////////////////////
      // TDC 03
      ////////////////////////////////////////////////////////

      var bins_tdc_03 = json.tdc03data.map(function (d) { return +d.bin; })
      var counts_tdc_03 = json.tdc03data.map(function (d) { return +d.count; })
      var data_tdc_03 = [];

      for (var bin in bins_tdc_03) {
        data_tdc_03.push({"x": bins_tdc_03[bin], "y": counts_tdc_03[bin]});
      }

      // Scale the range of the data again 
      x_tdc_03.domain([min_bin, max_bin + bin_step]);
      y_tdc_03.domain([0, d3.max(data_tdc_03, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_03 = svg_tdc_03.selectAll(".bar")
           .data(data_tdc_03);

      // new data:
      selection_tdc_03.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_03(d.y); });
      // removed data:
      selection_tdc_03.exit().remove();
      // updated data:
      selection_tdc_03
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_03(d.y); })
          .attr("height", function(d) { return height - y_tdc_03(d.y); });

      // change the x-axis
      svg_tdc_03.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_03);

      // change the y-axis
      svg_tdc_03.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_03);

      ////////////////////////////////////////////////////////
      // TDC 04
      ////////////////////////////////////////////////////////

      var bins_tdc_04 = json.tdc04data.map(function (d) { return +d.bin; })
      var counts_tdc_04 = json.tdc04data.map(function (d) { return +d.count; })
      var data_tdc_04 = [];

      for (var bin in bins_tdc_04) {
        data_tdc_04.push({"x": bins_tdc_04[bin], "y": counts_tdc_04[bin]});
      }

      // Scale the range of the data again 
      x_tdc_04.domain([min_bin, max_bin + bin_step]);
      y_tdc_04.domain([0, d3.max(data_tdc_04, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_04 = svg_tdc_04.selectAll(".bar")
           .data(data_tdc_04);

      // new data:
      selection_tdc_04.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_04(d.y); });
      // removed data:
      selection_tdc_04.exit().remove();
      // updated data:
      selection_tdc_04
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_04(d.y); })
          .attr("height", function(d) { return height - y_tdc_04(d.y); });

      // change the x-axis
      svg_tdc_04.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_04);

      // change the y-axis
      svg_tdc_04.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_04);

      ////////////////////////////////////////////////////////
      // TDC 05
      ////////////////////////////////////////////////////////

      var bins_tdc_05 = json.tdc05data.map(function (d) { return +d.bin; })
      var counts_tdc_05 = json.tdc05data.map(function (d) { return +d.count; })
      var data_tdc_05 = [];

      for (var bin in bins_tdc_05) {
        data_tdc_05.push({"x": bins_tdc_05[bin], "y": counts_tdc_05[bin]});
      }

      // Scale the range of the data again 
      x_tdc_05.domain([min_bin, max_bin + bin_step]);
      y_tdc_05.domain([0, d3.max(data_tdc_05, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_05 = svg_tdc_05.selectAll(".bar")
           .data(data_tdc_05);

      // new data:
      selection_tdc_05.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_05(d.y); });
      // removed data:
      selection_tdc_05.exit().remove();
      // updated data:
      selection_tdc_05
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_05(d.y); })
          .attr("height", function(d) { return height - y_tdc_05(d.y); });

      // change the x-axis
      svg_tdc_05.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_05);

      // change the y-axis
      svg_tdc_05.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_05);

      ////////////////////////////////////////////////////////
      // TDC 06
      ////////////////////////////////////////////////////////

      var bins_tdc_06 = json.tdc06data.map(function (d) { return +d.bin; })
      var counts_tdc_06 = json.tdc06data.map(function (d) { return +d.count; })
      var data_tdc_06 = [];

      for (var bin in bins_tdc_06) {
        data_tdc_06.push({"x": bins_tdc_06[bin], "y": counts_tdc_06[bin]});
      }

      // Scale the range of the data again 
      x_tdc_06.domain([min_bin, max_bin + bin_step]);
      y_tdc_06.domain([0, d3.max(data_tdc_06, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_06 = svg_tdc_06.selectAll(".bar")
           .data(data_tdc_06);

      // new data:
      selection_tdc_06.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_06(d.y); });
      // removed data:
      selection_tdc_06.exit().remove();
      // updated data:
      selection_tdc_06
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_06(d.y); })
          .attr("height", function(d) { return height - y_tdc_06(d.y); });

      // change the x-axis
      svg_tdc_06.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_06);

      // change the y-axis
      svg_tdc_06.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_06);

      ////////////////////////////////////////////////////////
      // TDC 07
      ////////////////////////////////////////////////////////

      var bins_tdc_07 = json.tdc07data.map(function (d) { return +d.bin; })
      var counts_tdc_07 = json.tdc07data.map(function (d) { return +d.count; })
      var data_tdc_07 = [];

      for (var bin in bins_tdc_07) {
        data_tdc_07.push({"x": bins_tdc_07[bin], "y": counts_tdc_07[bin]});
      }

      // Scale the range of the data again 
      x_tdc_07.domain([min_bin, max_bin + bin_step]);
      y_tdc_07.domain([0, d3.max(data_tdc_07, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_07 = svg_tdc_07.selectAll(".bar")
           .data(data_tdc_07);

      // new data:
      selection_tdc_07.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_07(d.y); });
      // removed data:
      selection_tdc_07.exit().remove();
      // updated data:
      selection_tdc_07
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_07(d.y); })
          .attr("height", function(d) { return height - y_tdc_07(d.y); });

      // change the x-axis
      svg_tdc_07.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_07);

      // change the y-axis
      svg_tdc_07.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_07);

      ////////////////////////////////////////////////////////
      // TDC 08
      ////////////////////////////////////////////////////////

      var bins_tdc_08 = json.tdc08data.map(function (d) { return +d.bin; })
      var counts_tdc_08 = json.tdc08data.map(function (d) { return +d.count; })
      var data_tdc_08 = [];

      for (var bin in bins_tdc_08) {
        data_tdc_08.push({"x": bins_tdc_08[bin], "y": counts_tdc_08[bin]});
      }

      // Scale the range of the data again 
      x_tdc_08.domain([min_bin, max_bin + bin_step]);
      y_tdc_08.domain([0, d3.max(data_tdc_08, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_08 = svg_tdc_08.selectAll(".bar")
           .data(data_tdc_08);

      // new data:
      selection_tdc_08.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_08(d.y); });
      // removed data:
      selection_tdc_08.exit().remove();
      // updated data:
      selection_tdc_08
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_08(d.y); })
          .attr("height", function(d) { return height - y_tdc_08(d.y); });

      // change the x-axis
      svg_tdc_08.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_08);

      // change the y-axis
      svg_tdc_08.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_08);

      ////////////////////////////////////////////////////////
      // TDC 09
      ////////////////////////////////////////////////////////

      var bins_tdc_09 = json.tdc09data.map(function (d) { return +d.bin; })
      var counts_tdc_09 = json.tdc09data.map(function (d) { return +d.count; })
      var data_tdc_09 = [];

      for (var bin in bins_tdc_09) {
        data_tdc_09.push({"x": bins_tdc_09[bin], "y": counts_tdc_09[bin]});
      }

      // Scale the range of the data again 
      x_tdc_09.domain([min_bin, max_bin + bin_step]);
      y_tdc_09.domain([0, d3.max(data_tdc_09, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_09 = svg_tdc_09.selectAll(".bar")
           .data(data_tdc_09);

      // new data:
      selection_tdc_09.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_09(d.y); });
      // removed data:
      selection_tdc_09.exit().remove();
      // updated data:
      selection_tdc_09
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_09(d.y); })
          .attr("height", function(d) { return height - y_tdc_09(d.y); });

      // change the x-axis
      svg_tdc_09.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_09);

      // change the y-axis
      svg_tdc_09.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_09);

      ////////////////////////////////////////////////////////
      // TDC 10
      ////////////////////////////////////////////////////////

      var bins_tdc_10 = json.tdc10data.map(function (d) { return +d.bin; })
      var counts_tdc_10 = json.tdc10data.map(function (d) { return +d.count; })
      var data_tdc_10 = [];

      for (var bin in bins_tdc_10) {
        data_tdc_10.push({"x": bins_tdc_10[bin], "y": counts_tdc_10[bin]});
      }

      // Scale the range of the data again 
      x_tdc_10.domain([min_bin, max_bin + bin_step]);
      y_tdc_10.domain([0, d3.max(data_tdc_10, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_10 = svg_tdc_10.selectAll(".bar")
           .data(data_tdc_10);

      // new data:
      selection_tdc_10.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_10(d.y); });
      // removed data:
      selection_tdc_10.exit().remove();
      // updated data:
      selection_tdc_10
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_10(d.y); })
          .attr("height", function(d) { return height - y_tdc_10(d.y); });

      // change the x-axis
      svg_tdc_10.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_10);

      // change the y-axis
      svg_tdc_10.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_10);

      ////////////////////////////////////////////////////////
      // TDC 11
      ////////////////////////////////////////////////////////

      var bins_tdc_11 = json.tdc11data.map(function (d) { return +d.bin; })
      var counts_tdc_11 = json.tdc11data.map(function (d) { return +d.count; })
      var data_tdc_11 = [];

      for (var bin in bins_tdc_11) {
        data_tdc_11.push({"x": bins_tdc_11[bin], "y": counts_tdc_11[bin]});
      }

      // Scale the range of the data again 
      x_tdc_11.domain([min_bin, max_bin + bin_step]);
      y_tdc_11.domain([0, d3.max(data_tdc_11, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_11 = svg_tdc_11.selectAll(".bar")
           .data(data_tdc_11);

      // new data:
      selection_tdc_11.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_11(d.y); });
      // removed data:
      selection_tdc_11.exit().remove();
      // updated data:
      selection_tdc_11
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_11(d.y); })
          .attr("height", function(d) { return height - y_tdc_11(d.y); });

      // change the x-axis
      svg_tdc_11.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_11);

      // change the y-axis
      svg_tdc_11.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_11);

      ////////////////////////////////////////////////////////
      // TDC 12
      ////////////////////////////////////////////////////////

      var bins_tdc_12 = json.tdc12data.map(function (d) { return +d.bin; })
      var counts_tdc_12 = json.tdc12data.map(function (d) { return +d.count; })
      var data_tdc_12 = [];

      for (var bin in bins_tdc_12) {
        data_tdc_12.push({"x": bins_tdc_12[bin], "y": counts_tdc_12[bin]});
      }

      // Scale the range of the data again 
      x_tdc_12.domain([min_bin, max_bin + bin_step]);
      y_tdc_12.domain([0, d3.max(data_tdc_12, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_12 = svg_tdc_12.selectAll(".bar")
           .data(data_tdc_12);

      // new data:
      selection_tdc_12.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_12(d.y); });
      // removed data:
      selection_tdc_12.exit().remove();
      // updated data:
      selection_tdc_12
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_12(d.y); })
          .attr("height", function(d) { return height - y_tdc_12(d.y); });

      // change the x-axis
      svg_tdc_12.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_12);

      // change the y-axis
      svg_tdc_12.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_12);

      ////////////////////////////////////////////////////////
      // TDC 13
      ////////////////////////////////////////////////////////

      var bins_tdc_13 = json.tdc13data.map(function (d) { return +d.bin; })
      var counts_tdc_13 = json.tdc13data.map(function (d) { return +d.count; })
      var data_tdc_13 = [];

      for (var bin in bins_tdc_13) {
        data_tdc_13.push({"x": bins_tdc_13[bin], "y": counts_tdc_13[bin]});
      }

      // Scale the range of the data again 
      x_tdc_13.domain([min_bin, max_bin + bin_step]);
      y_tdc_13.domain([0, d3.max(data_tdc_13, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_13 = svg_tdc_13.selectAll(".bar")
           .data(data_tdc_13);

      // new data:
      selection_tdc_13.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_13(d.y); });
      // removed data:
      selection_tdc_13.exit().remove();
      // updated data:
      selection_tdc_13
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_13(d.y); })
          .attr("height", function(d) { return height - y_tdc_13(d.y); });

      // change the x-axis
      svg_tdc_13.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_13);

      // change the y-axis
      svg_tdc_13.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_13);

      ////////////////////////////////////////////////////////
      // TDC 14
      ////////////////////////////////////////////////////////

      var bins_tdc_14 = json.tdc14data.map(function (d) { return +d.bin; })
      var counts_tdc_14 = json.tdc14data.map(function (d) { return +d.count; })
      var data_tdc_14 = [];

      for (var bin in bins_tdc_14) {
        data_tdc_14.push({"x": bins_tdc_14[bin], "y": counts_tdc_14[bin]});
      }

      // Scale the range of the data again 
      x_tdc_14.domain([min_bin, max_bin + bin_step]);
      y_tdc_14.domain([0, d3.max(data_tdc_14, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_14 = svg_tdc_14.selectAll(".bar")
           .data(data_tdc_14);

      // new data:
      selection_tdc_14.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_14(d.y); });
      // removed data:
      selection_tdc_14.exit().remove();
      // updated data:
      selection_tdc_14
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_14(d.y); })
          .attr("height", function(d) { return height - y_tdc_14(d.y); });

      // change the x-axis
      svg_tdc_14.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_14);

      // change the y-axis
      svg_tdc_14.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_14);

      ////////////////////////////////////////////////////////
      // TDC 15
      ////////////////////////////////////////////////////////

      var bins_tdc_15 = json.tdc15data.map(function (d) { return +d.bin; })
      var counts_tdc_15 = json.tdc15data.map(function (d) { return +d.count; })
      var data_tdc_15 = [];

      for (var bin in bins_tdc_15) {
        data_tdc_15.push({"x": bins_tdc_15[bin], "y": counts_tdc_15[bin]});
      }

      // Scale the range of the data again 
      x_tdc_15.domain([min_bin, max_bin + bin_step]);
      y_tdc_15.domain([0, d3.max(data_tdc_15, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_15 = svg_tdc_15.selectAll(".bar")
           .data(data_tdc_15);

      // new data:
      selection_tdc_15.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_15(d.y); });
      // removed data:
      selection_tdc_15.exit().remove();
      // updated data:
      selection_tdc_15
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_15(d.y); })
          .attr("height", function(d) { return height - y_tdc_15(d.y); });

      // change the x-axis
      svg_tdc_15.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_15);

      // change the y-axis
      svg_tdc_15.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_15);

      ////////////////////////////////////////////////////////
      // TDC 16
      ////////////////////////////////////////////////////////

      var bins_tdc_16 = json.tdc16data.map(function (d) { return +d.bin; })
      var counts_tdc_16 = json.tdc16data.map(function (d) { return +d.count; })
      var data_tdc_16 = [];

      for (var bin in bins_tdc_16) {
        data_tdc_16.push({"x": bins_tdc_16[bin], "y": counts_tdc_16[bin]});
      }

      // Scale the range of the data again 
      x_tdc_16.domain([min_bin, max_bin + bin_step]);
      y_tdc_16.domain([0, d3.max(data_tdc_16, function(d) { return d.y; })]);

      // Make the changes
      var selection_tdc_16 = svg_tdc_16.selectAll(".bar")
           .data(data_tdc_16);

      // new data:
      selection_tdc_16.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y_tdc_16(d.y); });
      // removed data:
      selection_tdc_16.exit().remove();
      // updated data:
      selection_tdc_16
          .transition()
          .duration(750)
          .attr("y", function(d) { return y_tdc_16(d.y); })
          .attr("height", function(d) { return height - y_tdc_16(d.y); });

      // change the x-axis
      svg_tdc_16.select(".x.axis")
          .transition()
          .duration(750)
          .call(x_axis_tdc_16);

      // change the y-axis
      svg_tdc_16.select(".y.axis") // change the y axis
          .transition()
          .duration(750)
          .call(y_axis_tdc_16);

      ////////////////////////////////////////////////////////

    });
  }

  var timeout;
  function load_next() {
    update();
    timeout = setTimeout(load_next, 15000);
  }

  load_next();

}) ();
