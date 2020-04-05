import React, { useState, useEffect, createContext } from 'react'
import SearchBar from './ChatChild/SearchBar';
import ContactsList from './ChatChild/ContactsList';
import ChatBoxHeader from './ChatChild/ChatBoxHeader';
import ChatBoxBody from './ChatChild/ChatBoxBody';
import ChatBoxFooter from './ChatChild/ChatBoxFooter';
import Sidebar from './ChatChild/Sidebar';
import { Button, Hidden } from '@material-ui/core';
import { useHistory } from 'react-router-dom'
import Welcome from './Welcome';
import Test from './Test'
import MyDrawer from './MyDrawer'

export const MyContext = createContext();

export default function ChatUI2(props) {

    const [rid, setRid] = useState('');
    const [msgs, setMsgs] = useState([]);
    const [msgsCount, setMsgsCount] = useState('');

    const [flag, setFlag] = useState(true);
    const [socketData, setsocketData] = useState([]);

    const [currentUsers, setCurrentUsers] = useState([])
    const [joinedUser, setJoinedUser] = useState({})
    const [leavedUser, setLeavedUser] = useState({})
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [msgFrom, setMsgFrom] = useState('');
    const [msgFromFlag, setMsgFromFlag] = useState('');
    const history = useHistory();


    useEffect(() => {

        Echo.join(`chat`)
            .here((users) => {
                setCurrentUsers(users)
            })
            .joining((user) => {
                setJoinedUser(user)
            })
            .leaving((user) => {

                setLeavedUser(user)
            })

        Echo.private(`MyChannel${localStorage.getItem('userID')}`)
            .listen('NewEvent', function (data) {
                setMsgFrom(data[0])
                setMsgFromFlag(Math.random().toString(36).substring(7))
            })


    }, [])

    useEffect(() => {
        setContacts(contacts.map(item => {
            return item.id == msgFrom ? { ...item, unReadMessages: item.unReadMessages + 1 } : item
        }))
    }, [msgFromFlag])

    useEffect(() => {
        setCurrentUsers([...currentUsers, joinedUser])
    }, [joinedUser])

    useEffect(() => {
        setCurrentUsers(currentUsers.filter(item => item.id != leavedUser.id))
    }, [leavedUser])




    return (
        <div className="container-fluid h-100 mt-3">
            <div className="row justify-content-center h-100">
                <Hidden xsDown>
                    <div className="col-md-5 col-xl-4 chat">
                        <div className="card mb-sm-3 mb-md-0 contacts_card">

                            <MyContext.Provider value={{ rid, setRid, currentUsers, contacts, setContacts, filteredContacts, setFilteredContacts }}>

                                <Sidebar />

                            </MyContext.Provider>

                            <div className="card-footer" />
                        </div>
                    </div>
                </Hidden>
                <div className="col-md-7 col-xl-7 chat">
                    <div className="card" style={{ position: 'relative' }}>

                        {
                            rid == '' ? <Welcome /> :

                                <>
                                    <MyContext.Provider value={{ rid, setRid, msgs, setMsgs, flag, setFlag, socketData, setsocketData, msgsCount, setMsgsCount, currentUsers, contacts, setContacts }}>
                                        <ChatBoxHeader />
                                        <ChatBoxBody />
                                        <ChatBoxFooter />
                                    </MyContext.Provider>
                                </>
                        }

                    </div>
                </div>

                <MyDrawer />

                {/* drawerElements={<div className="chat">
                        <div className="card mb-sm-3 mb-md-0 contacts_card">

                            <MyContext.Provider value={{ rid, setRid, currentUsers, contacts, setContacts, filteredContacts, setFilteredContacts }}>

                                <Sidebar />

                            </MyContext.Provider>

                            <div className="card-footer" />
                        </div>
                    </div>}  */}
            </div>
        </div>

    )
}
