import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import DotLoader from 'react-spinners/DotLoader';

export default function RegistrationForm({setResLoading}) {

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
        // opacity: '0.5',
        // background: 'rgba(255, 255, 255, 0.6)'

    }

    const [registrationData, setRegistrationData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        error: []
    });

    const [loading, setLoding] = useState(false);

    const history = useHistory();

    const handleFieldChange = (e) => {
        setRegistrationData({
            ...registrationData,
            [e.target.name]: e.target.value
        })
    }
    const hasError = (field) => {
        return !!registrationData.error[field]
    }


    const registerUser = (e) => {

        setResLoading(true)

        setLoding(true)
        axios.get('/airlock/csrf-cookie').then(response => {
            axios.post('/register', {
                name: registrationData.name,
                email: registrationData.email,
                password: registrationData.password,
                password_confirmation: registrationData.password_confirmation
            })
                .then(response => {
                    console.log(response)
                    if (response.status == 200) {
                        setLoding(false)
                        localStorage.setItem('userID', response.data.user.id)
                        history.push('/chat')
                    }

                })
                .catch(error => {
                    setResLoading(false)
                    console.log(error.response.status)

                    if (error.response.status == 422) {

                        setRegistrationData({
                            ...registrationData,
                            error: error.response.data.errors
                        })
                    }
                    setLoding(false)
                })
        });
    }

    return (
        <div className="d-flex justify-content-center form_container">


            <form style={loading ? formDisable : null}>
                <div className="form-group">

                    <input type="text" name='name' className={`form-control input_user ${hasError('name') ? 'invalid' : ''}`} placeholder="Name" value={registrationData.name} onChange={handleFieldChange} />
                    {
                        registrationData.error.hasOwnProperty('name') ? <small style={{ color: 'red' }}>{registrationData.error.name[0]}</small> : ''
                    }

                </div>

                <div className="form-group">

                    <input type="email" name='email' className={`form-control input_user ${hasError('name') ? 'invalid' : ''}`} placeholder="Email" value={registrationData.email} onChange={handleFieldChange} />
                    {
                        registrationData.error.hasOwnProperty('email') ? <small style={{ color: 'red' }}>{registrationData.error.email[0]}</small> : ''
                    }

                </div>
                <div className="form-group">

                    <input type="password" name='password' className={`form-control input_user ${hasError('name') ? 'invalid' : ''}`} placeholder="Password" value={registrationData.password} onChange={handleFieldChange} />
                    {
                        registrationData.error.hasOwnProperty('password') ? <small style={{ color: 'red' }}>{registrationData.error.password[0]}</small> : ''
                    }

                </div>
                <div className="form-group">

                    <input type="password" name='password_confirmation' className={`form-control input_user ${hasError('password_confirmation') ? 'invalid' : ''}`} placeholder="Confirm Password" value={registrationData.password_confirmation} onChange={handleFieldChange} />

                    {
                        registrationData.error.hasOwnProperty('password') ? <small style={{ color: 'red' }}>{registrationData.error.password[1]}</small> : ''
                    }

                </div>



                <div className="d-flex justify-content-center mt-3 login_container">
                    <button type="button" disabled={loading} name="button" className="btn login_btn" onClick={registerUser}>Register</button>
                </div>
                <div className="d-flex justify-content-center  login_container">
                    <strong style={{color:'white'}}>OR</strong>
                </div>
                
                <div className="d-flex justify-content-center login_container">
               
                    <button type="button" disabled={loading} name="button" className="btn login_btn" onClick={()=>history.push('/login')}>Login</button>
                </div>

            </form>
        </div>
    )
}
