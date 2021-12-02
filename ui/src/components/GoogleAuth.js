/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { authenticate } from './Posts';
import { baseUrl } from '../helper';
import dotenv from "dotenv";

dotenv.config();
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
console.log('id', clientId);

export default function GoogleAuth(props) {
    const { error, setError, loading, setLoading } = props;
    // const [error, setError] = useState('');
    // const [loading, setLoading] = useState(false);
    
    const [signup, setSignup] = useState(JSON.parse(localStorage.getItem('signup')));
    const apiUrl = `${baseUrl}/auth/${signup ? 'signup' : 'login'}`; 
    const history = useHistory();

    const onSuccess = (res) => {
        // console.log('login suceeded', res.profileObj);
        authenticate(true, res.profileObj.email, null, apiUrl, error, setError, setLoading, history, res.profileObj.name)
    }
    const onFailure = (res) => {
        console.log('login failed', res);
    }
    return (
        <div>
            <GoogleLogin 
                clientId={clientId}
                buttonText={signup ? 'Signup with Google' : 'Login with Google'}
                onSuccess={onSuccess}
                onFailure={onFailure}
                // isSignedIn={true}
                cookeiPolicy={'single_host_origin'}
                style={{marginTop: '160px'}}
            />
        </div>
    )
}
