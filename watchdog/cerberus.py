#!/usr/bin/env python

import sys
import subprocess
import time
from datetime import datetime

from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

dqm_root = '/home/nfs/lariatdqm/local/dqm'
log_dir = '/lariat/data/users/lariatdqm/log'
daq_file_dir = '/daqdata/dropbox'
dqm_file_dir = '/daqdata/dqm'

#dqm_root = '/Users/johnnyho/repos/dqm/dqm'
#log_dir = '/Users/johnnyho/repos/dqm/data/log'
#dqm_file_dir = '/Users/johnnyho/repos/dqm/data/test'

def parse_daq(file_path):
    token_list = file_path.split('_')
    run = token_list[1][1:].zfill(6)
    spill = token_list[2][2:6].zfill(4)
    return run, spill

def parse_dqm(file_path):
    token_list = file_path.split('_')
    run = token_list[2].zfill(6)
    spill = token_list[4][:4].zfill(4)
    return run, spill

class DaqFileHandler(PatternMatchingEventHandler):
    patterns = [ '*lariat_r*_sr*.root.root' ]

    def log(self, event):
        """
        event.event_type 
            'modified' | 'created' | 'moved' | 'deleted'
        event.is_directory
            True | False
        event.src_path
            path/to/observed/file
        """

        log_message = '{} - {} file: {}'.format(
            datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            event.event_type.capitalize(),
            event.src_path
            )

        if hasattr(event, 'dest_path'):
            log_message += ' => {}'.format(event.dest_path)

        print log_message

    def process(self, event):

        if hasattr(event, 'dest_path'):
            input_file_path = event.dest_path
        else:
            input_file_path = event.src_path

        print 'Processing DAQ file: {}'.format(input_file_path)

        run, spill = parse_daq(input_file_path)

        output_file_path = dqm_file_dir + \
            '/dqm_run_{}_spill_{}.root'.format(run, spill)

        log_file_path = log_dir + \
            '/larsoft/larsoft_dqm_run_{}_spill_{}'.format(run, spill)
        stdout_log_file_path = log_file_path + '.out'
        stderr_log_file_path = log_file_path + '.err'

        cmd = [
            'lar',
            '-c',
            'data_quality.fcl',
            event.src_path,
            '-T',
            output_file_path,
            ]

        stdout_log_file = open(stdout_log_file_path, 'w')
        stderr_log_file = open(stderr_log_file_path, 'w')

        subprocess.call(cmd, stdout=stdout_log_file, stderr=stderr_log_file)

        stdout_log_file.close()
        stderr_log_file.close()

        print "output_file_path:", output_file_path
        print "stdout_log_file_path:", stdout_log_file_path
        print "stderr_log_file_path:", stderr_log_file_path

    def on_created(self, event):
        self.log(event)
        self.process(event)

    def on_modified(self, event):
        self.log(event)

    def on_deleted(self, event):
        self.log(event)

    def on_moved(self, event):
        self.log(event)
        self.process(event)

class DqmFileHandler(PatternMatchingEventHandler):
    patterns = [ '*dqm_run_*_spill_*.root' ]

    def log(self, event):
        """
        event.event_type 
            'modified' | 'created' | 'moved' | 'deleted'
        event.is_directory
            True | False
        event.src_path
            path/to/observed/file
        """

        log_message = '{} - {} file: {}'.format(
            datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            event.event_type.capitalize(),
            event.src_path
            )

        if hasattr(event, 'dest_path'):
            log_message += ' => {}'.format(event.dest_path)

        print log_message

    def process(self, event):

        if hasattr(event, 'dest_path'):
            input_file_path = event.dest_path
        else:
            input_file_path = event.src_path

        print 'Processing DQM file: {}'.format(input_file_path)

        run, spill = parse_dqm(input_file_path)

        log_file_path = log_dir + \
            '/dqm/dqm_analyze_run_{}_spill_{}'.format(run, spill)
        stdout_log_file_path = log_file_path + '.out'
        stderr_log_file_path = log_file_path + '.err'

        cmd = [
            'python',
            dqm_root + '/analyze.py',
            input_file_path,
            ]

        stdout_log_file = open(stdout_log_file_path, 'w')
        stderr_log_file = open(stderr_log_file_path, 'w')

        subprocess.call(cmd, stdout=stdout_log_file, stderr=stderr_log_file)

        stdout_log_file.close()
        stderr_log_file.close()

    def on_created(self, event):
        self.log(event)
        self.process(event)

    def on_modified(self, event):
        self.log(event)

    def on_deleted(self, event):
        self.log(event)

    def on_moved(self, event):
        self.log(event)
        self.process(event)

if __name__ == '__main__':

    observer = Observer()
    #observer.schedule(DaqFileHandler(), path=daq_file_dir)
    observer.schedule(DqmFileHandler(), path=dqm_file_dir)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()

