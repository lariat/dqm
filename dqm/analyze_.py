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
    Tests the input ROOT file. Returns True if ROOT file is
    okay, returns False otherwise.

    """

    try:
        #v1740_array = rnp.root2array(
        #    file_path, 'DataQuality/v1740', branches=['trigger_time_tag'],
        #    start=0, stop=1, step=1
        #    )

        v1751_array = rnp.root2array(
            file_path, 'DataQuality/v1751', branches=['trigger_time_tag'],
            start=0, stop=1, step=1
            )

        mwpc_array = rnp.root2array(
            file_path, 'DataQuality/mwpc', branches=['tdc_time_stamp'],
            start=0, stop=1, step=1
            )

        wut_array = rnp.root2array(
            file_path, 'DataQuality/wut', ['time_header'],
            start=0, stop=1, step=1
            )

    except:
        return False

    return True

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

# set redis key prefix
key_prefix = 'dqm/run:{}/spill:{}/'.format(run, spill)

# test ROOT file
ok = test_root_file(file_path)
if not ok:
    exit_status = 3
    print "Bad spill file: {}".format(file_path)
    print "Exiting with exit status {}".format(exit_status)
    # tell redis that this is a bad spill file
    sys.exit(exit_status)

# set keys
analyze_key = key_prefix + 'analyze'
v1751_tof_histogram_key = key_prefix + 'v1751-tof-histogram'

# get array of TOF values from CAEN V1751 waveforms
v1751_tof_array = tofutils.get_v1751_tof(file_path)

# get histogram of TOF values from CAEN V1751 waveforms
v1751_tof_histogram, v1751_tof_bin_edges = np.histogram(
    v1751_tof_array, bins=100, range=(0, 100)
    )

if v1751_tof_histogram_key in redis.keys(v1751_tof_histogram_key):
    redis.delete(v1751_tof_histogram_key)

# send commands in a pipeline to save on round-trip time
p = redis.pipeline()
p.setex(key_prefix + 'analyze', 0, 604800)
p.rpush(v1751_tof_histogram_key, *v1751_tof_histogram)
p.expire(v1751_tof_histogram_key, 604800)
p.execute()

