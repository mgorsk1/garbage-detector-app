import cv2
import numpy as np
import sagemaker
import tensorflow as tf
from sagemaker.tensorflow.model import TensorFlowModel

role = 'sagemaker-admin'
#
# with tarfile.open('model.tar.gz', mode='w:gz') as archive:
#     archive.add('export', recursive=True)

sagemaker_session = sagemaker.Session()
inputs = sagemaker_session.upload_data(path='model.tar.gz', key_prefix='model')

sagemaker_model = TensorFlowModel(
    model_data='s3://' + sagemaker_session.default_bucket() + '/model/model.tar.gz',
    role='sagemaker-admin',
    framework_version='2.0.0',
    entry_point='train.py',
)

predictor = sagemaker_model.deploy(
    initial_instance_count=1,
    instance_type='ml.t2.medium',
)

endpoint_name = ''

# PREDICT --------------------------------------------------------------------------------------------------------------

path_image = './data/test_middle_no_crop3.jpg'

resize_to = (800, 600)
crop_to = (250, 250)

up, down = int((resize_to[1] / 2) - (crop_to[1] / 2)), int((resize_to[1] / 2) + (crop_to[1] / 2))
left, right = int((resize_to[0] / 2) - (crop_to[0] / 2)), int((resize_to[0] / 2) + (crop_to[0] / 2))

image = cv2.imread(path_image)
image = cv2.flip(image, 0)
image = cv2.resize(image, (800, 600))
image = image[up:down, left:right]

# cv2.imshow("image", image)
# cv2.waitKey(0)

image = cv2.resize(image, (224, 224))
image = np.expand_dims(image, axis=0)

image = tf.keras.applications.resnet50.preprocess_input(image)
predictor = sagemaker.tensorflow.model.TensorFlowPredictor(endpoint_name, sagemaker_session)

predictor.predict(image)
