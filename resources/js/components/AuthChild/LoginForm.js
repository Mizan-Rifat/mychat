import React, { useState, useEffet } from 'react';
import PersonIcon from '@material-ui/icons/Person';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles';


const useStyles = makeStyles(theme => ({
    inputGroupText: {
        background: '#c0392b !important',
        color: 'white!important',
        border: '0!important',
        borderRadius: '0.25rem 0 0 0.25rem!important'
    }
}))

export default function LoginForm({setResLoading}) {

    const classes = useStyles();

    const initState = {
        email: '',
        password: '',
        remember:false,
        error: ''
    }
    const [loginData, setLoginData] = useState(initState);
    const history = useHistory();

    const handleFieldChange = (e) => {

        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })

    }

    const login = (e) => {

        // e.preventDefault();
        setResLoading(true)

        axios.get('/airlock/csrf-cookie').then(response => {
            axios.post('/login', {
                email: loginData.email,
                password: loginData.password,
                remember : loginData.remember ? 'on' : ''
            })
                .then(response => {
                    setResLoading(false)
                    if (response.status === 200) {
                        console.log(response)
                        localStorage.setItem('userID', response.data.id)
                        localStorage.setItem('loggedIn', true)
                        history.push('/chat')

                    }
                })
                .catch(error => {
                    setResLoading(false)
                    console.log(error)

                })
        });
    }

    const handleClick = () => {
        axios.post('/logout')
            .then(respose => {
                console.log(respose)
            })
            .catch(error => {
                console.log(error)
            })
    }
    return (
        <div className="d-flex justify-content-center form_container" > 
            <form>
                <div className="input-group mb-3">
                    <div className="input-group-append">
                        <span className='input-group-text input-group-text2'><PersonIcon /></span>
                    </div>
                    <input type="text" className="form-control input_user" placeholder="Email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
                </div>

                <div className="input-group mb-2">
                    <div className="input-group-append">
                        <span className='input-group-text input-group-text2'><VpnKeyIcon /></span>
                    </div>
                    <input type="password" className="form-control input_pass" placeholder="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                </div>
                <div className="form-group">
                    <div className="custom-control custom-checkbox" style={{color:'white'}}>
                        <input type="checkbox" className="custom-control-input" id="customControlInline" onChange={(e) => setLoginData({ ...loginData, remember: e.target.checked })}/>
                        <label  className="custom-control-label" htmlFor="customControlInline">Remember me</label>
                    </div>
                </div>

                <LoginButton label='Login' handleClick={login} />


            </form>
        </div>
    )
}

function LoginButton({ label, handleClick }) {

    return (
        <div className="d-flex justify-content-center mt-3 login_container">
            <button type="button" name="button" className="btn login_btn" onClick={handleClick}>{label}</button>
        </div>
    )
}
