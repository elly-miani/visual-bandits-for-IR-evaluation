import pandas as pd
import json
from tabulate import tabulate

from helper_functions import *
import logging


'''
Loading data & initializations
'''
out_path = "./outputs/"
runs_path = "../data/runs"
qrels_path = "../data/qrels"


logging.basicConfig(filename=out_path+'tmp.log',
                    filemode='w',
                    format='%(message)s',
                    level=logging.DEBUG)

# parameters
topic = 401 
pool_size = 600

# load the txt files into a dataframe runs
print("➡️ Loading runs from file.")
runs_df = load_dataframe(runs_path, "RUNS", 1000)

# load the txt files into a dataframe qrels
print("➡️ Loading qrels from file.")
qrels_df = load_dataframe(qrels_path, "QRELS", 1)

# filter both runs & qrels by topic
runs_filtered = get_runs_by_topic(runs_df, topic)
qrels_filtered = get_qrels_by_topic(qrels_df, topic)



def get_next_run_round_robin(runs_ids):
	next_run = runs_ids.pop(0)
	runs_ids.append(next_run)

	return next_run


def get_next_doc_round_robin(runs, next_run, runs_status, retrieved_docs):
	filtered_run = runs[runs["RUN"] == next_run]

	next_doc = filtered_run[filtered_run["RANK"] == runs_status[next_run]]
	runs_status[next_run] = runs_status[next_run]+1

	return next_doc


def get_relevancy(qrels, document_name):
	next_doc_qrel = qrels[qrels["DOCUMENT"] == document_name]

	if not next_doc_qrel.empty:
		return next_doc_qrel.iloc[0].RELEVANCY
	else:
		return 2


def get_occurrences(runs, document_name):
	occurrencies = runs[runs['DOCUMENT'] == document_name]

	ranks = occurrencies["RANK"].unique().tolist()
	ranks.sort()

	doc_occurrences = {}
	for rank in ranks:
		# print("RANK:", rank, " --> \n", occurrencies[occurrencies["RANK"] == rank].iloc[0].RUN, "\n") 
		# all = occurrencies[occurrencies["RANK"] == rank]["RUN"].unique().tolist()
		# print("RANK:", rank, " --> \n", all)
		# print(occurrencies[occurrencies["RANK"] == rank], "\n")

		doc_occurrences[rank] = occurrencies[occurrencies["RANK"] == rank]["RUN"].unique().tolist()
	
	return doc_occurrences


def round_robin(runs, qrels, pool_size):

	# identify the names of all unique runs, and how many there are
	runs_ids = runs["RUN"].unique().tolist()
	runs_ids.sort()
	runs_count = len(runs_ids)

	### HELPER STRUCTURES
	retrieved_docs = {}				# dict keeping track of which docs have been retrieved from where, and if they are unique
	runs_status = {}					# dict keeping track of how many docs have been retrieved from each run
	for item in runs_ids:
		runs_status[item] = 1

	### OUTPUT STRUCTURES
	retrieved_docs_order = []			# ordered array of each doc retrieved at each step
	# missing a df for the second graph here
	

	# repeat the process until we have retrieved the desired number of documents
	for i in range(1, pool_size+1):
		logging.debug(f'\n📥 Retrieval #{i}')

		next_run = get_next_run_round_robin(runs_ids)
		next_doc = get_next_doc_round_robin(runs, next_run, runs_status, retrieved_docs)

		# proposed new_doc
		next_doc_info = {
			'DOCUMENT': next_doc.iloc[0].DOCUMENT,
			'RANK': next_doc.iloc[0].RANK
		}

		log_name = next_doc_info['DOCUMENT']
		logging.debug(f'next_run: {next_run}\nproposed next_doc: {log_name}')
		logging.debug(f'runs_status[{next_run}]: {runs_status[next_run]}')

		while next_doc_info['DOCUMENT'] in retrieved_docs:
			# document already retrieved
			logging.debug(f'❌ already retrieved')

			retrieved_docs[next_doc_info['DOCUMENT']]['UNIQUE'] = "0"
			next_doc_info['RELEVANCY'] = retrieved_docs[next_doc_info['DOCUMENT']]['RELEVANCY']

			next_doc = get_next_doc_round_robin(runs, next_run, runs_status, retrieved_docs)

			next_doc_info = {
				'DOCUMENT': next_doc.iloc[0].DOCUMENT,
				'RANK': next_doc.iloc[0].RANK
			}

			log_name = next_doc_info['DOCUMENT']
			logging.debug(f'new proposed next_doc: {log_name}')
			logging.debug(f'runs_status[{next_run}]: {runs_status[next_run]}')
	
		# new document retrieved
		logging.debug(f'👍 not yet retrieved')

		next_doc_info['RELEVANCY'] = get_relevancy(qrels, next_doc_info['DOCUMENT'])

		retrieved_docs[next_doc_info['DOCUMENT']] = {
													'RELEVANCY': next_doc_info['RELEVANCY'],
													'RETRIEVED_FROM': next_run,
													'UNIQUE': 1
											}
		
		retrieved_docs_order.append({
			"DOCUMENT": next_doc_info['DOCUMENT'],
			"RANK": next_doc_info['RANK'],
			"RELEVANCY": next_doc_info['RELEVANCY'],
			"RETRIEVED_FROM": next_run,
			"OCCURRENCES": get_occurrences(runs, next_doc_info['DOCUMENT'])
		})
	
	write_dict_into_json(runs_status, out_path, "runs_status.json")
	write_dict_into_json(retrieved_docs, out_path, "retrieved_docs.json")
	write_dict_into_json(retrieved_docs_order, out_path, "retrieved_docs_order.json")


round_robin(runs_filtered, qrels_filtered, pool_size)




