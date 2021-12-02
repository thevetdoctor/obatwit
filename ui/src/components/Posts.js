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
console.log('id', clientId, process.env);

export const authenticate = async(google = false, email, password = null, apiUrl, error, setError, setLoading, history, name) => {
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
                setTimeout(() => {
                    setError('');
                }, 1000);
            } else {
                setError('Please check your network');
                setTimeout(() => {
                    setError('');
                }, 1000);
            }
        });
    } else {
        res = await axios({
            method: 'POST',
            url: `${apiUrl}`,
            data: {email, password: 'passs', auth: 'google', name},
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .catch(error => {
            setError(error.response.data.error);
            setTimeout(() => {
                setError('');
            }, 1000);
        });

    }
        if(res && res.data.success) {
            localStorage.setItem('email', email);
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
    if(!token) {
        history.push('/');
    }
    return () => {
    }
}, []);

    return (
        <div className=' text-center align-items-center'>
            <p className='italic text-white-700 font-medium text-center mb-5'>
                <span className='text-purple-900 font-bold text-xl'>
                    Twitee
                </span> .... Feel free, express yourself, network ....
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
            <div style={{flexDirection: 'column'}} className='flex'>
                {error && <span className='mb-2 text-red-600'>{error}</span>}
                <div>
                    {!loading ?
                    <span 
                        style={{cursor: 'pointer'}}
                        onClick={() => authenticate(false, email, password, apiUrl, error, setError, setLoading, history)}
                        className='hover:bg-green-900 bg-green-400 font-medium p-2 rounded w-6 h-3 text-white'
                    >    
                        {signup ? 'Signup' : 'Login' }
                    </span>
                    :
                    <span className='m-auto'>
                        <Loader 
                        type='ThreeDots'
                        color='#00bfff'
                        height={40} 
                        width={40} 
                        />
                     </span>}
                </div>
                <span className='text-xs mt-4 mb-4'>
                {signup ? 'Already signed up ?' : 'Not registered ?' }
                     
                <a 
                    href='/' 
                    className='focus:text-md underline'
                    onClick={handleSignupMode}
                > 
                    {signup ? ' Login here' : ' Signup here!' }
                </a></span>
            </div>
            <GoogleAuth 
                error={error}
                setError={setError}
                loading={loading}
                setLoading={setLoading}
            />
            {/* <LinkedinAuth /> */}
            <p className="text-white-400 bold flex text-center"><CgCopyright /> Twitee</p>         
            
          <img 
            src={chat}
            alt='CHat'
            className=''
            style={{borderRadius: '5', width: '100'}}
          />
        </div>
    )
}
