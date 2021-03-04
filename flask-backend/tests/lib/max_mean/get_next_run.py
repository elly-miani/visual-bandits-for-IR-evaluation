def get_next_run(runs_ids, runs_status, max_mean_params):

	max_mean_index = 0
	max_mean_value = 0

	for i in range(len(runs_ids)):
		candidate = max_mean_params['mean'][i]

		if runs_status[runs_ids[i]] != -1 and candidate > max_mean_value:
			max_mean_value = candidate
			max_mean_index = i

	# print("max_mean_value:", max_mean_value)
	# print("max_mean_index:", max_mean_index)

	next_run = runs_ids[max_mean_index]
	
	return next_run, max_mean_index
