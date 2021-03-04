from lib import convert_data
from tabulate import tabulate
import pandas as pd
import json


def get_occurrences(runs):
	occurrences = {}

	# document_name = 'FR940525-1-00062'
	# filtered_runs = runs[runs['DOCUMENT'] == document_name]


	filtered_runs = runs[['DOCUMENT', 'RANK', 'RUN']]

	# ranks = filtered_runs["RANK"].unique().tolist()
	# ranks.sort()

	# doc_occurrences = {}
	# for rank in ranks:
	# 	doc_occurrences[rank] = filtered_runs[filtered_runs["RANK"] == rank]["RUN"].unique().tolist()
	
	# returned_runs = indexed_runs[indexed_runs.iloc[0].DOCUMENT == document_name]
	# print(convert_data.get_dict_from_df(indexed_runs))

	indexed_runs = filtered_runs.set_index(['DOCUMENT', 'RANK'])
	indexed_runs.sort_index(inplace=True)
	# indexed_runs.sort_index(inplace=True)

	# hello = indexed_runs.groupby('RANK')['RUN'].apply(lambda tags: ', '.join(tags))
	
	# apply({2: 'DOCUMENT', 'RANK': lambda x: tuple(x)}).reset_index()

	# hello = indexed_runs.groupby('RANK', as_index=False)["RUN"].apply(lambda tags: ', '.join(tags))



	# dict = {level: dataframe.xs(level).to_dict('index')
	# 					for level in dataframe.index.levels[0]}

	# dict = convert_data.get_dict_from_df(indexed_runs)
	
	# if dataframe.index.nlevels > 1:
	# 	dict = {level: dataframe.xs(level).to_dict('index')
	# 						for level in dataframe.index.levels[0]}

	# print(indexed_runs.index.levels)
	# for level in indexed_runs.index.levels[0]:
	# 	hello = indexed_runs.xs(level)
	# 	hello.unstack()
		# print(hello)
		# print(indexed_runs.xs(level))
	# 	print(level)

		# for second_level in indexed_runs.index.levels[1]:
		# 	print(second_level)

	# convert_data.write_dict_into_json(dict, './outputs/', 'occurrences.txt', 1)

	# print(dict)

	# doc_occurrences = filtered_runs.pivot(values="RUN", index=["DOCUMENT", "RANK"], columns="QUERY")
	# convert_data.write_df_into_csv(doc_occurrences, './outputs/', 'occurrences.txt', 1)

	# dict = convert_data.get_dict_from_df(indexed_runs)

	# each level convert to list of dictionaries for correct keys use rename
	# L = (df.rename(columns={'RANK': 'name'})
	# 		.groupby(['DOCUMENT', 'RANK'])['name', 'RUN']
	# 		.apply(lambda x: x.to_dict('r'))
	# 		.rename('children')
	# 		.reset_index()
	# 		.rename(columns={'RANK': 'name'})
	# 		.groupby('DOCUMENT')['name', 'children']
	# 		.apply(lambda x: x.to_dict('r'))
	# 		.rename('children')
	# 		.reset_index()
	# 		.rename(columns={'DOCUMENT': 'name'})
	# 		.to_dict('r')
	# 		)
	#print (L)

	# hello = filtered_runs.groupby('RANK')["RUN"].apply(lambda x: x.to_dict('r'))
	# hello = filtered_runs.groupby(['DOCUMENT', 'RANK'])["RUN"].agg(list)


	# hello = df_to_dict(indexed_runs)

	def to_dict(grouped):
		levels = len(grouped.index.levels)
		dicts = [{} for i in range(levels)]
		last_index = None

		for index,value in grouped.itertuples():

			if not last_index:
				last_index = index

			for (ii,(i,j)) in enumerate(zip(index, last_index)):
				if not i == j:
					ii = levels - ii -1
					dicts[:ii] =  [{} for _ in dicts[:ii]]
					break

			for i, key in enumerate(reversed(index)):
				dicts[i][key] = value
				value = dicts[i]

			last_index = index
		
		return dicts[-1]


	result = (filtered_runs.groupby(['DOCUMENT', 'RANK'], as_index=False).agg(list)
            # .apply(lambda x: x[['RUN']].to_dict(list))
            # .reset_index()
            # .rename(columns={0: 'Tide-Data'})
            # .to_json(orient='index')
						)
						# .groupby(['DOCUMENT'], as_index=False).agg(list)

	result = result.set_index(['DOCUMENT', 'RANK']).sort_index()

	result = to_dict(result)

	# result = df_to_dict(result)
	pd.set_option("display.max_rows", None, 
								"display.max_columns", 1000, 
								"display.max_colwidth", None,
                "display.width", 100000)

	print(json.dumps(result, sort_keys=True, indent=2))

	return occurrences
