import lib.user.user_db
import lib.user.user
import lib.user.rights
import lib.util.env


def get_all_rights_as_true():
    property_names = [
        p for p in dir(lib.user.user_db.UserRights)
        if str(p).startswith("can_")
    ]
    rights = {}
    for p in property_names:
        rights[p] = True
    return rights


def run():
    DRIVER = lib.user.user_db.Driver
    DRIVER.BASE.metadata.drop_all(DRIVER.engine)
    DRIVER.BASE.metadata.create_all(DRIVER.engine)

    admin_user = lib.user.user.create_new_user(
        lib.util.env.SERVER_ADMIN_EMAIL,
        lib.util.env.SERVER_ADMIN_PASSWORD
    )
    admin_rights = lib.user.rights.create_new_user_rights(admin_user.id)
    admin_rights = lib.user.rights.update_rights(
        admin_rights.id, get_all_rights_as_true()
    )
