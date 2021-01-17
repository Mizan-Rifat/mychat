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
import {useSelector,useDispatch} from 'react-redux';
import { fetchSessionUser } from './Redux/Ducks/SessionUserDuck';


export const drawerContext = createContext();


export default function Routes() {


    const {user,loading,fetching} = useSelector(state => state.sessionUser)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSessionUser())
    }, [])


    return (
        <BrowserRouter>

            {
                // true ?
                fetching ?
                <div className="d-flex justify-content-center align-items-center" style={{height:'300px'}}>
                    <CircularProgress style={{color:'darkblue'}} />
                </div>
                    :
                    <>

                            {/* <MyAppBar open={open} setOpen={setOpen} /> */}

                            <Switch>
                                <Route path='/' exact component={Login} />
                                <Route path='/message' component={ChatUI} />
                                <Route path='/login' component={Login} />
                                <Route path='/register' component={Login} />
                                {/* <Route path='/test' component={Test} />  */}

                            </Switch>
                    </>
            }
        </BrowserRouter >
    )
}

