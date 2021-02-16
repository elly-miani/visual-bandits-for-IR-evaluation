import pandas as pd


'''
	Index: ['DOCUMENT']
	Filtered columns: all
	Filtered rows: qrels['TOPIC'] == topic
	JSON result: DOCUMENT -> {ITERATION, RELEVANCY, TOPIC}
'''
def get_qrels_by_topic(qrels, topic):
	qrels_filtered = qrels[qrels['TOPIC'] == topic]
	# qrels_filtered.set_index('DOCUMENT', inplace=True)

	return qrels_filtered