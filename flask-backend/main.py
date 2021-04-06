# import time
from flask import Flask, jsonify, send_file, request, make_response
from flaskwebgui import FlaskUI
from werkzeug.utils import secure_filename

import pandas as pd
import os

from lib import convert_data
from lib import get_runs
from lib import get_qrels
from lib import round_robin
from lib import max_mean
from lib import file_handling

UPLOAD_FOLDER = './data/uploaded/'
DEFAULT_DATA_FOLDER = './data/default/'
LOGS_PATH = './data/output_logs/'

DEBUG_MAX_FILES_LOADED = 30

app = Flask(__name__, static_folder='../react-frontend/build', static_url_path='/')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


runs_df = pd.DataFrame(columns=['TOPIC', 'QUERY', 'DOCUMENT', 'RANK', 'SCORE', 'RUN'])
qrels_df = pd.DataFrame(columns=['TOPIC', 'ITERATION', 'DOCUMENT', 'RELEVANCY'])



# @app.before_first_request
# def before_first_request():
# 	global runs_df
# 	global qrels_df
	
# 	# load the txt files into a dataframe runs
# 	print("➡️ Loading default runs from file.")
# 	runs_df = convert_data.read_csv_into_df(DEFAULT_DATA_FOLDER + "runs", "RUNS", DEBUG_MAX_FILES_LOADED, 1)

# 	# load the txt files into a dataframe qrels
# 	print("➡️ Loading default qrels from file.")
# 	qrels_df = convert_data.read_csv_into_df(DEFAULT_DATA_FOLDER + "qrels", "QRELS", DEBUG_MAX_FILES_LOADED, 1)

# 	# clear user-uploaded directories
# 	file_handling.delete_all_files_in_dir(app.config['UPLOAD_FOLDER'] + "runs" + '/')
# 	file_handling.delete_all_files_in_dir(app.config['UPLOAD_FOLDER'] + "qrels" + '/')



'''
MAIN ROUTE
'''
@app.route('/')
def index():
	# clear user-uploaded directories
	file_handling.delete_all_files_in_dir(app.config['UPLOAD_FOLDER'] + "runs" + '/')
	file_handling.delete_all_files_in_dir(app.config['UPLOAD_FOLDER'] + "qrels" + '/')

	return app.send_static_file('index.html')



'''
RUNS ROUTE
'''
@app.route('/api/runs', methods=["GET"])
def get_runs_api():
	global runs_df

	if(runs_df.empty or request.args.get('topic') is None):
		return make_response("", 404,)
	else:
		topic = int(request.args.get('topic'))

		# dataframe filtered by topic
		runs_filtered = get_runs.by_topic(runs_df, topic)
			
		# shorten the run size to avoid sending too large data
		runs_filtered = get_runs.by_run_size(runs_filtered, 100)

		# dataframe with index ['RANK', 'RUN']
		runs_by_rank = get_runs.indexed_by_rank(runs_filtered)


		response = make_response(
															jsonify(convert_data.get_dict_from_df(runs_by_rank)),
															200,
														)
		response.headers["Content-Type"] = "application/json"
		return response





'''
QRELS ROUTE
'''
@app.route('/api/qrels', methods=["GET"])
def get_qrels_api():
	global qrels_df

	if(qrels_df.empty or request.args.get('topic') is None):
		return make_response("", 404,)
	else:
		topic = int(request.args.get('topic'))

		# dataframe filtered by topic and indexed by the document
		qrels_filtered = get_qrels.by_topic(qrels_df, topic)

		# dataframe with index ['DOCUMENT']
		qrels_by_rank = get_qrels.indexed_by_document(qrels_filtered)
		
		response = make_response(
															jsonify(convert_data.get_dict_from_df(qrels_by_rank)),
															200,
														)
		response.headers["Content-Type"] = "application/json"
		return response



'''
ADJUDICATION ROUTE
?method=round_robin?topic=401?poolSize=100
'''
@app.route('/api/adjudication', methods=["GET"])
def get_adjudication_data_api():
	global runs_df
	global qrels_df
	global LOGS_PATH

	# print(request.args.get('method'))
	# print(request.args.get('topic'))
	# print(request.args.get('poolSize'))
	method = request.args.get('method')
	topic = int(request.args.get('topic'))
	pool_size = int(request.args.get('poolSize'))

	runs_filtered = get_runs.by_topic(runs_df, topic)
	qrels_filtered = get_qrels.by_topic(qrels_df, topic)

	if method == 'round_robin':
		adjudication_result = round_robin.round_robin_alg(runs_filtered, qrels_filtered, pool_size, LOGS_PATH)
	if method == 'max_mean':
		adjudication_result = max_mean.max_mean_alg(runs_filtered, qrels_filtered, pool_size, LOGS_PATH)

	response = make_response(jsonify(adjudication_result), 200,)
	response.headers["Content-Type"] = "application/json"
	return response



'''
	CUSTOM DATA ROUTE TO UPLOAD AND DELETE FILES
'''
@app.route('/api/custom-data/<string:type>', methods=["POST", "DELETE"])
def custom_data(type):
	if request.method == 'POST':
		file = request.files['file']
		filename = secure_filename(file.filename)
		file.save(os.path.join(app.config['UPLOAD_FOLDER'] + type + '/', filename))

		return make_response('', 204)
	
	if request.method == 'DELETE':
		if (request.args.get('filename') is None):
			return make_response("Filename not specified", 404)

		try:
			filename = request.args.get('filename')
			os.remove(os.path.join(app.config['UPLOAD_FOLDER'] + type + '/', filename))
			return make_response('', 204)
		except OSError:
			return make_response("File doesn't exists", 404)


'''
LOAD RUNS & QRELS DATA ROUTE
'''
@app.route('/api/load-data/<string:type>')
def load_data(type):
	global runs_df
	global qrels_df

	runs_df = pd.DataFrame(columns=['TOPIC', 'QUERY', 'DOCUMENT', 'RANK', 'SCORE', 'RUN'])
	qrels_df = pd.DataFrame(columns=['TOPIC', 'ITERATION', 'DOCUMENT', 'RELEVANCY'])

	if type == 'default':
		# load the txt files into a dataframe runs
		print("➡️ Loading default runs from file.")
		runs_df = convert_data.read_csv_into_df(DEFAULT_DATA_FOLDER + "runs", "RUNS", DEBUG_MAX_FILES_LOADED, 1)

		# load the txt files into a dataframe qrels
		print("➡️ Loading default qrels from file.")
		qrels_df = convert_data.read_csv_into_df(DEFAULT_DATA_FOLDER + "qrels", "QRELS", DEBUG_MAX_FILES_LOADED, 1)

		file_handling.delete_all_files_in_dir(app.config['UPLOAD_FOLDER'] + "runs" + '/')
		file_handling.delete_all_files_in_dir(app.config['UPLOAD_FOLDER'] + "qrels" + '/')

	if type == 'custom':
		# load the txt files into a dataframe runs
		print("➡️ Loading custom runs from file.")
		runs_df = convert_data.read_csv_into_df(UPLOAD_FOLDER + "runs", "RUNS", 1000, 1)

		# load the txt files into a dataframe qrels
		print("➡️ Loading custom qrels from file.")
		qrels_df = convert_data.read_csv_into_df(UPLOAD_FOLDER + "qrels", "QRELS", 1000, 1)
	

	response = make_response(
														jsonify(get_runs.params(runs_df)),
														200,
													)
	response.headers["Content-Type"] = "application/json"
	return response




if __name__ == "__main__":
	app.run()

# to display in single window:
# ui = FlaskUI(browser_path="/Applications/Firefox.app ", app)
# ui.run()
