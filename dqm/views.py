import os
from glob import glob
import numpy as np
from redis import Redis
from flask import (
    render_template, request, jsonify, make_response, abort, redirect, url_for,
    session
    )
from natsort import natsorted
from dqm import app

from constants import *

redis = Redis()

@app.route('/')
@app.route('/index')
def index():
    latest_run = redis.get('dqm/latest-run')
    selected_run = session.get('selected_run', latest_run)
    mpl_plots_dir = app.static_folder + '/plots'
    filter_str = 'run_' + selected_run + '*.*'
    files = []
    try:
        lst = [
            os.path.basename(x) for x in glob(mpl_plots_dir + '/' + filter_str)
            ]
        #lst.sort()
    except OSError:
        pass # ignore errors
    else:
        for name in lst:
            files.append(
                {
                    'name': name,
                    'url': url_for('static',
                                   filename=os.path.join('plots', name))
                    }
                )
    return render_template('index.html', title='Home', files=files)

@app.route('/v1740')
def v1740():
    return render_template('v1740.html',
                           title="CAEN V1740 Boards")

@app.route('/v1751')
def v1751():
    return render_template('v1751.html',
                           title="CAEN V1751 Boards")

@app.route('/mwpc')
def mwpc():
    return render_template('mwpc.html',
                           title="Multi-Wire Proportional Chambers")

@app.route('/mwpc-channel')
def mwpc_channel():
    return render_template(
        'mwpc-channel.html',
        title="Multi-Wire Proportional Chambers: Channel Occupancy"
        )

@app.route('/mwpc-timing')
def mwpc_timing():
    return render_template('mwpc-timing.html',
                           title="Multi-Wire Proportional Chambers: Timing")

@app.route('/wut')
def wut():
    return render_template('wut.html',
                           title="Wave Union TDC")

@app.route('/data-blocks')
def data_blocks():
    return render_template('data-blocks.html',
                           title="Data Blocks")

@app.route('/physics')
def physics():
    return render_template('physics.html',
                           title="Physics")

@app.route('/mwpc-histograms')
def mwpc_histograms():
    return render_template('mwpc-histograms.html',
                           title="Multi-Wire Proportional Chambers")

@app.route('/log')
def log():

    latest_run = int(redis.get('dqm/latest-run'))
    latest_spill = int(redis.get('dqm/latest-spill'))
    selected_run = int(session.get('selected_run', latest_run))
    selected_spill = session.get('selected_spill', 'All')

    key_prefix = 'dqm/run:{}/spill:{}/'.format(selected_run,
                                               selected_spill)

    if selected_spill == 'All':
        key_prefix = 'dqm/run:{}/spill:*/'.format(selected_run)

    keys = redis.keys(key_prefix + 'log:*')
    p = redis.pipeline()
    for key in natsorted(keys):
        p.hgetall(key)
    posts = p.execute()

    return render_template('log.html',
                           title="Log",
                           posts=posts)

    log_html = '<!DOCTYPE html>\n' \
               '<html lang="en">\n' \
               '  <head>\n' \
               '    <meta charset="utf-8">\n' \
               '  </head>\n' \
               '  <body>\n' \
               '    <div>\n' \
               '      <p><span style="font-size:18pt">log</span> <i>noun</i></p>\n'\
               '      <p>a part of the trunk or a large branch of a tree that has fallen or been cut off.</p>\n' \
               '    </div>\n' \
               '  </body>\n' \
               '</html>\n'
    return log_html

@app.route('/select-run-spill', methods=['GET', 'POST'])
def select_run_spill():
    latest_run = int(redis.get('dqm/latest-run'))
    redirect_to = request.form.get('redirect-to', 'index')
    session['selected_run'] = request.form.get('run-selection', latest_run)
    session['selected_spill'] = request.form.get('spill-selection', 'All')
    response = make_response(redirect(url_for(redirect_to)))
    return response

@app.route('/json')
def json():
    query = request.args.get('q', None)

    latest_run = int(redis.get('dqm/latest-run'))
    latest_spill = int(redis.get('dqm/latest-spill'))
    selected_run = int(session.get('selected_run', latest_run))
    selected_spill = session.get('selected_spill', 'All')

    json_data = {
        'query': query,
        'data': [ { 'bin': 0, 'count': 0 }, { 'bin': 1, 'count': 0 } ],
        }

    key_prefix = 'dqm/run:{}//'.format(selected_run)

    if selected_spill != 'All':
        key_prefix = 'dqm/run:{}/spill:{}/'.format(selected_run,
                                                   selected_spill)

    if query == 'runs':
        runs_list = []
        keys = redis.keys('dqm/run:*//spills')
        for key in keys:
            run_number = int(key.split('/')[1].split(':')[1])
            runs_list.append(run_number)
        runs_list.remove(latest_run)
        runs_list.sort(reverse=True)
        json_data = {
                'query': query,
                'selected': selected_run,
                'latest': latest_run,
                'completed': runs_list,
            }
        return jsonify(json_data)

    elif query == 'spills':
        spills_list_key = 'dqm/run:{}//spills'.format(selected_run)
        spills_list = map(int, redis.lrange(spills_list_key, 0, -1))
        json_data = {
                'query': query,
                'run': selected_run,
                'selected': selected_spill,
                'completed': spills_list,
            }
        return jsonify(json_data)

    elif query == 'selected-run-spill':
        json_data = {
                'query': query,
                'latest_run': latest_run,
                'latest_spill': latest_spill,
                'selected_run': selected_run,
                'selected_spill': selected_spill,
            }
        return jsonify(json_data)

    # to be removed
    elif query == 'data-block-histogram':
        device = request.args.get('device', None)
        board_id = request.args.get('board_id', -1)
        device_key = None
        if device == 'v1740' and int(board_id) in range(0, 8):
            device_key = 'v1740/board-{}-'.format(board_id)
        elif device == 'v1751' and int(board_id) in (0, 1):
            device_key = 'v1751/board-{}-'.format(board_id)
        elif device == 'mwpc':
            device_key = 'mwpc/'
        elif device == 'wut':
            device_key = 'wut/'
        if device_key == None:
            return jsonify(json_data)
        keys = redis.keys(key_prefix + device_key + 'data-block-histogram')
        p = redis.pipeline()
        for key in keys:
            p.lrange(key, 0, -1)
        bins = np.linspace(0, 30, 300, endpoint=False, dtype=np.float64)
        counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)
        if type(counts) != np.ndarray:
            return jsonify(json_data)
        data = [
            { 'bin': round(i, 1), 'count': j } for i, j in zip(bins, counts)
            ]
        json_data = {
            'query': query,
            'data': data,
            }
        return jsonify(json_data)

    elif query == 'data-block-counts':
        counts_dict = {}
        device_keys = {
            'v1740/board-0-': 'v1740_board_0',
            'v1740/board-1-': 'v1740_board_1',
            'v1740/board-2-': 'v1740_board_2',
            'v1740/board-3-': 'v1740_board_3',
            'v1740/board-4-': 'v1740_board_4',
            'v1740/board-5-': 'v1740_board_5',
            'v1740/board-6-': 'v1740_board_6',
            'v1740/board-7-': 'v1740_board_7',
            'v1751/board-0-': 'v1751_board_0',
            'v1751/board-1-': 'v1751_board_1',
            'mwpc/': 'mwpc',
            'wut/': 'wut',
            }
        for device_key, device_value in device_keys.items():
            keys = redis.keys(key_prefix + device_key + 'data-block-histogram')
            p = redis.pipeline()
            for key in keys:
                p.lrange(key, 0, -1)
            counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)
            counts_dict[device_value] = np.sum(counts)
        json_data = counts_dict
        return jsonify(json_data)

    elif query == 'data-block-time-stamps':
        names = ('v1740', 'v1751', 'mwpc', 'wut')
        #names = ('v1740', 'v1751', 'mwpc')
        bins = np.linspace(0, 30, 300, endpoint=False, dtype=np.float64)
        counts_dict = {}
        device_keys = {
            'v1740': 'v1740/board-0-',
            'v1751': 'v1751/board-0-',
            'mwpc': 'mwpc/',
            'wut': 'wut/',
            }
        for name in names:
            keys = redis.keys(key_prefix + device_keys[name] +
                              'data-block-histogram')
            p = redis.pipeline()
            for key in keys:
                p.lrange(key, 0, -1)
            counts = np.sum(
                np.array(p.execute(), dtype=np.int64), axis=0
                )
            if type(counts) != np.ndarray:
                counts = np.zeros(bins.size, np.int64)
            counts_dict[name] = counts
        data = [
            {
                'time': round(t, 1),
                'V1740': x,
                'V1751': y,
                'MWPC': z,
                'WUT': u,
                }
                for t, x, y, z, u in zip(
                    bins,
                    counts_dict['v1740'],
                    counts_dict['v1751'],
                    counts_dict['mwpc'],
                    counts_dict['wut'],
                    )
            ]
        json_data = {
            'query': query,
            'data': data,
            }
        return jsonify(json_data)

    elif query == 'v1751-adc-count-histogram':
        board_id = request.args.get('board_id', -1)
        channel = request.args.get('channel', -1)
        bins = np.arange(0, 1024, 1)
        if int(board_id) < 0 or int(channel) < 0:
            return jsonify(json_data)
        keys = redis.keys(
            key_prefix + 'v1751/board-{}-channel-{}-adc-count-histogram' \
            .format(board_id, channel)
            )
        p = redis.pipeline()
        for key in keys:
            p.lrange(key, 0, -1)
        counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)
        if type(counts) != np.ndarray:
            counts = np.zeros(bins.size, dtype=np.int64)
        data = [
            { 'bin': i, 'count': j } for i, j in zip(bins, counts)
            ]
        json_data = {
            'query': query,
            'data': data,
            }
        return jsonify(json_data)

    elif query == 'mwpc-histogram':
        tdc = request.args.get('tdc', -1)
        type_ = request.args.get('type', None)
        start = request.args.get('start', None)
        stop = request.args.get('stop', None)

        if int(tdc) not in range(1, 17) or type_ not in ('channel', 'timing'):
            return jsonify(json_data)

        names = ('good', 'bad')
        bin_max_range = {
            'channel': (0, 64),
            'timing': (0, 1024),
            }
        bin_default_range = {
            'channel': (0, 64),
            'timing': (200, 520),
            }
        bin_range_ok = False

        if start and stop:
            start = int(start)
            stop = int(stop)
            if (start < stop and            
                bin_max_range[type_][0] <= start <= bin_max_range[type_][1] and
                bin_max_range[type_][0] <= stop <= bin_max_range[type_][1]):
                bin_range_ok = True

        if not bin_range_ok:
            start = bin_default_range[type_][0]
            stop = bin_default_range[type_][1]

        bins = np.arange(start, stop, 1)
        counts_dict = {}

        for name in names:
            keys = redis.keys(
                key_prefix +
                'mwpc/tdc-{}-{}-hit-{}-histogram'.format(tdc, name, type_)
                )
            p = redis.pipeline()
            for key in keys:
                p.lrange(key, start, stop-1)
            counts = np.sum(
                np.array(p.execute(), dtype=np.int64), axis=0
                )
            if type(counts) != np.ndarray:
                counts = np.zeros(bins.size, np.int64)
            counts_dict[name] = counts

        data = [
            {
                'name': name,
                'values': [
                    { 'x': x, 'y': y }
                    for x, y in zip(
                        bins,
                        counts_dict[name]
                        )
                    ]
                }
            for name in names
            ]

        json_data = {
            'query': query,
            'type': type_,
            'tdc': tdc,
            'start': start,
            'stop': stop,
            'data': data,
            }

        return jsonify(json_data)

    elif query == 'v1751-tof-hit-histogram':
        names = ('ustof', 'dstof')
        bins = np.arange(0, V1751_NUMBER_SAMPLES, 1)
        counts_dict = {}
        for name in names:
            keys = redis.keys(key_prefix + \
                'v1751/{}-hit-histogram'.format(name))
            p = redis.pipeline()
            for key in keys:
                p.lrange(key, 0, -1)
            counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)
            if type(counts) != np.ndarray:
                counts = np.zeros(bins.size, np.int64)
            counts_dict[name] = counts
        data = [
            {
                'bin': x,
                'USTOF': y,
                'DSTOF': z
                }
                for x, y, z in zip(
                    bins,
                    counts_dict['ustof'],
                    counts_dict['dstof']
                    )
            ]
        json_data = {
            'query': query,
            'data': data,
            }
        return jsonify(json_data)

    elif query == 'v1751-tof-histogram':
        keys = redis.keys(key_prefix + 'v1751/tof-histogram')
        p = redis.pipeline()
        for key in keys:
            p.lrange(key, 0, -1)
        bins = np.arange(10, 110, 1)
        counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)
        if type(counts) != np.ndarray:
            counts = np.zeros(bins.size, np.int64)
        data = [ { 'bin': i, 'count': j } for i, j in zip(bins, counts) ]
        json_data = {
            'query': query,
            'data': data,
            }
        return jsonify(json_data)

    elif query == 'latest-log':
        keys = redis.keys(
            'dqm/run:{}/spill:{}/log:*'.format(latest_run, latest_spill)
            )
        p = redis.pipeline()
        for key in natsorted(keys):
            p.hgetall(key)
        json_data = {
            'query': query,
            'latest_run': latest_run,
            'latest_spill': latest_spill,
            'messages': p.execute(),
            }
        return jsonify(json_data)

    return jsonify(json_data)

# testing area below

@app.route('/tab')
def tab():
    return render_template('tab.html')

@app.route('/tabs')
def tabs():
    return render_template('tabs.html')

@app.route('/session')
def session_():
    return render_template('session.html',
                           string=session.get('string', 'hello!'))

@app.route('/session-form', methods=['GET', 'POST'])
def session_form():
    if request.method == 'POST':
        session['string'] = request.form.get('string', 'hello!')
        response = make_response(redirect(url_for('session_')))
        return response
    return 'goodbye!'

@app.route('/cookie')
def cookies_():
    cookie = request.cookies.get('cookie', 'hello!')
    return render_template('cookie.html', cookie=cookie)

@app.route('/cookie-form', methods=['GET', 'POST'])
def cookie_form():
    if request.method == 'POST':
        cookie = request.form.get('cookie', 'hello!')
        response = make_response(redirect(url_for('cookies')))
        response.set_cookie('cookie', value=cookie, max_age=86400)
        return response
    return 'goodbye!'

@app.route('/cubism')
def cubism():
    return render_template('cubism.html',
                           title="Cubism")

@app.route('/random')
def random():
    data = list(np.random.randint(5, 10, 960))
    return jsonify(values=data)

# Test page
@app.route('/test')
def test():
    query = request.args.get('q', "Hello, Bill!")
    return query

# Run Plots summary page
@app.route('/runPlots')
def runPlots():
    run = request.args.get('RUN', '0')
    reply = "<HTML><HEAD><LINK TYPE=\"text/css\" rel=\"stylesheet\" href=\"/static/css/runStyle.css\"></HEAD>\n<BODY><B>DQM Plots for Run <A HREF=http://lariat-wbm.fnal.gov/wbm/servlet/LariatRunSummary?RUN="+run+">"+run+"</B><BR>\n"
    for file in glob("/home/nfs/lariatdqm/local/dqm/dqm/static/plots/run_"+run+"*"): 
      reply += file.replace("/home/nfs/lariatdqm/local/dqm/dqm", "<A HREF=")+">"+os.path.basename(file)+"</A><BR>\n"
    reply += "</BODY></HTML>\n"
    return reply

