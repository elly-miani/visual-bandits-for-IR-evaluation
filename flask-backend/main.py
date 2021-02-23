# import time
from flask import Flask, jsonify, send_file
from flaskwebgui import FlaskUI
import pandas as pd

from lib import convert_data
from lib import get_runs
from lib import get_qrels
from lib import round_robin

app = Flask(__name__, static_folder='../react-frontend/build', static_url_path='/')

runs_df = pd.DataFrame(columns=['TOPIC', 'QUERY', 'DOCUMENT', 'RANK', 'SCORE', 'RUN'])
qrels_df = pd.DataFrame(columns=['TOPIC', 'ITERATION', 'DOCUMENT', 'RELEVANCY'])

log_path = './data/output_logs/'

@app.before_first_request
def before_first_request():
	global runs_df
	global qrels_df

	debug_max_files_loaded = 10000

	# load the txt files into a dataframe runs
	runs_path = "./data/runs"
	print("➡️ Loading runs from file.")
	runs_df = convert_data.read_csv_into_df(runs_path, "RUNS", debug_max_files_loaded, 1)

	# load the txt files into a dataframe qrels
	qrels_path = "./data/qrels"
	print("➡️ Loading qrels from file.")
	qrels_df = convert_data.read_csv_into_df(qrels_path, "QRELS", debug_max_files_loaded, 1)



'''
MAIN ROUTE
'''
@app.route('/')
def index():
	return app.send_static_file('index.html')



'''
RUNS ROUTE
'''
@app.route('/api/runs/<int:topic>', methods=["GET"])
def get_runs_api(topic):
	global runs_df

	# dataframe filtered by topic
	runs_filtered = get_runs.by_topic(runs_df, topic)

	# shorten the run size to avoid sending too large data
	runs_filtered = get_runs.by_run_size(runs_filtered, 100)

	# dataframe with index ['RANK', 'RUN']
	runs_by_rank = get_runs.indexed_by_rank(runs_filtered)

	return jsonify(convert_data.get_dict_from_df(runs_by_rank))



'''
QRELS ROUTE
'''
@app.route('/api/qrels/<int:topic>', methods=["GET"])
def get_qrels_api(topic):
	global qrels_df

	# dataframe filtered by topic and indexed by the document
	qrels_filtered = get_qrels.by_topic(qrels_df, topic)

	# dataframe with index ['DOCUMENT']
	qrels_by_rank = get_qrels.indexed_by_document(qrels_filtered)
	
	return jsonify(convert_data.get_dict_from_df(qrels_by_rank))



'''
ADJUDICATION ROUTE
'''
@app.route('/api/adjudication/<string:method>/<int:topic>/<int:pool_size>', methods=["GET"])
def get_adjudication_data_api(method, topic, pool_size):
	global runs_df
	global qrels_df
	global log_path

	runs_filtered = get_runs.by_topic(runs_df, topic)
	qrels_filtered = get_qrels.by_topic(qrels_df, topic)

	return jsonify(round_robin.round_robin_alg(runs_filtered, qrels_filtered, pool_size, log_path))



@app.route('/api/mockdata/retrieved_docs_order')
def get_mockdata_retrieved_docs_order():
	return send_file('./data/mockdata/retrieved_docs_order.json')

@app.route('/api/mockdata/run_relevancies_order')
def get_mockdata_run_relevancies_order():
	return send_file('./data/mockdata/run_relevancies_order.json')

@app.route('/api/time')
def get_time():
	return {'time': time.time()}


@app.route('/api/mockdata/fake_data1')
def get_mockdata_fake_data1():
	return send_file('./data/mockdata/fake_data1.json')


@app.route('/api/mockdata/fake_data2')
def get_mockdata_fake_data2():
	return send_file('./data/mockdata/fake_data2.json')


# @app.route('/api/mockdata/GridChart')
# def get_mockdata_GridChart():
# 	return send_file('./data/mockdata/json_data/runs/GridChart.json')


# @app.route('/api/mockdata/GridChart2')
# def get_mockdata_GridChart2():
# 	return send_file('./data/mockdata/json_data/runs/GridChart2.json')

if __name__ == "__main__":
	app.run()

# to display in single window:
# ui = FlaskUI(browser_path="/Applications/Firefox.app ", app)
# ui.run()
