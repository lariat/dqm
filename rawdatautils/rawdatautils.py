import numpy as np
import root_numpy as rnp

def get_v1751_waveforms(file_path, board='DataQuality/v1751'):

    v1751_branch_list = [
        'channel_0',
        'channel_1',
        'channel_2',
        'channel_3',
        'channel_4',
        'channel_5',
        'channel_6',
        'channel_7',
        ]

    v1751_array = rnp.root2array(file_path, board, v1751_branch_list)
    #number_triggers = v1751_array.size

    channel_0 = v1751_array['channel_0']
    channel_1 = v1751_array['channel_1']
    channel_2 = v1751_array['channel_2']
    channel_3 = v1751_array['channel_3']
    channel_4 = v1751_array['channel_4']
    channel_5 = v1751_array['channel_5']
    channel_6 = v1751_array['channel_6']
    channel_7 = v1751_array['channel_7']

    waveform_array = np.array([
        channel_0,
        channel_1,
        channel_2,
        channel_3,
        channel_4,
        channel_5,
        channel_6,
        channel_7,
        ])

    return waveform_array

def get_mwpc_tdc_hit_time(file_path):

    mwpc_branch_list = [
        'tdc_number',
        'hit_channel',
        'hit_time_bin',
        ]

    mwpc_array = rnp.root2array(file_path, 'DataQuality/mwpc',
                                mwpc_branch_list)

    number_tdcs = 16
    number_triggers = mwpc_array.size
    tdc_number = mwpc_array['tdc_number']
    hit_channel = mwpc_array['hit_channel']
    hit_time_bin = mwpc_array['hit_time_bin']

    hit_time = [ [] for i in range(number_tdcs) ]

    for trigger in xrange(number_triggers):
        for tdc_index in xrange(number_tdcs):
            flag = (tdc_number[trigger] == tdc_index + 1)
            hit_time[tdc_index].extend(hit_time_bin[trigger][flag])

    return np.array(hit_time)

def get_wut_hits(file_path):
    return

