#!/usr/bin/env python

import sys
import time
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

class RootFileHandler(PatternMatchingEventHandler):
    patterns = [ '*.root' ]

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
        """
        event.event_type 
            'modified' | 'created' | 'moved' | 'deleted'
        event.is_directory
            True | False
        event.src_path
            path/to/observed/file
        """

        # the file will be processed there
        print event.src_path, event.event_type

    def on_created(self, event):
        self.log(event)

    def on_modified(self, event):
        self.log(event)

    def on_deleted(self, event):
        self.log(event)

    def on_moved(self, event):
        self.log(event)

if __name__ == '__main__':
    args = sys.argv[1:]
    observer = Observer()
    observer.schedule(RootFileHandler(), path=args[0] if args else '.')
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
