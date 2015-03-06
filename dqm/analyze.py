#!/usr/bin/env python

import os
import sys
import inspect
import argparse

import numpy as np
import root_numpy as rnp

from redis import Redis

# http://stackoverflow.com/questions/279237/import-a-module-from-a-relative-path/6098238#6098238
#cmd_dir = os.path.realpath(
#    os.path.abspath(
#        os.path.split(inspect.getfile( inspect.currentframe() ))[0]
#        )
#    )
#if cmd_dir not in sys.path:
#    sys.path.insert(0, cmd_dir)
cmd_subdir = os.path.realpath(
    os.path.abspath(
        os.path.join(
            os.path.split(inspect.getfile( inspect.currentframe() ))[0],
            '..'
            )
        )
    )
if cmd_subdir not in sys.path:
    sys.path.insert(0, cmd_subdir)

import rawdatautils
import tofutils

def parse_run_spill(file_path):
    """
    Returns run number and spill number from parsed from
    file_path.

    run, spill = parse_run_spill(run, spill)

    """
    token_list = file_path.split("_")
    run = token_list[-3]
    spill = token_list[-1].split(".")[-2]
    return run, spill

def test_root_file(file_path):
    """
    Tests the input ROOT file. Returns a tuple of flags for
    the different trees. The flag for a good tree is `True`;
    the flag for a bad tree is `False`.

    (v1740_ok, v1751_ok, mwpc_ok, wut_ok)

    """

    # initialize the flags to `True`
    v1740_ok, v1751_ok, mwpc_ok, wut_ok = (True,) * 4

    try:
        v1740_array = rnp.root2array(
            file_path, 'DataQuality/v1740', branches=['trigger_time_tag'],
            start=0, stop=1, step=1
            )
    except:
        v1740_ok = False

    try:
        v1751_array = rnp.root2array(
            file_path, 'DataQuality/v1751', branches=['trigger_time_tag'],
            start=0, stop=1, step=1
            )
    except:
        v1751_ok = False

    try:
        mwpc_array = rnp.root2array(
            file_path, 'DataQuality/mwpc', branches=['tdc_time_stamp'],
            start=0, stop=1, step=1
            )
    except:
        mwpc_ok = False

    try:
        wut_array = rnp.root2array(
            file_path, 'DataQuality/wut', ['time_header'],
            start=0, stop=1, step=1
            )
    except:
        wut_ok = False

    return v1740_ok, v1751_ok, mwpc_ok, wut_ok

parser = argparse.ArgumentParser(description="Analyze from ROOT file.")
parser.add_argument('file', type=str, help="path to ROOT file")
args = parser.parse_args()

file_path = args.file

# attempt connection to redis server
redis = Redis()
try:
    redis.setex('hello', 1, 1)
except:
    exit_status = 10
    print "No connection to redis server"
    print "Exiting with exit status {}".format(exit_status)
    sys.exit(exit_status)

# parse run number and spill number from file name
run, spill = parse_run_spill(file_path)

# set redis key timeout to 2 weeks for now
key_timeout = 604800  # each count is 1 second

# set redis key prefix
key_prefix = 'dqm/run:{}/spill:{}/'.format(run, spill)

# set key for this analysis script
analyze_key = key_prefix + 'analyze'

# tell redis that we are currently analyzing this file
redis.set(analyze_key, 1)

v1740_ok, v1751_ok, mwpc_ok, wut_ok = test_root_file(file_path)

if (v1740_ok, v1751_ok, mwpc_ok, wut_ok) == (False, False, False, False):
    exit_status = 3
    print "Bad spill file: {}".format(file_path)
    print "Exiting with exit status {}".format(exit_status)
    # tell redis that this is a bad file
    redis.setex(analyze_key, exit_status, key_timeout)
    sys.exit(exit_status)

if v1751_ok:
    # set key
    v1751_tof_histogram_key = key_prefix + 'v1751/tof-histogram'

    # if key already exists in redis, delete the existing key
    redis.delete(v1751_tof_histogram_key)

    # get array of TOF values from CAEN V1751 waveforms
    v1751_tof_array = tofutils.get_v1751_tof(file_path)

    # get histogram of TOF values from CAEN V1751 waveforms
    v1751_tof_histogram, bin_edges = np.histogram(
        v1751_tof_array, bins=100, range=(10, 110)
        )

    # send commands in a pipeline to save on round-trip time
    p = redis.pipeline()
    p.rpush(v1751_tof_histogram_key, *v1751_tof_histogram)
    p.expire(v1751_tof_histogram_key, key_timeout)
    p.execute()

else:
    # tell redis that this v1751 tree is bad
    pass

if mwpc_ok:
    # set list of keys for the 16 TDCs of the MWPCs
    #mwpc_tdc_histogram_keys = [
    #    key_prefix + 'mwpc/tdc-{}-histogram'.format(i) for i in xrange(1, 17)
    #    ]
    mwpc_tdc_histogram_keys = [
        key_prefix + 'mwpc/tdc-{}-histogram'.format(tdc_index+1)
        for tdc_index in xrange(0, 16)
        ]

    # if keys already exists in redis, delete the existing keys
    redis.delete(*mwpc_tdc_histogram_keys)

    # get array of relative TDC hit timing
    hit_time_array = rawdatautils.get_mwpc_tdc_hit_time(file_path)

    # get histograms of relative TDC hit timing for each TDC
    mwpc_tdc_hit_time_histograms = [
        np.histogram(hit_time_array[tdc_index], bins=320, range=(0, 320))[0]
        for tdc_index in xrange(0, 16)
        ]

    # send commands in a pipeline to save on round-trip time
    p = redis.pipeline()
    for tdc_index in xrange(0, 16):
        p.rpush(mwpc_tdc_histogram_keys[tdc_index],
                *mwpc_tdc_hit_time_histograms[tdc_index])
        p.expire(mwpc_tdc_histogram_keys[tdc_index], key_timeout)
    p.execute()

else:
    # tell redis that this mwpc tree is bad
    pass

# tell redis that we are done analyzing this file
redis.setex(analyze_key, 0, key_timeout)

