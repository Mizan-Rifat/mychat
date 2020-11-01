import { Button } from '@material-ui/core';
import { useLocalStore, useObserver } from 'mobx-react';
import React,{useState, useEffect, createContext, useContext} from 'react'


const StoreContext = createContext();

const StoreProvider = ({children})=>{
    const store = useLocalStore(()=>({
        bugs:['one','two'],
        counter:0
    }))

    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    )
}


export default function App() {

    return (
        <StoreProvider>
            <BugsList />
        </StoreProvider>
    )
}

function BugsList(){

    const store = useContext(StoreContext)

    console.log({store})
    return useObserver(()=> (
        <>
            <ul>
                {
                    store.bugs.map(bug=>(
                        <li>{bug}</li>
                    ))
                }
            </ul>

            <p>Counter:{store.counter}</p>
            <Button onClick={()=>store.counter++}>Add</Button>
        </>
    ))
}
