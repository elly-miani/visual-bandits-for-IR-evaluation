import pandas as pd
import json
import logging
from tabulate import tabulate

from lib import get_runs
from lib import get_qrels
from lib import convert_data
from lib import round_robin
from lib import max_mean


'''
Loading data & initializations
'''
LOGS_PATH = "./outputs/"
RUNS_PATH = "../data/default/runs"
QRELS_PATH = "../data/default/qrels"


# parameters
topic = 403
pool_size = 300

logging.basicConfig(filename=LOGS_PATH+'round_robin_og.log',
                    filemode='w',
                    format='%(message)s',
                    level=logging.DEBUG)


# load the txt files into a dataframe runs
print("➡️ Loading runs from file.")
runs_df = convert_data.read_csv_into_df(RUNS_PATH, "RUNS", 60, 1)

# load the txt files into a dataframe qrels
print("➡️ Loading qrels from file.")
qrels_df = convert_data.read_csv_into_df(QRELS_PATH, "QRELS", 1, 1)

# filter both runs & qrels by topic
runs_filtered = get_runs.by_topic(runs_df, topic)
qrels_filtered = get_qrels.by_topic(qrels_df, topic)

# round_robin.round_robin_alg(runs_filtered, qrels_filtered, pool_size, LOGS_PATH)
round_robin.round_robin_alg_og(runs_filtered, qrels_filtered, pool_size, LOGS_PATH)

# max_mean_results = max_mean.max_mean_alg(runs_filtered, qrels_filtered, pool_size, LOGS_PATH)
