import time
from flask import Flask, jsonify, send_file
from flaskwebgui import FlaskUI

from components.qrels import *
from components.runs import *


app = Flask(__name__, static_folder='../react-frontend/build',
            static_url_path='/')

@app.route('/api/time')
def get_current_time():
		return {'time': time.time()}


@app.route('/api/mockdata/fake_data1')
def get_mockdata_fake_data1():
	return send_file('./data/mockdata/fake_data1.json')


@app.route('/api/mockdata/fake_data2')
def get_mockdata_fake_data2():
	return send_file('./data/mockdata/fake_data2.json')


@app.route('/api/mockdata/GridChart')
def get_mockdata_json():
	return send_file('./data/mockdata/json_data/runs/GridChart.json')


@app.route('/api/mockdata/GridChart2')
def get_mockdata_json2():
	return send_file('./data/mockdata/json_data/runs/GridChart2.json')


@app.route('/api/runs/<int:topic_number>/<int:pool_depth>', methods=["GET"])
def get_runs(topic_number, pool_depth):

	# load the txt files into a dataframe runs
	runs_path = "./data/runs"
	runs_df = load_dataframe(runs_path, "RUNS")

	# dataframe filtered by topic and pool depth 
	runs_filtered = filter_runs_by_topic_number(runs_df, topic_number)
	runs_filtered = filter_runs_by_pool_depth(runs_filtered, pool_depth)

	# dataframe with index ['RANK', 'RUN']
	runs_df_by_rank = get_runs_by_rank(runs_filtered)

	return jsonify(return_dict_from_df(runs_df_by_rank))


@app.route('/api/mockdata/qrels/<int:topic_number>', methods=["GET"])
def get_mock_qrels(topic_number):

	# load the txt files into a dataframe qrels
	qrels_path = "./data/mockdata/original_data/qrels"
	qrels_df = load_dataframe(qrels_path, "QRELS")

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
