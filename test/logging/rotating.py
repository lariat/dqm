import subprocess
import logging
from logging.handlers import RotatingFileHandler

cmd = ['ls', '-l']

file_name = 'tmp_rotating.log'
format = '%(asctime)s %(levelname)s: %(message)s'
date_format = '%Y-%m-%d %H:%M:%S'

formatter = logging.Formatter(
    fmt=format,
    datefmt=date_format
    )

handler = RotatingFileHandler(
    filename=file_name,
    mode='a',
    maxBytes=50000000,
    backupCount=10,
    )

handler.setFormatter(formatter)
handler.setLevel(logging.INFO)

logger = logging.getLogger('rotating.py')
logger.setLevel(logging.INFO)
logger.addHandler(handler)

proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

while True:
    line = proc.stdout.readline()
    if not line:
        break
    logger.info(line.rstrip('\n'))
