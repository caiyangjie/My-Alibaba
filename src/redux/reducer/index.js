import { type } from "../action";

/***
 * Reducer 数据处理
 */
const initialState = {
    cityId:'123',
    menuName:'首页'
}

export default (state = initialState,action)=>{
    switch (action.type) {
        case type.SWITCH_MENU:
            return {
                ...state,
                menuName:action.menuName,
                menuHide:action.menuHide
            }
            break;
    
        case type.USER_NAME:
            return {
                ...state,
                username:action.username,
                name:action.name,
                user_id:action.user_id,
                sessionToken:action.sessionToken,
                menus:action.menus
            }
            break;

        default:
            return ''
            break;
    }
}