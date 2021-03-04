# DEPRECATED

def occurrences(runs, document_name):
	occurrences = runs[runs['DOCUMENT'] == document_name]

	ranks = occurrences["RANK"].unique().tolist()
	ranks.sort()

	doc_occurrences = {}
	for rank in ranks:
		doc_occurrences[rank] = occurrences[occurrences["RANK"] == rank]["RUN"].unique().tolist()

	return doc_occurrences
