import React, { useState, useEffect, createContext, useContext, useReducer } from 'react'
import ChatBoxHeader from './ChatChild/ChatBoxHeader';
import ChatBoxBody from './ChatChild/ChatBoxBody';
import ChatBoxFooter from './ChatChild/ChatBoxFooter';
import Sidebar from './ChatChild/Sidebar';
import { Button, Hidden } from '@material-ui/core';
import { useHistory } from 'react-router-dom'
import Welcome from './Welcome';
import MyDrawer from './MyDrawer'
import { drawerContext } from './App'
import messageReducer from './Reducers/MessageReducer'
import contactsReducer from './Reducers/ContactsReducer'
export const MyContext = createContext();


export default function ChatUI(props) {

    const { setOpen } = useContext(drawerContext);
    const [rid, setRid] = useState('');
    const [msgs, setMsgs] = useState([]);
    const [msgsCount, setMsgsCount] = useState('');
    const [flag, setFlag] = useState(true);
    const [active, setActive] = useState('');
    const [currentUsers, setCurrentUsers] = useState([])
    const [joinedUser, setJoinedUser] = useState({})
    const [leavedUser, setLeavedUser] = useState({})
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [msgFrom, setMsgFrom] = useState('');
    const [msgFromFlag, setMsgFromFlag] = useState('');
    const [activeUserName, setActiveUserName] = useState('');
    const [typing, setTyping] = useState(false);
    const history = useHistory();

    const initMsgState = {
        msgs: [],
        msgsCount: '',
        msgsChangedflag: true,
        activeUserName:''

    }
    const initContactState = {
        contacts: [],
        initContacts: [],
        currentUsers: [],
        joinedUser: {},
        leavedUser: {},
        selectedUser: ''

    }


    const [state, dispatch] = useReducer(messageReducer, initMsgState);
    const [contactState, contactDispatch] = useReducer(contactsReducer, initContactState);

    useEffect(() => {
        const query = new URLSearchParams(props.location.search);
        const params = query.get('rid');
        if (params != null) {
            setRid(params)
        }

        axios.get('/api/checkauth')
            .then(response => {

                if (!response.data.auth) {
                    history.push('/login')
                }
            })

        axios.get('/api/allusers')
            .then(response => {
                contactDispatch({ type: 'SET_INIT_CONTACTS', payload: response.data.users })
            })

    }, [])




    useEffect(() => {

        Echo.join(`chat`)
            .here((users) => {
                setCurrentUsers(users)
            })
            .joining((user) => {
                setJoinedUser(user)
            })
            .leaving((user) => {
                `   `

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
        if (rid != '') {
            contactDispatch({ type: 'SET_SELECTED_USER', payload: rid })
            setOpen(false)
        }
    }, [rid])


    useEffect(() => {
        setCurrentUsers([...currentUsers, joinedUser])
    }, [joinedUser])

    useEffect(() => {
        setCurrentUsers(currentUsers.filter(item => item.id != leavedUser.id))
    }, [leavedUser])




    return (
        <div className="container h-100 mt-3">
            <div className="row justify-content-center h-100">
                <Hidden xsDown>
                    <div className="col-md-5 col-xl-4 chat">
                        <div className="card mb-sm-3 mb-md-0 contacts_card">

                            <MyContext.Provider value={{ rid, active, setActive, setRid, activeUserName, currentUsers, contacts, setContacts, filteredContacts, setFilteredContacts, contactState, contactDispatch }}>

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
                                    <MyContext.Provider value={{ rid, active, setRid, msgs, activeUserName, setMsgs, flag, setFlag, msgsCount, setMsgsCount, currentUsers, state, dispatch,contactState,typing, setTyping}}>
                                        <ChatBoxHeader />
                                        <ChatBoxBody />
                                        <ChatBoxFooter />
                                    </MyContext.Provider>
                                </>
                        }

                    </div>
                </div>

                <MyDrawer
                    component={

                        <div className="card sidebarCard mb-sm-3 mb-md-0 contacts_card" >
                            <MyContext.Provider value={{ rid, active, setRid, activeUserName, currentUsers, contacts, setContacts, filteredContacts, setFilteredContacts }}>

                                <Sidebar />

                            </MyContext.Provider>
                            <div className="card-footer" />

                        </div>

                    }
                />
            </div>
        </div>

    )
}
