###################################################################################
# RUNS ############################################################################
###################################################################################

import pandas as pd
from tabulate import tabulate
import json

from helper_functions.parser import *

# path to the original run files and where to store the json files
og_path = "../data/mockdata/original_data/runs"
json_path = "../data/mockdata/json_data/runs"

# header for the runs dataframe
header = ['TOPIC', 'QUERY', 'DOCUMENT', 'RANK', 'SCORE', 'RUN']

''' 
Writing the corresponding json file from dictionary obtained from dataframe
'''
def write_runs_json(runs_df, json_path, file_name):
	dict = {level: runs_df.xs(level).to_dict('index')
         for level in runs_df.index.levels[0]}

	json_file = json_path + file_name
	# print_json_from_dict(dict)
	write_json_from_dict(json_file, dict)


'''
	Adding a multiIndex to the dataframe in order to get the desired structure.

 	{	"1": {
			"Flab8ax": {
					"DOCUMENT": "FBIS3-20090",
					"QUERY": "Q0",
					"SCORE": 1.96713310726314,
					"TOPIC": 401
			}, ... }, ... }
'''
def get_runs_by_rank(runs):
	runs.set_index(['RANK', 'RUN'], inplace=True)
	# runs.set_index(['RUN', 'RANK'], inplace=True)
	runs.sort_index(inplace=True)
	# print(tabulate(runs, headers='keys', tablefmt='psql'))

	return runs


# load the txt files into a dataframe runs
runs_df = load_dataframe(og_path, header, "RUNS")

# change index to get a dataframe sorted by rank and then by run name
runs_df_by_rank = get_runs_by_rank(runs_df)
print(runs_df_by_rank)

# write corresponding json file
write_runs_json(runs_df_by_rank, json_path, "/GridChart2.json")