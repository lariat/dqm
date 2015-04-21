$( document ).ready(function() {
    var start = 0,
        stop = 64;

    var json_url = $SCRIPT_ROOT + "/json?q=mwpc-histogram&type=channel&start=" + start + "&stop=" + stop;

    var mwpc_tdc_01_histogram = chart({
        selection: "#mwpc-tdc-01-histogram",
        json_url: json_url + "&tdc=1",
        title: "TDC 01",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_02_histogram = chart({
        selection: "#mwpc-tdc-02-histogram",
        json_url: json_url + "&tdc=2",
        title: "TDC 02",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_03_histogram = chart({
        selection: "#mwpc-tdc-03-histogram",
        json_url: json_url + "&tdc=3",
        title: "TDC 03",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_03_histogram = chart({
        selection: "#mwpc-tdc-04-histogram",
        json_url: json_url + "&tdc=4",
        title: "TDC 04",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_05_histogram = chart({
        selection: "#mwpc-tdc-05-histogram",
        json_url: json_url + "&tdc=5",
        title: "TDC 05",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_06_histogram = chart({
        selection: "#mwpc-tdc-06-histogram",
        json_url: json_url + "&tdc=6",
        title: "TDC 06",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_07_histogram = chart({
        selection: "#mwpc-tdc-07-histogram",
        json_url: json_url + "&tdc=7",
        title: "TDC 07",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_08_histogram = chart({
        selection: "#mwpc-tdc-08-histogram",
        json_url: json_url + "&tdc=8",
        title: "TDC 08",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_09_histogram = chart({
        selection: "#mwpc-tdc-09-histogram",
        json_url: json_url + "&tdc=9",
        title: "TDC 09",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_10_histogram = chart({
        selection: "#mwpc-tdc-10-histogram",
        json_url: json_url + "&tdc=10",
        title: "TDC 10",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_11_histogram = chart({
        selection: "#mwpc-tdc-11-histogram",
        json_url: json_url + "&tdc=11",
        title: "TDC 11",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_12_histogram = chart({
        selection: "#mwpc-tdc-12-histogram",
        json_url: json_url + "&tdc=12",
        title: "TDC 12",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_13_histogram = chart({
        selection: "#mwpc-tdc-13-histogram",
        json_url: json_url + "&tdc=13",
        title: "TDC 13",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_14_histogram = chart({
        selection: "#mwpc-tdc-14-histogram",
        json_url: json_url + "&tdc=14",
        title: "TDC 14",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_15_histogram = chart({
        selection: "#mwpc-tdc-15-histogram",
        json_url: json_url + "&tdc=15",
        title: "TDC 15",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

    var mwpc_tdc_16_histogram = chart({
        selection: "#mwpc-tdc-16-histogram",
        json_url: json_url + "&tdc=16",
        title: "TDC 16",
        x_label: "TDC channel",
        start: start,
        stop: stop
    });

});
