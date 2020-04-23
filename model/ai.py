import cv2
import googleapiclient.discovery
import numpy as np
from google.oauth2 import service_account

sa_file = 'dupa.json'
credentials = service_account.Credentials.from_service_account_file(sa_file)


def predict_json(project, model, instances, version=None):
    """Send json data to a deployed model for prediction.
​
    Args:
        project (str): project where the AI Platform Model is deployed.
        model (str): model name.
        instances ([Mapping[str: Any]]): Keys should be the names of Tensors
            your deployed model expects as inputs. Values should be datatypes
            convertible to Tensors, or (potentially nested) lists of datatypes
            convertible to tensors.
        version: str, version of the model to target.
    Returns:
        Mapping[str: any]: dictionary of prediction results defined by the
            model.
    """
    # Create the AI Platform service object.
    # To authenticate set the environment variable
    # GOOGLE_APPLICATION_CREDENTIALS=<path_to_service_account_file>
    service = googleapiclient.discovery.build('ml', 'v1', credentials=credentials)
    name = f'projects/{project}/models/{model}'

    if version is not None:
        name += f'/versions/{version}'

    response = service.projects().predict(
        name=name,
        body={'instances': instances},
    ).execute()

    if 'error' in response:
        raise RuntimeError(response['error'])

    return response['predictions']


if __name__ == '__main__':
    image = cv2.imread('./data/test_closer.jpg')

    resize_to = (800, 600)
    crop_to = (250, 250)

    up, down = int((resize_to[1] / 2) - (crop_to[1] / 2)), int((resize_to[1] / 2) + (crop_to[1] / 2))
    left, right = int((resize_to[0] / 2) - (crop_to[0] / 2)), int((resize_to[0] / 2) + (crop_to[0] / 2))

    image = cv2.flip(image, 0)
    image = cv2.resize(image, (800, 600))

    image = image[up:down, left:right]

    image_resized = cv2.resize(image, (128, 128))

    image_resized = np.expand_dims(image_resized, 0).tolist()

    predictions = predict_json('experiment-week', 'garbage_model_h5_128', image_resized)[0]['dense_8']

    classes = ['metal', 'paper', 'glass', 'plastic', 'cardboard']

    result = classes[predictions.index(max(predictions))]

    print(result)
