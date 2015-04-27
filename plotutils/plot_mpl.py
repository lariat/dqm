from __future__ import division
import os
import sys
import argparse
import shutil
import tarfile
from glob import glob
import time

import numpy as np
import root_numpy as rnp
import matplotlib
# force matplotlib to not use any X Window backend
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import AutoMinorLocator, MultipleLocator
from scipy.optimize import curve_fit
from redis import Redis

#def clean_dir(folder):
#    for the_file in os.listdir(folder):
#        file_path = os.path.join(folder, the_file)
#        try:
#            if os.path.isfile(file_path):
#                os.unlink(file_path)
#            #elif os.path.isdir(file_path): shutil.rmtree(file_path)
#        except Exception, e:
#            print e

def gaussian(x, a, b, c):
    """
    Returns a Gaussian function.

    x: input numpy array
    a: amplitude
    b: mean (expected value)
    c: standard deviation

    """
    return a * np.exp(- (x-b) * (x-b) / (2 * c * c))

def double_gaussian(x, a1, b1, c1, a2, b2, c2):
    return gaussian(x, a1, b1, c1) + gaussian(x, a2, b2, c2)

parser = argparse.ArgumentParser(description="Plot from redis.")
parser.add_argument('run', type=str, help="run number")
parser.add_argument('spill', type=str, help="spill number")
args = parser.parse_args()

selected_run = args.run.lstrip('0')
selected_spill = args.spill.lstrip('0')

#sys.stdout.write("Selected run: {}".format(selected_run) + '\n')
#sys.stdout.flush()

redis = Redis()

run_key_prefix = 'dqm/run:{}//'.format(selected_run)
spills_list_key = run_key_prefix + 'spills'

spills_list = np.array(redis.lrange(spills_list_key, 0, -1),
                       dtype=np.int64)

if type(spills_list) != np.ndarray:
    spills_list = np.zeros(1, dtype=np.int64)

number_spills = max(spills_list)

key_prefix = 'dqm/run:{}//'.format(selected_run)

plot_subtitle = "Run: ${}$".format(selected_run)

#output_dir = "/Users/johnnyho/repos/dqm/dqm/static/_plots/"
output_dir = "/lariat/data/users/lariatdqm/plots/"
output_file_prefix = "run_{}_".format(selected_run)

if selected_spill != 'All':
    key_prefix = 'dqm/run:{}/spill:{}/'.format(selected_run,
                                               selected_spill)
    plot_subtitle += "; Spill: ${}$".format(selected_spill)
    output_file_prefix += "spill_{}_".format(selected_spill)
else:
    plot_subtitle += "; Total number of spills: ${}$".format(number_spills)

output_prefix = output_dir + output_file_prefix

def create_tar():
    #sys.stdout.write("Creating tar.gz file..." + '\n')
    names = glob(output_prefix + '*.png')
    tar = tarfile.open(output_prefix + "plots.tar.gz", 'w:gz')
    for name in names:
        tar.add(name, arcname=os.path.basename(name), recursive=False)
    #tar.list(verbose=True)
    #sys.stdout.flush()
    tar.close()

def plot_tof():

    plot_title = "$\Delta t$ between DSTOF and USTOF V1751 hits\n" + \
                 plot_subtitle

    #///////////////////////////////////////////////////////////////////
    # let's query redis!
    #///////////////////////////////////////////////////////////////////
    keys = redis.keys(key_prefix + 'v1751/tof-histogram')

    p = redis.pipeline()

    for key in keys:
        p.lrange(key, 0, -1)

    bins = np.arange(10, 110, 1)
    counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)

    if type(counts) != np.ndarray:
        counts = np.zeros(bins.size, np.int64)
    #///////////////////////////////////////////////////////////////////

    delta_time = np.repeat(bins, counts)

    if len(delta_time) == 0:
        delta_time = [ -1 ]

    fig = plt.figure(figsize=(9, 6), dpi=120)
    ax = fig.add_subplot(1, 1, 1)

    fig.suptitle(plot_title)

    y_data, bin_edges, patches = ax.hist(
            delta_time, bins=102, range=(-1.5, 100.5),
            color='g', edgecolor='g', histtype='stepfilled'
            )

    ax.xaxis.set_minor_locator(AutoMinorLocator())
    ax.yaxis.set_minor_locator(AutoMinorLocator())
    ax.tick_params(which='major', length=7)
    ax.tick_params(which='minor', length=4)
    ax.set_xlabel("$\Delta t$ [$\mathrm{ns}$]", fontsize=12)
    ax.set_ylabel("Entries / $\mathrm{ns}$", fontsize=12)

    ax.set_xlim([ 0.0, 100.0 ])

    try:
        # initial guess for fitting
        y1 = (20, 33)  # approximate y range of first gaussian
        y2 = (33, 55)  # approximate y range of second gaussian
        amplitude_1_guess = np.max(y_data[y1[0]: y1[1]])
        mean_1_guess = 28
        std_1_guess = 1
        amplitude_2_guess = np.max(y_data[y2[0]: y2[1]])
        mean_2_guess = 40
        std_2_guess = 5
        guess = [
            amplitude_1_guess,
            mean_1_guess,
            std_1_guess,
            amplitude_2_guess,
            mean_2_guess,
            std_2_guess,
            ]

        #ax.text(0.15 * ax.get_xlim()[1], 0.8 * ax.get_ylim()[1],
        #        "$\pi^{+} \! / \mu^{+}$")
        #ax.text(0.5 * ax.get_xlim()[1], 0.2 * ax.get_ylim()[1], "$p$")

        x_data = np.arange(0, 101)
        popt, pcov = curve_fit(double_gaussian, x_data, y_data[1:],
                               p0=guess)

        x_data = np.linspace(0, 101, 1011)
        ax.plot(
            x_data, double_gaussian(
                x_data, popt[0], popt[1], popt[2], popt[3], popt[4], popt[5]),
            linewidth=1, color='k', alpha=0.6)

        ax.text(0.6 * ax.get_xlim()[1], 0.90 * ax.get_ylim()[1], "Preliminary",
                style='italic')
        ax.text(0.6 * ax.get_xlim()[1], 0.225 * ax.get_ylim()[1],
                "$A_1 = \, {:.2f}$ $\mathrm{{entries/ns}}$\n"
                "$\overline{{x}}_1 = \, {:.2f}$ $\mathrm{{ns}}$\n"
                "$\sigma_1 = \, {:.2f}$ $\mathrm{{ns}}$\n"
                "$A_1 \sigma_1 = \, {:.2f}$ $\mathrm{{entries}}$\n\n"
                .format(popt[0], popt[1], abs(popt[2]), popt[0]*abs(popt[2])) +
                "$A_2 = \, {:.2f}$ $\mathrm{{entries/ns}}$\n"
                "$\overline{{x}}_2 = \, {:.2f}$ $\mathrm{{ns}}$\n"
                "$\sigma_2 = \, {:.2f}$ $\mathrm{{ns}}$\n"
                "$A_2 \sigma_2 = \, {:.2f}$ $\mathrm{{entries}}$\n\n"
                .format(popt[3], popt[4], abs(popt[5]), popt[3]*abs(popt[5])) +
                "$A_1 \sigma_1 / A_2 \sigma_2 = \, {:.2f}$"
                .format(popt[0]*abs(popt[2]) / (popt[3]*abs(popt[5]))))

    except:
        #print "Fit has failed!"
        pass

    output_file_path = output_prefix + "tof.png"
    plt.savefig(output_file_path)
    #plt.show()
    plt.close()

def plot_mwpc_tdc(type_, start, stop):

    names = ('good', 'bad')

    bin_max_range = {
        'channel': (0, 64),
        'timing': (0, 1024),
        }
    bin_default_range = {
        'channel': (0, 64),
        'timing': (200, 520),
        }
    bin_default_range = {
        'channel': (0, 64),
        'timing': (200, 520),
        }

    plot_title = {
        'channel': "Channel occupancy of TDC hits",
        'timing': "Relative timing distributions of TDC hits"
        }

    axes_labels = {
        'channel': {
            'x': "TDC channel",
            'y': "Entries per TDC channel"
            },
        'timing': {
            'x': "TDC time tick",
            'y': "Entries per TDC time tick"
            }
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

    number_tdcs = 16

    good_hit_array = [ [] for i in range(number_tdcs) ]
    bad_hit_array = [ [] for i in range(number_tdcs) ]

    for tdc_index in xrange(number_tdcs):

        counts_dict = {}

        for name in names:
            keys = redis.keys(
                key_prefix +
                'mwpc/tdc-{}-{}-hit-{}-histogram'.format(
                    tdc_index+1, name, type_)
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

        good_hit_array[tdc_index].extend(np.repeat(bins, counts_dict['good']))
        bad_hit_array[tdc_index].extend(np.repeat(bins, counts_dict['bad']))

    fig, (( ax1,  ax2,  ax3,  ax4),
          ( ax5,  ax6,  ax7,  ax8),
          ( ax9, ax10, ax11, ax12),
          (ax13, ax14, ax15, ax16)) = plt.subplots(
        nrows=4, ncols=4, sharex=True, sharey=False, figsize=(16, 9), dpi=120
        )

    fig.suptitle(plot_title[type_] + '\n' + plot_subtitle)
    fig.text(0.5, 0.04, axes_labels[type_]['x'], ha='center', va='center')
    fig.text(0.06, 0.5, axes_labels[type_]['y'], ha='center', va='center',
             rotation='vertical')

    axes = (
        ax1, ax2, ax3, ax4,
        ax5, ax6, ax7, ax8,
        ax9, ax10, ax11, ax12,
        ax13, ax14, ax15, ax16
        )

    for i in xrange(len(axes)):

        if len(good_hit_array[i]) == 0 or len(bad_hit_array[i]) == 0:
            good_hit_array[i].append(start-1)
            bad_hit_array[i].append(start-1)
            snr = "N/A"
        else:
            snr = len(good_hit_array[i]) / len(bad_hit_array[i])
            snr = round(snr, 3)

        n, bin_edges, patches = axes[i].hist(
            [ good_hit_array[i], bad_hit_array[i] ],
            bins=bins.size+1, range=(start-1, stop), ec='none', color=['g', 'y'],
            alpha=0.75, histtype='stepfilled', stacked=True
            )

        axes[i].text(0.95, 0.925, "TDC {}".format(i+1),
                     horizontalalignment='right',
                     verticalalignment='top',
                     transform=axes[i].transAxes)
        axes[i].text(0.95, 0.8, "SNR: {}".format(snr),
                     horizontalalignment='right',
                     verticalalignment='top',
                     transform=axes[i].transAxes)
        axes[i].xaxis.set_minor_locator(AutoMinorLocator())
        axes[i].yaxis.set_minor_locator(AutoMinorLocator())
        axes[i].tick_params(which='major', length=7)
        axes[i].tick_params(which='minor', length=4)
        axes[i].tick_params(axis='both', which='major', labelsize=10)
        axes[i].set_xlim([start, stop])
        plt.setp(axes[i].get_xticklabels(), visible=True)
        plt.setp(axes[i].get_yticklabels(), visible=True)

    axes[0].set_ylim([0, axes[0].get_ylim()[1]])

    fig.text(0.95, 0.82, "MWPC 1", ha='center', va='center',
             fontsize=12)
    fig.text(0.95, 0.61, "MWPC 2", ha='center', va='center',
             fontsize=12)
    fig.text(0.95, 0.40, "MWPC 3", ha='center', va='center',
             fontsize=12)
    fig.text(0.95, 0.19, "MWPC 4", ha='center', va='center',
             fontsize=12)

    output_file_path = output_prefix + \
        "mwpc_tdc_{}_histograms.png".format(type_)
        #"mwpc_tdc_{}_histograms_bins_{}_to_{}.png".format(type_, start, stop)
    plt.savefig(output_file_path)
    #plt.show()
    plt.close()

def plot_data_blocks():

    plot_title = "Data block time stamps"

    devices = ('v1740', 'v1751', 'mwpc', 'wut')

    device_key = {
        'v1740': 'v1740/board-0-',
        'v1751': 'v1751/board-0-',
        'mwpc': 'mwpc/',
        'wut': 'wut/'
        }

    bins = np.linspace(0, 30, 300, endpoint=False, dtype=np.float64)
    bin_start = bins[0]
    bin_stop = bins[-1]
    bin_step = bins[1] - bins[0]
    number_bins = bins.size

    counts_dict = {}

    for device in devices:
        keys = redis.keys(key_prefix + device_key[device] + 'data-block-histogram')
        p = redis.pipeline()
        for key in keys:
            p.lrange(key, 0, -1)
        counts = np.sum(np.array(p.execute(), dtype=np.int64), axis=0)
        if type(counts) != np.ndarray:
            counts = np.zeros(bins.size, dtype=np.int64)

        counts_dict[device] = counts

    device_dict = {}

    for device in device_key:
        device_dict[device] = np.repeat(bins, counts_dict[device])
        if len(device_dict[device]) == 0:
            device_dict[device] = np.array([ bin_start - bin_step ])

    fig = plt.figure(figsize=(9, 6), dpi=120)
    ax = fig.add_subplot(1, 1, 1)

    ax.hist(device_dict['v1740'],
            bins=number_bins+1, range=(bin_start-bin_step, bin_stop),
            label="V1740 ({})".format(np.sum(counts_dict['v1740'])),
            edgecolor='y', color='y',
            alpha=1.0, histtype='stepfilled', linewidth=2)

    ax.hist(device_dict['v1751'],
            bins=number_bins+1, range=(bin_start-bin_step, bin_stop),
            label="V1751 ({})".format(np.sum(counts_dict['v1751'])),
            edgecolor='g', color='g', histtype='step',
            linewidth=2)

    ax.hist(device_dict['mwpc'],
            bins=number_bins+1, range=(bin_start-bin_step, bin_stop),
            label="MWPCs ({})".format(np.sum(counts_dict['mwpc'])),
            edgecolor='b', color='b', histtype='step',
            linestyle=('dashed'))

    ax.hist(device_dict['wut'],
            bins=number_bins+1, range=(bin_start-bin_step, bin_stop),
            label="WUT ({})".format(np.sum(counts_dict['wut'])),
            edgecolor='m', color='m', alpha=0.3, histtype='stepfilled')

    fig.suptitle(plot_title + '\n' + plot_subtitle)
    ax.legend(bbox_to_anchor=(0.75, 0.95), loc=2, borderaxespad=0, fontsize=10,
              frameon=False)

    ax.set_xlabel("Time since beginning of spill [$\mathrm{s}$]", fontsize=12)
    ax.set_ylabel("Entries / ${}$ $\mathrm{{s}}$".format(bin_step), fontsize=12)

    ax.set_xlim([bin_start, bin_stop])

    output_file_path = output_prefix + "data_blocks.png"
    plt.savefig(output_file_path)
    ax.set_xlim([0, 8])
    output_file_path = output_prefix + "data_blocks_zoomed.png"
    plt.savefig(output_file_path)
    #plt.show()
    plt.close()

def plot_v1751_tof_hits():

    names = ('ustof', 'dstof')
    bins = np.arange(0, 1792, 1)
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

    ustof_hits = np.repeat(bins, counts_dict['ustof'])
    dstof_hits = np.repeat(bins, counts_dict['dstof'])

    if ustof_hits.size == 0:
        ustof_hits = np.array([-1])
    if dstof_hits.size == 0:
        dstof_hits = np.array([-1])

    plot_title = "V1751 TOF hits\n"
    plot_title += plot_subtitle

    fig = plt.figure(figsize=(9, 6), dpi=120)
    ax = fig.add_subplot(1, 1, 1)

    fig.suptitle(plot_title)

    ax.hist(ustof_hits, bins=1792+1, range=(-1.5, 1791.5),
            label="USTOF ({})".format(np.sum(counts_dict['ustof'])),
            color='g', edgecolor='none', histtype='stepfilled', alpha=0.75)
    ax.hist(dstof_hits, bins=1792+1, range=(-1.5, 1791.5),
            label="DSTOF ({})".format(np.sum(counts_dict['dstof'])),
            color='y', edgecolor='none', histtype='stepfilled', alpha=0.75)
    ax.xaxis.set_minor_locator(AutoMinorLocator())
    ax.yaxis.set_minor_locator(AutoMinorLocator())
    ax.tick_params(which='major', length=7)
    ax.tick_params(which='minor', length=4)
    ax.set_xlabel("Time bin", fontsize=12)
    ax.set_ylabel("Entries / time bin", fontsize=12)
    ax.set_xlim([ 0.0, 1792.0 ])

    ax.legend(bbox_to_anchor=(0.725, 0.95), loc=2, borderaxespad=0,
              fontsize=8, frameon=False)

    output_file_path = output_prefix + "v1751_tof_hits.png"
    plt.savefig(output_file_path)
    ax.set_xlim([0, 450])
    output_file_path = output_prefix + "v1751_tof_hits_zoomed.png"
    plt.savefig(output_file_path)
    #plt.show()
    plt.close()

def plot_v1751_adc_counts(board_id):
    bins = np.arange(0, 1024, 1)
    counts_array = []
    for channel in xrange(8):
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
        counts_array.append(counts)

    fig, (
        ax00, ax01, ax02, ax03, ax04, ax05, ax06, ax07,
        ) = plt.subplots(8, sharex=True, sharey=False, figsize=(16, 9), dpi=120)

    axes = (
        ax00, ax01, ax02, ax03, ax04, ax05, ax06, ax07,
        )

    plot_title = "V1751 board {} ADC counts\n".format(board_id)
    plot_title += plot_subtitle

    fig.suptitle(plot_title)

    for channel_index in xrange(0, 8):
        x = np.repeat(bins, counts_array[channel_index])
        if x.size == 0:
            x = np.array([-1])
        axes[channel_index].hist(x,
                                 bins=1024+1, range=(-1, 1024),
                                 color='g', ec='g', histtype='stepfilled')
        axes[channel_index].set_xlim([0, 1024])
        axes[channel_index].locator_params(axis=u'y', nbins=4)
        axes[channel_index].tick_params(axis='y', which='major', labelsize=10)
        axes[channel_index].set_title("CH{}".format(channel_index),
                                      x=1.05, y=0.25)

    fig.text(0.06, 0.5, "Entries per ADC count", ha='center', va='center',
             rotation='vertical')
    axes[-1].set_xlabel("ADC count", fontsize=10)

    output_file_path = output_prefix + \
        "v1751_board_{}_adc_count.png".format(board_id)
    plt.savefig(output_file_path)
    #plt.show()
    plt.close()

plot_tof()
plot_mwpc_tdc('timing', 200, 520)
plot_mwpc_tdc('channel', 0, 64)
plot_data_blocks()
plot_v1751_tof_hits()
plot_v1751_adc_counts(0)
plot_v1751_adc_counts(1)
create_tar()

