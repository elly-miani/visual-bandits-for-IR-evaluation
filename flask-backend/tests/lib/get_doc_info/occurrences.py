def occurrences(runs, document_name):
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
