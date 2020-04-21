# Garbage Detector App

# How to run

There are multiple components to this project.

## Garbage Detector on Rapsberry Pi

To run this application, you need to have a google cloud account setup including:

- Bucket for storage of images
- Model execution environment

To ensure you can connect to GCP, set the following environment variable before you run the application:
        
    export GOOGLE_APPLICATION_CREDENTIALS=/loc/of/your/gcp_key.json

To run the app:

    python -m garbage_detector.main

## Web Application

The web application runs in docker and has to be build first:

    cd web_app
    make build

Then you can run it:
    
    make run

# How to test the garbage detector

Ensure the web app is running and the GCP keys are set, then run:

    python -m python -m tests.test_classifier
