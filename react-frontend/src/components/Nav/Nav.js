import React from 'react'

import './Nav.css';

export default function Nav() {
	return (
		<nav class="nav">
			<div class="nav-links">
					<a href="/" >Relevance Judgments</a>
					<a href="/" >Kendall's τ Scores</a>
					<a href="/" >Leave-Out-Unique Tests</a>
			</div>
		</nav>
	)
}
