#!/usr/bin/env python

import os
import sys
import inspect
import argparse
from datetime import datetime

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
from trackutils import mwpc

def get_spill_info(file_path):
    """
    Returns the following spill information from the
    artEventRecord tree

        - run_number
        - sub_run_number
        - time_stamp_low (Unix time from wall clock)

    Returns (run_number, spill_number, time_stamp)

    """

    try:
        spill_trailer = rnp.root2array(
            file_path,
            'DataQuality/artEventRecord',
            branches=['run_number', 'sub_run_number', 'time_stamp_low']
            )

        run_number = np.unique(spill_trailer['run_number'])
        spill_number = np.unique(spill_trailer['sub_run_number'])
        time_stamp = np.unique(spill_trailer['time_stamp_low'])

        if run_number.size != 1:
            print "Multiple run numbers detected!"
            print run_number

        if spill_number.size != 1:
            print "Multiple spill numbers detected!"
            print spill_number

        if time_stamp.size != 1:
            print "Multiple time stamps detected!"
            print time_stamp

        return run_number[0], spill_number[0], time_stamp[0]

    except:
        print "Cannot get artEventRecord information!"
        return 0, 0, 0

def get_spill_trailer(file_path):
    """
    Returns the following spill information from the
    SpillTrailer fragment:

        - runNumber
        - spillNumber
        - timeStamp (Unix time from wall clock)

    Returns (run_number, spill_number, time_stamp)

    """

    try:
        spill_trailer = rnp.root2array(
            file_path,
            'DataQuality/spillTrailer',
            branches=['runNumber', 'spillNumber', 'timeStamp']
            )

        run_number = np.unique(spill_trailer['runNumber'])
        spill_number = np.unique(spill_trailer['spillNumber'])
        time_stamp = np.unique(spill_trailer['timeStamp'])

        if run_number.size != 1:
            print "Multiple run numbers detected!"
            print run_number

        if spill_number.size != 1:
            print "Multiple spill numbers detected!"
            print spill_number

        if time_stamp.size != 1:
            print "Multiple time stamps detected!"
            print time_stamp

        return run_number[0], spill_number[0], time_stamp[0]

    except:
        print "Cannot get spillTrailer information!"
        return 0, 0, 0

def test_root_file(file_path):
    """
    Tests the input ROOT file. Returns a tuple of flags for
    the different trees. The flag for a good tree is `True`;
    the flag for a bad tree is `False`.

    Returns (v1740_ok, v1751_ok, mwpc_ok, wut_ok)

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

def mwpc_hits_histogram(hit_array, tdc_index, column, bins, bins_range):
    try:
        histogram = np.histogram(
            hit_array[tdc_index][:, column],
            bins=bins,
            range=bins_range
            )[0]
    except:
        histogram = np.zeros(bins, dtype=np.int64)
    return histogram

parser = argparse.ArgumentParser(description="Analyze from ROOT file.")
parser.add_argument('file', type=str, help="path to ROOT file")
args = parser.parse_args()

file_path = args.file

log_messages = []
datetime_format = '%Y-%m-%d %H:%M:%S'
date_time = datetime.now().strftime(datetime_format)

# attempt connection to redis server
redis = Redis()
try:
    redis.setex('hello', 1, 1)
except:
    exit_status = 10
    print "No connection to redis server"
    print "Exiting with exit status {}".format(exit_status)
    sys.exit(exit_status)

# get run number, spill number, and time stamp
run_number, spill_number, time_stamp = get_spill_info(file_path)

# set redis key timeout to 2 weeks for now
#key_timeout = 604800  # each count is 1 second

# set redis key timeout to 4 weeks
key_timeout = 2419200  # each count is 1 second

# set redis key prefix
run_key_prefix = 'dqm/run:{}//'.format(run_number)
spill_key_prefix = 'dqm/run:{}/spill:{}/'.format(run_number, spill_number)

# set key for latest run/spill analyzed
latest_run_key = 'dqm/latest-run'
latest_spill_key = 'dqm/latest-spill'

# set key that stores spill numbers analyzed in this run
spills_list_key = run_key_prefix + 'spills'

# set key for this analysis script
analyze_key = spill_key_prefix + 'analyze'

# set key for spill time stamp and send to redis
time_stamp_key = spill_key_prefix + 'timestamp'
redis.setex(time_stamp_key, time_stamp, key_timeout)

# set key prefix for log messages
log_message_key_prefix = spill_key_prefix + 'log:'

# tell redis that we are currently analyzing this file
redis.setex(analyze_key, 1, key_timeout)

v1740_ok, v1751_ok, mwpc_ok, wut_ok = test_root_file(file_path)

if (v1740_ok, v1751_ok, mwpc_ok, wut_ok) == (False, False, False, False):
    exit_status = 3
    print "Bad spill file: {}".format(file_path)
    print "Exiting with exit status {}".format(exit_status)
    # tell redis that this is a bad file
    redis.setex(analyze_key, exit_status, key_timeout)
    sys.exit(exit_status)

# get list of spills that have already been analyzed
spills_list = np.array(redis.lrange(spills_list_key, 0, -1),
                       dtype=np.int64)

# if spill has already been analyzed, exit
if spill_number in spills_list:
    exit_status = 0
    print "Spill file has already been analyzed: {}".format(file_path)
    print "Exiting with exit status {}".format(exit_status)
    sys.exit(exit_status)

# tell redis that this is the latest run/spill analyzed and
# add this spill number to list of analyzed spills
p = redis.pipeline()
p.set(latest_run_key, run_number)
p.set(latest_spill_key, spill_number)
p.rpush(spills_list_key, spill_number)
p.expire(spills_list_key, key_timeout)
p.execute()

#/////////////////////////////////////////////////////////////
# CAEN V1740
#/////////////////////////////////////////////////////////////

if v1740_ok:
    # set keys
    v1740_data_block_histogram_keys = [
        spill_key_prefix +
        'v1740/board-{}-data-block-histogram'.format(board_id)
        for board_id in xrange(0, 8)
        ]

    # get arrays of CAEN V1740 data block time stamps
    # each trigger time tag count is 8 nanoseconds
    v1740_times = [
        rawdatautils.get_caen_trigger_time_tag(file_path, board_id) \
        * 0.008  # microseconds
        for board_id in xrange(0, 8)
        ]

    # get histogram of CAEN V1740 data block time stamps; units in seconds
    v1740_data_block_histograms = [
        np.histogram(v1740_times[board_id] * 1e-6, bins=300, range=(0, 30))[0]
        for board_id in xrange(0, 8)
        ]

    # if keys already exist in redis, delete the existing keys
    redis.delete(*v1740_data_block_histogram_keys)

    # send commands in a pipeline to save on round-trip time
    p = redis.pipeline()
    for board_id in xrange(0, 8):
        p.rpush(v1740_data_block_histogram_keys[board_id],
                *v1740_data_block_histograms[board_id])
        p.expire(v1740_data_block_histogram_keys[board_id], key_timeout)
    p.execute()

    # tell redis that this v1740 tree is okay
    log_messages.append(
        {
            'timestamp': datetime.now().strftime(datetime_format),
            'level': 'info',
            'message': 'Data stream is OK from CAEN V1740 boards.',
            'run': run_number,
            'spill': spill_number,
            }
        )

else:
    # tell redis that this v1740 tree is bad
    log_messages.append(
        {
            'timestamp': datetime.now().strftime(datetime_format),
            'level': 'warning',
            'message': 'No data stream from any CAEN V1740 boards!',
            'run': run_number,
            'spill': spill_number,
            }
        )

#/////////////////////////////////////////////////////////////
# CAEN V1751
#/////////////////////////////////////////////////////////////

if v1751_ok:
    # set keys
    v1751_board_0_data_block_histogram_key = spill_key_prefix + \
        'v1751/board-0-data-block-histogram'
    v1751_board_1_data_block_histogram_key = spill_key_prefix + \
        'v1751/board-1-data-block-histogram'
    v1751_board_0_adc_count_histogram_keys = [
        spill_key_prefix + 'v1751/board-0-channel-{}-adc-count-histogram' \
        .format(channel)
        for channel in xrange(8)
        ]
    v1751_board_1_adc_count_histogram_keys = [
        spill_key_prefix + 'v1751/board-1-channel-{}-adc-count-histogram' \
        .format(channel)
        for channel in xrange(8)
        ]
    v1751_ustof_hit_histogram_key = spill_key_prefix + \
        'v1751/ustof-hit-histogram'
    v1751_dstof_hit_histogram_key = spill_key_prefix + \
        'v1751/dstof-hit-histogram'
    v1751_tof_histogram_key = spill_key_prefix + 'v1751/tof-histogram'

    # if keys already exist in redis, delete the existing keys
    redis.delete(v1751_board_0_data_block_histogram_key)
    redis.delete(v1751_board_1_data_block_histogram_key)
    redis.delete(v1751_board_0_adc_count_histogram_keys)
    redis.delete(v1751_board_1_adc_count_histogram_keys)
    redis.delete(v1751_ustof_hit_histogram_key)
    redis.delete(v1751_dstof_hit_histogram_key)
    redis.delete(v1751_tof_histogram_key)

    # get arrays of CAEN V1751 data block time stamps
    # each trigger time tag count is 8 nanoseconds
    v1751_board_0_time = rawdatautils.get_caen_trigger_time_tag(file_path, 8) \
                         * 0.008  # microseconds
    v1751_board_1_time = rawdatautils.get_caen_trigger_time_tag(file_path, 9) \
                         * 0.008  # microseconds

    # get histogram of CAEN V1751 data block time stamps; units in seconds
    v1751_board_0_data_block_histogram, bin_edges = np.histogram(
        v1751_board_0_time * 1e-6, bins=300, range=(0, 30))
    v1751_board_1_data_block_histogram, bin_edges = np.histogram(
        v1751_board_1_time * 1e-6, bins=300, range=(0, 30))

    # get histograms of CAEN V1751 ADC count
    v1751_board_0_adc_count_histograms = \
        rawdatautils.get_caen_adc_count_histograms(file_path, board_id=8)
    v1751_board_1_adc_count_histograms = \
        rawdatautils.get_caen_adc_count_histograms(file_path, board_id=9)

    # get array of TOF hits from CAEN V1751 waveforms
    v1751_ustof_hit_array, v1751_dstof_hit_array = tofutils.get_v1751_tof_hits(
        file_path)

    # get histogram of TOF hits from CAEN V1751 waveforms
    v1751_ustof_hit_histogram = np.histogram(
        v1751_ustof_hit_array, bins=1792, range=(0, 1792))[0]
    v1751_dstof_hit_histogram = np.histogram(
        v1751_dstof_hit_array, bins=1792, range=(0, 1792))[0]

    # get array of TOF values from CAEN V1751 waveforms
    v1751_tof_array = tofutils.get_v1751_tof(file_path, flatten=True)

    # get histogram of TOF values from CAEN V1751 waveforms
    v1751_tof_histogram, bin_edges = np.histogram(
        v1751_tof_array, bins=100, range=(10, 110))

    # send commands in a pipeline to save on round-trip time
    p = redis.pipeline()
    p.rpush(v1751_board_0_data_block_histogram_key,
            *v1751_board_0_data_block_histogram)
    p.rpush(v1751_board_1_data_block_histogram_key,
            *v1751_board_1_data_block_histogram)
    p.expire(v1751_board_0_data_block_histogram_key, key_timeout)
    p.expire(v1751_board_1_data_block_histogram_key, key_timeout)
    for channel in xrange(0, 8):
        p.rpush(v1751_board_0_adc_count_histogram_keys[channel],
                *v1751_board_0_adc_count_histograms[channel])
        p.rpush(v1751_board_1_adc_count_histogram_keys[channel],
                *v1751_board_1_adc_count_histograms[channel])
        p.expire(v1751_board_0_adc_count_histogram_keys[channel], key_timeout)
        p.expire(v1751_board_1_adc_count_histogram_keys[channel], key_timeout)
    p.rpush(v1751_ustof_hit_histogram_key, *v1751_ustof_hit_histogram)
    p.rpush(v1751_dstof_hit_histogram_key, *v1751_dstof_hit_histogram)
    p.expire(v1751_ustof_hit_histogram_key, key_timeout)
    p.expire(v1751_dstof_hit_histogram_key, key_timeout)
    p.rpush(v1751_tof_histogram_key, *v1751_tof_histogram)
    p.expire(v1751_tof_histogram_key, key_timeout)
    p.execute()

    # tell redis that this v1751 tree is okay
    log_messages.append(
        {
            'timestamp': datetime.now().strftime(datetime_format),
            'level': 'info',
            'message': 'Data stream is OK from CAEN V1751 boards.',
            'run': run_number,
            'spill': spill_number,
            }
        )

else:
    # tell redis that this v1751 tree is bad
    log_messages.append(
        {
            'timestamp': datetime.now().strftime(datetime_format),
            'level': 'warning',
            'message': 'No data stream from any CAEN V1751 boards!',
            'run': run_number,
            'spill': spill_number,
            }
        )

#/////////////////////////////////////////////////////////////
# MWPCs
#/////////////////////////////////////////////////////////////

if mwpc_ok:
    # set keys
    mwpc_data_block_histogram_key = spill_key_prefix + \
        'mwpc/data-block-histogram'
    mwpc_tdc_good_hit_channel_histogram_keys = [
        spill_key_prefix + 'mwpc/tdc-{}-good-hit-channel-histogram'
        .format(tdc_index+1)
        for tdc_index in xrange(0, 16)
        ]
    mwpc_tdc_good_hit_timing_histogram_keys = [
        spill_key_prefix + 'mwpc/tdc-{}-good-hit-timing-histogram'
        .format(tdc_index+1)
        for tdc_index in xrange(0, 16)
        ]
    mwpc_tdc_bad_hit_channel_histogram_keys = [
        spill_key_prefix + 'mwpc/tdc-{}-bad-hit-channel-histogram'
        .format(tdc_index+1)
        for tdc_index in xrange(0, 16)
        ]
    mwpc_tdc_bad_hit_timing_histogram_keys = [
        spill_key_prefix + 'mwpc/tdc-{}-bad-hit-timing-histogram'
        .format(tdc_index+1)
        for tdc_index in xrange(0, 16)
        ]

    # if keys already exist in redis, delete the existing keys
    redis.delete(mwpc_data_block_histogram_key)
    redis.delete(*mwpc_tdc_good_hit_timing_histogram_keys)
    redis.delete(*mwpc_tdc_good_hit_channel_histogram_keys)
    redis.delete(*mwpc_tdc_bad_hit_timing_histogram_keys)
    redis.delete(*mwpc_tdc_bad_hit_channel_histogram_keys)

    # get array of MWPC TDC time stamp
    # each TDC time stamp count is 1/106.208e6 seconds
    mwpc_time = rawdatautils.get_mwpc_tdc_time_stamp(file_path) \
                / 106.208  # microseconds

    # get histogram of MWPC data block time stamps; units in seconds
    mwpc_data_block_histogram, bin_edges = np.histogram(
        mwpc_time * 1e-6, bins=300, range=(0, 30)
        )

    # get arrays of good hits and bad hits
    good_hit_array, bad_hit_array = mwpc.cluster.get_hits(file_path)

    # get channel and timing histograms of good and bad hits
    mwpc_tdc_good_hit_channel_histograms = [
        mwpc_hits_histogram(good_hit_array, tdc_index, 0, 64, (0, 64))
        for tdc_index in xrange(0, 16)
        ]
    mwpc_tdc_good_hit_timing_histograms = [
        mwpc_hits_histogram(good_hit_array, tdc_index, 1, 1024, (0, 1024))
        for tdc_index in xrange(0, 16)
        ]
    mwpc_tdc_bad_hit_channel_histograms = [
        mwpc_hits_histogram(bad_hit_array, tdc_index, 0, 64, (0, 64))
        for tdc_index in xrange(0, 16)
        ]
    mwpc_tdc_bad_hit_timing_histograms = [
        mwpc_hits_histogram(bad_hit_array, tdc_index, 1, 1024, (0, 1024))
        for tdc_index in xrange(0, 16)
        ]

    # send commands in a pipeline to save on round-trip time
    p = redis.pipeline()
    p.rpush(mwpc_data_block_histogram_key, *mwpc_data_block_histogram)
    p.expire(mwpc_data_block_histogram_key, key_timeout)
    for tdc_index in xrange(0, 16):
        # add channel and timing histograms of good and bad hits
        p.rpush(mwpc_tdc_good_hit_channel_histogram_keys[tdc_index],
                *mwpc_tdc_good_hit_channel_histograms[tdc_index])
        p.rpush(mwpc_tdc_good_hit_timing_histogram_keys[tdc_index],
                *mwpc_tdc_good_hit_timing_histograms[tdc_index])
        p.rpush(mwpc_tdc_bad_hit_channel_histogram_keys[tdc_index],
                *mwpc_tdc_bad_hit_channel_histograms[tdc_index])
        p.rpush(mwpc_tdc_bad_hit_timing_histogram_keys[tdc_index],
                *mwpc_tdc_bad_hit_timing_histograms[tdc_index])

        # set timeout of channel and timing histograms of good and bad hits
        p.expire(mwpc_tdc_good_hit_channel_histogram_keys[tdc_index],
                 key_timeout)
        p.expire(mwpc_tdc_good_hit_timing_histogram_keys[tdc_index],
                 key_timeout)
        p.expire(mwpc_tdc_bad_hit_channel_histogram_keys[tdc_index],
                 key_timeout)
        p.expire(mwpc_tdc_bad_hit_timing_histogram_keys[tdc_index],
                 key_timeout)
    p.execute()

    # tell redis that this mwpc tree is okay
    log_messages.append(
        {
            'timestamp': datetime.now().strftime(datetime_format),
            'level': 'info',
            'message': 'Data stream is OK from MWPCs.',
            'run': run_number,
            'spill': spill_number,
            }
        )

else:
    # tell redis that this mwpc tree is bad
    log_messages.append(
        {
            'timestamp': datetime.now().strftime(datetime_format),
            'level': 'warning',
            'message': 'No data stream from MWPCs!',
            'run': run_number,
            'spill': spill_number,
            }
        )

#/////////////////////////////////////////////////////////////
# WUT
#/////////////////////////////////////////////////////////////

if wut_ok:
    # set keys
    wut_data_block_histogram_key = spill_key_prefix + \
        'wut/data-block-histogram'

    # each time header count is 16 microseconds
    wut_time = rawdatautils.get_wut_time_header(file_path) \
               * 16.0  # microseconds

    # get histogram of WUT data block time stamps; units in seconds
    wut_data_block_histogram, bin_edges = np.histogram(
        wut_time * 1e-6, bins=300, range=(0, 30)
        )

    # if keys already exist in redis, delete the existing keys
    redis.delete(wut_data_block_histogram_key)

    # send commands in a pipeline to save on round-trip time
    p = redis.pipeline()
    p.rpush(wut_data_block_histogram_key, *wut_data_block_histogram)
    p.expire(wut_data_block_histogram_key, key_timeout)
    p.execute()

    # tell redis that this wut tree is okay
    log_messages.append(
        {
            'timestamp': datetime.now().strftime(datetime_format),
            'level': 'info',
            'message': 'Data stream is OK from WUT.',
            'run': run_number,
            'spill': spill_number,
            }
        )

else:
    # tell redis that this wut tree is bad
    log_messages.append(
        {
            'timestamp': datetime.now().strftime(datetime_format),
            'level': 'warning',
            'message': 'No data stream from WUT!',
            'run': run_number,
            'spill': spill_number,
            }
        )

# tell redis that we are done analyzing this file
redis.setex(analyze_key, 0, key_timeout)

# time to add spill histograms to cumulative run histograms
# get spill keys added to redis during this script execution
spill_keys = redis.keys(spill_key_prefix + '*')

for spill_key in spill_keys:
    # set cumulative run key
    run_key = '//'.join(spill_key.split('/spill:{}/'.format(spill_number)))
    # add current spill histogram to cumulative run histogram
    if spill_key.split('-')[-1] == 'histogram':
        spill_array = np.array(redis.lrange(spill_key, 0, -1), dtype=np.int64)
        run_array = np.array(redis.lrange(run_key, 0, -1), dtype=np.int64)
        if run_array.size == spill_array.size:
            run_array += spill_array
        else:
            run_array = spill_array
        p = redis.pipeline()
        p.delete(run_key)
        p.rpush(run_key, *run_array)
        p.expire(run_key, key_timeout)
        p.execute()

# send log messages to redis
p = redis.pipeline()
for log_message_index in xrange(len(log_messages)):
    log_message_key = log_message_key_prefix + str(log_message_index)
    p.hmset(log_message_key, log_messages[log_message_index])
    p.expire(log_message_key, key_timeout)
p.execute()

