import pandas as pd

def write_df(data, outfile_path, file_name):
	file_path = outfile_path + file_name
	print("➡️ Writing ", file_path, "...")

	with open(file_path, "w") as f:
		f.write(data)
	print("✅ Writing complete\n")
