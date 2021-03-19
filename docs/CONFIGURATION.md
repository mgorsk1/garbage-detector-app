
# Configuration

## Camera

### Resolution

What image size should be captured from raspberry pi camera. **In pixels.**

#### Width `CAMERA_RESOLUTION_WIDTH`

Default: `640`

#### Height `CAMERA_RESOLUTION_HEIGHT`

Default: `480`

### Framerate `CAMERA_FRAMERATE`

What's the desired video stream frame rate that should be captured.

Default: `10`

### Display `CAMERA_DISPLAY`

Should video stream be displayed during runtime.

Note that when running Garbage Detector App via SSH without GUI, this should be set to `false` or application will fail.

Default: `false`

## Trigger

What kind of triggering do we want to use. Available options:

* `DummyTrigger` - app will trigger classification continuously
* `DistanceSensorTrigger` - app will trigger classification when person is in specified range of the proximity sensor

### Cls `TRIGGER_CLS`

Default: `DistanceSensorTrigger`

### Parameters
`TRIGGER_PARAMETERS_ECHO`
Default: `20} `TRIGGER_PARAMETERS_TRIGGER`
Default: `26} `TRIGGER_PARAMETERS_DISTANCE_MIN`
Default: `25} `TRIGGER_PARAMETERS_DISTANCE_MAX`
Default: `65} `TRIGGER_PARAMETERS_LED`
Default: `24

### Delay `TRIGGER_DELAY`

How long triggering condition should be fulfilled to trigger the classification. **In seconds.**

Default: `3`

## LEDs

Configuration of LEDs used for pointing correct sorting fraction. Should ne GPIO pin number.

### Green `LEDS_GREEN_PIN`

Default: `27`

### Red `LEDS_RED_PIN`

Default: `14`

### Yellow `LEDS_YELLOW_PIN`

Default: `23

### Blue  `LEDS_BLUE_PIN`

Default: `22`

## GCP

Configuration regarding integration with Google Cloud Platform.

### Project

#### Name `GCP_PROJECT_NAME`

Name of project where our infrastructure & services are deployed.

Default: `experiment-week`

#### Region `GCP_REGION`

Region of project where our infrastructure & services are deployed.

For several services (like AutoML, AI) this needs to be `us-central1`.

Default: `us-central1`

### Bucket

Configuration of GCP Bucket, where classification results will be stored.

#### Name `GCP_BUCKET_NAME`

Name of bucket to which save classification results.

Default: `garbage-detector-classifications`

### AI

Settings used when our classification is done by model deployed to GCP AI.

#### Model

##### Name `GCP_AI_MODEL_NAME`

Name of model deployed to GCP AI.

Default: `garbage_model_h5_128_custom_prep`

##### Version `GCP_AI_MODEL_VERSION`

Version of model deployed to GCP AI.

Default: `1`

### AutoML

Settings used when our classification is done by MLaaS model created in GCP AutoML.

#### Model

##### Id `GCP_AUTOML_MODEL_ID`

ID of model deployed to GCP AI.

Default: `ICN4013336188638199808`

#### Threshold `GCP_AUTOML_MODEL_THRESHOLD`

Accepted minimum probability of prediction made by model. Should be value from **range (0;1)**.

Default: `0.6`

### Vision

Settings used when our classification is done by model available in Google Cloud Platform Vision.

#### Classification

##### Threshold `GCP_VISION_CLASSIFICATION_THRESHOLD`

Accepted minimum probability of prediction made by model. Should be value from **range (0;100)**.

Default: `40`

#### Image

Size of the image we will be sending to Google Cloud Platform Vision model.

##### Size

###### Width `GCP_VISION_IMAGE_SIZE_WIDTH`

Default: `2400`

###### Height `GCP_VISION_IMAGE_SIZE_HEIGHT`

Default: `1800`

### Backend

Settings related to web-app.

#### Scheme `BACKEND_SCHEME`

Scheme under which application is published.

Default: `http`

#### Host `BACKEND_HOST`

Address under which application is published.

Default: `34.91.179.51`

#### Port `BACKEND_PORT`

Port under which application is published (backend, not UI).

Default: `9000`

### TFSERVING

Settings used when we are using Tensorflow Model hosted in our own Tensorflow Serving instance.

#### Scheme `TFSERVING_SCHEME`

Scheme under which model is published.

Default: `http`

#### Host `TFSERVING_HOST`

Address under which model is published.

Default: `192.168.0.17`

#### Port `TFSERVING_PORT`

Port under which model is published (**REST API**, not gRPC).

Default: `8500`

#### Model

##### Name `TFSERVING_MODEL_NAME`

Name of the model deployed to Tensorflow Serving.

Default: `gd`

### Classifier

#### Cls `CLASSIFIER_CLS`

Default: `TensorflowServingGarbageClassifier`

### Image

#### Final size `IMAGE_FINAL_SIZE`

For all classifiers (except of Google Cloud Platform Vision) the actual image will be cropped square of `IMAGE_FINAL_SIZE`
width and height. **In pixels.**

Default: `224`

#### Crop factor `IMAGE_CROP_FACTOR`

Default: `.33`
