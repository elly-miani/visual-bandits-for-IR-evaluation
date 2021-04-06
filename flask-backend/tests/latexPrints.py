import pandas as pd
import json

from lib import convert_data
from lib import get_runs
from lib import get_qrels

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
runs_df = convert_data.read_csv_into_df(paths['runs'], "RUNS", 10, 1)

# load the txt files into a dataframe qrels
print("➡️ Loading qrels from file.")
qrels_df = convert_data.read_csv_into_df(paths['qrels'], "QRELS", 1, 1)

topic = 401

### RUNS
# dataframe filtered by topic
runs_filtered = get_runs.by_topic(runs_df, topic)
# print(runs_filtered)

# shorten the run size to avoid sending too large data
runs_filtered = get_runs.by_run_size(runs_filtered, 100)

# dataframe with index ['RANK', 'RUN']
runs_by_rank = get_runs.indexed_by_rank(runs_filtered)
print(runs_by_rank)

runs_by_rank_dict = convert_data.get_dict_from_df(runs_by_rank)
convert_data.write_dict_into_json(runs_by_rank_dict, paths['output']+'latex/', 'runs_by_rank.json', 1)


### QRELS
# dataframe filtered by topic and indexed by the document
qrels_filtered = get_qrels.by_topic(qrels_df, topic)
# print(qrels_filtered)

# dataframe with index ['DOCUMENT']
qrels_by_doc = get_qrels.indexed_by_document(qrels_filtered)
# print(qrels_by_doc)

qrels_by_doc_dict = convert_data.get_dict_from_df(qrels_by_doc)
convert_data.write_dict_into_json(qrels_by_doc_dict, paths['output']+'latex/', 'qrels_by_doc.json', 1)