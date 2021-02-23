import pandas as pd


def by_run_size(runs, run_size):
	runs_filtered = runs[runs['RANK'] <= run_size]

	return runs_filtered
