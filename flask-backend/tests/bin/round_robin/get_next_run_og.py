def get_next_run_og(runs_ids):
	next_run = runs_ids.pop(0)
	runs_ids.append(next_run)

	return next_run