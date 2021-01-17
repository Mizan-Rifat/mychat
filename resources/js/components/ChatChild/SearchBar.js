import React, { useState, useEffect, useContext } from 'react';
import SearchIcon from '@material-ui/icons/Search';

export default function SearchBar() {


    const [query, setQuery] = useState('')

    useEffect(() => {
  
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
