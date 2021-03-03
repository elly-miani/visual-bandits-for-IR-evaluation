def params(runs):
	runs_list = runs["RUN"].unique().tolist()
	runs_list.sort()

	topic_list = runs["TOPIC"].unique().tolist()
	topic_list.sort()

	return {
		'runsList': runs_list,
		'topic_list': topic_list
	}