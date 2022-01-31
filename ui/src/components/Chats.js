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
import { MdEmail } from 'react-icons/md';
import { RiChatNewLine } from 'react-icons/ri';

export default function Chats() {
    const [error, setError] = useState('');
    // const [ userMessages, setUserMessages ] = useState({});
    const [sync, setSync] = useState(false);
    let { user } = useParams();
    const history = useHistory();

    const {getState, dispatch} = store;
    const state = getState();
    const { messages, formActive } = useSelector(state => state);
    console.log(messages)

    const email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
    const username = localStorage.getItem('username') ? localStorage.getItem('username') : '';    
    const img = localStorage.getItem('img') ? localStorage.getItem('img') : '';      
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

    const showForm = () => {
        dispatch({
            type: 'SET_FORM_ACTIVE',
            data: !formActive
        });
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
        getMessages();
     
        return () => {
        }
    }, [sync]);

    const messageLine = messages.map(message => email === message.chatSender.email ? message.chatReceiver : message.chatSender);
    console.log(messages, messageLine);
    
    return (
        <div id={`${user}`} style={{fontSize: '1.1em'}} className='shadow-lg border border-gray-200 h-full rounded p-2 mb-4 md:w-1/2 m-auto'>
        <p className='flex justify-between mb-4 border-3 border shadow-md p-2'>
            <span className='cursor-pointer text-left' onClick={() => history.goBack()}><IoIosArrowBack size={30} /></span>
            <span className='text-xl font-bold self-center'>Messages</span>
            <span className='text-left bg-black-400 cursor-pointer hover:invisible' onClick={() => history.push("/twits")}><AiFillHome size={28} /></span>
        </p>
        
        <div style={{bottom: '0em', margin: 'auto'}} className='p-2 rounded flex justify-around border-3 border shadow-md fixed right-0 left-0 bg-white md:w-1/2'>
            <span className='cursor-pointer pt-1' onClick={() => history.push("/twits")}>
                <AiFillHome size={25} color='gray' />
            </span>
            <span className='cursor-pointer pt-1' onClick={e => history.push(`/${username}`)}>
                {(img !== 'null' || error) ? 
                    <BsPersonFill size={25} color='gray' />:
                    <img src={img} alt='Profile' style={{width: '30px', height: '30px', borderRadius: '50%'}} />
                }
            </span>
            <span className='cursor-pointer pt-1' onClick= {e => history.push('/people')}>
                <IoIosPeople size={30} color='gray'/>
            </span>
            {/* <span className='cursor-pointer pt-1'>
                <RiChatNewLine size={25} color='gray' onClick={showForm} />
            </span> */}

            <span className='cursor-pointer pt-1 border-t-2 border-black'  onClick= {e => history.push(`/chats/${username}`)}><MdEmail size={25} color='black' />
            </span>
        </div>
        {error && <div style={{backgroundColor: 'white', fontWeight: 'bold'}} className='text-red-500 text-center py-1 m-1 rounded'>Please check your network !</div>}
        <div className='mb-1'>
            {messages.length ? 
            <Chat messages={messages} />
            :
            <div className='text-center'>You have not started any conversation</div>}
        </div>
    </div>
    )
}
