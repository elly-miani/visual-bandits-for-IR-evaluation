# import glob
# import re
# import os

# module_parent_directory = "lib/"

# owd = os.getcwd()
# print("Current working directory:\n", owd, "\n")
# if not owd.endswith(module_parent_directory):
# 	os.chdir(module_parent_directory)
# 	print("Moving to:\n", os.getcwd(), "\n")


# module_paths = glob.glob("**/*.py", recursive=True)
# print("module_paths:\n", module_paths)

# for module_path in module_paths:
# 	if not re.match(".*__init__.py$", module_path):
# 		import_path = module_path[:-3]
# 		import_path = import_path.replace("/", ".")
# 		exec(f"from .{import_path} import *")

# os.chdir(owd)
# print("Going back to:\n", os.getcwd(), "\n")