import time
from flask import Flask
from flaskwebgui import FlaskUI

app = Flask(__name__, static_folder='../react-frontend/build', static_url_path='/')

@app.route('/api/time')
def get_current_time():
		return {'time': time.time()}

@app.route('/')
def index():
		return app.send_static_file('index.html')


if __name__ == "__main__":
	app.run()

# to display in single window:
# ui = FlaskUI(browser_path="/Applications/Firefox.app ", app)
# ui.run()
