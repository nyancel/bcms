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

    # Creat admin user with all rights
    admin_user = lib.user.user.create_new_user(
        lib.util.env.SERVER_ADMIN_EMAIL,
        lib.util.env.SERVER_ADMIN_PASSWORD
    )

    admin_rights = lib.user.rights.create_new_user_rights(admin_user.id)
    admin_rights = lib.user.rights.update_rights(
        admin_rights.id, get_all_rights_as_true()
    )

    # create editor user with certain rights
    editor_user = lib.user.user.create_new_user(
        lib.util.env.TEST_EDITOR_EMAIL,
        lib.util.env.TEST_EDITOR_PASSWORD,
    )
    editor_rights = lib.user.rights.create_new_user_rights(editor_user.id)
    editor_rights.can_post_draft = True
    editor_rights.can_approve_draft = True
    editor_rights.can_read_all_drafts = True
    editor_rights.can_publish_article = True
    editor_rights.can_delete_article = True
    editor_rights.can_post_media = True
    editor_rights.can_update_media = True
    editor_rights.can_assign_journalist = True
    editor_rights.can_assign_editorial = False
    editor_rights.can_assign_admin = False
    editor_rights.can_delete_other_user = False
    editor_rights.can_change_other_email = False
    editor_rights.can_change_other_password = False
    editor_rights.can_change_other_details = False
    editor_rights.can_edit_user_rights = False
    editor_rights.can_submit_event = False
    editor_rights = lib.user.rights.update_rights(
        editor_rights.id, editor_rights.to_dict()
    )

    # create a basic journalist user
    journalist_user = lib.user.user.create_new_user(
        lib.util.env.TEST_JOURNALIST_EMAIL,
        lib.util.env.TEST_JOURNALIST_PASSWORD,
    )
    journalist_rights = lib.user.rights.create_new_user_rights(
        journalist_user.id
    )
    journalist_rights.can_post_draft = True
    journalist_rights.can_approve_draft = False
    journalist_rights.can_read_all_drafts = False
    journalist_rights.can_publish_article = False
    journalist_rights.can_delete_article = False
    journalist_rights.can_post_media = True
    journalist_rights.can_update_media = True
    journalist_rights.can_assign_journalist = False
    journalist_rights.can_assign_editorial = False
    journalist_rights.can_assign_admin = False
    journalist_rights.can_delete_other_user = False
    journalist_rights.can_change_other_email = False
    journalist_rights.can_change_other_password = False
    journalist_rights.can_change_other_details = False
    journalist_rights.can_edit_user_rights = False
    journalist_rights.can_submit_event = False
    journalist_rights = lib.user.rights.update_rights(
        journalist_rights.id, journalist_rights.to_dict()
    )
