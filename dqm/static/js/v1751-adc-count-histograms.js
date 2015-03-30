(function() {

  function chart(config) {

    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 70, bottom: 30, left: 70},
        width = 960 - margin.left - margin.right,
        height = 180 - margin.top - margin.bottom;

    // Set the title position
    //var x_title = 6 * width/7,
    var x_title = 0.98 * width,
        y_title = 15;

    // Set histogram binning
    var min_bin = 0,
        max_bin = 1024,
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
          return "<strong>Entries:</strong> <span style='color:darkorange'>" + d.y + "</span> <br> ADC count: " + d.x;
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
          .text("ADC count");

      // Add the y-axis
      svg.append("g")
          .attr("class", "y axis")
          .style("font-size", "10px")
          .call(y_axis)
        .append("text")
          .attr("class", "label")
          .attr("y", 6)
          .attr("dy", ".71em")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .style("font-size", "10px")
          .text("Entries per 1 ADC count");

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

  $.getJSON($SCRIPT_ROOT + '/json?q=selected-run-spill', function(data) {
    if (data.selected_run == data.latest_run && data.selected_spill == "All") {
      load_next();
    }
  });

  }

  var json_url = $SCRIPT_ROOT + "/json?q=v1751-adc-count-histogram";

  // board 0
  var v1751_board_0_channel_0_adc_count_histogram = chart(
    {
      selection: "#v1751-board-0-channel-0-adc-count-histogram",
      title: "CH 0",
      json_url: json_url + "&board_id=0&channel=0"
    }
  );

  var v1751_board_0_channel_1_adc_count_histogram = chart(
    {
      selection: "#v1751-board-0-channel-1-adc-count-histogram",
      title: "CH 1",
      json_url: json_url + "&board_id=0&channel=1"
    }
  );

  var v1751_board_0_channel_2_adc_count_histogram = chart(
    {
      selection: "#v1751-board-0-channel-2-adc-count-histogram",
      title: "CH 2",
      json_url: json_url + "&board_id=0&channel=2"
    }
  );

  var v1751_board_0_channel_3_adc_count_histogram = chart(
    {
      selection: "#v1751-board-0-channel-3-adc-count-histogram",
      title: "CH 3",
      json_url: json_url + "&board_id=0&channel=3"
    }
  );

  var v1751_board_0_channel_4_adc_count_histogram = chart(
    {
      selection: "#v1751-board-0-channel-4-adc-count-histogram",
      title: "CH 4",
      json_url: json_url + "&board_id=0&channel=4"
    }
  );

  var v1751_board_0_channel_5_adc_count_histogram = chart(
    {
      selection: "#v1751-board-0-channel-5-adc-count-histogram",
      title: "CH 5",
      json_url: json_url + "&board_id=0&channel=5"
    }
  );

  var v1751_board_0_channel_6_adc_count_histogram = chart(
    {
      selection: "#v1751-board-0-channel-6-adc-count-histogram",
      title: "CH 6",
      json_url: json_url + "&board_id=0&channel=6"
    }
  );

  var v1751_board_0_channel_7_adc_count_histogram = chart(
    {
      selection: "#v1751-board-0-channel-7-adc-count-histogram",
      title: "CH 7",
      json_url: json_url + "&board_id=0&channel=7"
    }
  );

  // board 1
  //var v1751_board_1_channel_0_adc_count_histogram = chart(
  //  {
  //    selection: "#v1751-board-1-channel-0-adc-count-histogram",
  //    title: "CH 0",
  //    json_url: json_url + "&board_id=1&channel=0"
  //  }
  //);

  //var v1751_board_1_channel_1_adc_count_histogram = chart(
  //  {
  //    selection: "#v1751-board-1-channel-1-adc-count-histogram",
  //    title: "CH 1",
  //    json_url: json_url + "&board_id=1&channel=1"
  //  }
  //);

  //var v1751_board_1_channel_2_adc_count_histogram = chart(
  //  {
  //    selection: "#v1751-board-1-channel-2-adc-count-histogram",
  //    title: "CH 2",
  //    json_url: json_url + "&board_id=1&channel=2"
  //  }
  //);

  //var v1751_board_1_channel_3_adc_count_histogram = chart(
  //  {
  //    selection: "#v1751-board-1-channel-3-adc-count-histogram",
  //    title: "CH 3",
  //    json_url: json_url + "&board_id=1&channel=3"
  //  }
  //);

  //var v1751_board_1_channel_4_adc_count_histogram = chart(
  //  {
  //    selection: "#v1751-board-1-channel-4-adc-count-histogram",
  //    title: "CH 4",
  //    json_url: json_url + "&board_id=1&channel=4"
  //  }
  //);

  //var v1751_board_1_channel_5_adc_count_histogram = chart(
  //  {
  //    selection: "#v1751-board-1-channel-5-adc-count-histogram",
  //    title: "CH 5",
  //    json_url: json_url + "&board_id=1&channel=5"
  //  }
  //);

  //var v1751_board_1_channel_6_adc_count_histogram = chart(
  //  {
  //    selection: "#v1751-board-1-channel-6-adc-count-histogram",
  //    title: "CH 6",
  //    json_url: json_url + "&board_id=1&channel=6"
  //  }
  //);

  //var v1751_board_1_channel_7_adc_count_histogram = chart(
  //  {
  //    selection: "#v1751-board-1-channel-7-adc-count-histogram",
  //    title: "CH 7",
  //    json_url: json_url + "&board_id=1&channel=7"
  //  }
  //);

}) ();
