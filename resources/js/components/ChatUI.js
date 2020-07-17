import React, {
    useState,
    useEffect,
    createContext,
    useContext,
    useReducer
} from "react";
import ChatBox from "./ChatChild/ChatBox";
import ChatBoxHeader from "./ChatChild/ChatBoxHeader";
import ChatBoxBody from "./ChatChild/ChatBoxBody";
import ChatBoxFooter from "./ChatChild/ChatBoxFooter";
import Sidebar from "./ChatChild/Sidebar";
import {
    Button,
    Hidden
} from "@material-ui/core";
import {
    useHistory
} from "react-router-dom";
import Welcome from "./Welcome";
import MyDrawer2 from "./MyDrawer2";
import {
    drawerContext
} from "./App";
import messageReducer from "./Reducers/MessageReducer";
import contactsReducer from "./Reducers/ContactsReducer";
import axios from "axios";
import MyAppBar from "./MyAppBar";

import CircularProgress from "@material-ui/core/CircularProgress";

export const MyContext = createContext();

export default function ChatUI(props) {
    const {
        user
    } = useContext(drawerContext);

    const sound = new Audio("/uploads/audio/2.mp3");

    const [open, setOpen] = useState(false);



    const history = useHistory();

    const initMsgState = {
        msgs: [],
        msgsCount: "",
        next: "",
        msgsChangedflag: true,
        activeUserName: ""
    };
    const initContactState = {
        rid: '',
        contacts: [],
        initContacts: [],
        currentUsers: [],
        joinedUser: {},
        leavedUser: {},
        selectedUser: "",
        fetchLoading: true,
        play: false
    };

    const [messageState, messageDispatch] = useReducer(
        messageReducer,
        initMsgState
    );
    const [contactState, contactDispatch] = useReducer(
        contactsReducer,
        initContactState
    );

    useEffect(() => {
        if (Object.entries(user.user).length == 0) {
            history.push("/login");
        } else {
            const query = new URLSearchParams(props.location.search);
            const params = query.get("rid");

            window.Echo.leaveChannel(`chat`)

            axios
                .get(`/api/allusers`)
                .then(response => {
                    contactDispatch({
                        type: "SET_INIT_CONTACTS",
                        payload: {
                            users: response.data.users,
                            loggedInUser: user.user
                        }
                    });
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status == 401) {
                        history.push("/login");
                    }
                })
                .then(() => {
                    if (params != null) {
                        contactDispatch({
                            type: "SET_RID",
                            payload: params
                        });
                    }
                });

            window.Echo.join(`chat`)
                .here(users => {
                    console.log({
                        users
                    });
                    contactDispatch({
                        type: "SET_CURRENT_USERS",
                        payload: users
                    });
                })
                .joining(user => {
                  console.log('juser',user)
                    contactDispatch({
                        type: "USER_JOINED",
                        payload: user
                    });
                })
                .leaving(user => {
                  console.log('luser',user)
                    contactDispatch({
                        type: "USER_LEAVED",
                        payload: user
                    });
                });

            window.Echo.private(`MyChannel${user.user.id}`).listen(
                "NewEvent",
                function(data) {
                    console.log("mydata", data[0]);

                    contactDispatch({
                        type: "RECEIVE_OTHER_MSGS",
                        payload: {
                            from: data[0]
                        }
                    });
                    // sound.play();
                }
            );
        }
    }, []);

    useEffect(() => {
        if (contactState.rid != "") {
            contactDispatch({
                type: "SET_SELECTED_USER",
                // payload: rid
            });
            setOpen(false);
        }
    }, [contactState.rid]);

    useEffect(() => {
        if (contactState.play) {
            sound.play()
            const timeoutID = setTimeout(() => {
                contactDispatch({
                    type: "SET_PLAY_FALSE",
                });
            }, 1000);
        }
    }, [contactState.play]);

    return (
      <MyContext.Provider value = {
            {

                messageState,
                messageDispatch,
                contactState,
                contactDispatch,
                user
            }
        } >

        <MyAppBar setOpen = {
            setOpen
        }
        />

        { // true ?
            contactState.fetchLoading ? (
              <div className = "d-flex justify-content-center align-items-center"
                style = {
                    {
                        height: "300px"
                    }
                } >

              <CircularProgress style = {
                    {
                        color: "darkblue"
                    }
                }
                />
                </div>
            ) : (
              <div className = "container h-100 mt-3" >
                < div className = "row justify-content-center h-100" >
                    <Hidden xsDown >
                        <div className = "col-md-5 col-xl-4 chat" >
                        <div className = "card mb-sm-3 mb-md-0 contacts_card" >

                <Sidebar / >

                <div className = "card-footer" / >
                </div>
                </div>
                </Hidden>

                <div className = "col-md-7 col-xl-7 chat" >
                <div className = "card"
                style = {
                    {
                        position: "relative"
                    }
                } >
                {
                    contactState.rid == "" ? (
                      <Welcome / >
                    ) : (

                        <ChatBox / >

                    )
                }
                </div>
                </div>

                <MyDrawer2 open = {
                    open
                }
                setOpen = {
                    setOpen
                }
                components = {
                    <div className = "card sidebarCard mb-sm-3 mb-md-0 contacts_card" >

                    <Sidebar / >

                    <div className = "card-footer" / >
                    </div>
                }
                />
                </div>
                </div>
            )
        }
        </MyContext.Provider>
    );
}
