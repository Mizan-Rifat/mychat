import React, { useState, useContext, useEffect, useRef } from "react";
import SendIcon from "@material-ui/icons/Send";
import { MyContext } from "../ChatUI";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import Badge from "@material-ui/core/Badge";
import ImageIcon from "@material-ui/icons/Image";
import axios from "axios";
import echo from "../LaravelEcho";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { Dot } from "react-animated-dots";
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";

function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

const useStyles = makeStyles(theme => ({
    chip: {
        background: "darkmagenta"
    },
    chip2: {
        color: "white",
        padding: "2px 10px",
        borderRadius: "30px"
    },
    snackbar: {
        "& .MuiSnackbarContent-root": {
            background: "firebrick"
        }
    }
}));

function ChatBoxFooter({ listenerState, listenerDispatch }) {
    const classes = useStyles();

    const history = useHistory();

    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [picker, setPicker] = useState(false);
    const [sendLoading, setSendLoding] = useState(false);
    const [send, setSend] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ""
    });

    const ref = useRef();

    const { rid, messageDispatch, user } = useContext(MyContext);

    const handleSend = e => {
        e.preventDefault();
        setSendLoding(true);
        setPicker(false);
        ref.current.blur();
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        const formData = new FormData();

        formData.append("msg_to", rid);

        if (message != "") {
            formData.append("content[]", message);
            formData.append("format", "text");
        }

        for (let i = 0; i < attachments.length; i++) {
            formData.append("content[]", attachments[i]);
            formData.append("format", "image");
        }

        axios
            .post(`/api/sendmessage`, formData, config)
            .then(response => {
                console.log({ response });
                messageDispatch({
                    type: "ADD_SINGLE_MSG",
                    payload: response.data.data
                });
                listenerDispatch({
                    type: "MESSAGE_SEND"
                });
                setSendLoding(false);
            })
            .catch(error => {
                console.log(error.response.data.message);
                setSendLoding(false);
                setSnackbar({
                  open:true,
                  message:error.response.data.message
                })
            });

        setMessage("");
        setAttachments([]);
    };

    const handleChange = e => {
        setMessage(e.target.value);
    };
    const scrollToBottom = () => {
        listenerDispatch({
            type: "SCROLL_TO_BOTTOM"
        });
    };

    const handleFocus = () => {
        setPicker(false);
        window.Echo.private(
            `chat.${Math.min(parseInt(rid), user.user.id)}.${Math.max(
                parseInt(rid),
                user.user.id
            )}`
        ).whisper("typing", {
            name: "typing"
        });
    };
    const handleBlur = () => {
        window.Echo.private(
            `chat.${Math.min(parseInt(rid), user.user.id)}.${Math.max(
                parseInt(rid),
                user.user.id
            )}`
        ).whisper("notTyping", {
            name: "notTyping"
        });
    };

    const addEmoji = emoji => {
        setMessage(message + emoji.native);
    };

    const handleUploadChange = e => {
        setMessage("");
        // console.log(e.target.files)
        let array = e.target.files;
        let fileArray = [];
        for (let i = 0; i < array.length; i++) {
          if(array[i].size > 1992290){
            setSnackbar({
              open:true,
              message:'File Size Can Not Be More Than 2MB'
            })
            break;
          }else{
            fileArray.push(array[i]);
          }
            
        }
        // console.log(fileArray)
        setAttachments(fileArray);
    };

    const removePreview = index => {
        setAttachments(attachments.filter((item, ind) => ind != index));
    };

    useEffect(() => {
        setMessage("");
    }, [rid]);

    useEffect(() => {
        if (message != "" || attachments.length > 0) {
            setSend(true);
        } else {
            setSend(false);
        }
    }, [message, attachments]);

    return (
        <div className="card-footer" style={{ position: "relative" }}>
            <div style={{ display: "flex", overflowY: "auto" }}>
                {// !attachments.length  ?
                attachments.length > 0
                    ? attachments.map((attachment, index) => (
                          <div
                              className="p-1"
                              style={{ position: "relative", marginTop: "6px" }}
                          >
                              <Badge
                                  color="secondary"
                                  badgeContent={"X"}
                                  onClick={() => removePreview(index)}
                                  style={{ cursor: "pointer" }}
                              >
                                  <img
                                      src={URL.createObjectURL(attachment)}
                                      height="100px"
                                  />
                              </Badge>
                          </div>
                      ))
                    : ""}
            </div>
            <form onSubmit={handleSend}>
                <div className="input-group">
                    <div
                        className="input-group-append"
                        style={{ borderRight: "1px solid rgba(0,0,0,.5)" }}
                    >
                        <span className="input-group-text attach_btn">
                            <input
                                color="primary"
                                accept="image/*"
                                type="file"
                                multiple
                                id="icon-button-file"
                                style={{ display: "none" }}
                                onChange={handleUploadChange}
                            />
                            <label
                                htmlFor="icon-button-file"
                                style={{ margin: 0 }}
                            >
                                <IconButton
                                    variant="contained"
                                    component="span"
                                    size="medium"
                                    style={{ padding: 0 }}
                                >
                                    <ImageIcon />
                                </IconButton>
                            </label>
                        </span>
                    </div>

                    <Input
                        ref={ref}
                        id="standard-adornment-password"
                        className="form-control type_msg"
                        placeholder="Type your message..."
                        disabled={attachments.length > 0 ? true : false}
                        value={message}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        style={{ padding: "0.375rem 5px" }}
                        autoComplete="off"
                        disableUnderline
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setPicker(!picker)}
                                    style={{ padding: 0 }}
                                >
                                    <InsertEmoticonIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />

                    <div className="input-group-append">
                        <span className="input-group-text send_btn">
                            <IconButton
                                type="submit"
                                style={{ padding: 0 }}
                                disabled={!send || sendLoading}
                            >
                                {sendLoading ? (
                                    <CircularProgress
                                        style={{ color: "darkblue" }}
                                        size={24}
                                    />
                                ) : (
                                    <SendIcon />
                                )}
                            </IconButton>
                        </span>
                    </div>

                    {picker ? (
                        <Picker
                            set="facebook"
                            onSelect={addEmoji}
                            showPreview={false}
                            // backgroundImageFn={() => 'http://127.0.0.1:8000/storage/32.png'}
                            // backgroundImageFn={() => require(`../../images/32.png`)}
                            showSkinTones={false}
                            exclude={["flags"]}
                            style={{
                                position: "absolute",
                                right: 0,
                                bottom: "60px"
                            }}
                        />
                    ) : (
                        ""
                    )}
                </div>
            </form>

            <div
                className="d-flex justify-content-center"
                style={{
                    position: "absolute",
                    left: "50%",
                    right: "50%",
                    top: "-40px"
                }}
            >
                {listenerState.isTyping ? (
                    <div className={clsx(classes.chip, classes.chip2)}>
                        Typing
                        <Dot>.</Dot>
                        <Dot>.</Dot>
                        <Dot>.</Dot>
                    </div>
                ) : (
                    ""
                )}
            </div>
            <div
                className="d-flex justify-content-center"
                style={{
                    position: "absolute",
                    left: "50%",
                    right: "50%",
                    top: "-68px"
                }}
            >
                {listenerState.newIncomingMsg ? (
                    <Chip
                        className={clsx(classes.chip)}
                        label="New Message"
                        clickable
                        color="primary"
                        size="small"
                        onClick={scrollToBottom}
                    />
                ) : (
                    ""
                )}
            </div>

            <Snackbar
                open={snackbar.open}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                TransitionComponent={SlideTransition}
                // message={'snackbar.message'}
                message={snackbar.message}
                autoHideDuration={5000}
                severity="error"
                className={classes.snackbar}
            />
        </div>
    );
}

export default React.memo(ChatBoxFooter);
