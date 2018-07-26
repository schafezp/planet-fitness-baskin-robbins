from flask import render_template
from app import app
import pandas as pd

@app.route('/')
@app.route('/index')
def index():
    df = pd.read_csv('../evidence-files/pf-locations-cleaned.csv')
    
    data  = {'df': df}
    return render_template('index.html', title='Home', data=data)