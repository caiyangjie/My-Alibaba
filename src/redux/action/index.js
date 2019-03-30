/***
 * Action 类型
 */
export const type = {
    SWITCH_MENU: "SWITCH_MENU",
    USER_NAME: "USER_NAME",
    URL: "URL"
}

export function switchMenu(menuName,menuHide){
    return {
        type:type.SWITCH_MENU,
        menuName,
        menuHide
    }
}

export function getUser(username,name,user_id,sessionToken,menus){
    return {
        type:type.USER_NAME,
        username,
        name,
        user_id,
        sessionToken,
        menus
    }
}
export function getUrl(Url){
    return {
        type:type.URL,
        Url
    }
}