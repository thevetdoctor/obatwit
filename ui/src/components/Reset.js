/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import { baseUrl } from '../helper';
import chat from './chat.jpg';
import { CgCopyright } from 'react-icons/cg';

export default function Reset(props) {
    const [newpass1, setNewPass1] = useState('');
    const [newpass2, setNewPass2] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

const apiUrl = `${baseUrl}/auth/reset`; 

const handleChange = (e) => {
    if(e.target.name === 'newpass1') {
        console.log(e.target.value);
        setNewPass1(e.target.value);
    } else {
        console.log(e.target.value);
        setNewPass2(e.target.value);
    }
}

useEffect(() => {

    return () => {
    }
}, []);
    return (
        <div style={{fontFamily: 'Roboto', fontWeight: '600', backgroundImage: 'url("./bg.png")'}} className='font-Roboto text-center align-items-center bg-cover bg-center'>
             <p className='text-center mb-2'>
                <span style={{fontFamily: 'Architects Daughter', fontSize: '1.8em'}} className='text-purple-900 font-bold italic'>Buzz<br/>
                </span> 
                <span className='text-md'> Feel free, express yourself & network </span>
            </p>
            <h3 className='font-bold text-md mt-8 mb-4'>
                Set up a new password
            </h3>
            <input 
                type='text'
                name='newpass1'
                value={newpass1} 
                placeholder='Enter a new password'
                onChange={handleChange}
                className='px-3 rounded mb-5 text-xs'
                /><br/>
            <input 
                type='text'
                name='newpass2'
                value={newpass2} 
                placeholder='Confirm new password' 
                onChange={handleChange}
                className='px-3 rounded mb-5 text-xs'
            /><br/>
            <div className='flex flex-col mb-3'>
                {error && <span className='mb-2 text-red-600'>{error}</span>}
                <div className='flex justify-center'>
                    {!loading ?
                    <span 
                        // onClick={() => authenticate(false, email, password, apiUrl, error, setError, setLoading, history)}
                        className='cursor-pointer mb-3 bg-green-500 hover:bg-green-400 py-2 px-3 font-bold shadow-md rounded text-white text-xs'
                    >   
                    Update Password
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
          
          {/* <img 
            src={chat}
            alt='Chat'
            className=''
            style={{borderRadius: '5', width: '40'}}
          /> */}
            <p className="text-white-400 bold flex text-center"><CgCopyright /> Twitee</p>         
        </div>
    )
}
