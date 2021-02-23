import pandas as pd

'''
	MultiIndex: ['RANK', 'RUN']
	Filtered columns: all
	Filtered rows: all
	JSON result: RANK -> RUN -> {DOCUMENT, QUERY, SCORE, TOPIC}
'''
def indexed_by_rank(runs):
	runs_indexed = runs.set_index(['RANK', 'RUN'])
	# runs.set_index(['RUN', 'RANK'], inplace=True)
	runs_indexed.sort_index(inplace=True)
	# print(tabulate(runs, headers='keys', tablefmt='psql'))

	return runs_indexed
