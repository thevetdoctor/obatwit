/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { BsPersonFill } from 'react-icons/bs';
import { IoIosArrowBack, IoIosPeople } from 'react-icons/io';
import Moment from 'react-moment';
import axios from 'axios';
import { baseUrl } from '../helper';
import { LoadSpan } from './Twits';
import store from '../redux/store';
import { useSelector } from 'react-redux';
import { AiFillHome } from 'react-icons/ai';

export default function Verified() {
    const [error, setError] = useState('');
    const [userData, setUserData] = useState({});
    let { user } = useParams();
    const history = useHistory();

    const email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
    const token = localStorage.getItem('token');
    const {getState, dispatch} = store;
    const state = getState();
    
    const verifyUser = async() => {
        const res = await axios({
            method: 'GET',
            url: `${baseUrl}/auth/verify/${user}`,
            headers: {
                'Content-Type': 'application/json'
            }
            })
            .catch(error => {
                if(error.isAxiosError) {
                    setError(error.response?.data?.error);
                }
            });
            if(res && res.data.success) {             
            } else {
                setError('Please check your network');
              
            }
    }

    useEffect(() => {
        verifyUser();

        return () => {}
    }, []);

    return (
        <div id={`${user}`} style={{fontSize: '1.1em'}} className='shadow-lg border border-gray-200 h-full rounded p-2 mb-4 m-auto justify-center md:w-1/2'>
        <p className='flex justify-between mb-6 border-3 border shadow-md p-2'>
            <span className='cursor-pointer' onClick={() => history.goBack()}><IoIosArrowBack size={30} /></span>
            {<span className='flex cursor-pointer' onClick= {e => history.push('/people')}><IoIosPeople size={35}/></span>}
            <span className='bg-black-400 cursor-pointer' onClick={() => history.push("/twits")}><AiFillHome size={28} /></span>
        </p>
        <div className='mb-1'>
        <>
            {userData?.imageUrl ?
            <span className='flex'>
                    {error ? <BsPersonFill size={'1.7em'} color='black' />:
                <img src={userData?.imageUrl} alt='Profile' style={{width: '2em', height: '2em', borderRadius: '50%'}} />}
                <span className='text-xl font-semibold ml-2 mb-2'>{user}</span>
            </span>
            : 
            <span className='flex'>
                <BsPersonFill size={30} />
                <span className='text-xl font-semibold ml-2 mb-2'>{user}</span>
            </span>}
            </>
        </div>
        Your account is now verified!

        {error && <div style={{backgroundColor: 'white', fontWeight: 'bold'}} className='text-red-500 text-center py-2 mb-5 rounded'>{error}</div>}
        <span className='text-sm mt-3 mb-1 flex justify-between'>
         
            <span className='flex'>
                <>
                    <span className='flex flex-col'>
                        <span className={'text-xs text-white bg-blue-900 rounded hover:bg-blue-400 p-1 cursor-pointer -mt-2 mr-1'} onClick={() => history.push(`/${user}`)}> 
                            Go to your profile
                        </span>
                    </span>
                </>
            </span>
        </span>
        
        <span>
            {userData?.imageUrl ? 
            <>{error ? <BsPersonFill size={300} color='black' />:
            <img src={userData?.imageUrl} width='100%' alt='imgurl' className='mt-3 rounded-lg' />}</>
            :
            <div className='flex'>
                <span className='m-auto'><BsPersonFill size={300} /></span>
            </div>}
        </span>
        
        
    </div>
    )
}
