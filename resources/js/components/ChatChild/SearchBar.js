import React, { useState, useEffect, useContext } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { MyContext } from '../ChatUI';

export default function SearchBar() {

    const {contactDispatch } = useContext(MyContext);

    const [query, setQuery] = useState('')

    useEffect(() => {
        contactDispatch({ type: 'SET_FILTERD_CONTACTS', payload: query })
  
    }, [query])

    return (
        <div className="card-header search-header">
            <div className="input-group">
                <input type="text" placeholder="Search..." className="form-control search" value={query} onChange={e => setQuery(e.target.value)} />
                <div className="input-group-prepend">
                    <span className="input-group-text search_btn"><SearchIcon /></span>
                </div>
            </div>
        </div>
    )
}
