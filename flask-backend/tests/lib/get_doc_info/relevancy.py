import pandas as pd


def relevancy(qrels, document_name):
	next_doc_qrel = qrels[qrels["DOCUMENT"] == document_name]

	if not next_doc_qrel.empty:
		return next_doc_qrel.iloc[0].RELEVANCY
	else:
		return 2
