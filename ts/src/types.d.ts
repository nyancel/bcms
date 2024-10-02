type GalleryHtmlElements = {
    input_source: HTMLElement
    image_preview_template: HTMLElement
    image_display: HTMLElement
}

type Media = {
    id: string,
    uploader_user_id: string,
    filename: string,
    file_extention: string,
    file_mimetype: string,
    file_hash: string,
    alt_text: string,
    content_type: string,
    creation_time: number,
    is_unlisted: boolean,
    unlisted_state_update_time: number,
    is_deleted: boolean,
    deleted_state_update_time: number,
}

enum ArticleItemTypeEnum {
    paragraph,
    image,
    heading
}

type ArticleTextItem = {
    type: ArticleItemTypeEnum.heading | ArticleItemTypeEnum.paragraph,
    text: string,
    index: number,
}

type ArticleMediaItem = {
    type: ArticleItemTypeEnum.image,
    alt_text: string,
    src_id: string | undefined,
    index: number,
}

type ArticleData = {
    id: undefined | string,
    author_id: string;
    title: string;
    description: string;
    content: Array<ArticleTextItem | ArticleMediaItem>;
    last_changed: number;
}

type ArticleHtmlTemplates = {
    paragraph: HTMLTemplateElement,
    image: HTMLTemplateElement,
    heading: HTMLTemplateElement,
}

type ArticleEditorControllButtons = {
    log_button: HTMLButtonElement;
    add_paragraph_button: HTMLButtonElement;
    add_image_button: HTMLButtonElement;
    add_heading_button: HTMLButtonElement;
}

// types
type UserAuthToken = {
    id: string,
    user_id: string,
    created_at: number,
    expires_at: number,
}

type User = {
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    last_edited: number,
    created_at: number,
}

type UserData = {
    token: UserAuthToken,
    user: User
}

type UserSigninHtmlInputs = {
    registration: {
        first_name: HTMLInputElement,
        last_name: HTMLInputElement,
        email: HTMLInputElement,
        password: HTMLInputElement,
        repeat_password: HTMLInputElement,
        submit: HTMLButtonElement,
    },
    signin: {
        email: HTMLInputElement,
        password: HTMLInputElement,
        submit: HTMLButtonElement,
    }
}

type UserHtmlElements = {
    login_template: HTMLTemplateElement,
    profile_template: HTMLTemplateElement,
    details_container: HTMLElement,
}

type UtilCacheItem = {
    key: string,
    item: string,
    expires_at: number
}