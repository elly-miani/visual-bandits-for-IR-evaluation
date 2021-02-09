import time
from flask import Flask, jsonify, send_file
from flaskwebgui import FlaskUI

from components.qrels import *
from components.runs import *
from components.helper_functions.io_parser_functions import *


app = Flask(__name__, static_folder='../react-frontend/build', static_url_path='/')

runs_df = pd.DataFrame(columns=['TOPIC', 'QUERY', 'DOCUMENT', 'RANK', 'SCORE', 'RUN'])
qrels_df = pd.DataFrame(columns=['TOPIC', 'ITERATION', 'DOCUMENT', 'RELEVANCY'])


@app.before_first_request
def before_first_request():
	global runs_df
	global qrels_df

	# load the txt files into a dataframe runs
	runs_path = "./data/runs"
	print("➡️ Loading runs from file.")
	runs_df = load_dataframe(runs_path, "RUNS")

	# load the txt files into a dataframe qrels
	qrels_path = "./data/qrels"
	print("➡️ Loading qrels from file.")
	qrels_df = load_dataframe(qrels_path, "QRELS")


@app.route('/api/time')
def get_time():
	return {'time': time.time()}


@app.route('/api/mockdata/fake_data1')
def get_mockdata_fake_data1():
	return send_file('./data/mockdata/fake_data1.json')


@app.route('/api/mockdata/fake_data2')
def get_mockdata_fake_data2():
	return send_file('./data/mockdata/fake_data2.json')


@app.route('/api/mockdata/GridChart')
def get_mockdata_GridChart():
	return send_file('./data/mockdata/json_data/runs/GridChart.json')


@app.route('/api/mockdata/GridChart2')
def get_mockdata_GridChart2():
	return send_file('./data/mockdata/json_data/runs/GridChart2.json')


@app.route('/api/runs/<int:topic_number>/<int:pool_depth>', methods=["GET"])
def get_runs(topic_number, pool_depth):
	global runs_df

	# dataframe filtered by topic and pool depth 
	runs_filtered = filter_runs_by_topic_number(runs_df, topic_number)
	runs_filtered = filter_runs_by_pool_depth(runs_filtered, pool_depth)

	# dataframe with index ['RANK', 'RUN']
	runs_df_by_rank = get_runs_by_rank(runs_filtered)

	return jsonify(return_dict_from_df(runs_df_by_rank))


@app.route('/api/qrels/<int:topic_number>', methods=["GET"])
def get_qrels(topic_number):
	global qrels_df

	# dataframe filtered by topic and indexed by the document
	qrels_by_topic = get_qrels_by_topic(qrels_df, topic_number)
	
	return jsonify(return_dict_from_df(qrels_by_topic))


@app.route('/')
def index():
		return app.send_static_file('index.html')


if __name__ == "__main__":
	app.run()

# to display in single window:
# ui = FlaskUI(browser_path="/Applications/Firefox.app ", app)
# ui.run()
