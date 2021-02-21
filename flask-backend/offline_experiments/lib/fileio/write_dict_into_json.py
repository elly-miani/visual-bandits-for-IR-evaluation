import pandas as pd
import json

def write_dict_into_json(dict, outfile_path, file_name):
	file_path = outfile_path + file_name
	print("➡️ Writing ", file_path, "...")

	with open(file_path, "w") as f:
		f.write(json.dumps(dict, sort_keys=True, indent=2))
	print("✅ Writing complete\n")
