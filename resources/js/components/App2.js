import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Echo from 'laravel-echo';
import {userContext} from './App';
import { useHistory } from 'react-router-dom'

export default function App2() {

    const {userID,setUserID} = useContext(userContext);

    const history = useHistory();

    const initState = {
        email: '',
        password: '',
        error: ''
    }
    const style = {
        display: 'block',
        borderColor: 'blue',
        position: 'absolute',
        top: '25%',
        left: '32%',
        zIndex: '2'
    }
    const formDisable = {
        pointerEvents: 'none',
        opacity: '0.5',
        background: 'rgba(255, 255, 255, 0.6)'

    }

    const [loginData, setLoginData] = useState(initState);
    // const [userID, setUserID] = useState('');

    const handleFieldChange = (e) => {

        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })

    }

    const login = (e) => {

        e.preventDefault();

        axios.get(`/airlock/csrf-cookie`).then(response => {


            axios.post(`/login`, {
                email: loginData.email,
                password: loginData.password
            })
                .then(response => {

                    if (response.status === 200) {
                        console.log(response)
                        localStorage.setItem('userID',response.data.id)
                        localStorage.setItem('userName',response.data.name)
                        setUserID(response.data.id)
                        history.push('/chat')

                    }
                })
                .catch(error => {
                    console.log(error.response)

                })
        });
    }

    const handleClick = () => {
        axios.post(`/logout`)
            .then(respose => {
                console.log(respose)
            })
            .catch(error => {
                console.log(error)
            })
    }
    const handleuser = () => {
        axios.get(`api/user`)
            .then(respose => {
                console.log(respose)
            })
            .catch(error => {
                console.log(error)
            })
    }


    useEffect(()=>{
        axios.get(`/api/checkauth`)
        .then(response =>{
            console.log(response.status)
            if(response.status == 200){
                history.push('/users')
            }
            
        })
    },[])
 


    return (
        <div>
            <form onSubmit={login}>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>

                    <input type="email"
                        className='form-control'
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        name="email"
                        onChange={handleFieldChange}
                        value={loginData.email} />


                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>

                <div className="form-group">

                    <label htmlFor="exampleInputPassword1">Password</label>

                    <input type="password"
                        className='form-control'
                        id="exampleInputPassword1"
                        placeholder="Password"
                        name="password"
                        onChange={handleFieldChange}
                        value={loginData.password}
                    />

                    {/* {errorRendering('name')} */}
                </div>

                <div className='mb-2 d-flex justify-content-center'>
                    <strong className='text-danger'>{loginData.error}</strong>
                </div>
                <a href="">Forgot Password</a>


                <button type='submit' className="btn btn-primary">Login</button>
            </form>

            <button onClick={handleClick}>logout</button>
            <button onClick={handleuser}>user</button>




        </div>
    )
}

