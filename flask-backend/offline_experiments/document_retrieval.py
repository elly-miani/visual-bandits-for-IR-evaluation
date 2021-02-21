import pandas as pd
import json
import logging
from tabulate import tabulate

from lib import get_runs
from lib import get_qrels
from lib import fileio
from lib import round_robin


'''
Loading data & initializations
'''
paths = {
	'output':  "./outputs/",
	'runs': "../data/runs",
	'qrels': "../data/qrels"
}

# parameters
topic = 401
pool_size = 500

logging.basicConfig(filename=paths['output']+'tmp.log',
                    filemode='w',
                    format='%(message)s',
                    level=logging.DEBUG)


# load the txt files into a dataframe runs
print("➡️ Loading runs from file.")
runs_df = fileio.read_csv_into_df(paths['runs'], "RUNS", 4)

# load the txt files into a dataframe qrels
print("➡️ Loading qrels from file.")
qrels_df = fileio.read_csv_into_df(paths['qrels'], "QRELS", 1)

# filter both runs & qrels by topic
runs_filtered = get_runs.by_topic(runs_df, topic)
qrels_filtered = get_qrels.by_topic(qrels_df, topic)

round_robin.round_robin_alg(runs_filtered, qrels_filtered, pool_size, paths)