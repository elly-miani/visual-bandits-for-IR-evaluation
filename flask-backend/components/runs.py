###################################################################################
# RUNS ############################################################################
###################################################################################

import pandas as pd
from tabulate import tabulate
import json

from components.helper_functions.parser import *
# from helper_functions.parser import *


# paths to the original run files and where to store the json files
og_path = "../data/runs"
json_path = "../data/mockdata/json_data/runs"


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

def filter_runs_by_pool_depth(runs, pool_depth):
	runs_filtered = runs[runs['RANK'] <= pool_depth]
	
	return runs_filtered


def filter_runs_by_topic_number(runs, topic_number):
	runs_filtered = runs[runs['TOPIC'] == topic_number]

	return runs_filtered


# load the txt files into a dataframe runs
# runs_df = load_dataframe(og_path, "RUNS")

# print(runs_df)

# runs_filtered = filter_runs_by_topic_number(runs_df, 401)
# runs_filtered = filter_runs_by_pool_depth(runs_filtered, 5)

# dataframe with index ['RANK', 'RUN']
# runs_df_by_rank = get_runs_by_rank(runs_filtered)
# print(runs_df_by_rank)
# tabulate(runs_df_by_rank)


# print_json_from_df(runs_df_by_rank)

# write corresponding json file
# write_json_from_df(runs_df_by_rank, json_path, "/GridChart2.json")
