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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

dotenv.config();
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export const authenticate = async(google = false, email, password = null, apiUrl, error, setError, setLoading, history, name, imageUrl) => {
    localStorage.setItem('img', imageUrl);
    setLoading(true);
    let res;
    if(!google) {
        if(!(email && password)) {
            if(!email) {
                setError('Email is required');
                setLoading(false);
                return;
            }
            setError('Password required');
            setLoading(false);
            return;
        }
        res = await axios({
            method: 'POST',
            url: `${apiUrl}`,
            data: {email, password},
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .catch(error => {
            if(error.isAxiosError) {
                if(error.response?.data?.error.search('NOTFOUND') >= 0) {
                    setError('Please check your network');
                } else {
                    setError(error.response?.data?.error);
                }
            }
        });
        if(res && res.data.success) {
            console.log("Login successful!", res.data.data.newUser);
            if(res.data.data.newUser) {
                toast.success("Signup successful!", {position: "top-center", hideProgressBar: true,});
                toast.success("Please check your mail to activate your account!", {position: "top-center", hideProgressBar: true,});
            } else {
                toast.success("Login successful!", {position: "top-center", hideProgressBar: true});
            }
        } else {
            toast.error("Something went wrong!", {position: "top-center", hideProgressBar: true});
        }
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
        if(res && res.data.success) {
            console.log("Login successful!");
            if(res.data.data.newUser) {
                toast.success("Signup successful!", {position: "top-center", hideProgressBar: true});
                toast.success("Please check your mail to activate your account!", {position: "top-center", hideProgressBar: true});
            } else {
            toast.success("Login successful!", {position: "top-center", hideProgressBar: true});
            }
        } else {
            toast.error("Something went wrong!", {position: "top-center", hideProgressBar: true});
        }
    }
        if(res && res.data.success) {
            const {user: {id, imageUrl, username}, token} = res.data.data;
            localStorage.setItem('email', email);
            localStorage.setItem('img', imageUrl);
            localStorage.setItem('userId', id);
            localStorage.setItem('username', username);
            localStorage.setItem('token', token);
            setLoading(false);
            setTimeout(() => {
                history.push('/twits');
            }, 2000);
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
        <div style={{fontFamily: 'Roboto', fontWeight: '600'}} className='text-center align-items-center bg-gradient-to-r from-cyan-500 to-blue-500'>
             <p className='text-center mb-2'>
                <span style={{fontFamily: 'Architects Daughter', fontSize: '1.8em'}} className='text-purple-900 font-bold italic'>Buzz<br/>
                </span> 
                <span className='text-md'> Feel free, express yourself & network </span>
            </p>
            <ToastContainer />

            <h3 style={{fontSize: 20}} className='font-bold text-md mb-4 mt-7'>
                {signup ?  'Signup' : 'Login'}
            </h3>
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
                        {/* {' '}{window.innerWidth} */}
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
            <div className='mt-7 mb-6 text-xs'>
                    {signup ? 'Already registered ?' : 'Not registered ?' }
                    <span className='hover:bg-purple-400 bg-purple-500 ml-2 p-1 rounded text-white font-bold cursor-pointer' onClick={handleSignupMode}> 
                        {signup ? ' Switch to Login' : ' Switch to Signup!' }
                    </span>
            </div>
          {/* <img 
            src={bg}
            alt='CHat'
            className='invisible'
            style={{borderRadius: '0.5em'}}
          /> */}
            {/* <p className="text-white-400 bold flex text-center"><CgCopyright /> Twitee</p>          */}
        </div>
    )
}
