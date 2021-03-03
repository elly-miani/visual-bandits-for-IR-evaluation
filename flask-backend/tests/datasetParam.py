import pandas as pd
import json

from lib import convert_data

'''
Loading data & initializations
'''
paths = {
	'output':  "./outputs/",
	'runs': "../data/default/runs",
	'qrels': "../data/default/qrels"
}


# load the txt files into a dataframe runs
print("➡️ Loading runs from file.")
runs_df = convert_data.read_csv_into_df(paths['runs'], "RUNS", 10)

# load the txt files into a dataframe qrels
print("➡️ Loading qrels from file.")
qrels_df = convert_data.read_csv_into_df(paths['qrels'], "QRELS", 1)

