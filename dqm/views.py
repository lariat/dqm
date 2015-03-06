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

@app.route('/mwpc')
def mwpc():
    return render_template('mwpc.html',
                           title="Multi-Wire Proportional Chambers")

@app.route('/physics')
def physics():
    return render_template('physics.html',
                           title="Physics")

@app.route('/req')
def req():
    args = request.args
    name = args['name']
    email = args['email']
    message = "Hello, {} ({})!".format(name, email)
    return message

@app.route('/json')
def json():
    query = request.args.get('q', None)

    json_data = {
        'query': query,
        'data': [ { 'bin': 0, 'count': 1 }, { 'bin': 1, 'count': 0 } ],
        }

    if query == 'v1751-tof-histogram':
        p = redis.pipeline()
        keys = redis.keys('dqm/run:*/spill:*/v1751/tof-histogram')
        for key in keys:
            p.lrange(key, 0, -1)
        bins = np.arange(10, 110, 1)
        counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)
        data = [ { 'bin': i, 'count': j } for i, j in zip(bins, counts) ]
        json_data = {
            'query': query,
            'data': data,
            }

    elif query == 'mwpc-tdc-histograms':
        bins = np.arange(0, 320, 1)
        data_names = [
            'tdc{0:02d}data'.format(tdc_index+1) for tdc_index in xrange(0, 16)
            ]
        data = [ [] for tdc_index in xrange(0, 16) ]
        for tdc_index in xrange(0, 16):
            p = redis.pipeline()
            keys = redis.keys(
                'dqm/run:*/spill:*/mwpc/tdc-{}-histogram'.format(tdc_index+1)
                )
            for key in keys:
                p.lrange(key, 0, -1)
            counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)
            data[tdc_index] = [
                { 'bin': i, 'count': j } for i, j in zip(bins, counts)
                ]
        json_data = {
            data_names[tdc_index]: data[tdc_index]
            for tdc_index in xrange(0, 16)
            }
        json_data['query'] = query

    return jsonify(json_data)

#@app.route('/json_')
#def json_():
#    args = request.args
#    name = args['name']
#    email = args['email']
#    json_data = {
#        'name': name,
#        'email': email,
#        'data': [ { 'bin': 1, 'count': 2 }, { 'bin': 2, 'count': 3 } ],
#        }
#    return jsonify(json_data)

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

@app.route('/query')
def query():
    return

# from redis import Redis()
# redis = Redis()
# p = redis.pipeline()
# p.rpush('foo', *[0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
# p.lrange('foo', 0, -1)
# p.lrange('foo', 0, -1)
# np.sum(np.array(p.execute(), dtype=np.int64), axis=0)

