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
} from "./Routes";
import messageReducer from "./Reducers/MessageReducer";
import contactsReducer from "./Reducers/ContactsReducer";
import axios from "axios";
import MyAppBar from "./MyAppBar";

import CircularProgress from "@material-ui/core/CircularProgress";
import { useSelector,useDispatch } from "react-redux";
import { fetchContacts } from "./Redux/Ducks/ContactsDuck";
import { add_user, remove_user, set_currentUsers } from "./Redux/Ducks/currentUsersDuck";
import { setRecipient } from "./Redux/Ducks/recipientDuck";

export const MyContext = createContext();

export default function ChatUI(props) {


    const sound = new Audio("/uploads/audio/2.mp3");

    const {contacts,currentUsers,loading,fetching:contactsFetching} = useSelector(state => state.contacts)
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const history = useHistory();

    const query = new URLSearchParams(props.location.search);
    const rid = query.get("rid");

    useEffect(() => {
    
        window.Echo.leaveChannel(`chat`)

        dispatch(fetchContacts())
        .then(res=>{

            if(rid != null){
                const ruser = res.find(user=>user.id == rid)
                dispatch(setRecipient(ruser))
    
            }
            
            window.Echo.join(`chat`)
            .here(users => {
                console.log({
                    users
                });

                dispatch(set_currentUsers(users))
            })
            .joining(user => {
                console.log('juser',user)
                dispatch(add_user(user))
            })
            .leaving(user => {
                console.log('luser',user)
                dispatch(remove_user(user))
               
            });
        })

        

        // window.Echo.private(`MyChannel${user.user.id}`).listen(
        //     "NewEvent",
        //     function(data) {
        //         console.log("mydata", data[0]);

        //         contactDispatch({
        //             type: "RECEIVE_OTHER_MSGS",
        //             payload: {
        //                 from: data[0]
        //             }
        //         });
        //         // sound.play();
        //         }
        //     );
        
    }, []);

    // useEffect(() => {
    //     if (contactState.rid != "") {
    //         contactDispatch({
    //             type: "SET_SELECTED_USER",
    //             // payload: rid
    //         });
    //         setOpen(false);
    //     }
    // }, [contactState.rid]);

    // useEffect(() => {
    //     if (contactState.play) {
    //         sound.play()
    //         const timeoutID = setTimeout(() => {
    //             contactDispatch({
    //                 type: "SET_PLAY_FALSE",
    //             });
    //         }, 1000);
    //     }
    // }, [contactState.play]);

    return (
    //   <MyContext.Provider value = {
    //         {

    //             messageState,
    //             messageDispatch,
    //             contactState,
    //             contactDispatch,
    //             user
    //         }
    //     } >

    //     <MyAppBar 
    //         setOpen = {
    //         setOpen
    //     }
    //     />
    <>

        { 
            contactsFetching ? 
            
                <div className = "d-flex justify-content-center align-items-center" style = {{height: "300px"}} >
                    <CircularProgress style = {{color: "darkblue"}}/>
                </div>
             : 
              <div className = "container h-100 mt-3" >
                    <div className = "row justify-content-center h-100" >
                        <Hidden xsDown >
                            <div className = "col-md-5 col-xl-4 chat" >
                                <div className = "card mb-sm-3 mb-md-0 contacts_card" >

                                    <Sidebar />
                                    <div className = "card-footer" / >
                                </div>
                            </div>
                        </Hidden>

                        <div className = "col-md-7 col-xl-7 chat" >
                            <div className = "card" style = {{position: "relative"}} >
                                {
                                    rid == null ? 
                                        <Welcome / >
                                        : 
                                        <ChatBox / >
                                }
                            </div>
                        </div>


{/*
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
                        /> */}
                    </div>
                </div>
            
        }
        </>
    );
}
