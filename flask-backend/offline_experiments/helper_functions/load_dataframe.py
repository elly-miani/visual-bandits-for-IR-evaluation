import pandas as pd
import os

def load_dataframe(dir_path, filetype, max_number_runs):
	print("Loading all ", filetype, " files in ", dir_path, "...")

	if filetype == "RUNS":
		header = ['TOPIC', 'QUERY', 'DOCUMENT', 'RANK', 'SCORE', 'RUN']
	if filetype == "QRELS":
		header = ['TOPIC', 'ITERATION', 'DOCUMENT', 'RELEVANCY']

	data_frame = pd.DataFrame(columns=header)

	counter = 1

	for file in os.listdir(dir_path):

		print("Loading file ", "#", counter, ": ", file, "...", end='', sep='')
		counter = counter + 1

		if file == ".DS_Store":
			print(" Skipped.")
			continue

		file_path = os.path.join(dir_path, file)

		if filetype == "RUNS":
			# runs files are tab-separated
			temp = pd.read_csv(file_path, sep='\t',
			                   encoding="ISO-8859-1", header=None, names=header)
			temp.sort_values('RANK', inplace=True)

			# check if the ranks start from 1; if not, adjust accordingly
			if temp['RANK'].iloc[0] == 0:
				temp['RANK'] += 1

		if filetype == "QRELS":
			# qrels files are space-separated
			temp = pd.read_csv(file_path, sep=' ', header=None, names=header)

		data_frame = data_frame.append(temp, ignore_index=True)
		print(" ✅")

		
		if counter == max_number_runs:
			break

	print("➡️ Parsing of ", dir_path, " complete.\n")
	return data_frame