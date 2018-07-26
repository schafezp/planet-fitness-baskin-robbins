import json
import pandas as pd
import urllib.request
import urllib.parse
 
uncleaned_json_file = "evidence-files/br-locations.json"
cleaned_csv_file = "evidence-files/br-locations-cleaned.csv"
#this option resets uncleaned_json_file
reset_json_cache = False

def br_parse(json_data : json):
    limit = 5000 # 5000 is above api limit
    idx = 0
    d = []
    for result in json_data["searchResults"]:
        idx = idx + 1
        if idx > limit:
            break
        latLng = result['fields']["mqap_geography"]["latLng"]
        city = result['fields']["city"]
        row = {'title':city, 'lat': latLng["lat"], 'lng' : latLng["lng"]}
        d.append(row)

    df = pd.DataFrame(d)
    cleaned_df =df[['title','lat','lng']]
    print(cleaned_df)    
    cleaned_df.to_csv(cleaned_csv_file, sep='\t')

if __name__ == "__main__":
    url = "https://www.mapquestapi.com/search/v2/radius?key=Gmjtd%7Clu6t2luan5%252C72%253Do5-larsq&origin=Terre+Haute%2C+IN&units=m&maxMatches=4000&ambiguities=ignore&radius=3000&hostedData=mqap.33454_BaskinRobbins&_=1531798949723" 

    if(reset_json_cache):
        f = urllib.request.urlopen(url)
        if (f.getcode() == 200):
            decoded = f.read().decode('utf-8')
            br_parse(json.loads(decoded))
        else:
            print("Failed to query mapquestapi")
    else:
        with open(uncleaned_json_file,"r") as read_file:
            br_parse(json.load(read_file))
    
else:
    print("one.py is being imported into another module")