import React, { useState, useContext, useEffect } from 'react'
import SendIcon from '@material-ui/icons/Send';
import { MyContext } from '../ChatUI2';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import Badge from '@material-ui/core/Badge';
import ImageIcon from '@material-ui/icons/Image';

function ChatBoxFooter() {

    const [message, setMessage] = useState('')
    const [attachments, setAttachments] = useState([])
    const [picker, setPicker] = useState(false);

    const { msgs, setMsgs, rid, flag, setFlag } = useContext(MyContext);

    const handleSend = () => {

        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const formData = new FormData;

        formData.append('msg_to', rid)

        if (message != '') {

            formData.append('content[]', message)
            formData.append('format', 'text')

        }

        for (let i = 0; i < attachments.length; i++) {
            formData.append('content[]',attachments[i] );
            formData.append('format', 'image')
        }

        axios.post('/api/sendmessage', formData, config).then(response => {
            // console.log(response.data.message[0])
            setMsgs([...msgs, response.data.message[0]])
            setFlag(!flag)

        })
        setMessage('')
        setAttachments([])
    }

    const handleChange = (e) => {
        setMessage(e.target.value)
    }

    const handleFocus = () => {
        setPicker(false)
        window.Echo.private(`chat.${Math.min(parseInt(rid), parseInt(localStorage.getItem('userID')))}.${Math.max(parseInt(rid), parseInt(localStorage.getItem('userID')))}`)
            .whisper('typing', {
                name: 'typing',
            });
    }
    const handleBlur = () => {
        window.Echo.private(`chat.${Math.min(parseInt(rid), parseInt(localStorage.getItem('userID')))}.${Math.max(parseInt(rid), parseInt(localStorage.getItem('userID')))}`)
            .whisper('notTyping', {
                name: 'notTyping',
            });
    }

    const addEmoji = (emoji) => {
        setMessage(message + emoji.native)
    }

    const handleUploadChange = (e) => {
        setMessage('')
        // console.log(e.target.files)
        let array = e.target.files;
        let fileArray = [];
        for (let i = 0; i < array.length; i++) {
            fileArray.push(array[i]);
        }
        // console.log(fileArray)
        setAttachments(fileArray);
    }

    const removePreview = (index) => {

        setAttachments(attachments.filter((item, ind) => ind != index))

    }


    return (
        <div className="card-footer">
            <div style={{ display: 'flex', overflowY: 'auto' }}>

                {
                    // !attachments.length  ?
                    attachments.length > 0 ?

                        attachments.map((attachment, index) => (
                            <div className="p-1" style={{ position: 'relative', marginTop: '6px' }}>

                                <Badge color="secondary" badgeContent={'X'} onClick={() => removePreview(index)} style={{ cursor: 'pointer' }}>
                                    <img src={URL.createObjectURL(attachment)} height='100px' />

                                </Badge>

                            </div>
                        ))
                        : ''
                }


            </div>
            <div className="input-group">
                <div className="input-group-append">
                    <span className="input-group-text attach_btn">


                        <input
                            color="primary"
                            accept="image/*"
                            type="file"
                            multiple
                            id="icon-button-file"
                            style={{ display: 'none', }}
                            onChange={handleUploadChange}
                            
                        />
                        <label htmlFor="icon-button-file" style={{ margin: 0 }}>
                            <IconButton
                                variant="contained"
                                component="span"
                                size="large"
                            >
                                <ImageIcon />
                            </IconButton>
                        </label>

                    </span>
                </div>


                <Input
                    id="standard-adornment-password"
                    className="form-control type_msg"
                    placeholder="Type your message..."
                    disabled={attachments.length > 0 ? true : false}
                    value={message}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    autoComplete='off'
                    disableUnderline
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setPicker(!picker)}
                            >
                                <InsertEmoticonIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                />



                <div className="input-group-append">
                    <span className="input-group-text send_btn"><SendIcon onClick={handleSend} /></span>
                </div>


                {
                    picker ? <Picker set='facebook' onSelect={addEmoji} showPreview={false} backgroundImageFn={() => `/storage/32.png`} showSkinTones={false} exclude={["flags"]} style={{
                        position: 'absolute',
                        right: 0,
                        bottom: '60px'
                    }} />
                        : ''
                }

            </div>
        </div>
    )
}


export default React.memo(ChatBoxFooter)