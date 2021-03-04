import json

def update_params(next_run_index, next_doc_relevancy, max_mean_params):

	# print("next_doc_relevancy:", next_doc_relevancy, "-->", next_doc_relevancy%2)

	max_mean_params['alpha'][next_run_index] = max_mean_params['alpha'][next_run_index] + next_doc_relevancy % 2
	max_mean_params['beta'][next_run_index] = max_mean_params['beta'][next_run_index] + 1 - next_doc_relevancy % 2
	max_mean_params['mean'][next_run_index] = max_mean_params['alpha'][next_run_index] / (max_mean_params['alpha'][next_run_index] + max_mean_params['beta'][next_run_index])

	# print("Updated parameters::")
	# print(json.dumps(max_mean_params, sort_keys=True, indent=2))

	return max_mean_params
