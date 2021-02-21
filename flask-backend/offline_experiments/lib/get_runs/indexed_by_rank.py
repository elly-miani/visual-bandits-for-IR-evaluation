import pandas as pd

'''
	MultiIndex: ['RANK', 'RUN']
	Filtered columns: all
	Filtered rows: all
	JSON result: RANK -> RUN -> {DOCUMENT, QUERY, SCORE, TOPIC}
'''
def indexed_by_rank(runs):
	indexed_runs = runs.set_index(['RANK', 'RUN'])
	# runs.set_index(['RUN', 'RANK'], inplace=True)
	indexed_runs.sort_index(inplace=True)
	# print(tabulate(runs, headers='keys', tablefmt='psql'))

	return indexed_runs