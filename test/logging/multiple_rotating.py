import subprocess
import logging
from logging.handlers import RotatingFileHandler

cmd = ['ls', '-l']

file_name = 'tmp_multiple_rotating.log'
format = '%(asctime)s %(name)-12s %(levelname)-8s %(message)s'
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
handler.setLevel(logging.DEBUG)

console = logging.StreamHandler()
console.setLevel(logging.INFO)
console.setFormatter(formatter)
logging.getLogger('').addHandler(console)

logger = logging.getLogger('rotating.py')
logger.setLevel(logging.DEBUG)
logger.addHandler(handler)

proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

while True:
    line = proc.stdout.readline()
    if not line:
        break
    logger.info(line.rstrip('\n'))

logging.info('Jackdaws love my big sphinx of quartz.')

logger1 = logging.getLogger('myapp.area1')
logger2 = logging.getLogger('myapp.area2')

logger1.setLevel(logging.DEBUG)
logger2.setLevel(logging.DEBUG)
logger1.addHandler(handler)
logger2.addHandler(handler)

logger1.debug('Quick zephyrs blow, vexing daft Jim.')
logger1.info('How quickly daft jumping zebras vex.')
logger2.warning('Jail zesty vixen who grabbed pay from quack.')
logger2.error('The five boxing wizards jump quickly.')
