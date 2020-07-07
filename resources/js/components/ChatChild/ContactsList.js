import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../ChatUI";
import { drawerContext } from "../App";
import { useHistory } from "react-router-dom";
import Scrollbar from "react-scrollbars-custom";
import { NavLink } from "react-router-dom";
import { useQueryState } from "react-router-use-location-state";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import axios from "axios";
export default function ContactsList() {
  // const [flag, setFlag] = useState(false);
  const [query, setQuery] = useQueryState("rid", "");

  const { setRid, contactState, contactDispatch } = useContext(MyContext);
  const { setOpen } = useContext(drawerContext);

  const handleSelect = (contact) => {
    setQuery(contact.id);
    setRid(contact.id);
    setOpen(false);
  };

  return (
    <Scrollbar>
      <div className="card-body contacts_body">
        <List className="contacts">
          {contactState.contacts.length == 0 ? (
            <div className="d-flex justify-content-center">
              <p style={{ color: "white" }}>No User Found...</p>
            </div>
          ) : (
            contactState.contacts.map((contact, index) => (
              <div
                to={`/message?rid=${contact.id}`}
                className="contact_nav"
                key={index}
                onClick={() => handleSelect(contact)}
              >
                <ListItem
                  key={index}
                  className={
                    contactState.selectedUser != undefined ?
                          contactState.selectedUser.id == contact.id ? "active" : ""
                          : ''
                  }
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

                        {contactState.currentUsers.some(
                          (user) => user.id == contact.id
                        ) ? (
                          <span className="online_icon" />
                        ) : (
                          <span className="online_icon offline" />
                        )}
                      </div>
                      <div className="user_info">
                        <span>{contact.name}</span>
                        {contactState.currentUsers.some(
                          (user) => user.id == contact.id
                        ) ? (
                          <p>{contact.name} is online</p>
                        ) : (
                          <p>{contact.name} is offline</p>
                        )}
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
          )}
        </List>
      </div>
    </Scrollbar>
  );
}
