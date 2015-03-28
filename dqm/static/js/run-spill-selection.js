$(document).ready(function() {

  $.getJSON($SCRIPT_ROOT + '/json?q=runs', function(data) {
    $('#selected-run').html(data.selected);
    $("#run-selection").val(data.selected);
    $('#runs').append('<li class="dropdown-header">Live</li>');
    $('#runs').append('<li class="run-option" value="' + data.latest + '"><a href="#">' + data.latest + '</a></li>');
    $('#runs').append('<li class="divider"></li>');
    $('#runs').append('<li class="dropdown-header">Completed Runs</li>');
    for (var i = 0; i < data.completed.length; ++i) {
        $('#runs').append('<li class="run-option" value="' + data.completed[i] + '"><a href="#">' + data.completed[i] + '</a></li>');
    }

    $('#runs .run-option').click(function(e) {
      e.preventDefault();
      $("#run-selection").val($(this).attr("value"));
      var form_data = $("#run-spill-selection-form").serialize();
      //alert(form_data);
      $.ajax({
        type: "POST",
        url: $SCRIPT_ROOT + "/select-run-spill",
        data: form_data,
        success: function() {
          window.location.reload(true);
        }
      });
    });

  });

  $.getJSON($SCRIPT_ROOT + '/json?q=spills', function(data) {
    $('#selected-spill').html(data.selected);
    $('#spills').append('<li class="spill-option" value="All"><a href="#">All</a></li>');
    $('#spills').append('<li class="divider"></li>');
    $('#spills').append('<li class="dropdown-header">Completed Spills</li>');
    for (var i = 0; i < data.completed.length; ++i) {
        $('#spills').append('<li class="spill-option" value="' + data.completed[i] + '"><a href="#">' + data.completed[i] + '</a></li>');
    }

    $('#spills .spill-option').click(function(e) {
      e.preventDefault();
      $("#spill-selection").val($(this).attr("value"));
      var form_data = $("#run-spill-selection-form").serialize();
      //alert(form_data);
      $.ajax({
        type: "POST",
        url: $SCRIPT_ROOT + "/select-run-spill",
        data: form_data,
        success: function() {
          window.location.reload(true);
        }
      });
    });

  });

});
