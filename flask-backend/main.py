import time
from flask import Flask, send_file
from flaskwebgui import FlaskUI

app = Flask(__name__, static_folder='../react-frontend/build', static_url_path='/')

@app.route('/api/time')
def get_current_time():
		return {'time': time.time()}


@app.route('/api/data')
def get_data():
	return send_file('./data/data.json')

@app.route('/api/data2')
def get_data2():
	return send_file('./data/data2.json')


@app.route('/api/json')
def get_data_json():
	return send_file('./data/mockdata_json/GridChart.json')

@app.route('/')
def index():
		return app.send_static_file('index.html')


if __name__ == "__main__":
	app.run()

# to display in single window:
# ui = FlaskUI(browser_path="/Applications/Firefox.app ", app)
# ui.run()
