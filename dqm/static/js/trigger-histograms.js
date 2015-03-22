(function() {

  function chart(config) {

    // Set the dimensions of the canvas / graph
    var margin = {top: 60, right: 70, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Set histogram binning
    var min_bin = 0,
        max_bin = 30,
        bin_step = 0.1;

    var bin_array = [];
    for (var i = min_bin; i <= max_bin + bin_step; i += bin_step) {
      bin_array.push(i);
    }

    var bin_width = parseFloat(width / (bin_array.length - 1)) - 1;

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

    // Set title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
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
          return "<strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span> <br> Trigger time: " + d.x + " s";
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

      // Set the x-axis ticks
      //x_axis.tickValues(bin_ticks);

      // Add the x-axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(x_axis)
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .attr("text-anchor", "end")
          .text("Time since beginning of spill [s]");

      // Add the y-axis
      svg.append("g")
          .attr("class", "y axis")
          .call(y_axis)
        .append("text")
          .attr("class", "label")
          .attr("y", 6)
          .attr("dy", ".71em")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .text("Entries per 0.1 s");

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

        var bin_array = [];
        for (var i = min_bin; i <= max_bin + bin_step; i += bin_step) {
          bin_array.push(i);
        }

        //var bin_ticks = [];
        //for (var i = min_bin; i <= max_bin + bin_step; i += bin_step) {
        //  bin_ticks.push(i);
        //}

        var bin_width = parseFloat(width / (bin_array.length - 1)) - 1;

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

    load_next();

  }

  var json_url = $SCRIPT_ROOT + "/json?q=trigger-histogram";

  var v1751_board_0_trigger_histogram = chart(
    {
      selection: "#v1751-board-0-trigger-histogram",
      title: "CAEN V1751 board 0 triggers",
      json_url: json_url + "&device=v1751&board_id=0"
    }
  );

  var v1751_board_1_trigger_histogram = chart(
    {
      selection: "#v1751-board-1-trigger-histogram",
      title: "CAEN V1751 board 1 triggers",
      json_url: json_url + "&device=v1751&board_id=1"
    }
  );

  var mwpc_trigger_histogram = chart(
    {
      selection: "#mwpc-trigger-histogram",
      title: "Multi-wire proportional chambers triggers",
      json_url: json_url + "&device=mwpc"
    }
  );

  var wut_trigger_histogram = chart(
    {
      selection: "#wut-trigger-histogram",
      title: "Wave union TDC triggers",
      json_url: json_url + "&device=wut"
    }
  );

  //var timeout;
  //function load_next() {
  //  v1751_board_0_trigger_histogram.update();
  //  v1751_board_1_trigger_histogram.update();
  //  mwpc_trigger_histogram.update();
  //  wut_trigger_histogram.update();
  //  timeout = setTimeout(load_next, 15000);
  //}

  //load_next();

  $(document).ready(function() {
    fill_table();
  });

  setInterval(function() {
    fill_table();
  }, 15000);

  function fill_table() {
    $.getJSON($SCRIPT_ROOT + '/json?q=trigger-counts', function (data) {
      $("#v1751-board-0-triggers").html(JSON.stringify(data.v1751_board_0));
      $("#v1751-board-1-triggers").html(JSON.stringify(data.v1751_board_1));
      $("#mwpc-triggers").html(JSON.stringify(data.mwpc));
      $("#wut-triggers").html(JSON.stringify(data.wut));
      $("#v1740-board-0-triggers").html(JSON.stringify(data.v1740_board_0));
      $("#v1740-board-1-triggers").html(JSON.stringify(data.v1740_board_1));
      $("#v1740-board-2-triggers").html(JSON.stringify(data.v1740_board_2));
      $("#v1740-board-3-triggers").html(JSON.stringify(data.v1740_board_3));
      $("#v1740-board-4-triggers").html(JSON.stringify(data.v1740_board_4));
      $("#v1740-board-5-triggers").html(JSON.stringify(data.v1740_board_5));
      $("#v1740-board-6-triggers").html(JSON.stringify(data.v1740_board_6));
      $("#v1740-board-7-triggers").html(JSON.stringify(data.v1740_board_7));
    });
  }

}) ();
