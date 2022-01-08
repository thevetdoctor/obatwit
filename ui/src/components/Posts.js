/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import GoogleAuth from './GoogleAuth';
import { baseUrl } from '../helper';
// import LinkedinAuth from './LinkedinAuth';
import dotenv from "dotenv";
import chat from './chat.jpg';
import { CgCopyright } from 'react-icons/cg';

dotenv.config();
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export const authenticate = async(google = false, email, password = null, apiUrl, error, setError, setLoading, history, name, imageUrl) => {
    localStorage.setItem('img', imageUrl);
    setLoading(true);
    let res;
    if(!google) {
        res = await axios({
            method: 'POST',
            url: `${apiUrl}`,
            data: {email, password},
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .catch(error => {
            if(error.response) {
                setError(error.response?.data?.error);
            } else {
                setError('Please check your network');
            }
        });
    } else {
        res = await axios({
            method: 'POST',
            url: `${apiUrl}`,
            data: {email, password: 'passs', auth: 'google', name, imageUrl},
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .catch(error => {
            setError(error.response.data.error);
        });

    }
        if(res && res.data.success) {
            localStorage.setItem('email', email);
            localStorage.setItem('img', res.data.data.user.imageUrl);
            localStorage.setItem('username', res.data.data.user?.username);
            localStorage.setItem('token', res.data.data.token);
            setLoading(false);
            history.push('/twits');
        } else {
            setLoading(false);
        }
}

export default function Posts(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [signup, setSignup] = useState(JSON.parse(localStorage.getItem('signup')));
    const token = localStorage.getItem('token');
    const history = useHistory();
const apiUrl = `${baseUrl}/auth/${signup ? 'signup' : 'login'}`; 

const handleChange = (e) => {
    if(e.target.name === 'email') {
        setEmail(e.target.value);
    } else {
        setPassword(e.target.value);
    }
}

const handleSignupMode = () => {
    if(!signup) {
        setSignup(true);
        localStorage.setItem('signup', true);
    } else {
        setSignup(false);
        localStorage.setItem('signup', false);
    }
}

useEffect(() => {
    if(token) {
        history.push('/twits');
    }
    return () => {
    }
}, []);

    return (
        <div style={{fontFamily: 'Roboto', fontWeight: '600'}} className='font-Roboto text-center align-items-center'>
             <p style={{fontFamily: 'Architects Daughter', fontWeight: '300'}} className='italic text-center mb-2'>
                <span style={{fontSize: '1.8em'}} className='text-purple-900 font-bold'>Twitee<br/>
                </span> 
                <span style={{fontSize: '1em'}}>.... Feel free, express yourself, network ....</span>
            </p>
            <h1 style={{fontSize: 20}} className='font-bold text-md mb-7'>
                {signup ?  'Signup' : 'Login'}
            </h1>
            <input 
                type='text'
                name='email'
                value={email} 
                placeholder='email'
                onChange={handleChange}
                className='px-3 rounded mb-5'
                /><br/>
            <input 
                type='password'
                name='password'
                value={password} 
                placeholder='password' 
                onChange={handleChange}
                className='px-3 rounded mb-5'
            /><br/>
            <div className='flex flex-col mb-3'>
                {error && <span className='mb-2 text-red-600'>{error}</span>}
                <div className='flex justify-center'>
                    {!loading ?
                    <span 
                        onClick={() => authenticate(false, email, password, apiUrl, error, setError, setLoading, history)}
                        className='cursor-pointer mb-3 bg-green-500 hover:bg-green-400 py-1 px-6 rounded text-white'
                    >    
                        {signup ? 'Signup' : 'Login' }
                    </span>
                    :
                    <span className=''>
                        <Loader 
                        type='ThreeDots'
                        color='#00bfff'
                        height={40} 
                        width={40} 
                        />
                     </span>}
                </div>
            </div>
            {!token && <GoogleAuth
                error={error}
                setError={setError}
                loading={loading}
                setLoading={setLoading}
            />}
            {/* <LinkedinAuth /> */}
            <div className='mt-7 mb-6'>
                    {signup ? 'Already signed up ?' : 'Not registered ?' }
                    <span className='hover:bg-purple-400 bg-purple-500 ml-2 p-1 rounded text-white font-bold cursor-pointer' onClick={handleSignupMode}> 
                        {signup ? ' Switch to Login' : ' Switch to Signup!' }
                    </span>
            </div>
          <img 
            src={chat}
            alt='CHat'
            className=''
            style={{borderRadius: '5', width: '100'}}
          />
            <p className="text-white-400 bold flex text-center"><CgCopyright /> Twitee</p>         
        </div>
    )
}
