import pandas as pd

from lib import convert_data
from lib import get_doc_info
from lib import round_robin


def round_robin_alg(runs, qrels, pool_size, log_path):

	# identify the names of all unique runs, and how many there are
	runs_ids = runs["RUN"].unique().tolist()
	runs_ids.sort()
	runs_count = len(runs_ids)


	### HELPER STRUCTURES
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
		# print("Retrieving document", i, "\n")

		next_run = round_robin.get_next_run(runs_ids)
		next_doc = round_robin.get_next_doc(runs, next_run, runs_status, retrieved_docs)

		# proposed next_doc
		next_doc_info = {
			'DOCUMENT': next_doc.iloc[0].DOCUMENT,
			'RANK': next_doc.iloc[0].RANK
		}


		while next_doc_info['DOCUMENT'] in retrieved_docs:
			# if document was already retrieved

			# update run_relevancies to track which documents are unique relevants
			round_robin.check_for_unique_relevants(next_doc_info, retrieved_docs, run_relevancies)

			# find new proposed next_doc
			next_doc = round_robin.get_next_doc(runs, next_run, runs_status, retrieved_docs)

			next_doc_info = {
				'DOCUMENT': next_doc.iloc[0].DOCUMENT,
				'RANK': next_doc.iloc[0].RANK
			}

		# finally new document is retrieved

		# get corresponding qrel
		next_doc_info['RELEVANCY'] = get_doc_info.relevancy(qrels, next_doc_info['DOCUMENT'])

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
			"OCCURRENCES": get_doc_info.occurrences(runs, next_doc_info['DOCUMENT'])
		})

		# update info for second graph
		run_relevancies = round_robin.update_run_relevancies(run_relevancies, next_run, next_doc_info)
		run_relevancies_order.append(convert_data.get_dict_from_df(run_relevancies))


	convert_data.write_dict_into_json(runs_status, 
																		log_path+'adjudication/', 
																		"runs_status.json", 0)
	convert_data.write_dict_into_json(retrieved_docs, 
																		log_path+'adjudication/', 
																		"retrieved_docs.json", 0)
	convert_data.write_dict_into_json(retrieved_docs_order, 
																		log_path+'adjudication/', 
																		"retrieved_docs_order.json", 0)
	convert_data.write_dict_into_json(convert_data.get_dict_from_df(run_relevancies), 
																		log_path+'adjudication/', 
																		"run_relevancies.json", 0)
	convert_data.write_dict_into_json(run_relevancies_order, 
																		log_path+'adjudication/', 
																		"run_relevancies_order.json", 0)
	
	print("✅ Complete.")

	return {
            'retrieved_docs_order': retrieved_docs_order,
            'run_relevancies_order': run_relevancies_order
        }
