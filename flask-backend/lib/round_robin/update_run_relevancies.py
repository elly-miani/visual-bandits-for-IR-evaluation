import pandas as pd

def update_run_relevancies(run_relevancies, next_run, next_doc_info):
	if next_run not in run_relevancies.index:
		# append new row for current run
		new_run_row = [0, 0, 0, 0]
		run_relevancies = run_relevancies.append(pd.Series(new_run_row, index=run_relevancies.columns, name=next_run))
	
	# update number of docs retrieved
	run_relevancies.loc[next_run, 'DOCS_RETRIEVED'] += 1

	if next_doc_info['RELEVANCY'] == 1:
		run_relevancies.loc[next_run, 'REL'] += 1
		run_relevancies.loc[next_run, 'REL_UNIQUE'] += 1
	else:
		run_relevancies.loc[next_run, 'NON_REL'] += 1

	return run_relevancies