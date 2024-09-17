# Article Model Overview

The table which contains the articles have following attributes:
- id: primary key to identify the article
- title, body: used to store title and body of article. 
- user_id: foreign key to the user table
- timestamp: when the article was posted
- update_timestamp: when the article was edited
- isAccepted: to determine if the article is been accepted by the redaksjon
- isListed: to determine if the article has been deleted or not

## JSON representation
{
    "id": 123,
    "title": "a good article",
    "body": "this article contains...",
    "user_id": 12312,
    "timestamp": "2024-07-20:15:33:00",
    "update_timestamp": "2024-07-20:15:36:00",
    "isAccepted": 0,
    "isListed": 1,
    "_links": {
        "self": "/users/12312"
    }
}

## Routes that are implemented in the API

| HTTP Method | Resource URL           | Notes                |
|-------------|------------------------|----------------------|
| POST        | /article/post          | Posts an article     |
| DELETE      | /article/delete        | Deletes an article   |
| PUT         | /article/edit/<id>          | Modifies an article  |
| GET         | /article/list_all      | Returns all articles |
| GET         | /article/retrieve/<id> | Returns an article   |