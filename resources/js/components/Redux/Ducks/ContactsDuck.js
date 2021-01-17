import { postAction, getAction } from "./action";

//urls

const fetch_contacts_url = `/api/allusers`;
const add_contacts_url = `/api/`;
const delete_contacts_url =(id)=> `/api/`;
const update_contacts_url = (id)=>`/api/`;


//actions

const CONTACTS_FETCHED = 'chat/contacts/contacts_fetched';
const CONTACTS_ADDED = 'chat/contacts/contacts_added';
const CONTACTS_DELETED = 'chat/contacts/contacts_deleted';
const CONTACTS_UPDATED = 'chat/contacts/contacts_updated';

const LOADING_TRUE = 'chat/contacts/loading_true';
const LOADING_FALSE = 'chat/contacts/loading_false';
const FETCHING_TRUE = 'chat/contacts/fetching_true';
const FETCHING_FALSE = 'chat/contacts/fetching_false';
const SET_ERRORS = 'chat/contacts/set_errors';

// reducers

const initState = {
    fetching:true,
    loading:false,
    contacts:[],
    initContacts:[],
    currentUsers:[],
    error:{},
};

export default (state=initState,action)=>{
    switch (action.type) {
        case CONTACTS_FETCHED:
            
            return {
                ...state,
                fetching:false,
                loading:false,
                contacts:action.payload,
                initContacts:action.payload,
                
            }

        case CONTACTS_ADDED:
            
            return {
                ...state,
                loading:false,
                contacts:[...state.contacts,action.payload],
                
            }
        case CONTACTS_UPDATED:
            
            return {
                ...state,
                loading:false,
                contacts:state.contacts.map(item=>item.id == action.payload.id ? action.payload : item),
                
            }
        case CONTACTS_DELETED:
            
            return {
                ...state,
                loading:false,
                contacts:state.contacts.filter(item => item.id != action.payload),
                
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

export const contactsFetched = (data) =>{
    return {
        type:CONTACTS_FETCHED,
        payload:data
    }
}

export const contactsUpdated = (data) =>{
    return {
        type:CONTACTS_UPDATED,
        payload:data
    }
}
export const contactsDeleted = (id) =>{
    return {
        type:CONTACTS_DELETED,
        payload:id
    }
}
export const contactsAdded = (data) =>{
    return {
        type:CONTACTS_ADDED,
        payload:data
    }
}

export const setErrors = (error) =>{
    return {
        type:SET_ERRORS,
        payload:error
    }
}

export const fetchContacts = () => (dispatch) => {
    
    const url = fetch_contacts_url;
    const actions={
        loading:{type:FETCHING_TRUE},
        success:contactsFetched,
        error:setErrors
    }
    return getAction(actions,url,dispatch);
}

export const addContacts = (newData) => (dispatch) => {
    
    const url = add_contacts_url;
    const actions={
        loading:{type:LOADING_TRUE},
        success:contactsAdded,
        error:setErrors
    }
    return postAction(actions,url,newData,dispatch);
}

export const updateContacts = (newData) => (dispatch) => {

    const url = update_contacts_url();
    const actions={
        loading:{type:LOADING_TRUE},
        success:contactsUpdated,
        error:setErrors
    }
    return postAction(actions,url,newData,dispatch,'put');
}

export const deleteContacts = (id) => (dispatch) => {

    const url = delete_contacts_url(id);
    const actions={
        loading:{type:LOADING_TRUE},
        success:contactsDeleted,
        error:setErrors
    }
    return postAction(actions,url,{},dispatch,'delete');
}
