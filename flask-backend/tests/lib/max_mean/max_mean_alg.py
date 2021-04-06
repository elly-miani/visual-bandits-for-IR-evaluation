import pandas as pd

from lib import convert_data
from lib import get_doc_info
from lib import adjudication
from lib import max_mean

import logging

def max_mean_alg(runs, qrels, pool_size, log_path):

	# identify the names of all unique runs, and how many there are
	runs_ids = runs["RUN"].unique().tolist()
	runs_ids.sort()
	runs_count = len(runs_ids)


	### HELPER STRUCTURES
	# dict of arrays to help compute the maximum expectation of the posterior distribution
	max_mean_params = {
		'alpha': [1] * runs_count,
		'beta': [1] * runs_count,
		'mean': [0.5] * runs_count
	}

	# dict containing all occurrences of all documents
	docs_occurrences = adjudication.get_occurrences(runs, log_path)

	# dict keeping track of which docs have been retrieved from where, and if they are unique
	retrieved_docs = {}

	# dict keeping track of how many docs have been retrieved from each run
	runs_status = {}					
	for item in runs_ids:
		runs_status[item] = 1
	
	# pandas' dataframe keeping track of how many docs for each run are relevant/unique relevant/nonrelevant
	run_relevancies = pd.DataFrame(columns=['RUN', 'DOCS_RETRIEVED', 'REL', 'REL_UNIQUE', 'NON_REL'])
	run_relevancies.set_index('RUN', inplace=True)

	### OUTPUT STRUCTURES
	retrieved_docs_order = []			# ordered array of each doc retrieved at each step
	run_relevancies_order = []		# ordered array of the relevancies status at each step


	print("➡️ Retrieving documents to be adjudicated...")
	for i in range(1, pool_size+1):
		# repeat the process until we have retrieved the desired number of documents

		# print("\n### DOCUMENT", i)																												### LOGGING
		# logging.debug("\n#### DOCUMENT %d", i)																						### LOGGING


		next_doc_found = False
		while not next_doc_found:
			# find next_run
			next_run, next_run_index = max_mean.get_next_run(runs_ids, runs_status, max_mean_params)

			# print("next_run::", next_run, "(index: ", next_run_index, ")")  								### LOGGING
			# logging.debug("next_run:: %s", next_run)																				### LOGGING


			while True:
				# find next_doc
				next_doc = adjudication.get_next_doc(runs, next_run, runs_status, retrieved_docs)

				if next_doc.empty:
					# if it's empty, next_run must have run out of documents

					# update runs_status to track that
					runs_status[next_run] = -1

					# print("Run", next_run, "is empty. Trying again.")														### LOGGING
					# logging.debug("Run %s appears to be empty. Trying again.", next_run)				### LOGGING

					# break to go look for another run
					break
			

				# since the proposed next_doc is not empty, we can gather its info
				next_doc_info = {
					'DOCUMENT': next_doc.iloc[0].DOCUMENT,
					'RANK': next_doc.iloc[0].RANK
				}

				''' LOGGING ''' ''' LOGGING ''' ''' LOGGING '''
				# print("next_doc:: DOCUMENT:", next_doc_info['DOCUMENT'], "RANK:", next_doc_info['RANK'] )
				# logging.debug("next_doc:: DOCUMENT: %s RANK %s", next_doc_info['DOCUMENT'], next_doc_info['RANK'])
				''' LOGGING ''' ''' LOGGING ''' ''' LOGGING '''

				if next_doc_info['DOCUMENT'] not in retrieved_docs:
					# if the document found has not been retrieved before
					next_doc_found = True

					break

				# otherwise doc has already been retrieved

				# print("This document is already retrieved. Retrieving a new one:")							### LOGGING
				# logging.debug("This document is already retrieved. Retrieving a new one:")			### LOGGING

				# update run_relevancies to track which documents are unique relevants
				adjudication.check_for_unique_relevants(next_doc_info, retrieved_docs, run_relevancies)
					
				# loop to look for another next_doc

		# finally new document is retrieved

		# get corresponding qrel
		next_doc_info['RELEVANCY'] = get_doc_info.relevancy(qrels, next_doc_info['DOCUMENT'])
		next_doc_info['OCCURRENCES'] = docs_occurrences[next_doc_info['DOCUMENT']]

		# track which documents have already been retrieved
		retrieved_docs[next_doc_info['DOCUMENT']] = {
																									'RELEVANCY': next_doc_info['RELEVANCY'],
																									'RETRIEVED_FROM': next_run,
																									'UNIQUE': 1
																								}

		# update info for first graph
		retrieved_docs_order.append({
			"DOCUMENT": next_doc_info['DOCUMENT'],
			"RANK": next_doc_info['RANK'],
			"RELEVANCY": next_doc_info['RELEVANCY'],
			"RETRIEVED_FROM": next_run,
			"OCCURRENCES": next_doc_info['OCCURRENCES']
		})

		# update info for second graph
		run_relevancies = adjudication.update_run_relevancies(run_relevancies, next_run, next_doc_info)
		run_relevancies_order.append(convert_data.get_dict_from_df(run_relevancies))

		max_mean_params = max_mean.update_params(next_doc_info['OCCURRENCES'], runs_ids, next_doc_info['RELEVANCY'], max_mean_params)


	convert_data.write_dict_into_json(runs_status, 
																		log_path+'adjudication/max_mean/', 
																		"runs_status.json", 0)
	convert_data.write_dict_into_json(retrieved_docs, 
																		log_path+'adjudication/max_mean/', 
																		"retrieved_docs.json", 0)
	convert_data.write_dict_into_json(retrieved_docs_order, 
																		log_path+'adjudication/max_mean/', 
																		"retrieved_docs_order.json", 0)
	convert_data.write_dict_into_json(convert_data.get_dict_from_df(run_relevancies), 
																		log_path+'adjudication/max_mean/', 
																		"run_relevancies.json", 0)
	convert_data.write_dict_into_json(run_relevancies_order, 
																		log_path+'adjudication/max_mean/', 
																		"run_relevancies_order.json", 0)
	
	print("✅ Complete.")

	return {
            'retrieved_docs_order': retrieved_docs_order,
            'run_relevancies_order': run_relevancies_order
        }
