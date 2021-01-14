import pandas as pd
from tabulate import tabulate
import re
import os
import json


'''
Parses space-separated files contained in a given directory
and outputs the corresponding csv files in a given directory.
@PAR indir_path : The path to the directory containing the .txt files
                  [str]
@PAR outdir_path : The path to the directory where to save the .csv files
                  [str]
'''
def parse_into_csv(indir_path, outdir_path):
  print("Parsing all files in ", indir_path, "...")

  for file in os.listdir(indir_path):
    if file.endswith(".txt"):
      infile_path = os.path.join(indir_path, file)
      outfile_path = os.path.join(outdir_path, file.replace(".txt", ".csv"))
      
      if not os.path.isfile(outfile_path):
        with open(infile_path) as infile, open(outfile_path, 'w') as outfile:
          outfile.write(infile.read().replace("\t", ","))
        print("└──", infile_path, " was parsed into csv file: ", outfile_path)
      else:
        print("❌", outfile_path, " already existed.")
  
  print("➡️ Parsing complete.\n")


'''
Load csv files in provided directory path and returns a pandas dataframe with all corresponding data.
@PAR dir_path : The path to the directory containing the .csv files
                [str]
@PAR header   : List of strings containing the names of the dataframe columns
                [list]
@RETURNS data_frame : Dataframe containing all the data parsed
                [pd.DataFrame]
'''
def load_csv(dir_path, header):
  print("Loading all csv files in ", dir_path, "...")
  data_frame = pd.DataFrame(columns=['TOPIC', 'QUERY', 'DOCUMENT', 'RANK', 'SCORE', 'RUN'])

  for file in os.listdir(dir_path):
    if file.endswith(".csv"):
      file_path = os.path.join(dir_path, file)
      
      temp = pd.read_csv(file_path, header=None, names=header)
      data_frame = data_frame.append(temp, ignore_index=True)
      print("✅ Appending file ", file_path)

  print("➡️ Parsing of ", dir_path, " complete.\n")
  return data_frame


'''
Write a json file in provided file path.
@PAR outfile_path : The path to the file to write
                [str]
@PAR dataframe : Dataframe to turn into json
                [pd.DataFrame]
@PAR orientation : Orientation to pass to function .to_json
'''
def write_json_from_df(outfile_path, dataframe, orientation):
	json_string = dataframe.to_json(orient=orientation)

	print("➡️ Writing ", outfile_path, "...")
	with open(outfile_path, "w") as f:
		f.write(json_string)
	print("✅ Writing complete\n")


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





###################################################################################
# RUNS ############################################################################
###################################################################################


# LOADING & PARSING DATA ##########################################################

# path to the run files and where to store the csv+json files
original_data_path_runs = "./data/mockdata/original_data/runs"
csv_data_path_runs = "./data/mockdata/csv_data/runs"
json_data_path_runs = "./data/mockdata/json_data/runs"

# parse the txt files into csv files
parse_into_csv(original_data_path_runs, csv_data_path_runs)

# load the csv files into a dataframe runs
runs = load_csv(csv_data_path_runs, ['TOPIC', 'QUERY', 'DOCUMENT', 'RANK', 'SCORE', 'RUN'])


# SOME USEFUL FUNCTIONS FOR REFERENCE #############################################

# print("\n📄 Select specific columns")
# print(runs[['RANK', 'DOCUMENT', 'RUN']], "\n")

# print("\n📄 Filter specific rows")
# print(runs[runs["RUN"] == "apl8c221"])

# print("\n📄 Select specific rows & columns")
# print(runs.loc[runs["RUN"] == "apl8c221", ["DOCUMENT", "RANK"]])


# TRANSFORMING THE DF INTO SMTH USEFUL ############################################

''' 
Printing the dataframe with a multiIndex
'''
print("\n📄 Printing the dataframe with multiIndex", "\n")

temp_runs = runs.set_index(['RANK', 'RUN'])
temp_runs.sort_index(inplace=True)
# print(temp_runs, "\n")
# print(tabulate(temp_runs, headers='keys', tablefmt='psql'))

# temp_runs_unstacked = temp_runs.unstack()
# print(temp_runs_unstacked, "\n")
# print(tabulate(temp_runs_unstacked, headers='keys', tablefmt='psql'))


''' 
Writing the corresponding json file from dictionary obtained from dataframe
'''
dict = {level: temp_runs.xs(level).to_dict('index')
        for level in temp_runs.index.levels[0]}

json_file = json_data_path_runs + "/GridChart.json"
print_json_from_dict(dict)
write_json_from_dict(json_file, dict)



''' 
Writing the corresponding json file from dataframe (DEPRECATED)
'''
# json_file = json_data_path_runs + "/GridChart.json"
# orientation = "records"
# orientation = "index"
# write_json_from_df(json_file, temp_runs.unstack(), orientation)
# print_json_from_df(temp_runs.unstack(), orientation)
