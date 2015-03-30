(function() {

  $(document).ready(function() {
    fill_table();
  });

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

  var timeout;
  function load_next() {
    fill_table();
    timeout = setTimeout(load_next, 15000);
  }

  $.getJSON($SCRIPT_ROOT + '/json?q=selected-run-spill', function(data) {
    if (data.selected_run == data.latest_run && data.selected_spill == "All") {
      load_next();
    }
  });

}) ();
