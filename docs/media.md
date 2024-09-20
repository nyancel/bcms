POST    /media/upload_media
query
body:multipart-form {
  media: @file(./upload_image.jpg)
}

return
```json
{
    "data": {
        "results": {
            "1726830246422429-2NNNGu2xWJnq": {
                "original_filename": "upload_image.jpg",
                "success": 1
            },
            ...
        },
        "task_ID": "17268302464223816-CBnIApbcR3fr"
    },
    "message": "File upload request recieved"
}
```


POST    /media/fetch_media"
<!-- do note that the media_ID will not be a drop in replacement due to the database being local -->
query
params:query {
  media_ID: 1726829477543921-De1ySZKWvQEN
}

return
```json
{
  "instances": [
    {
      "instance_id": "17268294775593667-iUZYiIR1TWgn",
      "parent_id": "1726829477543921-De1ySZKWvQEN",
      "url": "http://localhost:8080/volume/media/files/1726829477543921-De1ySZKWvQEN/17268294775593667-iUZYiIR1TWgn.jpg",
      "x_dimension": 1126,
      "y_dimension": 1126
    },
    ...
  ],
  "metadata": {
    "content_type": "image",
    "creation_time": 1726829477.5471098,
    "deletion_time": 0,
    "file_extention": "jpg",
    "file_mimetype": "image/jpeg",
    "filename": "upload_image",
    "id": "1726829477543921-De1ySZKWvQEN",
    "is_deleted": false,
    "uploader_user_id": "1726829477547041-CRFaQu9idf0q"
  }
}
```