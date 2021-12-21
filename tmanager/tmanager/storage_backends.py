from storages.backends.s3boto3 import S3Boto3Storage

class MediaStorage(S3Boto3Storage):
    location = 'media'
    AWS_DEFAULT_ACL = 'public-read'
    file_overwrite = False