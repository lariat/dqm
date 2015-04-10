#!/usr/bin/env python

import sys
import subprocess
import time
from datetime import datetime

import logging
from logging.handlers import RotatingFileHandler

from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

from cleanup import cleanup

log_dir = '/lariat/data/users/lariatdqm/log/watchdog'
log_file_path = log_dir + '/proc.log'
dqm_root = '/home/nfs/lariatdqm/local/dqm'
daq_file_dir = '/lariat/data/users/lariatdqm/daqdata'
dqm_file_dir = '/lariat/data/users/lariatdqm/dqm'
# number of days a file can exist in daq_file_dir before it is
# deleted by the cleanup process
days = 1

format = '%(asctime)s %(name)-12s %(levelname)-8s %(message)s'
date_format = '%Y-%m-%d %H:%M:%S'

formatter = logging.Formatter(
    fmt=format,
    datefmt=date_format
    )

handler = RotatingFileHandler(
    filename=log_file_path,
    mode='a',
    maxBytes=50000000,
    backupCount=10,
    )

handler.setFormatter(formatter)
handler.setLevel(logging.DEBUG)

logger_daq = logging.getLogger('subproc_daq')
logger_dqm = logging.getLogger('subproc_dqm')
logger_daq.setLevel(logging.DEBUG)
logger_dqm.setLevel(logging.DEBUG)
logger_daq.addHandler(handler)
logger_dqm.addHandler(handler)

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
    patterns = [ daq_file_dir + '/lariat_r*_sr*.root' ]

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

        sys.stdout.write(log_message + '\n')
        sys.stdout.flush()

    def process(self, event):

        if hasattr(event, 'dest_path'):
            input_file_path = event.dest_path
        else:
            input_file_path = event.src_path

        time_stamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        print '{} - Processing DAQ file: {}'.format(time_stamp,
                                                    input_file_path)

        run, spill = parse_daq(input_file_path)

        output_file_path = dqm_file_dir + \
            '/dqm_run_{}_spill_{}.root'.format(run, spill)

        cmd = [
            'lar',
            '-c',
            'data_quality.fcl',
            input_file_path,
            '-T',
            output_file_path,
            '&&',
            cleanup(days, daq_file_dir),
            ]

        proc = subprocess.Popen(
            cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT
            )

        while True:
            line = proc.stdout.readline()
            if not line:
                break
            logger_daq.info(line.rstrip('\n'))

    def on_created(self, event):
        self.log(event)
        #self.process(event)

    def on_modified(self, event):
        self.log(event)

    def on_deleted(self, event):
        self.log(event)

    def on_moved(self, event):
        self.log(event)
        self.process(event)

class DqmFileHandler(PatternMatchingEventHandler):
    patterns = [ dqm_file_dir + '/dqm_run_*_spill_*.root' ]

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

        sys.stdout.write(log_message + '\n')
        sys.stdout.flush()

    def process(self, event):

        if hasattr(event, 'dest_path'):
            input_file_path = event.dest_path
        else:
            input_file_path = event.src_path

        time_stamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        print '{} - Processing DQM file: {}'.format(time_stamp,
                                                    input_file_path)

        cmd = [
            'python',
            dqm_root + '/dqm/analyze.py',
            input_file_path,
            ]

        proc = subprocess.Popen(
            cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT
            )

        while True:
            line = proc.stdout.readline()
            if not line:
                break
            logger_dqm.info(line.rstrip('\n'))

    def on_created(self, event):
        self.log(event)
        #self.process(event)

    def on_modified(self, event):
        self.log(event)

    def on_deleted(self, event):
        self.log(event)

    def on_moved(self, event):
        self.log(event)
        self.process(event)

if __name__ == '__main__':

    observer = Observer()
    observer.schedule(DaqFileHandler(), path=daq_file_dir)
    observer.schedule(DqmFileHandler(), path=dqm_file_dir)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()

