import server

server.server.testing = True
client = server.server.test_client()


def test_new_user():
    print("🟡 CREATING NEW USER")
    new_user_body = {
        "email": "user@email.com",
        "password": "123",
        "firstname": "John",
        "lastname": "Hancock",
    }

    request = client.post("/user/register_new_user", json=new_user_body)
    new_user: dict = request.json

    if "error" in new_user.keys():
        print("❌ TEST FAILED")
        return False, new_user
    else:
        print("✅ TEST PASSED")
        return True, new_user


def test_login_user():
    print("🟡 LOGGING IN TO USER")
    login_body = {
        "email": "user@email.com",
        "password": "123",
    }

    request = client.post("/user/login", json=login_body)
    user: dict = request.json

    if "error" in user.keys():
        print("❌ TEST FAILED")
        return False, user
    else:
        print("✅ TEST PASSED")
        return True, user


def test_logout_user(token: str):
    print("🟡 LOGGING OUT USER")
    logout_body = {
        "user_token": token,
    }

    request = client.post("/user/logout", json=logout_body)
    logout: dict = request.json

    if "error" in logout.keys():
        print("❌ TEST FAILED")
        return False, logout
    else:
        print("✅ TEST PASSED")
        return True, logout


def test_who_user(token: str):
    print("🟡 LOGGING OUT USER")
    who_body = {
        "user_token": token,
    }

    request = client.post("/user/who", json=who_body)
    who_response: dict = request.json

    if "error" in who_response.keys():
        print("❌ TEST FAILED")
        return False, who_response
    else:
        print("✅ TEST PASSED")
        return True, who_response


def test_list_users():
    print("🟡 LISTING USERS")
    request = client.post("/user/list_users", json={})
    who_response: list = request.json

    if request.status_code != 200:
        print("❌ TEST FAILED")
        return False, who_response
    print("✅ TEST PASSED")
    return True, who_response


def run():
    result, data = test_new_user()
    result, data = test_login_user()
    token = data.get("id")
    result, data = test_who_user(token)
    result, data = test_logout_user(token)
    result, data = test_list_users()
    print(data)
