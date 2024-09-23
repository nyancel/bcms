## post : /user/login

Expects:

```json
{
  "email": "some_email@domain.com",
  "password": "123_password"
}
```

Possible Errors:

```json
{"error": "missing email or password"}
{"error": "user not found"}
```

Example return:

```json
{
  "id": "some_data",
  "user_id": "some_data",
  "created_at": "some_data",
  "expires_at": "some_data"
}
```

## post : /user/logout

expects:

```json
{
  "user_token": "123"
}
```

errors:

```json
{
    "error": "token not supplied"
}
{
    "error": "could not delete token"
}

```

returns:

```json
{
  "success": "user logged out"
}
```

## post : /user/register_new_user

expects:

```json
{
  "email": "some_data",
  "password": "some_data",
  "lastname": "some_data", // optional
  "lastname": "some_data" // optional
}
```

errors:

```json
{"error": "missing email or password"}
{"error": "email already registered"}
```

returns:

```json
{
  "id": "some data",
  "first_name": "some data",
  "last_name": "some data",
  "email": "some data",
  "user_role": "some data",
  "last_edited": "some data",
  "created_at": "some data"
}
```

## post : /user/who

expects:

```json
{
  "user_token": "some_data"
}
```

errors:

```json
{"error": "token not supplied"}
{"error": "token invalid"}
{"error": "token expired"}
{"error": "no user data"}
```

returns:

```json
{
  "id": "some data",
  "first_name": "some data",
  "last_name": "some data",
  "email": "some data",
  "user_role": "some data",
  "last_edited": "some data",
  "created_at": "some data"
}
```

## post : /user/list_users

does not expect a body

does not error

returns:

```json
[
  {
    "id": "some data",
    "first_name": "some data",
    "last_name": "some data",
    "last_edited": "some data",
    "created_at": "some data"
  },
  {
    "id": "some data",
    "first_name": "some data",
    "last_name": "some data",
    "last_edited": "some data",
    "created_at": "some data"
  },
  {
    "id": "some data",
    "first_name": "some data",
    "last_name": "some data",
    "last_edited": "some data",
    "created_at": "some data"
  }
]
```

## post : /user/show_user

expects:

```json
{
  "user_id": "some_data"
}
```

errors:

```json
{"error": "user_id not provided"}
{"error": "user not found"}
```

returns:

```json
{
  "id": "some data",
  "first_name": "some data",
  "last_name": "some data",
  "last_edited": "some data",
  "created_at": "some data"
}
```

## post : /user/edit_user

expects:

```json
{
  "user_token": "some_data",
  "password": "some_data",
  "new_password": "some_data",
  "firstname": "some_data",
  "lastname": "some_data",
  "new_email": "some_data"
}
```

errors:

```json
{"error": "token or password not supplied"}
{"error": "token invalid"}
{"error": "token expired"}
{"error": "no user data"}
{"error": "invalid password"}
```

returns:

```json
{
  "id": "some data",
  "first_name": "some data",
  "last_name": "some data",
  "email": "some data",
  "user_role": "some data",
  "last_edited": "some data",
  "created_at": "some data"
}
```

## post : /user/delete_user

expects:

```json
{
  "user_token": "some_data",
  "password": "some_data"
}
```

errors:

```json
{"error": "token or password not supplied"}
{"error": "token invalid"}
{"error": "token expired"}
{"error": "no user data"}
{"error": "invalid password"}
{"error": "could not delete"}
```

returns:

```json
{ "success": "user deleted" }
```

## post : /user/refresh_token

expects:

```json
{
  "user_token": "some_data"
}
```

errors:

```json
{"error": "token invalid"}
{"error": "token expired"}
{"error": "no user data"}
```

returns:

```json
{
  "id": "some_data",
  "user_id": "some_data",
  "created_at": "some_data",
  "expires_at": "some_data"
}
```
