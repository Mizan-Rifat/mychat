import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../ChatUI";
import { drawerContext } from "../Routes";
import { useHistory } from "react-router-dom";
import Scrollbar from "react-scrollbars-custom";
import { NavLink } from "react-router-dom";
import { useQueryState } from "react-router-use-location-state";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {setRecipient} from '../Redux/Ducks/recipientDuck';
import clsx from 'clsx';



export default function ContactsList() {
  // const [flag, setFlag] = useState(false);
  const [query, setQuery] = useQueryState("rid", "");

  const {contacts} = useSelector(state => state.contacts)
  const {currentUsers} = useSelector(state => state.currentUsers)
  const {recipient} = useSelector(state => state.recipient)

  const dispatch = useDispatch();


  const handleSelect = (contact) => {
    
    setQuery(contact.id);
    dispatch(setRecipient(contact))

  };

  return (
    <Scrollbar>
      <div className="card-body contacts_body">
        <List className="contacts">
          {
            contacts.length == 0 ? 
              <div className="d-flex justify-content-center">
                <p style={{ color: "white" }}>No User Found...</p>
              </div>
              : 
            contacts.map((contact, index) => (
              <div
                to={`/message?rid=${contact.id}`}
                className="contact_nav"
                key={index}
                onClick={() => handleSelect(contact)}
              >
                <ListItem
                  key={index}
                  className={clsx({'active':contact.id == recipient.id})}
                >
                  <div
                    className="d-flex bd-highlight justify-content-between"
                    style={{ cursor: "pointer", width: "100%" }}
                  >
                    <div className="d-flex">
                      <div className="img_cont">
                        <img
                          src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                          className="rounded-circle user_img"
                        />

                        {
                          currentUsers.some((user) => user.id == contact.id) ? 
                            <span className="online_icon" />
                           :
                            <span className="online_icon offline" />
                        }
                      </div>

                      <div className="user_info">
                        <span>{contact.name}</span>
                        {
                          currentUsers.some((user) => user.id == contact.id) ? 
                          
                            <p>{contact.name} is online</p>
                            :
                            <p>{contact.name} is offline</p>
                        }
                      </div>

                    </div>
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ width: "15%" }}
                    >
                      <span
                        className="badge badge-danger"
                        style={{ padding: "5px", fontSize: "18px" }}
                      >
                        {contact.unReadMessages != 0
                          ? contact.unReadMessages
                          : ""}
                      </span>
                    </div>
                  </div>
                </ListItem>
              </div>
            ))
          }
        </List>
      </div>
    </Scrollbar>
  );
}
