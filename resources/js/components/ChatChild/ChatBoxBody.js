import React, { useState, useEffect, useContext, useRef } from "react";
import { MyContext } from "../ChatUI";
import Chip from "@material-ui/core/Chip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Scrollbar from "react-scrollbars-custom";
import CircularProgress from "@material-ui/core/CircularProgress";
import dateFormat from "dateformat";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import axios from "axios";
import { useHistory } from "react-router-dom";
import echo from "../LaravelEcho";
import VisibilitySensor from "react-visibility-sensor";
import { Button } from "@material-ui/core";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';



const useStyles = makeStyles((theme) => ({
  msgBody: {
    "&:hover": {
      background: "#f00",
    },
  },

}));
export default function ChatBoxBody({listenerState,listenerDispatch}) {

  const classes = useStyles();

  const sound = new Audio('/uploads/audio/1.mp3')
  const [ruser, setRuser] = useState(true);
  const [initLoading, setInitLoading] = useState(true);




  const [currentChannel, setCurrentChannel] = useState(0);

  const { messageState, messageDispatch, user, contactState,contactDispatch} = useContext(
    MyContext
  );

  const messagesEndRef = useRef();

  const loadMore = () => {
    axios
      .get(messageState.next)
      .then((response) => {
        console.log(response);
        messageDispatch({
          type: "SET_PAGE_MSGS",
          payload: {
            data: response.data.data.reverse(),
            meta: response.data.meta,
            links: response.data.links,
          },
        });
      })
      .catch((e) => {
        // if (e.response.status == 401) {
        //     history.push('/')
        // }
      });
  };

  const onChange = (isVisible) => {
    if (isVisible) {
      console.log("visible");
      listenerDispatch({
        type : 'SET_VISIBILITY',
        payload : true
    })
    } else {
      console.log("not_visible");
      listenerDispatch({
          type : 'SET_VISIBILITY',
          payload : false
      })
    }
  };


  useEffect(() => {
    listenerDispatch({
      type : 'INIT_STATE'
    })
    axios
      .get(`/api/messages?rid=${contactState.rid}`)
      .then((response) => {
        // console.log(response.data.data.reverse());
        messageDispatch({
          type: "SET_INIT_MSGS",
          payload: {
            data: response.data.data.reverse(),
            meta: response.data.meta,
            links: response.data.links,
          },
        });
        setInitLoading(false);
        setRuser(true);
        listenerDispatch({
            type : 'INIT_SCROLL'
        })
      })
      .catch((e) => {
        console.log(e)
        setInitLoading(false);
        if (e.response.status == 404) {
            setRuser(false);

        }
      });
  }, [contactState.rid]);

  useEffect(() => {


    if (!initLoading) {

      window.Echo.leaveChannel(`private-chat.${Math.min(parseInt(currentChannel), user.user.id)}.${Math.max(
        parseInt(currentChannel),
        user.user.id
      )}`)


      setCurrentChannel(contactState.rid)

      window.Echo
        .private(
          `chat.${Math.min(parseInt(contactState.rid), user.user.id)}.${Math.max(
            parseInt(contactState.rid),
            user.user.id
          )}`
        )
        .listen("SeenEvent", function (data) {

          messageDispatch({
            type: "SET_MSGS_SEEN",
          });
        })

      window.Echo
        .private(
          `chat.${Math.min(parseInt(contactState.rid), user.user.id)}.${Math.max(
            parseInt(contactState.rid),
            user.user.id
          )}`
        )
        .listen("ChatEvent", function (data) {

          if (data.msg.seen == 0) {

            if (data.msg.msg_to == user.user.id) {

              messageDispatch({
                type: "SET_SOCKET_MSGS",
                payload: data.msg,
              });

              listenerDispatch({
                type: 'INCOMING_MESSAGE'
              })

              sound.play();

              axios.post(`/api/setseen`, {
                id: data.msg.id,
              });
          }
        }else{
          messageDispatch({
            type:'SET_SOCKET_MSG_SEEN',
            payload:data.msg.id
          })
        }


        })
        .listenForWhisper("typing", (e) => {
            listenerDispatch({
                type:'SET_TYPING',
                payload : true

            })
        //   setIsTyping(true);
        //   console.log("typing");
        })
        .listenForWhisper("notTyping", (e) => {
            listenerDispatch({
                type:'SET_TYPING',
                payload : false

            })
        });
    }
  }, [initLoading,contactState.rid]);

  useEffect(() => {

    if (listenerState.scroll) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

  }, [listenerState]);


  return (
    <Scrollbar>
      {initLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{height:'100px'}}>
          <CircularProgress style={{color:'darkblue'}} />
        </div>
      ) : (
        <>
          <div className="card-body msg_card_body">
            {ruser ? (
              <>
                {messageState.next != null && (
                  <div className="d-flex justify-content-center">
                    <Chip
                      style={{ background: "darkmagenta" }}
                      label="Load More"
                      color="primary"
                      onClick={loadMore}
                    />
                  </div>
                )}

                {messageState.msgs.map((msg, index) =>
                  index == messageState.msgs.length - 6 ? (
                    <VisibilitySensor onChange={onChange} offset={{ top: -400,}}>
                      <SingleMsg
                        key={index}
                        index={index}
                        msg={msg}
                        selectedUser={contactState.selectedUser}
                        sender={msg.msg_from == user.user.id ? true : false}
                        dispatch={messageDispatch}
                      />

                    </VisibilitySensor>
                  ) : (
                    <SingleMsg
                      key={index}
                      index={index}
                      msg={msg}
                      selectedUser={contactState.selectedUser}
                      sender={msg.msg_from == user.user.id ? true : false}
                      dispatch={messageDispatch}
                    />
                  )
                )}

                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="d-flex justify-content-center align-items-center" style={{height:'100px'}}>
                <p style={{ fontSize: "25px", color: "white" }}>
                  No User Found...
                </p>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </>
      )}




    </Scrollbar>
  );
}


function MsgMenuButton({ id, dispatch }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = () => {
    axios
      .post(`/api/deletemessage`, {
        id,
      })
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          dispatch({ type: "DELETE_SINGLE_MSG", payload: id });
        }
      });

    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ padding: 0, marginTop: "10px" }}
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
  );
}

function SingleMsg({ index, msg, sender,selectedUser, dispatch }) {
  const [showMenu, setShowMenu] = useState(false);

  const [lightBox, setLightBox] = useState({
    open:false,
    url:[],
    selectedindex:''
  });

  const handleLightBox = (contents,index) => {
    setLightBox({
      open:true,
      url:contents.map((item)=>(
        item.content
      )),
      selectedindex:index
    })
  }

  return (
    <>

      {sender ? (
        <div
          key={index}
          className={`d-flex justify-content-between mb-4`}
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          <div
            className="d-flex justify-content-start"
            style={{ maxWidth: "300px" }}
          >
            <div className="img_cont_msg" style={{ position: "relative" }}>
              <img
                src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                className="rounded-circle user_img_msg"
              />
              <div className="doneIcon">
                  {
                      msg.seen ?

                    <CheckCircleOutlineRoundedIcon fontSize = "inherit" />
                    :
                    <RadioButtonUncheckedIcon fontSize = "inherit" />
                  }
              </div>
            </div>

            <div className="msg_cotainer" style={{ display: "grid" }}>
              {msg.contents[0].format == "text" && (
                <div className="text_container">{msg.contents[0].content}</div>
              )}

              {msg.contents[0].format == "image" && (
                <div className="img_container d-flex">
                  {msg.contents.map((item,ind) => (
                    <img src={item.content} className="img" onClick={()=>handleLightBox(msg.contents,ind)} />
                  ))}
                </div>
              )}

              <span className="msg_time">
                {dateFormat(msg.created_at, "h:MM TT, mmm d")}
              </span>

              <span className="sender">Me</span>
            </div>
          </div>
          {showMenu ? (
            <div className="">
              <MsgMenuButton id={msg.id} dispatch={dispatch} />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        <div
          key={index}
          className="d-flex justify-content-between mb-4"
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          {showMenu ? (
            <div className="">
              <MsgMenuButton id={msg.id} dispatch={dispatch} />
            </div>
          ) : (
            <div></div>
          )}

          <div
            className="d-flex justify-content-end"
            style={{ maxWidth: "300px" }}
          >
            <div className="msg_cotainer_send">
              {msg.contents[0].format == "text" && (
                <div className="text_container_send">
                  {msg.contents[0].content}
                </div>
              )}

              {msg.contents[0].format == "image" && (
                <div className="img_container d-flex">
                  {msg.contents.map((item,ind) => (
                    <img src={item.content} className="img" onClick={()=>handleLightBox(msg.contents,ind)} />
                  ))}
                </div>
              )}

              <span className="msg_time_send">
                {dateFormat(msg.created_at, "h:MM TT, mmm d")}
              </span>
              <span className="receiver">
                {selectedUser.name.split(" ")[0]}
              </span>
            </div>

            <div className="img_cont_msg">
              <img
                src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                className="rounded-circle user_img_msg"
              />
            </div>
          </div>
        </div>
      )}


      {lightBox.open && (
          <Lightbox
            mainSrc={lightBox.url[lightBox.selectedindex]}
            nextSrc={lightBox.selectedindex + 1 > lightBox.url.length ? undefined : lightBox.url[(lightBox.selectedindex + 1)]}
            prevSrc={lightBox.selectedindex - 1 < 0 ? undefined : lightBox.url[(lightBox.selectedindex - 1)]}

            onCloseRequest={() => setLightBox({ ...lightBox,open: false })}
            onMovePrevRequest={() =>
              setLightBox({
                ...lightBox,
                selectedindex:(lightBox.selectedindex - 1) % lightBox.url.length
              })
            }
            onMoveNextRequest={() =>
              setLightBox({
                ...lightBox,
                selectedindex:(lightBox.selectedindex + 1) % lightBox.url.length
              })
            }
          />
        )}



    </>
  );
}
