import React from 'react'

// import logo from './assets/logo.svg';
import './assets/App.css';
import 'rsuite/dist/styles/rsuite-default.css'

// import Time from './components/Time/Time'
import Nav from './components/Nav/Nav'
import ViewA from './containers/ViewA/ViewA'
import ViewB from './containers/ViewB/ViewB'

function App() {
	console.log("➡️ Rendering App()");
	
	// const [state, setState] = useState(100);

	// function updateState() {
	// 	setState(prevState => prevState - 1)
	// }

	return (
		<div className="App">
			{/* <header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />

				<p>
					Current state: {state}
				</p>
				<button onClick={updateState}>
					Refresh main App()
				</button>

				<Time />
			</header> */}
			<header>
				<Nav />
			</header>
			<ViewB />
		</div>
	);
}

export default App;