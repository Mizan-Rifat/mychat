import { postAction, getAction } from "./action";

//urls

const fetch_messages_url = (rid)=>`/api/messages?rid=${rid}`;
const add_messages_url = `/api/`;
const sent_message_url = `/api/sendmessage`;
const delete_messages_url =(id)=> `/api/`;
const update_messages_url = (id)=>`/api/`;


//actions

const MESSAGES_FETCHED = 'chat/messages/messages_fetched';
const MESSAGES_LOAD_MORE = 'chat/messages/load_more';
const MESSAGES_ADDED = 'chat/messages/messages_added';
const MESSAGES_SENT = 'chat/messages/messages_deleted';
const MESSAGES_UPDATED = 'chat/messages/messages_updated';

const LOADING_TRUE = 'chat/messages/loading_true';
const LOADING_FALSE = 'chat/messages/loading_false';
const FETCHING_TRUE = 'chat/messages/fetching_true';
const FETCHING_FALSE = 'chat/messages/fetching_false';
const SET_ERRORS = 'chat/messages/set_errors';

// reducers

const initState = {
    fetching:true,
    loading:false,
    messages:[],
    next:null,
    count:0,
    error:{},
};

export default (state=initState,action)=>{
    switch (action.type) {
        case MESSAGES_FETCHED:
            
            return {
                ...state,
                fetching:false,
                loading:false,
                messages:action.payload.data.reverse(),
                next:action.payload.links.next,
                count:action.payload.meta.total,
                
            }

        case MESSAGES_ADDED:
            
            return {
                ...state,
                loading:false,
                messages:[...action.payload.data.reverse(),...state.messages],
                next:action.payload.links.next,
                count:action.payload.meta.total,
                
            }
        case MESSAGES_UPDATED:
            
            return {
                ...state,
                loading:false,
                messages:state.messages.map(item=>item.id == action.payload.id ? action.payload : item),
                
            }
        case MESSAGES_DELETED:
            
            return {
                ...state,
                loading:false,
                messages:state.messages.filter(item => item.id != action.payload),
                
            }
        case LOADING_TRUE:
            
            return {
                ...state,
                loading:true
            }
        case LOADING_FALSE:
            
            return {
                ...state,
                loading:false
            }
        case FETCHING_TRUE:
            
            return {
                ...state,
                fetching:true
    
            }
        case FETCHING_FALSE:
            
            return {
                ...state,
                fetching:false,
            }
        case SET_ERRORS:
            
            return {
                ...state,
                loading:false,
                fetching:false,
                error:action.payload
            }
    
        default:
            return state;
    }
}

// action_creators

export const messagesFetched = (data) =>{
    return {
        type:MESSAGES_FETCHED,
        payload:data
    }
}

export const messagesUpdated = (data) =>{
    return {
        type:MESSAGES_UPDATED,
        payload:data
    }
}
export const messagesDeleted = (id) =>{
    return {
        type:MESSAGES_DELETED,
        payload:id
    }
}
export const messagesAdded = (data) =>{
    return {
        type:MESSAGES_ADDED,
        payload:data
    }
}

export const setErrors = (error) =>{
    return {
        type:SET_ERRORS,
        payload:error
    }
}

export const fetchMessages = (rid) => (dispatch) => {
    
    const url = fetch_messages_url(rid);
    const actions={
        loading:{type:FETCHING_TRUE},
        success:messagesFetched,
        error:setErrors
    }
    return getAction(actions,url,dispatch);
}

export const loadMoreMessages = (next) => (dispatch) => {
    
    const url = next;
    const actions={
        loading:{type:LOADING_TRUE},
        success:messagesAdded,
        error:setErrors
    }
    return getAction(actions,url,dispatch);
}

export const updateMessages = (newData) => (dispatch) => {

    const url = update_messages_url();
    const actions={
        loading:{type:LOADING_TRUE},
        success:messagesUpdated,
        error:setErrors
    }
    return postAction(actions,url,newData,dispatch,'put');
}

export const deleteMessages = (id) => (dispatch) => {

    const url = delete_messages_url(id);
    const actions={
        loading:{type:LOADING_TRUE},
        success:messagesDeleted,
        error:setErrors
    }
    return postAction(actions,url,{},dispatch,'delete');
}
export const sentMessage = (formData,config) => (dispatch) => {

    const url = sent_message_url;
    const actions={
        loading:{type:LOADING_TRUE},
        success:messagesDeleted,
        error:setErrors
    }
    return postAction(actions,url,{},dispatch,'post',config);
}
