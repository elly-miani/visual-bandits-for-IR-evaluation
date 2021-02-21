import pandas as pd

def by_topic(runs, topic):
	runs_filtered = runs[runs['TOPIC'] == topic]

	return runs_filtered
