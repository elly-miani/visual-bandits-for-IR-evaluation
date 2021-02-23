import pandas as pd

def indexed_by_document(qrels):
	qrels_indexed = qrels.set_index('DOCUMENT')

	return qrels_indexed