def get_dict_from_df(dataframe):
	if dataframe.index.nlevels > 1:
		dict = {level: dataframe.xs(level).to_dict('index')
						for level in dataframe.index.levels[0]}
	else:
		dict = dataframe.to_dict('index')

	return dict