import React, { useState, createContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route,withRouter} from 'react-router-dom';
import ChatUI from './ChatUI';
import Login from './Login';
import Register from './Register';
import Test from './Test';
import Test2 from './Test2';
import MyAppBar from './MyAppBar';

export const drawerContext = createContext();


export default function App() {

    const [open, setOpen] = useState(false);

    return (
        <BrowserRouter>


            <drawerContext.Provider value={{ open, setOpen }}>
                <MyAppBar open={open} setOpen={setOpen} />
            </drawerContext.Provider>

            <Switch>

                <Route path='/' exact component={Login} />

                <drawerContext.Provider value={{ open, setOpen }}>
                    <Route path='/chat' component={ChatUI} />
                    <Route path='/login' component={Login} />
                <Route path='/register' component={Login} />
                <Route path='/test' component={Test} />
                <Route path='/test2' component={Test2} />
                </drawerContext.Provider>

                

            </Switch>

        </BrowserRouter >
    )
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}