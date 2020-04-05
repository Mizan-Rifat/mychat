import React, { useState, useEffect, useContext, useRef } from 'react';
import { MyContext } from '../ChatUI2';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import VisibilitySensor from 'react-visibility-sensor';
import Scrollbar from "react-scrollbars-custom";
var dateFormat = require('dateformat');
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';

const useStyles = makeStyles(theme => ({
    msgBody: {
        '&:hover': {
            background: "#f00",
        },
    }
}))
export default function ChatBoxBody() {
    const classes = useStyles();


    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState('');
    const [typing, setTyping] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const { rid, setRid, msgs, setMsgs, flag, setFlag, socketData, setsocketData, msgsCount, setMsgsCount, contacts, setContacts } = useContext(MyContext);

    const messagesEndRef = useRef(null)

    const loadMore = () => {
        setPage(page + 1)
    }

    useEffect(() => {
        if (flag) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
            setFlag(false)
        }

    });

    useEffect(() => {
        axios.get(`/api/messages?rid=${rid.id}&page=${page}`)
            .then(response => {
                setMsgs([...response.data.messages, ...msgs])
                setFlag(false)
                setMsgsCount(response.data.count)
                setTotalPage(Math.ceil(response.data.count / 10))

            }).catch(e => {
                if (e.response.status == 401) {
                    history.push('/')
                }
            })

    }, [page])

    useEffect(() => {
        axios.get(`/api/messages?rid=${rid.id}&page=${page}`)
            .then(response => {
                setMsgs([...response.data.messages])
                setFlag(true)
                setMsgsCount(response.data.count)
                setTotalPage(Math.ceil(response.data.count / 10) == 0 ? 1 : Math.ceil(response.data.count / 10))

            }).catch(e => {
                if (e.response.status == 401) {
                    history.push('/')
                }
            })

    }, [rid])


    useEffect(() => {

        window.Echo.private(`chat.${Math.min(parseInt(rid.id), parseInt(localStorage.getItem('userID')))}.${Math.max(parseInt(rid.id), parseInt(localStorage.getItem('userID')))}`)
            .listen('ChatEvent', function (data) {

                setsocketData(data)

                if (data[0].msg_to == localStorage.getItem('userID')) {
                    axios.post('/api/setseen', {
                        id: data[0].id
                    })
                }

            })
            .listenForWhisper('typing', (e) => {
                setTyping(true);
                console.log('typing')
            })
            .listenForWhisper('notTyping', (e) => {

                setTyping(false);
            })


    }, [])
    useEffect(() => {
        setMsgs([...msgs, ...socketData])
        setFlag(true)
    }, [socketData])

    return (
        <Scrollbar>
            <div className="card-body msg_card_body" >
                {
                    page != totalPage ?
                        <div className="d-flex justify-content-center">
                            <Chip label="Load More" color='primary' onClick={loadMore} />
                        </div> : ''
                }

                {
                    msgs.map((msg, index) => (

                        <SingleMsg index={index} msg={msg} showMenu={showMenu} setShowMenu={setShowMenu} msgs={msgs} setMsgs={setMsgs} sender={msg.msg_from == localStorage.getItem('userID') ? true : false} rid={rid} />

                    ))
                }

                <div className="d-flex justify-content-center" style={{ position: 'absolute', left: '50%', right: '50%' }}>
                    {
                        typing ?
                            <small><Chip label="Typing..." color='primary' /></small>
                            : ''
                    }
                </div>

                <div ref={messagesEndRef} />

            </div>
        </Scrollbar>


    )
}


function MsgMenuButton({ id, msgs, setMsgs }) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {

        setAnchorEl(null);
    };
    const handleDelete = () => {
        axios.post('/api/deletemessage', {
            id
        })
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    setMsgs(msgs.filter((msg) => msg.id != id))
                }
            })

        setAnchorEl(null);
    };
    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
                style={{ padding: 0, marginTop: '10px' }}
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
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
        </div>
    )
}


function SingleMsg({ index, msg, setShowMenu, showMenu, msgs, setMsgs, sender, rid }) {

    const formattedMsg = (msg) => {

    }
    return (
        <>
            {
                sender ?

                    <div key={index} className={`d-flex justify-content-between mb-4`} onMouseEnter={() => setShowMenu(index + 1)} onMouseLeave={() => setShowMenu('')}>
                        <div className="d-flex justify-content-start" >
                            <div className="img_cont_msg" style={{ position: 'relative' }}>
                                <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" className="rounded-circle user_img_msg" />
                                <div className="doneIcon" >
                                    {/* <RadioButtonUncheckedOutlinedIcon fontSize='inherit' /> */}
                                    <CheckCircleOutlineRoundedIcon fontSize='inherit' />
                                </div>
                            </div>




                            <div className="msg_cotainer" style={{ display: 'grid' }}>
                                {
                                    msg.contents[0].format == 'text' ?
                                        <div className='text_container'>
                                            {msg.contents[0].content}
                                        </div> : ''
                                }

                                {
                                    msg.contents[0].format == 'image' ?
                                        <div className='img_container d-flex' >
                                            {
                                                msg.contents.map(item => (

                                                    <img src={`/storage/pics/${item.content}`} height='100%' style={{ borderRadius: '5px', height: '100px', width: '100px', marginRight: '5px' }} />

                                                ))
                                            }
                                        </div>

                                        : ''

                                }

                                <span className="msg_time">{dateFormat(msg.created_at, "h:MM TT, mmm d")}</span>

                                <span className="sender">Me</span>
                            </div>

                        </div>
                        {
                            index + 1 == showMenu && showMenu != '' ?
                                <div className="">
                                    <MsgMenuButton id={msg.id} msgs={msgs} setMsgs={setMsgs} />
                                </div>
                                : <div></div>

                        }

                    </div >


                    :



                    <div key={index} className="d-flex justify-content-between mb-4" onMouseEnter={() => setShowMenu(index + 1)} onMouseLeave={() => setShowMenu('')}>
                        {
                            index + 1 == showMenu && showMenu != '' ?
                                <div className="">
                                    <MsgMenuButton id={msg.id} msgs={msgs} setMsgs={setMsgs} />
                                </div>
                                : <div></div>
                        }
                        <div className="d-flex justify-content-end">
                            <div className="msg_cotainer_send">
                                {/* {msg.msg} */}


                                {
                                    msg.contents[0].format == 'text' ?
                                        <div className='text_container_send'>
                                            {msg.contents[0].content}
                                        </div> : ''
                                }

                                {
                                    msg.contents[0].format == 'image' ?
                                        <div className='img_container d-flex' >
                                            {
                                                msg.contents.map(item => (

                                                    <img src={`/storage/pics/${item.content}`} height='100%' style={{ borderRadius: '5px', height: '100px', width: '100px', marginRight: '5px' }} />

                                                ))
                                            }
                                        </div>

                                        : ''

                                }





                                <span className="msg_time_send">{dateFormat(msg.created_at, "h:MM TT, mmm d")}</span>
                                <span className="receiver">{rid.name.split(' ')[0]}</span>
                            </div>

                            <div className="img_cont_msg">
                                <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" className="rounded-circle user_img_msg" />
                            </div>
                        </div>
                    </div>

            }
        </>
    )
}


