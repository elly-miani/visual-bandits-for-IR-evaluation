from lib import convert_data
from tabulate import tabulate
import pandas as pd
import json


def get_occurrences(runs, log_path):

	filtered_runs = runs[['DOCUMENT', 'RANK', 'RUN']]

	grouped_runs = (filtered_runs.groupby(['DOCUMENT', 'RANK'], as_index=False)
						.agg(list)
						.set_index(['DOCUMENT', 'RANK'])
						.sort_index()
						)

	occurrences = convert_data.get_dict_from_multiindex_df(grouped_runs)

	convert_data.write_dict_into_json(occurrences, log_path+'adjudication/', "occurrences.json", 1)

	return occurrences
