import React, { useState, createContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, withRouter } from 'react-router-dom';
import ChatUI from './ChatUI';
import Login from './Login';
import Register from './Register';
import Test from './Test';
// import Test2 from './Test2';
import MyAppBar from './MyAppBar';
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";


export const drawerContext = createContext();


export default function App() {

    

    const [user, setUser] = useState({
        user: {},
        loading: true
    })

    useEffect(() => {
        axios.get(`/api/test`)
            .then(response => {
                console.log(response)
                
            })
            
        axios.get(`/api/user`)
            .then(response => {
                console.log(response)
                setUser({
                    ...user,
                    user: response.data,
                    loading: false
                })
            }).catch(error => {
                setUser({
                    ...user,
                    loading: false
                })
            })
    }, [])


    return (
        <BrowserRouter>

            {
                // true ?
                user.loading ?
                <div className="d-flex justify-content-center align-items-center" style={{height:'300px'}}>
                    <CircularProgress style={{color:'darkblue'}} />
                </div>
                    :
                    <>
                        <drawerContext.Provider value={{user,setUser }}>

                            {/* <MyAppBar open={open} setOpen={setOpen} /> */}

                            <Switch>
                                <Route path='/' exact component={Login} />
                                <Route path='/message' component={ChatUI} />
                                <Route path='/login' component={Login} />
                                <Route path='/register' component={Login} />
                                <Route path='/test' component={Test} />

                            </Switch>
                        </drawerContext.Provider>
                    </>
            }
        </BrowserRouter >
    )
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}