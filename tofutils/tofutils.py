from __future__ import division
import sys

import numpy as np
import root_numpy as rnp

#import inspect
#cmd_subdir = os.path.realpath(
#    os.path.abspath(
#        os.path.join(
#            os.path.split(inspect.getfile( inspect.currentframe() ))[0],
#            '..'
#            )
#        )
#    )
#if cmd_subdir not in sys.path:
#    sys.path.insert(0, cmd_subdir)

from constants import *

def parse_run_spill(file_path):
    token_list = file_path.split("_")
    run = token_list[-3]
    spill = token_list[-1].split(".")[-2]
    return run, spill

def update_progress(progress):
    bar_length = 25  # modify this to change the length of the progress bar
    status = ""
    if isinstance(progress, int):
        progress = float(progress)
    if not isinstance(progress, float):
        progress = 0
        status = "error: progress variable must be float\r\n"
    if progress < 0:
        progress = 0
        status = "Halt...\r\n"
    if progress >= 1:
        progress = 1
        status = "Done...\r\n"
    block = int(round(bar_length * progress))
    text = "\rPercent: [{0}] {1}% {2}".format(
        "#" * block + "-" * (bar_length-block),
        round(progress * 100, 0),
        status
        )
    sys.stdout.write(text)
    sys.stdout.flush()

def find_v1751_hits(logic):
    threshold1 = -40
    threshold2 = -40
    logic_gradient = np.gradient(logic)
    flag = (
        np.roll((logic_gradient > threshold1), 1) &
        (logic_gradient < threshold2)
        )
    time_bins = np.arange(0, V1751_NUMBER_SAMPLES)
    hits = time_bins[flag]
    return hits

def match_v1751_hits(hits1, hits2):
    time_threshold = 10  # nanoseconds
    rows = hits1.size
    cols = hits2.size
    diff_array = np.zeros((rows, cols), dtype=np.int64)
    for i in xrange(rows):
        for j in xrange(cols):
            diff_array[i][j] = abs(hits1[i] - hits2[j])
    matched_hits = np.array([], dtype=np.int64)
    for i in xrange(rows):
        if diff_array[i, :].size == 0:
            continue
        j = np.argmin(diff_array[i, :])
        if (diff_array[i, j] < time_threshold):
            matched_hits = np.append(np.min([ hits1[i], hits2[j] ]),
                                     matched_hits)
    return matched_hits[::-1]

def get_v1751_tof(file_path, flatten=True):

    us_min_bin = 8000
    us_max_bin = 9000
    ds_min_bin = 8000
    ds_max_bin = 9000

    branches = [
        'board_id',
        'trigger_time_tag',
        'channel_0',
        'channel_1',
        'channel_2',
        'channel_3',
        ]

    selection = 'board_id == 8'
    arr = rnp.root2array(file_path, 'DataQuality/v1751', branches, selection)
    number_entries = arr.size
    tof_array = []

    ustof1_waveform = arr['channel_0'].astype(dtype=np.int64)
    ustof2_waveform = arr['channel_1'].astype(dtype=np.int64)
    dstof1_waveform = arr['channel_2'].astype(dtype=np.int64)
    dstof2_waveform = arr['channel_3'].astype(dtype=np.int64)

    #sys.stdout.write("Getting TOF...\n")

    for entry in xrange(number_entries):

        #update_progress((entry+1) / number_entries)

        dstof1_hits = find_v1751_hits(dstof1_waveform[entry])
        dstof2_hits = find_v1751_hits(dstof2_waveform[entry])

        if dstof1_hits.size == 0 or dstof2_hits.size == 0:
            tof_array.append(np.array([], dtype=np.int64))
            continue

        dstof_hits = match_v1751_hits(dstof1_hits, dstof2_hits)

        dstof_flag = (dstof_hits > ds_min_bin) & (dstof_hits < ds_max_bin)
        dstof_hits = dstof_hits[dstof_flag]

        if dstof_hits.size == 0 or dstof_hits.size > 1:
            tof_array.append(np.array([], dtype=np.int64))
            continue

        ustof1_hits = find_v1751_hits(ustof1_waveform[entry])
        ustof2_hits = find_v1751_hits(ustof2_waveform[entry])

        if (ustof1_hits.size == 0 or ustof2_hits.size == 0):
            tof_array.append(np.array([], dtype=np.int64))
            continue

        ustof_hits = match_v1751_hits(ustof1_hits, ustof2_hits),

        ustof_flag = (ustof_hits > us_min_bin) & (ustof_hits < us_max_bin)
        ustof_hits = ustof_hits[ustof_flag]

        if ustof_hits.size == 0:
            tof_array.append(np.array([], dtype=np.int64))
            continue

        for dstof_hit in dstof_hits:
            tof = dstof_hit - ustof_hits
            flag = (tof > 20) & (tof < 100)
            tof = tof[flag]
            if tof.size == 1:
                tof_array.append(tof)
            else:
                tof_array.append(np.array([], dtype=np.int64))

    #sys.stdout.write("\n")

    tof_array = np.array(tof_array)

    if flatten and tof_array.size > 0:
        return np.hstack(tof_array.flat)

    return tof_array

def get_v1751_tof_hits(file_path):

    branches = [
        'board_id',
        'trigger_time_tag',
        'channel_0',
        'channel_1',
        'channel_2',
        'channel_3',
        ]

    selection = 'board_id == 8'
    arr = rnp.root2array(file_path, 'DataQuality/v1751', branches, selection)
    number_entries = arr.size
    tof_array = []

    ustof1_waveform = arr['channel_0'].astype(dtype=np.int64)
    ustof2_waveform = arr['channel_1'].astype(dtype=np.int64)
    dstof1_waveform = arr['channel_2'].astype(dtype=np.int64)
    dstof2_waveform = arr['channel_3'].astype(dtype=np.int64)

    ustof_hits_array = []
    dstof_hits_array = []

    for entry in xrange(number_entries):

        ustof1_hits = find_v1751_hits(ustof1_waveform[entry])
        ustof2_hits = find_v1751_hits(ustof2_waveform[entry])
        dstof1_hits = find_v1751_hits(dstof1_waveform[entry])
        dstof2_hits = find_v1751_hits(dstof2_waveform[entry])

        ustof_hits = match_v1751_hits(ustof1_hits, ustof2_hits)
        dstof_hits = match_v1751_hits(dstof1_hits, dstof2_hits)

        if ustof_hits.size:
            ustof_hits_array.extend(ustof_hits.tolist())

        if dstof_hits.size:
            dstof_hits_array.extend(dstof_hits.tolist())

    return ustof_hits_array, dstof_hits_array

if __name__ == '__main__':

    import argparse

    import matplotlib.pyplot as plt
    from matplotlib.ticker import AutoMinorLocator, MultipleLocator

    parser = argparse.ArgumentParser(description="Plot from ROOT file.")
    parser.add_argument("file", type=str, help="path to ROOT file")
    args = parser.parse_args()
    file_path = args.file

    print "Plotting from {}".format(file_path)

    ustof_hits_array, dstof_hits_array = get_v1751_tof_hits(file_path)

    fig = plt.figure(figsize=(7, 5), dpi=120)
    ax = fig.add_subplot(1, 1, 1)

    fig.suptitle("V1751 TOF hits")

    ax.hist(ustof_hits_array, bins=V1751_NUMBER_SAMPLES,
            range=(0, V1751_NUMBER_SAMPLES),
            label="USTOF ({})".format(len(ustof_hits_array)),
            color='g', edgecolor='none', histtype='stepfilled', alpha=0.75)
    ax.hist(dstof_hits_array, bins=V1751_NUMBER_SAMPLES,
            range=(0, V1751_NUMBER_SAMPLES),
            label="DSTOF ({})".format(len(dstof_hits_array)),
            color='y', edgecolor='none', histtype='stepfilled', alpha=0.75)
    ax.xaxis.set_minor_locator(AutoMinorLocator())
    ax.yaxis.set_minor_locator(AutoMinorLocator())
    ax.tick_params(which='major', length=7)
    ax.tick_params(which='minor', length=4)
    ax.set_xlabel("Time bin", fontsize=12)
    ax.set_ylabel("Entries / time bin", fontsize=12)
    ax.set_xlim([ 0, V1751_NUMBER_SAMPLES ])

    ax.legend(bbox_to_anchor=(0.725, 0.95), loc=2, borderaxespad=0,
              fontsize=8, frameon=False)

    plt.show()
    plt.close()

