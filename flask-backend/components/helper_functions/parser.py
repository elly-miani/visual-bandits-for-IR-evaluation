import os
import pandas as pd
import json


'''
Parses files contained in a given directory and returns a pandas' dataframe with all corresponding data.
@PAR dir_path : The path to the directory containing the .txt files
								[str]
@PAR header   : List of strings containing the names of the dataframe columns
								[list]
@PAR filetype : String specifying the type of data contained in the file
								Currently supported: : "RUNS", "QRELS"
								[str]
@RETURNS data_frame : Dataframe containing all the data parsed
								[pd.DataFrame]
'''
def load_dataframe(dir_path, header, filetype):
	print("Loading all ", filetype, " files in ", dir_path, "...")

	data_frame = pd.DataFrame(columns=header)

	for file in os.listdir(dir_path):
		file_path = os.path.join(dir_path, file)

		if filetype == "RUNS":
			# runs files are tab-separated
			temp = pd.read_csv(file_path, sep='\t', header=None, names=header)
			temp.sort_values('RANK', inplace=True)
			
			# check if the ranks start from 1; if not, adjust accordingly
			if temp['RANK'].iloc[0] == 0:
				temp['RANK'] += 1

		if filetype == "QRELS":
			# qrels files are space-separated
			temp = pd.read_csv(file_path, sep=' ', header=None, names=header)

		data_frame = data_frame.append(temp, ignore_index=True)
		print("✅ Appending file ", file_path)

	print("➡️ Parsing of ", dir_path, " complete.\n")
	return data_frame



'''
Write a json file from dataframe in provided file path.
@PAR dataframe : Dataframe to turn into json
								[pd.DataFrame]
@PAR outfile_path : The path to the directory where to write the file
								[str]
@PAR file_name : Name of the file to write
								[str]
'''
def write_json_from_df(dataframe, outfile_path, file_name):
	json_file = outfile_path + file_name
	print("➡️ Writing ", json_file, "...")

	if dataframe.index.nlevels > 1:
		dict = {level: dataframe.xs(level).to_dict('index')
                    for level in dataframe.index.levels[0]}
	else:
		dict = dataframe.to_dict('index')

	with open(json_file, "w") as f:
		f.write(json.dumps(dict, sort_keys=True, indent=4))
	print("✅ Writing complete\n")



'''
Print a json file from dataframe.
@PAR dataframe : Dataframe to turn into json
								[pd.DataFrame]
'''
def print_json_from_df(dataframe):
	if dataframe.index.nlevels > 1:
		dict = {level: dataframe.xs(level).to_dict('index')
         for level in dataframe.index.levels[0]}
	else:
		dict = dataframe.to_dict('index')

	print("🖨  Printing dict in json format:\n")
	print(json.dumps(dict, sort_keys=True, indent=4))


'''
Print a dict in json format.
@PAR dict : Dictionary to turn into json
								[dict]
'''
def print_json_from_dict(dict):
	print("🖨  Printing dict in json format:\n")
	print(json.dumps(dict, sort_keys=True, indent=4))