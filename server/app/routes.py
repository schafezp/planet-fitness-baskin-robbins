from flask import render_template
from app import app
import pandas as pd

@app.route('/')
@app.route('/index')
def index():
    pfdf = pd.read_csv('../evidence-files/pf-locations-cleaned.csv',sep='\t')
    brdf = pd.read_csv('../evidence-files/br-locations-cleaned.csv',sep='\t')
    
    pfdata  = {'df': pfdf[['lat','lng']].to_json(orient='split').rstrip()}
    brdata  = {'df': brdf[['lat','lng']].to_json(orient='split').rstrip()}
    return render_template('index.html', title='Home', pfdata=pfdata, brdata=brdata)