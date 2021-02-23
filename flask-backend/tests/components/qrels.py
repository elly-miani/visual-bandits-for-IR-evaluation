###################################################################################
# QRELS ############################################################################
###################################################################################

import pandas as pd
from tabulate import tabulate
import json

# from components.helper_functions.io_parser_functions import *

# paths to the original run files and where to store the json files
og_path = "../data/mockdata/original_data/qrels"
json_path = "../data/mockdata/json_data/qrels"

'''
	Index: ['DOCUMENT']
	Filtered columns: all
	Filtered rows: qrels['TOPIC'] == topic
	JSON result: DOCUMENT -> {ITERATION, RELEVANCY, TOPIC}
'''
def get_qrels_by_topic(qrels, topic):
	qrels_filtered = qrels[qrels['TOPIC'] == topic]
	qrels_filtered.set_index('DOCUMENT', inplace=True)

	return qrels_filtered


# load the txt files into a dataframe qrels
# qrels_df = load_dataframe(og_path, "QRELS")

# dataframe filtered by topic and indexed by the document
# qrels_by_topic = get_qrels_by_topic(qrels_df, 401)

# print(return_json_from_df(qrels_by_topic))
# write corresponding json file
# write_json_from_df(qrels_by_topic, json_path, "/qrels_topic_401.json")