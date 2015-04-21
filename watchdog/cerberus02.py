#!/usr/bin/env python

import sys
import subprocess
import time
from datetime import datetime

import logging
from logging.handlers import RotatingFileHandler

from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

import daemon

log_dir = '/lariat/data/users/lariatdqm/log/watchdog'
log_file_path = log_dir + '/cerberus02.log'
src_file_dir = '/daqdata/dropbox'
dest_file_dir = '/lariat/data/users/lariatdqm/daqdata'
remote_host = 'lariatdqm@lariat-daq01.fnal.gov'

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

logger = logging.getLogger('subproc_rsync')
logger.setLevel(logging.DEBUG)
logger.addHandler(handler)

def parse(file_path):
    token_list = file_path.split('_')
    run = token_list[1][1:].zfill(6)
    spill = token_list[2][2:6].zfill(4)
    return run, spill

class FileHandler(PatternMatchingEventHandler):
    patterns = [ src_file_dir + '/lariat_r*_sr*.root' ]

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
            src_file_path = event.dest_path
        else:
            src_file_path = event.src_path

        file_name = src_file_path.split('/')[-1]

        time_stamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        log_message = '{} - New DAQ file: {}'.format(
            time_stamp, src_file_path
            )
        sys.stdout.write(log_message + '\n')
        sys.stdout.flush()

        dest_file_path = dest_file_dir + '/' + \
            file_name.replace('.root', '.complete')

        cmd = [
            '/usr/krb5/bin/kinit',
            '-k',
            '-t',
            '/var/adm/krb5/lariatdqm.lariat-daq02.keytab',
            'lariatdqm/lariat-daq02.fnal.gov',
            ]

        subprocess.call(cmd)

        cmd = [
            'ssh',
            remote_host,
            'touch',
            dest_file_path,
            ]

        proc = subprocess.Popen(
            cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT
            )

        while True:
            line = proc.stdout.readline()
            if not line:
                break
            logger.info(line.rstrip('\n'))

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

def run():

    observer = Observer()
    observer.schedule(FileHandler(), path=src_file_dir)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()

if __name__ == '__main__':

    with daemon.DaemonContext():
        run()

