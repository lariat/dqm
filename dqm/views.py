from flask import render_template, request, jsonify
import numpy as np
from redis import Redis
from dqm import app

redis = Redis()

@app.route('/')
@app.route('/index')
def index():
    user = {'nickname': 'Johnny'}  # fake user
    posts = [  # fake array of posts
        {
            'author': {'nickname': 'Fred'},
            'body': 'Beautiful day in Portland!'
        },
        {
            'author': {'nickname': 'Carrie'},
            'body': 'LOL PORTLAND SUCKS'
        }
    ]
    return render_template('index.html',
                           title='Home',
                           user=user,
                           posts=posts)

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

@app.route('/wut')
def wut():
    return render_template('wut.html',
                           title="Wave Union TDC")

@app.route('/triggers')
def triggers():
    return render_template('triggers.html',
                           title="Triggers")

@app.route('/physics')
def physics():
    return render_template('physics.html',
                           title="Physics")

@app.route('/json')
def json():
    query = request.args.get('q', None)
    run = request.args.get('r', '*')
    spill = request.args.get('s', '*')

    json_data = {
        'query': query,
        'data': [ { 'bin': 0, 'count': 1 }, { 'bin': 1, 'count': 0 } ],
        }

    if run == '*' and spill == '*':
        key_prefix = 'dqm/run:*//'
    else:
        key_prefix = 'dqm/run:*/spill:*/'

    if query == 'trigger-histogram':
        device = request.args.get('device', None)
        board_id = request.args.get('board_id', -1)
        #integral = request.args.get('integral', False)
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
        keys = redis.keys(key_prefix + device_key + 'trigger-histogram')
        p = redis.pipeline()
        for key in keys:
            p.lrange(key, 0, -1)
        bins = np.linspace(0, 30, 300, endpoint=False, dtype=np.float64)
        counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)
        if type(counts) != np.ndarray:
            return jsonify(json_data)
        #if integral:
        #    return jsonify(data=np.sum(counts))
        data = [
            { 'bin': round(i, 1), 'count': j } for i, j in zip(bins, counts)
        ]
        json_data = {
            'query': query,
            'data': data,
            }
        return jsonify(json_data)

    elif query == 'trigger-counts':
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
            keys = redis.keys(key_prefix + device_key + 'trigger-histogram')
            p = redis.pipeline()
            for key in keys:
                p.lrange(key, 0, -1)
            counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)
            if type(counts) != np.ndarray:
                return jsonify(json_data)
            counts_dict[device_value] = np.sum(counts)
        json_data = counts_dict
        return jsonify(json_data)

    elif query == 'v1751-adc-count-histogram':
        board_id = request.args.get('board_id', -1)
        channel = request.args.get('channel', -1)
        if int(board_id) < 0 or int(channel) < 0:
            return jsonify(json_data)
        keys = redis.keys(
            key_prefix + 'v1751/board-{}-channel-{}-adc-count-histogram' \
            .format(board_id, channel)
            )
        p = redis.pipeline()
        for key in keys:
            p.lrange(key, 0, -1)
        bins = np.arange(0, 1024, 1)
        counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)
        if type(counts) != np.ndarray:
            return jsonify(json_data)
        data = [
            { 'bin': i, 'count': j } for i, j in zip(bins, counts)
        ]
        json_data = {
            'query': query,
            'data': data,
            }
        return jsonify(json_data)

    elif query == 'mwpc-timing-histogram':
        tdc = request.args.get('tdc', -1)
        if int(tdc) not in range(1, 17):
            return jsonify(json_data)
        keys = redis.keys(key_prefix +
                          'mwpc/tdc-{}-timing-histogram'.format(tdc))
        p = redis.pipeline()
        for key in keys:
            p.lrange(key, 0, -1)
        bins = np.arange(200, 520, 1)
        counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)
        if type(counts) != np.ndarray:
            return jsonify(json_data)
        data = [
            { 'bin': i, 'count': j } for i, j in zip(bins, counts)
        ]
        json_data = {
            'query': query,
            'data': data,
            }
        return jsonify(json_data)

    #elif query == 'mwpc-tdc-histograms':
    #    bins = np.arange(200, 520, 1)
    #    data_names = [
    #        'tdc{0:02d}data'.format(tdc_index+1) for tdc_index in xrange(0, 16)
    #        ]
    #    data = [ [] for tdc_index in xrange(0, 16) ]
    #    for tdc_index in xrange(0, 16):
    #        keys = redis.keys(
    #            key_prefix + 'mwpc/tdc-{}-histogram'.format(tdc_index+1)
    #            )
    #        p = redis.pipeline()
    #        for key in keys:
    #            p.lrange(key, 0, -1)
    #        counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)
    #        data[tdc_index] = [
    #            { 'bin': i, 'count': j } for i, j in zip(bins, counts)
    #            ]
    #    json_data = {
    #        data_names[tdc_index]: data[tdc_index]
    #        for tdc_index in xrange(0, 16)
    #        }
    #    json_data['query'] = query
    #    return jsonify(json_data)

    elif query == 'v1751-tof-histogram':
        keys = redis.keys(key_prefix + 'v1751/tof-histogram')
        p = redis.pipeline()
        for key in keys:
            p.lrange(key, 0, -1)
        bins = np.arange(10, 110, 1)
        counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)
        if type(counts) != np.ndarray:
            return jsonify(json_data)
        data = [ { 'bin': i, 'count': j } for i, j in zip(bins, counts) ]
        json_data = {
            'query': query,
            'data': data,
            }
        return jsonify(json_data)

    return jsonify(json_data)

# testing area below

@app.route('/json_dispatch')
def json_dispatch():
    x = 100 + 15 * np.random.randn(100)
    min_bin = 40
    max_bin = 160
    bin_step = 5
    number_bins = (max_bin - min_bin) / bin_step
    counts, bins = np.histogram(x, bins=number_bins, range=(min_bin, max_bin))
    data = [ { 'bin': i, 'count': j } for i, j in zip(bins[:-1], counts) ]
    args = request.args
    name = args['name']
    json_data = {
        'name': name,
        'min_bin': min_bin,
        'max_bin': max_bin,
        'bin_step': bin_step,
        'number_bins': number_bins,
        'data': data,
        }
    return jsonify(json_data)

@app.route('/req')
def req():
    args = request.args
    name = args['name']
    email = args['email']
    message = "Hello, {} ({})!".format(name, email)
    return message

@app.route('/cubism')
def cubism():
    return render_template('cubism.html',
                           title="Cubism")

@app.route('/random')
def random():
    data = list(np.random.randint(5, 10, 960))
    return jsonify(values=data)

