###################################################################################
# RUNS ############################################################################
###################################################################################

import pandas as pd
from tabulate import tabulate
import json

from helper_functions.parser import *

# paths to the original run files and where to store the json files
og_path = "../data/mockdata/original_data/runs"
json_path = "../data/mockdata/json_data/runs"

# header for the runs dataframe
header = ['TOPIC', 'QUERY', 'DOCUMENT', 'RANK', 'SCORE', 'RUN']


'''
	MultiIndex: ['RANK', 'RUN']
	Filtered columns: all
	Filtered rows: all
	JSON result: RANK -> RUN -> {DOCUMENT, QUERY, SCORE, TOPIC}
'''
def get_runs_by_rank(runs):
	runs.set_index(['RANK', 'RUN'], inplace=True)
	# runs.set_index(['RUN', 'RANK'], inplace=True)
	runs.sort_index(inplace=True)
	# print(tabulate(runs, headers='keys', tablefmt='psql'))

	return runs


# load the txt files into a dataframe runs
runs_df = load_dataframe(og_path, header, "RUNS")

# dataframe with index ['RANK', 'RUN']
runs_df_by_rank = get_runs_by_rank(runs_df)
# print(runs_df_by_rank)
# print_json_from_df(runs_df_by_rank)

# write corresponding json file
write_json_from_df(runs_df_by_rank, json_path, "/GridChart2.json")