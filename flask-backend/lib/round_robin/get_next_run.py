def get_next_run(runs_ids, runs_status, current_run_index):
	
	while True:
		current_run_index = (current_run_index+1) % len(runs_ids)
		if runs_status[runs_ids[current_run_index]] != -1:
			break

	next_run = runs_ids[current_run_index]

	return next_run, current_run_index
