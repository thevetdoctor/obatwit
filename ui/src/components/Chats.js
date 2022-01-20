/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { BsPersonFill } from 'react-icons/bs';
import { IoIosArrowBack, IoIosPeople } from 'react-icons/io';
import axios from 'axios';
import { baseUrl, frontendUrl } from '../helper';
import { LoadSpan, Twit } from './Twits';
import { AiFillHome } from 'react-icons/ai';
import store from '../redux/store';
import { useSelector } from 'react-redux';
import Chat from './Chat';

export default function Chats() {
    const [error, setError] = useState('');
    const [ userMessages, setUserMessages ] = useState({});
    const [sync, setSync] = useState(false);
    let { user } = useParams();
    const history = useHistory();

    const {getState, dispatch} = store;
    const state = getState();
    const { messages } = useSelector(state => state);
    console.log(messages)

    const email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
    const token = localStorage.getItem('token');
    const apiUrl = `${baseUrl}/messages`;

    const apiCallHook = async(method, url, data) => {
        const res = await axios({
            method,
            url,
            data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            })
            .catch(error => {
                if(error.isAxiosError) {
                }
            });
            if(res && res.data.success) {
                    if(method === 'GET') {
                        console.log(res.data)
                    // setUserData(res.data.data.user);
                    // setTwitData(res.data.data.users);
                    localStorage.setItem('users', JSON.stringify(res.data.data.users));
                    setError('');
                } else{
                    setSync(!sync); 
                }
            } else {
                setError('Please check your network');
            }
    }

    const getMessages = async() => {
        if(!token) {
            return;
        }
        const res = await axios({
            method: 'GET',
            url: `${apiUrl}/chats`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            })
            .catch(error => {
                if(error.isAxiosError) {
                    setError(error.response?.data?.error);
                }
            });
            if(res && res.data.success) {
                dispatch({
                    type: 'SET_MESSAGES_DATA',
                    data: res.data.data
                });
                localStorage.setItem('messages', JSON.stringify(res.data.data));
                // const userMessages = res.data.data.filter(obj => obj.twits.username === user);
                // setUserData(userTwitData[0]?.twits);
                // setTwitData(userTwitData);
            } else {
                setError('Please check your network');
                dispatch({
                    type: 'SET_MESSAGES_DATA',
                    data: JSON.parse(localStorage.getItem('messages'))
                });
            }
    }
    
    useEffect(() => {
        // const userTwitData = twits.filter(obj => obj.twits.username === user);
        // setUserData(userTwitData[0]?.twits);
        // setTwitData(userTwitData);
    }, []);
    
    useEffect(async() => {
        getMessages();
     
        return () => {
        }
    }, [sync]);

    return (
        <div id={`${user}`} style={{fontSize: '1.1em'}} className='shadow-lg border border-gray-200 h-full rounded p-2 mb-4 md:w-1/2 m-auto'>
        <p className='flex justify-between mb-6 border-3 border shadow-md p-2'>
        <span className='cursor-pointer text-left' onClick={() => history.goBack()}><IoIosArrowBack size={30} /></span>
            <span className='text-xl font-bold self-center'>Messages</span>
            <span className='text-left bg-black-400 cursor-pointer hover:invisible' onClick={() => history.push("/twits")}><AiFillHome size={28} /></span>
        </p>
        {error && <div style={{backgroundColor: 'white', fontWeight: 'bold'}} className='text-red-500 text-center py-2 m-1 rounded'>Please check your network !</div>}
        <div className='mb-1'>
        <>
            {/* {userData?.imageUrl ?
            <span className='flex'>
                    {error ? <BsPersonFill size={'1.7em'} color='black' />:
                <img src={userData?.imageUrl} alt='Profile' style={{width: '2em', height: '2em', borderRadius: '50%'}} />}
                <span className='text-xl font-semibold ml-2 mb-2'>{userData?.username}</span>
            </span>
            : 
            <span className='flex'>
                <BsPersonFill size={30} />
                <span className='text-xl font-semibold ml-2 mb-2'>{userData?.username}</span>
            </span>} */}
            </>
            <Chat messages={messages} />
        </div>
        <div style={{fontFamily: 'Roboto'}} className='text-md'>
        {/* {
                    twitData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((twit, idx) => 
                        <div  key={idx} style={{backgroundColor: 'white', fontWeight: 'bold'}}>
                            <Twit key={idx} twit={twit} email={email} apiCallHook={apiCallHook} baseUrl={baseUrl} frontendUrl={frontendUrl} sync={sync} setSync={setSync} />
                        </div>
                    )
                } */}
        </div>
    </div>
    )
}
