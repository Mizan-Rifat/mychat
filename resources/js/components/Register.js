import React,{useEffect} from 'react';
import AuthHeader from './AuthChild/AuthHeader';
import RegistrationForm from './AuthChild/RegistrationForm';
import { useHistory } from 'react-router-dom';

export default function Register() {
    const history = useHistory();

    return (
        <div className="body">
            <div className="d-flex justify-content-center h-100">
                <div className="user_card">
                    <AuthHeader />
                   <RegistrationForm />
                   
                    
                </div>
            </div>
        </div>

    )
}
