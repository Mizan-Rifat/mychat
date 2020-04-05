import React, { useState, useEffect,useContext} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import { MyContext } from '../ChatUI2';
import Axios from 'axios';


export default function ChatBoxHeader() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const { rid, setRid,msgs,setMsgs,flag, setFlag,msgsCount, setMsgsCount,currentUsers} = useContext(MyContext);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () =>{
        axios.post('/api/deleteallmessages',{
            id : rid.id
        })
        .then(response=>{
            setMsgs([]);
        })
        setAnchorEl(null);
    }
    return (
        <div className="card-header msg_head d-flex justify-content-between">
            <div className="d-flex bd-highlight">
                <div className="img_cont">
                    <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" className="rounded-circle user_img" />
                    {
                        currentUsers.some(user => user.id == rid.id) ? <span className="online_icon" /> :<span className="online_icon offline" />
                    } 
                    
                </div>
                <div className="user_info">
                    <span>Chat with {rid.name}</span>
                    <p>{msgsCount} Messages</p>
                </div>

            </div>
          

            <div>
                <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleDelete}>Delete Conversation</MenuItem>
                </Menu>
            </div>
        </div>
    )
}
