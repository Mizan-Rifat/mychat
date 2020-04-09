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
                msgs:[...action.payload.msgs],
                msgsChangedflag:true,
                msgsCount:action.payload.msgsCount,
                activeUserName:action.payload.recipientName
            }
        case 'SET_PAGE_MSGS':
            return {
                ...state,
                msgs:[...action.payload.msgs,...state.msgs],
                msgsChangedflag:false,
                msgsCount:action.payload.msgsCount
            }
        case 'SET_SOCKET_MSGS':
            return {
                ...state,
                msgs:[...state.msgs,action.payload],
                msgsChangedflag:true,
                msgsCount:state.msgsCount + 1
            }
        case 'ADD_SINGLE_MSG':
            return {
                ...state,
                msgs:[...state.msgs,action.payload],
                msgsCount:state.msgsCount + 1,
                msgsChangedflag:true,
            }
        case 'DELETE_SINGLE_MSG':
            return {
                ...state,
                msgs:state.msgs.filter(msg=> msg.id != payload.id),
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