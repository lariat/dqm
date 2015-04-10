#!/usr/bin/env python

import os
import sys
import time

def remove(path):
    """
    Remove the file.
    """
    try:
        if os.path.exists(path):
            os.remove(path)
            sys.stdout.write("Removing file: {}".format(path) + '\n')
            sys.stdout.flush()
    except OSError:
        sys.stdout.write("Unable to remove file: {}".format(path) + '\n')
        sys.stdout.flush()

def cleanup(days, path):
    """
    Removes files from the passed-in path that are older than
    or equal to the number of days.
    """
    time_in_seconds = time.time() - (days * 24 * 60 * 60)
    for root, dirs, files in os.walk(path, topdown=False):
        for file_ in files:
            full_path = os.path.join(root, file_)
            stat = os.stat(full_path)

            if stat.st_mtime <= time_in_seconds:
                remove(full_path)

if __name__ == '__main__':
    #days, path = int(sys.argv[1]), sys.argv[2]
    days, path = float(sys.argv[1]), sys.argv[2]
    cleanup(days, path)
