from google.cloud import storage
import logging


class GCP:

    def __init__(self, bucket_name):
        self.storage_client = storage.Client()
        self.bucket = self.storage_client.bucket(bucket_name)

    def upload_blob(self, source_file_name, destination_blob_name):
        """
        Uploads a file to the bucket.
        """

        blob = self.bucket.blob(destination_blob_name)
        blob.upload_from_filename(source_file_name)

        logging.info(f"File {source_file_name} uploaded to {destination_blob_name}.")

    def blob_exists(self, destination_blob_name):
        """
        Checks if a blob exists in GCP
        """

        blob = self.bucket.blob(destination_blob_name)
        return blob.exists()
