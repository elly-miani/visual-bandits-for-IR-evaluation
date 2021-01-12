import React from 'react'

import './Nav.css';

export default function Nav() {
	return (
		<nav className="nav">
			<div className="nav-links">
					<a href="/" >Relevance Judgments</a>
					<a href="/" >Kendall's τ Scores</a>
					<a href="/" >Leave-Out-Unique Tests</a>
			</div>
		</nav>
	)
}
