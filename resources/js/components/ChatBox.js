import React,{useState,useContext,useEffect} from 'react';
import ChatBoxBody from "../components/ChatChild/ChatBoxBody"
import ChatBoxFooter from "../components/ChatChild/ChatBoxFooter"
import ChatBoxHeader from "../components/ChatChild/ChatBoxHeader"

export default function ChatBox() {


    useEffect(() => {
        if (page != 1) {
            axios.get(`/api/messages?rid=${rid}&page=${page}`)
                .then(response => {
                    console.log(response)
                    

                    dispatch({ type: 'SET_PAGE_MSGS', payload: { msgs: response.data.messages, msgsCount: response.data.count } })

                    setTotalPage(Math.ceil(response.data.count / 10))

                }).catch(e => {
                    if (e.response.status == 401) {
                        history.push('/')
                    }
                })
        }

    }, [page])

    useEffect(() => {

        axios.get(`/api/messages?rid=${rid}&page=${page}`)
            .then(response => {
                setRecipientName(response.data.recipientName)
                dispatch({ type: 'SET_INIT_MSGS', payload: { msgs: response.data.messages, msgsCount: response.data.count } })
                setRuser(true)
                setLoading(false)
                setTotalPage(Math.ceil(response.data.count / 10) == 0 ? 1 : Math.ceil(response.data.count / 10))

            }).catch(e => {
                if (e.response.status == 401) {
                    history.push('/')
                }
                if (e.response.status == 404) {
                    setRuser(false)
                }
            })

    }, [rid])

    return (
        <>
            <ChatBoxHeader />
            <ChatBoxBody />
            <ChatBoxFooter />
        </>
    )
}
