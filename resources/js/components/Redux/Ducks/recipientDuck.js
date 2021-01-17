
//actions

const SET_RECIPIENT = 'chat/recipient/recipient_fetched';

// reducers

const initState = {
    recipient:{},
};

export default (state=initState,action)=>{
    switch (action.type) {
        case SET_RECIPIENT:
            
            return {
                ...state,
                recipient:action.payload,
                
            }
    
        default:
            return state;
    }
}

// action_creators

export const setRecipient = (user) =>{
    return {
        type:SET_RECIPIENT,
        payload:user
    }
}
