import pandas as pd

def get_runs_by_topic(runs, topic):
	runs_filtered = runs[runs['TOPIC'] == topic]

	return runs_filtered
