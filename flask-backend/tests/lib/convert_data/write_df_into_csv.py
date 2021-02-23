import pandas as pd

def write_df_into_csv(dataframe, outfile_path, file_name):
	file_path = outfile_path + file_name
	print("➡️ Writing ", file_path, "...")

	with open(file_path, "w") as f:
		f.write(dataframe.to_csv(sep=',', index=False, header=False))
	print("✅ Writing complete\n")