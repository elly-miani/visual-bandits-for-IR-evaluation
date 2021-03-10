import json

def update_params(occurrences, runs_ids, next_doc_relevancy, max_mean_params):

	# print("next_doc_relevancy:", next_doc_relevancy, "-->", next_doc_relevancy%2)

	for rank in occurrences:
		for run in occurrences[rank]:
			run_index = runs_ids.index(run)

			max_mean_params['alpha'][run_index] = max_mean_params['alpha'][run_index] + next_doc_relevancy % 2
			max_mean_params['beta'][run_index] = max_mean_params['beta'][run_index] + 1 - next_doc_relevancy % 2
			max_mean_params['mean'][run_index] = max_mean_params['alpha'][run_index] / (max_mean_params['alpha'][run_index] + max_mean_params['beta'][run_index])

	# print("Updated parameters::")
	# print(json.dumps(max_mean_params, sort_keys=True, indent=2))

	return max_mean_params
