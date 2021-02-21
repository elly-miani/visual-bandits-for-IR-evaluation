def check_for_unique_relevants(next_doc_info, retrieved_docs, run_relevancies):
	if retrieved_docs[next_doc_info['DOCUMENT']]['UNIQUE'] == 1:
		next_doc_info['RELEVANCY'] = retrieved_docs[next_doc_info['DOCUMENT']]['RELEVANCY']

		if next_doc_info['RELEVANCY'] == 1:
			run_relevancies.loc[retrieved_docs[next_doc_info['DOCUMENT']]['RETRIEVED_FROM'], 'REL_UNIQUE'] -= 1

		retrieved_docs[next_doc_info['DOCUMENT']]['UNIQUE'] = 0