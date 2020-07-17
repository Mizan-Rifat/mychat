export default (state,action)=>{
    switch (action.type) {
        case 'SET_RID':
            return {
                ...state,
                rid:action.payload
            }
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
                selectedUser:state.contacts.find(item => item.id == state.rid),
                contacts:state.contacts.map(item => {
                    if (item.id == state.rid) {
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
                // play:true
                contacts : state.rid != action.payload.from ?
                    state.contacts.map(item => {
                    return item.id == action.payload.from ? { ...item, unReadMessages: item.unReadMessages + 1 } : item
                }) : state.contacts,
                initContacts : state.rid != action.payload.from ?
                    state.initContacts.map(item => {
                    return item.id == action.payload.from ? { ...item, unReadMessages: item.unReadMessages + 1 } : item
                }) : state.initContacts,
                play : state.rid != action.payload.from
            }

          case 'SET_PLAY_FALSE':
            return {
              ...state,
              play:false
            }




        default:
            return state
    }
}
