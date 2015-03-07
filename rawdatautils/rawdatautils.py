import numpy as np
import root_numpy as rnp

def get_caen_trigger_time_tag(file_path, board_id):
    """
    Returns the trigger time tag of the CAEN board. Each
    trigger time tag count is 8 nanoseconds.

    """

    if board_id in range(0, 8):
        tree_name = 'DataQuality/v1740'
    else:
        tree_name = 'DataQuality/v1751'

    caen_branch_list = [
        'trigger_time_tag',
        'board_id',
    ]

    caen_array = rnp.root2array(file_path, tree_name, caen_branch_list)

    trigger_time_tag_array = caen_array['trigger_time_tag'].astype(np.int64)
    board_id_array = caen_array['board_id']

    trigger_time_tag = trigger_time_tag_array[board_id_array == board_id]

    return trigger_time_tag

def get_mwpc_tdc_time_stamp(file_path):
    """
    Returns the TDC time stamp. Each TDC time stamp count is
    1/106.208e6 seconds.

    """

    mwpc_array = rnp.root2array(
        file_path, 'DataQuality/mwpc', ['tdc_time_stamp']
        )

    tdc_time_stamp = mwpc_array['tdc_time_stamp'].astype(np.int64)

    return tdc_time_stamp

def get_wut_time_header(file_path):
    """
    Returns the WUT time header. Each time header count is 16
    microseconds.

    """

    wut_array = rnp.root2array(file_path, 'DataQuality/wut', ['time_header'])

    time_header = wut_array['time_header'].astype(np.int64)

    return time_header

#def get_v1751_waveforms(file_path, board='DataQuality/v1751'):
#
#    v1751_branch_list = [
#        'channel_0',
#        'channel_1',
#        'channel_2',
#        'channel_3',
#        'channel_4',
#        'channel_5',
#        'channel_6',
#        'channel_7',
#        ]
#
#    v1751_array = rnp.root2array(file_path, board, v1751_branch_list)
#    #number_triggers = v1751_array.size
#
#    channel_0 = v1751_array['channel_0']
#    channel_1 = v1751_array['channel_1']
#    channel_2 = v1751_array['channel_2']
#    channel_3 = v1751_array['channel_3']
#    channel_4 = v1751_array['channel_4']
#    channel_5 = v1751_array['channel_5']
#    channel_6 = v1751_array['channel_6']
#    channel_7 = v1751_array['channel_7']
#
#    waveform_array = np.array([
#        channel_0,
#        channel_1,
#        channel_2,
#        channel_3,
#        channel_4,
#        channel_5,
#        channel_6,
#        channel_7,
#        ])
#
#    return waveform_array

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

#def get_wut_hits(file_path):
#    return
