def get_next_doc(runs, next_run, runs_status, retrieved_docs):
	filtered_run = runs[runs["RUN"] == next_run]

	next_doc = filtered_run[filtered_run["RANK"] == runs_status[next_run]]
	runs_status[next_run] = runs_status[next_run]+1

	return next_doc