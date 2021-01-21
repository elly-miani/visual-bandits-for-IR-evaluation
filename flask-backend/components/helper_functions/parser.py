import os
import pandas as pd
import json
# import re


'''
Parses tab-separated files contained in a given directory
and returns a pandas dataframe with all corresponding data.
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
	print("Loading DIRECTLY all original files in ", dir_path, "...")

	data_frame = pd.DataFrame(columns=header)

	for file in os.listdir(dir_path):
		file_path = os.path.join(dir_path, file)

		if filetype == "RUNS":
			temp = pd.read_csv(file_path, sep='\t', header=None, names=header)
			temp.sort_values('RANK', inplace=True)
			
			# check if the ranks start from 1; if not, adjust accordingly
			if temp['RANK'].iloc[0] == 0:
				temp['RANK'] += 1

		if filetype == "QRELS":
			temp = pd.read_csv(file_path, sep=' ', header=None, names=header)

		data_frame = data_frame.append(temp, ignore_index=True)
		print("✅ Appending file ", file_path)

	print("➡️ Parsing of ", dir_path, " complete.\n")
	return data_frame


'''
Print a dataframe in json format.
@PAR dataframe : Dataframe to turn into json
								[pd.DataFrame]
@PAR orientation : Orientation to pass to function .to_json
'''
def print_json_from_df(dataframe, orientation):
	json_string = dataframe.to_json(orient=orientation)
	json_object = json.loads(json_string)
	print("🖨  Printing dataframe in json format:\n")
	print(json.dumps(json_object, indent=4))


'''
Write a json file from dict in provided file path.
@PAR outfile_path : The path to the file to write
								[str]
@PAR dict : Dictionary to turn into json
								[dict]
'''
def write_json_from_dict(outfile_path, dict):
	print("➡️ Writing ", outfile_path, "...")
	with open(outfile_path, "w") as f:
		f.write(json.dumps(dict, sort_keys=True, indent=4))
	print("✅ Writing complete\n")


'''
Print a dict in json format.
@PAR dict : Dictionary to turn into json
								[dict]
'''
def print_json_from_dict(dict):
	print("🖨  Printing dict in json format:\n")
	print(json.dumps(dict, sort_keys=True, indent=4))
