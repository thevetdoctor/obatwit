/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Loader from 'react-loader-spinner';

export default function Posts(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [signup, setSignup] = useState(JSON.parse(localStorage.getItem('signup')));
    const token = localStorage.getItem('token');

    const history = useHistory();
  
const baseUrl = 'http://oba-twit.herokuapp.com';
// const baseUrl = 'http://localhost:4000';
const apiUrl = `${baseUrl}/auth/${signup ? 'signup' : 'login'}`; 

const handleChange = (e) => {
    if(e.target.name === 'email') {
        setEmail(e.target.value);
    } else {
        setPassword(e.target.value);
    }
}

const handleSignupMode = () => {
    console.log(signup);
    if(!signup) {
        setSignup(true);
        localStorage.setItem('signup', true);
    } else {
        setSignup(false);
        localStorage.setItem('signup', false);
    }
}
const authenticate = async() => {
    setLoading(true);
    const res = await axios({
        method: 'POST',
        url: `${apiUrl}`,
        data: {email, password},
        headers: {
            'Content-Type': 'application/json',
            }
        })
        .catch(error => {
            console.log(error.response);
            setError(error.response.data.error);
        });
        if(res && res.data.success) {
            localStorage.setItem('email', email);
            localStorage.setItem('token', res.data.data.token);
            setLoading(false);
            history.push('/twits');
        } else {
            setLoading(false);
            console.log('Error found');
        }
}

useEffect(() => {
    if(!token) {
        history.push('/');
    }
    return () => {
        console.log('cleanup posts');
    }
}, []);

    return (
        <div className='text-center'>
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
                />
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
                        onClick={authenticate}
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
                <span className='text-xs mt-5'>
                {signup ? 'Already signed up ?' : 'Not registered ?' }
                     
                <a 
                    href='/' 
                    className='focus:text-md underline'
                    onClick={handleSignupMode}
                > 
                    {signup ? ' Login here' : ' Signup here!' }
                </a></span>
            </div>
        </div>
    )
}
