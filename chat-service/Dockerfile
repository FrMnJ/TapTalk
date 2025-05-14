# Use the official Python image as the base image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 8765

# Command to run the FastAPI application
CMD ["uvicorn", "websocket_service:app", "--host", "0.0.0.0", "--port", "8765"]