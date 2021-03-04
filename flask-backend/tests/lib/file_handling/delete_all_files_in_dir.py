import os

def delete_all_files_in_dir(dir_path):
	filelist = [f for f in os.listdir(dir_path)]
	for f in filelist:
		os.remove(os.path.join(dir_path, f))