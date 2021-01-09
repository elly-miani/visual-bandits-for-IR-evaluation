import pandas as pd
import re
import os

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
@RETURNS data_frame : dataframe containing all the data parsed
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


# RUNS ############################################################################

# path to the run files and where to store the csv files
indir_path_runs = "./data/mockdata/runs"
outdir_path_runs = "./data/mockdata_csv/runs"

# parse the txt files into csv files
parse_into_csv(indir_path_runs, outdir_path_runs)

# load the csv files into a dataframe runs
runs = load_csv(outdir_path_runs, ['TOPIC', 'QUERY', 'DOCUMENT', 'RANK', 'SCORE', 'RUN'])


'''
Some useful functions with dataframes
'''

print("\n📄 Select specific columns")
print(runs[['DOCUMENT', 'RUN']])

print("\n📄 Filter specific rows")
print(runs[runs["RUN"] == "apl8c221"])

print("\n📄 Select specific rows & columns")
print(runs.loc[runs["RUN"] == "apl8c221", ["DOCUMENT", "RANK"]])
