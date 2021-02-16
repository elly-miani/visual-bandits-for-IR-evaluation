import pandas as pd
from tabulate import tabulate
import json

from helper_functions import *

# load the txt files into a dataframe runs
runs_path = "../data/runs"
print("➡️ Loading runs from file.")
runs_df = load_dataframe(runs_path, "RUNS")

# load the txt files into a dataframe qrels
qrels_path = "../data/qrels"
print("➡️ Loading qrels from file.")
qrels_df = load_dataframe(qrels_path, "QRELS")

out_path = "../data/experiments/"



print("========== RUNS ==========")
write_df_into_csv(runs_df, out_path, "runs.csv")

print("\n\n========== QRELS ==========")
write_df_into_csv(qrels_df, out_path, "qrels.csv")
print(qrels_df)


print(runs_df)
topic_number = 401

# dataframe filtered by topic and pool depth
runs_filtered = get_runs_by_topic(runs_df, topic_number)
# runs_filtered = filter_runs_by_pool_depth(runs_filtered, pool_depth)

# dataframe with index ['RANK', 'RUN']
runs_df_by_rank = get_runs_by_rank(runs_filtered)
write_df(tabulate(runs_df_by_rank), out_path, "qrels_filtered_index_rank_run")
# print(runs_df_by_rank)

print(runs_df[(runs_df['DOCUMENT'] == 'FT941-3931')])
print(runs_df[(runs_df['DOCUMENT'] == 'FT941-3931') & (runs_df['RUN'] == 'fub99a')])
print(runs_df[(runs_df['DOCUMENT'] == 'FT941-3931') & (runs_df['RUN'] == 'fub99a')].iloc[0].RANK)



# print(runs_df_by_rank)
# print_json_from_df(runs_df_by_rank)

# print(runs_df_by_rank)
# print(tabulate(runs_df_by_rank))

# return jsonify(return_dict_from_df(runs_df_by_rank))
