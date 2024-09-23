import pandas as pd
import numpy as np
import xgboost as xgb
from statsmodels.tsa.seasonal import seasonal_decompose
import joblib
import os

base = os.path.join(os.getcwd(), 'model')
model = joblib.load(f'{base}/model3.joblib')

def load_historical_data(file_path=f'{base}/historical_data.csv', start_date=None, end_date=None):
    historical_data = pd.read_csv(file_path, parse_dates=['Unnamed: 0'], index_col=['Unnamed: 0'])
    historical_data.index.name = 'Date'
    
    if start_date:
        historical_data = historical_data[historical_data.index >= start_date]
    if end_date:
        historical_data = historical_data[historical_data.index <= end_date]
    
    return historical_data

def create_advanced_features(df, historical_data):
    df = df.copy()
    df['hour'] = df.index.hour
    df['month'] = df.index.month
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
    
    historical_data_interpolated = historical_data['ActivePower'].interpolate()
    
    df['lag_1d'] = historical_data_interpolated.iloc[-1]
    df['rolling_mean_24h'] = historical_data_interpolated.rolling(window=144, min_periods=1).mean().iloc[-1]
    df['rolling_std_24h'] = historical_data_interpolated.rolling(window=144, min_periods=1).std().iloc[-1]
    df['rolling_mean_168h'] = historical_data_interpolated.rolling(window=1008, min_periods=1).mean().iloc[-1]
    df['rolling_std_168h'] = historical_data_interpolated.rolling(window=1008, min_periods=1).std().iloc[-1]
    df['rolling_mean_720h'] = historical_data_interpolated.rolling(window=4320, min_periods=1).mean().iloc[-1]
    
    decomposition_data = historical_data_interpolated.iloc[-4320:]
    decomposition = seasonal_decompose(decomposition_data, model='additive', period=144)
    df['trend'] = np.linspace(decomposition.trend.iloc[-1], decomposition.trend.iloc[-1] * 1.1, len(df))
    df['seasonal'] = np.tile(decomposition.seasonal.iloc[-144:], len(df) // 144 + 1)[:len(df)]
    df['residual'] = np.random.normal(0, decomposition.resid.std(), len(df))
    
    return df

def predict_future(from_date, to_date, historical_data):
    future_dates = pd.date_range(start=from_date, end=to_date, freq='10min')
    future_features = create_advanced_features(pd.DataFrame(index=future_dates), historical_data)
    
    model_features = ['hour', 'month', 'hour_sin', 'hour_cos', 'month_sin', 'month_cos',
                      'lag_1d', 'rolling_mean_24h', 'rolling_std_24h', 'rolling_mean_168h',
                      'rolling_std_168h', 'rolling_mean_720h', 'trend', 'seasonal', 'residual']
    
    predictions = model.predict(future_features[model_features])
    
    mean_historical = historical_data['ActivePower'].mean()
    std_historical = historical_data['ActivePower'].std()
    predictions = (predictions - predictions.mean()) / predictions.std() * std_historical + mean_historical
    
    return pd.Series(predictions, index=future_dates, name='Predictions')