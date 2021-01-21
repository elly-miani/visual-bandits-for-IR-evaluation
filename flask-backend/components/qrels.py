###################################################################################
# QRELS ############################################################################
###################################################################################

import pandas as pd
from tabulate import tabulate
import json

from helper_functions.parser import *

# path to the original run files and where to store the json files
og_path = "../data/mockdata/original_data/qrels"
json_path = "../data/mockdata/json_data/qrels"

# header for the qrels dataframe
header = ['TOPIC', 'ITERATION', 'DOCUMENT', 'RELEVANCY']


'''

'''
def get_qrels_by_topic(qrels, topic):
	qrels_filtered = qrels[qrels['TOPIC'] == topic]
	qrels_filtered.set_index('DOCUMENT', inplace=True)

	return qrels_filtered


''' 
Writing the corresponding json file from dictionary obtained from dataframe
'''
def write_qrels_json(df, json_path, file_name):
	dict = df.to_dict('index')
	# print_json_from_dict(dict)

	json_file = json_path + file_name
	# print_json_from_dict(dict)
	write_json_from_dict(json_file, dict)


# load the txt files into a dataframe qrels
qrels_df = load_dataframe(og_path, header, "QRELS")

# get a dataframe filtered by topic and indexed by the document
qrels_by_topic = get_qrels_by_topic(qrels_df, 401)

write_qrels_json(qrels_by_topic, json_path, "/qrels_topic_401.json")