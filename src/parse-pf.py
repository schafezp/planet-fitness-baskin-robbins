import json
import pandas as pd

with open("evidence-files/pf-locations.json","r") as read_file:
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
    
    print(pd.DataFrame(d)[['title','lat','lng']])

