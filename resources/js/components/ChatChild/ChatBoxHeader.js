import React, { useState, useEffect, useContext } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import { MyContext } from '../ChatUI';
import axios from 'axios'
import { useSelector } from 'react-redux';

export default function ChatBoxHeader() {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const {recipient} = useSelector(state => state.recipient)
    const {currentUsers} = useSelector(state => state.currentUsers)

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        axios.post(`${process.env.REACT_APP_DOMAIN}/api/deleteallmessages`, {
            id: contactState.rid
        })
            .then(response => {
                if(response.status == 200)
                messageDispatch({type:'DELETE_ALL_MSGS'})
            })
        setAnchorEl(null);
    }




return (
    <div className="card-header msg_head d-flex justify-content-between">
        <div className="d-flex bd-highlight">
            <div className="img_cont">
                <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" className="rounded-circle user_img" />
                {
                    currentUsers.some(user => user.id == recipient.rid) ? <span className="online_icon" /> : <span className="online_icon offline" />
                }

            </div>
            <div className="user_info">
                <span>Chat with {recipient.name}</span>
                {/* <p>{messageState.msgsCount} Messages</p> */}
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
