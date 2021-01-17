
//actions

const SET_CURRENTUSERS = 'storium/currentUsers/set_currentUsers';
const ADD_CURRENTUSER = 'storium/currentUsers/currentUsers_added';
const REMOVE_CURRENTUSER = 'storium/currentUsers/currentUsers_removed';
// reducers

const initState = {
    currentUsers:[]
};

export default (state=initState,action)=>{
    switch (action.type) {
        case SET_CURRENTUSERS:
            
            return {
                ...state,
                currentUsers:action.payload,
                
            }

        case ADD_CURRENTUSER:
            
            return {
                ...state,
                currentUsers:[...state.currentUsers,action.payload],
                
            }  
        case REMOVE_CURRENTUSER:
            
            return {
                ...state,
                currentUsers:state.currentUsers.filter(user=>user.id != action.payload.id),
                
            }
    
        default:
            return state;
    }
}

// action_creators

export const set_currentUsers = (data) =>{
    return {
        type:SET_CURRENTUSERS,
        payload:data
    }
}

export const add_user = (data) =>{
    return {
        type:ADD_CURRENTUSER,
        payload:data
    }
}

export const remove_user = (data) =>{
    return {
        type:REMOVE_CURRENTUSER,
        payload:data
    }
}


