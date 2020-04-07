import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../ChatUI2';
import { drawerContext } from '../App';
import { useHistory } from 'react-router-dom';
import Scrollbar from "react-scrollbars-custom";
import { NavLink } from "react-router-dom";
import { useQueryState } from 'react-router-use-location-state'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

export default function ContactsList() {

    const history = useHistory();
    // const [active, setActive] = useState('');
    const [flag, setFlag] = useState(false);
    const [query, setQuery] = useQueryState('rid', '')

    const { rid,active,setActive,setRid, currentUsers, contacts, setContacts, setFilteredContacts } = useContext(MyContext);
    const { setOpen } = useContext(drawerContext);

    const handleSelect = (contact) => {
        setQuery(contact.id)
        setRid(contact.id)
        setActive(contact.id)

        setContacts(contacts.map(item => {
            if (item.id == contact.id) {
                item.unReadMessages = 0;
            }
            return item;
        }))
        setOpen(false)
    }

    useEffect(() => {
        // setActive(rid.id)
        axios.get('/api/allusers')
            .then(response => {
                setContacts(response.data.users.filter(item => item.id != localStorage.getItem('userID')))
                setFilteredContacts(response.data.users.filter(item => item.id != localStorage.getItem('userID')))
                setFlag(!flag)
            })
    }, [])
  



    return (
        <Scrollbar>
            <div className="card-body contacts_body">

                <List className='contacts'>

                    {

                        contacts.map((contact, index) => (
                            <div to={`/chat?rid=${contact.id}`} className='contact_nav' onClick={()=>handleSelect(contact)}>
                                <ListItem
                                    key={index}
                                    className={active == contact.id ? 'active' : ''}>

                                    <div className="d-flex bd-highlight justify-content-between" style={{ cursor: 'pointer' }}>
                                        <div className='d-flex'>
                                            <div className="img_cont">
                                                <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" className="rounded-circle user_img" />

                                                {
                                                    currentUsers.some(user => user.id == contact.id) ? <span className="online_icon" /> : <span className="online_icon offline" />
                                                }

                                            </div>
                                            <div className="user_info">

                                                <span>{contact.name}</span>
                                                {
                                                    currentUsers.some(user => user.id == contact.id) ? <p>{contact.name} is online</p> : <p>{contact.name} is offline</p>
                                                }


                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span className="badge badge-danger" style={{ padding: '5px', fontSize: '18px' }}>
                                                {
                                                    contact.unReadMessages != 0 ? contact.unReadMessages : ''
                                                }
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
    )
}
