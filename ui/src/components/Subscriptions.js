/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { IoIosArrowBack, IoIosPeople } from 'react-icons/io';
import { BsPersonFill } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { AiFillHome } from 'react-icons/ai';
import { SiSubstack } from 'react-icons/si';
import { Logout } from './GoogleAuth';
import store from '../redux/store';
import { baseUrl } from '../helper';
import { useSelector } from 'react-redux';

export default function Subscriptions() {
    const [error, setError] = useState('');
    const [subData, setSubData] = useState([]);

    const {getState, dispatch} = store;
    const state = getState();
    const { subs, users } = useSelector(state => state);
    const email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
    const img = localStorage.getItem('img') ? localStorage.getItem('img') : '';
    const username = localStorage.getItem('username') ? localStorage.getItem('username') : '';
    const token = localStorage.getItem('token');
    const history = useHistory();
 
    const logout = () => {
        localStorage.removeItem('token');
        history.push('/');
    } 

    const push = async() => {
        await axios({
        method: 'GET', url: `${baseUrl}/push`
    }).then(res => {
        dispatch({
            type: 'SET_SUBS',
            data: res.data.data
        });
        localStorage.setItem('subs', JSON.stringify(res.data.data));
        return res;
    });
}

    useEffect(() => {
        if(!token) {
            return history.push('/');
        }
        if(username === 'hobar') {
            push();
        }
        return () => {}
    }, []);

  return (<div>
            <div className='flex flex-col text-md md:w-1/2 m-auto'>
                <div style={{top: '0em', margin: 'auto'}} className='p-2 rounded mb-2 flex justify-between border-4 border shadow-md fixed right-0 left-0 bg-white md:w-1/2'>
                        {img !== 'null' ? (
                            <span className='cursor-pointer'  onClick= {e => history.push(`/${username}`)}>
                                {error ? <BsPersonFill size={25} />:
                            <img src={img} alt='Profile' style={{width: '30px', height: '30px', borderRadius: '50%'}} />}
                        </span>) 
                        : <span className='text-left cursor-pointer'><BsPersonFill size={25} onClick={e => history.push(`/${username}`)} /></span>}
                    <span className='text-left flex cursor-pointer'  onClick= {e => history.push('people')}><IoIosPeople size={30}/><span className='pt-1 pl-1'>{users > 0 && users}</span></span>
                    
                    <span style={{cursor: 'pointer'}} className='text-right' onClick={() => logout()}><Logout />
                    </span>
                </div>
                <p style={{marginTop: '3em'}} className='flex justify-between mb-1 p-2 border-3 border shadow-md mx-1 '>
                    <span className='cursor-pointer' onClick={() => history.goBack()}><IoIosArrowBack size={30} /></span>
                    <span style={{fontFamily: 'Raleway'}} className='text-xl font-bold self-center'>Subscriptions{' ('}{subs.length}{' / '}{subs.filter(sub => sub.users).length}{')'}</span>
                    <span></span>
                </p>
                <div style={{bottom: '0em', margin: 'auto'}} className='pb-1 rounded flex justify-around border-2 border shadow-md fixed right-0 left-0 bg-white md:w-1/2'>
                    <span className='cursor-pointer pt-1' onClick={() => history.push("/twits")}>
                        <AiFillHome size={25} color='gray' /> 
                    </span>
                    {username === 'hobar' && <span className='cursor-pointer pt-2 border-t-2 border-black' onClick= {e => history.push('/subscriptions')}>
                        <SiSubstack size={20} color='black'/>
                    </span>}
                    <span className='cursor-pointer pt-2' onClick= {e => history.push('/people')}>
                        <IoIosPeople size={30} color='gray'/>
                    </span>

                    <span className='cursor-pointer pt-2'  onClick= {e => history.push(`/chats/${username}`)}><MdEmail size={25} color='gray' />
                    </span>
                </div>

                {subs.sort((a, b) => a.users?.username.localeCompare(b.users?.username)).map((person, idx) => (
                    <span key={idx} 
                        className={'bg-gray-200 rounded hover:bg-gray-400 p-2 mb-2 cursor-pointer'} 
                        onClick= {person?.users !== null ? (e => history.push(`/${person.users?.username}`)) : (() => alert('User unknown'))}
                    > 
                    <span className='mx-2 flex cursor-pointer'>
                    {person.users?.imageUrl ? (
                    <span className='mr-2'>
                        {error ? <BsPersonFill size={'1.5em'} color='black' />:
                        <img src={person.users?.imageUrl} alt='Profile' style={{width: '1.5em', height: '1.5em', borderRadius: '50%'}} />}
                    </span>)
                    : <span className='mr-2 text-black'><BsPersonFill size={'1.5em'}/></span>}
                    {email === person.user?.email ? 'Me' : person.users?.username}
                </span>
                    </span>
                ))}
            </div>
            <div className='flex'>
                    <span className='m-auto'><IoIosPeople size={300} /></span>
            </div>
        </div>);
        }
