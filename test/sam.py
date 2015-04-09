import sys
import subprocess
import argparse
import re

def parse_daq(file_path):
    token_list = file_path.split('_')
    run = token_list[1][1:].zfill(6)
    spill = token_list[2][2:6].zfill(4)
    return run, spill

parser = argparse.ArgumentParser(
    description="Process raw data files that have been moved to pnfs."
    )
parser.add_argument('run', type=str, help="run number")
args = parser.parse_args()

run = args.run

output_dir = '/lariat/data/users/lariatdqm/tmp'

cmd = [
    'samweb',
    'list-files',
    'run_number',
    '=',
    str(run),
    ]

file_name_list = subprocess.check_output(cmd).splitlines()
file_name_list.sort()

#print file_name_list

file_path_list = []

for file_name in file_name_list:

    cmd = [
        'samweb',
        'locate-file',
        #'-e',
        #'lariat',
        file_name,
        ]

    file_path = subprocess.check_output(cmd).lstrip("enstore:").rstrip()
    file_path = re.sub('[\(\[].*?[\)\]]', '', file_path) + '/' + file_name

    #print file_path
    run_number, spill_number = parse_daq(file_name)

    cmd = [
        'ls',
        file_path,
        ]

    subprocess.call(cmd)

    output_file_path = output_dir + \
        '/dqm_run_{}_spill_{}.root'.format(run_number, spill_number)

    cmd = [
        'lar',
        '-c',
        'data_quality.fcl',
        file_path,
        '-T',
        output_file_path,
        ]

    subprocess.call(cmd)
