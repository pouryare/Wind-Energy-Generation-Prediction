document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('prediction-form');
    const resultDiv = document.getElementById('result');
    const plotDiv = document.getElementById('plot');
    const resultCard = document.getElementById('result-card');
    const plotCard = document.getElementById('plot-card');
    const snackbarContainer = document.querySelector('#snackbar');

    // Initialize date-time pickers
    const fpConfig = {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minuteIncrement: 10,
        defaultHour: 0,
        defaultMinute: 0,
        onClose: function(selectedDates, dateStr, instance) {
            adjustDateTime(instance);
        },
        plugins: [new confirmDatePlugin({})],
    };

    flatpickr("#from_date", fpConfig);
    flatpickr("#to_date", fpConfig);

    function adjustDateTime(instance) {
        let date = instance.selectedDates[0];
        if (!date) return;

        // Round minutes to nearest 10
        let minutes = Math.round(date.getMinutes() / 10) * 10;
        date.setMinutes(minutes);

        // If hour and minute were not set, default to midnight
        if (instance.initialValue.indexOf(':') === -1) {
            date.setHours(0, 0, 0, 0);
        }

        instance.setDate(date);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const fromDate = document.getElementById('from_date').value;
        const toDate = document.getElementById('to_date').value;
        
        // Show loading in snackbar
        snackbarContainer.MaterialSnackbar.showSnackbar({
            message: 'Predicting...',
            timeout: 2000
        });
        
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `from_date=${fromDate}&to_date=${toDate}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const dates = Object.keys(data.predictions);
                const values = Object.values(data.predictions);

                // Create plot
                const trace = {
                    x: dates,
                    y: values,
                    type: 'scatter',
                    mode: 'lines'
                };
                const layout = {
                    title: 'Wind Energy Predictions',
                    xaxis: { 
                        title: 'Date and Time',
                        tickformat: '%Y-%m-%d %H:%M'
                    },
                    yaxis: { title: 'Predicted Active Power' },
                    autosize: true,
                    margin: { l: 50, r: 50, b: 100, t: 100, pad: 4 }
                };
                const config = {responsive: true}
                Plotly.newPlot(plotDiv, [trace], layout, config);

                // Display summary statistics
                const avg = values.reduce((a, b) => a + b, 0) / values.length;
                const max = Math.max(...values);
                const min = Math.min(...values);
                
                resultDiv.innerHTML = `
                    <h4>Prediction Summary:</h4>
                    <ul class="mdl-list">
                        <li class="mdl-list__item">
                            <span class="mdl-list__item-primary-content">
                                <i class="material-icons mdl-list__item-icon">timeline</i>
                                Average: ${avg.toFixed(2)}
                            </span>
                        </li>
                        <li class="mdl-list__item">
                            <span class="mdl-list__item-primary-content">
                                <i class="material-icons mdl-list__item-icon">arrow_upward</i>
                                Maximum: ${max.toFixed(2)}
                            </span>
                        </li>
                        <li class="mdl-list__item">
                            <span class="mdl-list__item-primary-content">
                                <i class="material-icons mdl-list__item-icon">arrow_downward</i>
                                Minimum: ${min.toFixed(2)}
                            </span>
                        </li>
                    </ul>
                `;

                // Show result and plot cards
                resultCard.style.display = 'block';
                plotCard.style.display = 'block';

                // Show success message in snackbar
                snackbarContainer.MaterialSnackbar.showSnackbar({
                    message: 'Prediction completed successfully!',
                    timeout: 2000
                });
            } else {
                snackbarContainer.MaterialSnackbar.showSnackbar({
                    message: `Error: ${data.message}`,
                    timeout: 2000
                });
            }
        })
        .catch(error => {
            snackbarContainer.MaterialSnackbar.showSnackbar({
                message: `Error: ${error.message}`,
                timeout: 2000
            });
        });
    });
});