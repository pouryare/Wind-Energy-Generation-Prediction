# Use Ubuntu 24.04 as the base image
FROM ubuntu:24.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY ./app /app

# Install Python and venv
RUN apt-get update && apt-get install -y \
    python3 \
    python3-venv \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Create a virtual environment
RUN python3 -m venv /opt/venv

# Activate the virtual environment and install packages
ENV PATH="/opt/venv/bin:$PATH"
RUN pip3 install --no-cache-dir --upgrade pip setuptools
RUN pip3 install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Run app.py when the container launches
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]