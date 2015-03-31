import subprocess
import logging

cmd = ['ls', '-l']

filename = 'tmp_basic.log'
format = '%(asctime)s %(levelname)s: %(message)s'
datefmt = '%Y-%m-%d %H:%M:%S'
filemode = 'a'

logging.basicConfig(
    filename=filename,
    level=logging.DEBUG,
    format=format,
    datefmt=datefmt,
    filemode=filemode,
    )

proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

while True:
    line = proc.stdout.readline()
    if not line:
        break
    logging.info(line.rstrip('\n'))
