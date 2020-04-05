import React,{useEffect,useRef} from 'react'
import { Grid, Chip } from '@material-ui/core';
import {useHistory} from 'react-router-dom';

export default function Messages({ messages }) {

    const messagesEndRef = useRef(null)

    const history= useHistory();

    

    
    return (
        <div className='card-body msg_card_body'>
            {
                messages.map((msg, index) => (
                    <SingleMsg msg={msg} key={index}/>
                    
                ))
            }


            

        </div>
    )
}

function SingleMsg({ msg }) {
    return (
        <>
            {
                msg.msg_from ==  localStorage.getItem('userID') ?
                    <div className="d-flex justify-content-start mb-4">
                        <div className="img_cont_msg">
                            <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" className="rounded-circle user_img_msg" />
                        </div>
                        <div className="msg_cotainer">
                           {msg.msg}
                           <span className="msg_time">8:55 AM, Today</span>
                        </div>
                    </div>
                    :
                    <div className="d-flex justify-content-end mb-4">
                        <div className="msg_cotainer_send">
                            {msg.msg}
                            <span className="msg_time_send">8:55 AM, Today</span>
                        </div>
                        <div className="img_cont_msg">
                            <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" className="rounded-circle user_img_msg" />
                        </div>
                    </div>
            }
        </>





    )
}



