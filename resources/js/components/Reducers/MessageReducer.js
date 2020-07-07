export default  (state,action)=>{
    switch (action.type) {
        case 'SET_RID':
            return {
                ...state,
                rid:action.payload
            }
        case 'SET_INIT_MSGS':
            return {
                ...state,
                msgs:action.payload.data,
                next:action.payload.links.next,
                msgsChangedflag:true,
                msgsCount:action.payload.meta.total,
                activeUserName:action.payload.recipientName
            }
        case 'SET_PAGE_MSGS':
            return {
                ...state,
                msgs:[...action.payload.data,...state.msgs],
                next:action.payload.links.next,
                // msgsChangedflag:false,
                msgsCount:action.payload.meta.total
            }
        case 'SET_SOCKET_MSGS':
            return {
                ...state,
                msgs:[...state.msgs,action.payload],
                msgsCount:state.msgsCount + 1
            }
        case 'ADD_SINGLE_MSG':
            return {
                ...state,
                msgs:[...state.msgs,action.payload],
                msgsCount:state.msgsCount + 1,
                // msgsChangedflag:true,
            }
        case 'DELETE_SINGLE_MSG':
            return {
                ...state,
                msgs:state.msgs.filter(msg=> msg.id != action.payload),
                msgsCount:state.msgsCount -1 
            }
        case 'DELETE_ALL_MSGS':
            return {
                ...state,
                msgs:[],
                msgsCount:0 
            }
        case 'SET_FLAG_FALSE':
            return {
                ...state,
                msgsChangedflag:false,
            }
    
        default:
            return state;
    }
}