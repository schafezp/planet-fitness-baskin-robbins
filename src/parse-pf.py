import json
import pandas as pd

uncleaned_json_file = "evidence-files/pf-locations.json"
cleaned_csv_file = "evidence-files/pf-locations-cleaned.csv"

with open(uncleaned_json_file,"r") as read_file:
    data = json.load(read_file)
    obj_limit = int((len(data)-9)/8)
    idx = 9 #keys start at idx
    d = []
    for x in range(obj_limit):
        row = {'nid': data[idx],'title': data[idx+1],
         'lat': data[idx+2], 'lng': data[idx+3],
         'tel': data[idx+4], 'phone': data[idx+5],
         'address': data[idx+6], 'locales': data[idx+7]}
        d.append(row)
        idx = idx + 8 # skip to next group of 8 keys
    
    df = pd.DataFrame(d)
    print(df[['title','lat','lng']])
    df[['title','lat','lng']].to_csv(cleaned_csv_file, sep='\t')

