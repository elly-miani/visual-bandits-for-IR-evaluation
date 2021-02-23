import pandas as pd

def write_df(dataframe, outfile_path, file_name):
	file_path = outfile_path + file_name
	print("➡️ Writing ", file_path, "...")

	with open(file_path, "w") as f:
		f.write(dataframe)
	print("✅ Writing complete\n")
