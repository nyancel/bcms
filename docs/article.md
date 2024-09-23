# article types

## 1. paragraph

The paragraph contains text

```json
{
  "type": "paragraph",
  "text": "this is a paragraph",
  "order": 4
}
```

## 2. image

images contain a alternative text as well as an ID for the source image.
it is the job of the renderer to ask for that image in the correct resolution.

```json
{
  "type": "image",
  "src_id": "12345asdlkj12-1141249712365612371",
  "text": "this is an image",
  "order": 2
}
```

## 3. Heading

heading contains a short text that is the heading of an article

```json
{
  "type": "heading",
  "text": "this is an image",
  "order": 2
}
```

# Article Model Overview

The table which contains the articles have following attributes:

- id: primary key to identify the article
- title: used to store title
- body: body of article. Is a nested dictionary with text, pictures...
- desc: short description of the article. Should only be text
- user_id: foreign key to the user table
- timestamp: when the article was posted
- update_timestamp: when the article was edited
- isAccepted: to determine if the article is been accepted by the redaksjon
- accepted_id: who has approved the article
- isListed: to determine if the article is listed on the page
- isDraft: is the article in drafts?
- isDeleted: to determine if the article is not draft 

## JSON representation

```
{
"id": 123,
"title": "a good article",
"body": "this article contains...",
"user_id": 12312,
"timestamp": "2024-07-20:15:33:00",
"update_timestamp": "2024-07-20:15:36:00",
"isAccepted": 0,
"isListed": 1,
"\_links": {
"self": "/users/12312"
}
}
```

## Routes that are implemented in the API

| HTTP Method | Resource URL           | Notes                |
| ----------- | ---------------------- | -------------------- |
| POST        | /article/post          | Posts an article     |
| DELETE      | /article/delete        | Deletes an article   |
| PUT         | /article/edit/<id>     | Modifies an article  |
| GET         | /article/list_all      | Returns all articles |
| GET         | /article/retrieve/<id> | Returns an article   |

# example article body

```json
[
  {
    "type": "paragraph",
    "text": "this is a paragraph",
    "order": 1
  },
  {
    "type": "image",
    "src_id": "12345asdlkj12-1141249712365612371",
    "text": "this is an image",
    "order": 2
  },
  {
    "type": "paragraph",
    "text": "this is a paragraph",
    "order": 3
  },
  {
    "type": "paragraph",
    "text": "this is a paragraph",
    "order": 4
  },
  {
    "type": "heading",
    "text": "this is a paragraph",
    "order": 5
  },
  {
    "type": "image",
    "src_id": "12345asdlkj12-1141249712365612371",
    "text": "this is an image",
    "order": 6
  },
  {
    "type": "paragraph",
    "text": "this is a paragraph",
    "order": 7
  }
]
```
