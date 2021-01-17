import React,{useState,useContext,useEffect, useReducer} from 'react';
import ChatBoxBody from "./ChatBoxBody"
import ChatBoxFooter from "./ChatBoxFooter"
import ChatBoxHeader from "./ChatBoxHeader";
import listenerReducer from '../Reducers/ListenerReducer';

export default function ChatBox() {


const [listenerState,listenerDispatch] = useReducer(listenerReducer,{
    isTyping : false,
    newIncomingMsg : false,
    scroll : false,
    visibility : true
})

  

    return (
        <>
            <ChatBoxHeader />

            <ChatBoxBody listenerState={listenerState} listenerDispatch={listenerDispatch} />

            <ChatBoxFooter listenerState={listenerState} listenerDispatch={listenerDispatch} />

        {/*            {
                contactState.selectedUser != undefined &&

                <ChatBoxFooter listenerState={listenerState} listenerDispatch={listenerDispatch} />
            }         */}
        </>
    )
}
