import pandas as pd


def select_run_size(runs, run_size):
	runs_filtered = runs[runs['RANK'] <= run_size]

	return runs_filtered