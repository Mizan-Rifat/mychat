export default (state,action)=>{
    switch (action.type) {
        case 'SET_INIT_CONTACTS':
            return {
                ...state,
                contacts:action.payload.filter(item => item.id != localStorage.getItem('userID')),
                initContacts:action.payload.filter(item => item.id != localStorage.getItem('userID'))
            }
        case 'SET_SELECTED_USER':
            return {
                ...state,
                selectedUser:action.payload,
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
                contacts: action.payload == "" ? state.initContacts : state.contacts.filter(contact => contact.name.toUpperCase().includes(action.payload.toUpperCase()))
                
            }
    

        default:
            return state
    }
}