def get_dict_from_multiindex_df(dataframe):
	levels = len(dataframe.index.levels)
	dicts = [{} for i in range(levels)]
	last_index = None

	for index, value in dataframe.itertuples():

		if not last_index:
			last_index = index

		for (ii, (i, j)) in enumerate(zip(index, last_index)):
			if not i == j:
				ii = levels - ii - 1
				dicts[:ii] = [{} for _ in dicts[:ii]]
				break

		for i, key in enumerate(reversed(index)):
			dicts[i][key] = value
			value = dicts[i]

		last_index = index

	return dicts[-1]
