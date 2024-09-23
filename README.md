# Wind Energy Generation Prediction

This project implements machine learning models to predict wind energy generation based on historical data. It includes data preprocessing, feature engineering, model training scripts, and a Flask web application for easy deployment and usage.

## Project Structure

```
Wind Energy Generation Prediction/
├── Prediction of Renewable Energy Generation.ipynb
└── app
    ├── app.py
    ├── model.py
    ├── model
    │   ├── historical_data.csv
    │   └── model3.joblib
    ├── static
    │   ├── css
    │   │   └── styles.css
    │   └── js
    │       └── script.js
    └── templates
        └── index.html
```

- `Prediction of Renewable Energy Generation.ipynb`: Jupyter notebook containing the data analysis and model development process
- `app.py`: Flask web application for serving predictions
- `model.py`: Contains functions for data preprocessing, feature engineering, and prediction
- `model/`: Directory containing the trained model and historical data
- `static/`: Directory containing CSS and JavaScript files for the web interface
- `templates/`: Directory containing HTML templates for the web interface

## Features

- Data preprocessing and feature engineering for wind turbine data
- Multiple machine learning models (XGBoost) for wind energy prediction
- Flask web application for easy deployment and usage
- Interactive visualization of historical data and predictions
- User-friendly interface for date range selection and prediction

## Prerequisites

- Docker

## Usage

### Running the Web Application using Docker

1. Pull the Docker image:
   ```
   docker pull pouryare/wind-energy-prediction:latest
   ```

2. Run the Docker container:
   ```
   docker run -d -p 5000:5000 --name wind-energy-app pouryare/wind-energy-prediction:latest
   ```

3. Open a web browser and go to `http://localhost:5000` to use the prediction interface.

### Using the Interface

1. Select the date range for prediction using the "From date" and "To date" inputs.
2. Click "Predict" to generate wind energy predictions.
3. View the results, including a visualization of historical and predicted data, as well as summary statistics.

## Model Architecture

The project uses an XGBoost regression model for wind energy prediction. The model is trained on historical data and incorporates various features such as time-based variables, rolling statistics, and seasonal decomposition.

## Performance

The model's performance metrics, such as R-squared, Mean Absolute Error (MAE), and Root Mean Square Error (RMSE), are calculated and displayed in the Jupyter notebook. The final model's performance can be viewed in the web interface after making predictions.

## Contributing

Contributions to this project are welcome! Please fork the repository and submit a pull request with your proposed changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Dataset source: [Wind Power Forecasting](https://www.kaggle.com/datasets/theforcecoder/wind-power-forecasting) from Kaggle
- Inspired by renewable energy forecasting projects in the energy sector
