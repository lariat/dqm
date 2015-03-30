(function() {

  function chart(config) {

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

    // Set the ranges
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var x_axis = d3.svg.axis().scale(x).orient("bottom");
    var y_axis = d3.svg.axis().scale(y).orient("left");

    var svg = d3.select(config.selection).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar");

    svg.append("text")
        .attr("x", x_title)
        .attr("y", y_title)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(config.title);

    d3.json(config.json_url, function(json) {

      var bins = json.data.map(function (d) { return +d.bin; })
      var counts = json.data.map(function (d) { return +d.count; })
      var data = [];

      for (var bin in bins) {
        data.push({"x": bins[bin], "y": counts[bin]});
      }

      // Scale the range of the data
      x.domain([min_bin, max_bin + bin_step]);
      y.domain([0, d3.max(data, function(d) { return d.y; })]);

      // Initialize tooltips for bars
      var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span> <br> TDC time tick: " + d.x;
        })

      svg.call(tip);

      // Add the bars
      bar.data(data)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", bin_width)
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y(d.y); })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

      // Add the x-axis
      svg.append("g")
          .attr("class", "x axis")
          .style("font-size", "10px")
          .attr("transform", "translate(0," + height + ")")
          .call(x_axis)
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", 30)
          .attr("text-anchor", "end")
          .style("font-size", "10px")
          .text("TDC time tick");

      // Add the y-axis
      svg.append("g")
          .attr("class", "y axis")
          .style("font-size", "10px")
          .call(y_axis)
        .append("text")
          .attr("class", "label")
          .attr("y", -50)
          .attr("dy", ".71em")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .style("font-size", "10px")
          .text("Entries per 1 TDC time tick");

    })

    function update() {

      // Get the data again
      d3.json(config.json_url, function(json) {

        var bins = json.data.map(function (d) { return +d.bin; })
        var counts = json.data.map(function (d) { return +d.count; })
        var data = [];

        for (var bin in bins) {
          data.push({"x": bins[bin], "y": counts[bin]});
        }

        // Scale the range of the data again 
        x.domain([min_bin, max_bin + bin_step]);
        y.domain([0, d3.max(data, function(d) { return d.y; })]);

        // Make the changes
        var selection = svg.selectAll(".bar")
             .data(data);

        // new data:
        selection.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.x); })
            .attr("width", bin_width)
            .attr("y", function(d) { return y(d.y); })
            .attr("height", function(d) { return height - y(d.y); });
        // removed data:
        selection.exit().remove();
        // updated data:
        selection
            .transition()
            .duration(750)
            .attr("y", function(d) { return y(d.y); })
            .attr("height", function(d) { return height - y(d.y); });

        // change the x-axis
        svg.select(".x.axis")
            .transition()
            .duration(750)
            .call(x_axis);

        // change the y-axis
        svg.select(".y.axis") // change the y axis
            .transition()
            .duration(750)
            .call(y_axis);

      });
    }

    var timeout;
    function load_next() {
      update();
      timeout = setTimeout(load_next, 15000);
    }

    $.getJSON($SCRIPT_ROOT + '/json?q=runs', function(data) {
      if (data.selected == data.latest) {
        load_next();
      }
    });

  }

  var json_url = $SCRIPT_ROOT + "/json?q=mwpc-timing-histogram";

  var mwpc_tdc_01_histogram = chart(
    {
      selection: "#mwpc-tdc-01-timing-histogram",
      title: "TDC 01",
      json_url: json_url + "&tdc=1"
    }
  );

  var mwpc_tdc_02_histogram = chart(
    {
      selection: "#mwpc-tdc-02-timing-histogram",
      title: "TDC 02",
      json_url: json_url + "&tdc=2"
    }
  );

  var mwpc_tdc_03_histogram = chart(
    {
      selection: "#mwpc-tdc-03-timing-histogram",
      title: "TDC 03",
      json_url: json_url + "&tdc=3"
    }
  );

  var mwpc_tdc_04_histogram = chart(
    {
      selection: "#mwpc-tdc-04-timing-histogram",
      title: "TDC 04",
      json_url: json_url + "&tdc=4"
    }
  );

  var mwpc_tdc_05_histogram = chart(
    {
      selection: "#mwpc-tdc-05-timing-histogram",
      title: "TDC 05",
      json_url: json_url + "&tdc=5"
    }
  );

  var mwpc_tdc_06_histogram = chart(
    {
      selection: "#mwpc-tdc-06-timing-histogram",
      title: "TDC 06",
      json_url: json_url + "&tdc=6"
    }
  );

  var mwpc_tdc_07_histogram = chart(
    {
      selection: "#mwpc-tdc-07-timing-histogram",
      title: "TDC 07",
      json_url: json_url + "&tdc=7"
    }
  );

  var mwpc_tdc_08_histogram = chart(
    {
      selection: "#mwpc-tdc-08-timing-histogram",
      title: "TDC 08",
      json_url: json_url + "&tdc=8"
    }
  );

  var mwpc_tdc_09_histogram = chart(
    {
      selection: "#mwpc-tdc-09-timing-histogram",
      title: "TDC 09",
      json_url: json_url + "&tdc=9"
    }
  );

  var mwpc_tdc_10_histogram = chart(
    {
      selection: "#mwpc-tdc-10-timing-histogram",
      title: "TDC 10",
      json_url: json_url + "&tdc=10"
    }
  );

  var mwpc_tdc_11_histogram = chart(
    {
      selection: "#mwpc-tdc-11-timing-histogram",
      title: "TDC 11",
      json_url: json_url + "&tdc=11"
    }
  );

  var mwpc_tdc_12_histogram = chart(
    {
      selection: "#mwpc-tdc-12-timing-histogram",
      title: "TDC 12",
      json_url: json_url + "&tdc=12"
    }
  );

  var mwpc_tdc_13_histogram = chart(
    {
      selection: "#mwpc-tdc-13-timing-histogram",
      title: "TDC 13",
      json_url: json_url + "&tdc=13"
    }
  );

  var mwpc_tdc_14_histogram = chart(
    {
      selection: "#mwpc-tdc-14-timing-histogram",
      title: "TDC 14",
      json_url: json_url + "&tdc=14"
    }
  );

  var mwpc_tdc_15_histogram = chart(
    {
      selection: "#mwpc-tdc-15-timing-histogram",
      title: "TDC 15",
      json_url: json_url + "&tdc=15"
    }
  );

  var mwpc_tdc_16_histogram = chart(
    {
      selection: "#mwpc-tdc-16-timing-histogram",
      title: "TDC 16",
      json_url: json_url + "&tdc=16"
    }
  );

}) ();
