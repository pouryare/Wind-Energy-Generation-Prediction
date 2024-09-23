from flask import Flask, render_template, request, jsonify
from model import load_historical_data, predict_future
import pandas as pd

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        from_date = request.form['from_date']
        to_date = request.form['to_date']
        
        historical_data = load_historical_data()
        predictions = predict_future(from_date, to_date, historical_data)
        
        # Convert Timestamp index to string
        result = {date.strftime('%Y-%m-%d %H:%M:%S'): float(value) for date, value in predictions.items()}
        
        return jsonify({"status": "success", "predictions": result})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)