export default (state,action)=>{
    switch (action.type) {
        case 'SET_INIT_CONTACTS':
            return {
                ...state,
                contacts:action.payload.users.filter(item => item.id != action.payload.loggedInUser.id),
                initContacts:action.payload.users.filter(item => item.id != action.payload.loggedInUser.id),
                fetchLoading:false
            }
        case 'SET_SELECTED_USER':
            return {
                ...state,
                selectedUser:state.contacts.find(item => item.id == action.payload),
                contacts:state.contacts.map(item => {
                    if (item.id == action.payload) {
                        item.unReadMessages = 0;
                    }
                    return item;

                })
            }
        case 'SET_FILTERD_CONTACTS':
            return {
                ...state,   
                contacts: action.payload == "" ? state.initContacts : state.initContacts.filter(contact => contact.name.toUpperCase().includes(action.payload.toUpperCase()))
                
            }
        case 'SET_CURRENT_USERS':
            return {
                ...state,   
                currentUsers:[...state.currentUsers,...action.payload]
                
            }
        case 'USER_JOINED':
            return {
                ...state,   
                currentUsers:[...state.currentUsers,action.payload]
                
            }
        case 'USER_LEAVED':
            return {
                ...state,   
                currentUsers:state.currentUsers.filter(item=> item.id != action.payload.id)
                
            }
        case 'RECEIVE_OTHER_MSGS':
            return {
                ...state,
                contacts :state.contacts.map(item => {
                    return item.id == action.payload.from ? { ...item, unReadMessages: item.unReadMessages + 1 } : item
                }),
                initContacts :state.initContacts.map(item => {
                    return item.id == action.payload.from ? { ...item, unReadMessages: item.unReadMessages + 1 } : item
                })
            }
        // case 'CLEAN_UNREAD_MESSAGE':
        //     return {
        //         ...state,
        //         contacts :state.contacts.map(item => {
        //             return item.id == action.payload ? { ...item, unReadMessages: 0 } : item
        //         }),
        //         initContacts :state.initContacts.map(item => {
        //             return item.id == action.payload ? { ...item, unReadMessages: 0 } : item
        //         })
        //     }

    

        default:
            return state
    }
}