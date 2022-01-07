/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { IoCloseCircle } from 'react-icons/io5';
import { BsPersonFill } from 'react-icons/bs';
import Moment from 'react-moment';
import axios from 'axios';
import { baseUrl } from '../helper';

export default function Profile() {
    const [ userData, setUserData ] = useState({});
    let { user } = useParams();
    const history = useHistory();

    const email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
    const apiCallHook = async(method, url = `${baseUrl}/auth/users/${user}`) => {
        const res = await axios({
            method,
            url,
            headers: {
                'Content-Type': 'application/json',
            }
            })
            .catch(error => {
                if(error.isAxiosError) {
                    console.log(error.isAxiosError);
                }
            });
            if(res && res.data.success) {
                setUserData(res.data.data.user);
            } 
    }
    useEffect(() => {
        apiCallHook();
        return () => {
            console.log('cleanup profile page');
        }
    }, []);

    return (
        <div id={`${user}`} style={{fontSize: '1.1em'}} className='shadow-lg border border-gray-200 bg-gray-200 h-full rounded p-5 mb-4'>
        <p className='flex justify-between mb-2'>
            {userData?.imageUrl ?
            <span>
                <img src={userData?.imageUrl} alt='Profile' style={{width: '3em', height: '3em', borderRadius: '50%'}} />
            </span>
            : 
            <span className='text-left'><BsPersonFill size={25} /></span>}
            <span style={{fontFamily: 'Roboto Slab'}} className='text-xl font-bold self-center'>{userData?.username}</span>
            <span className='text-left bg-black-400 cursor-pointer hover:invisible' onClick={() => history.push("/")}><IoCloseCircle size={35} /></span>
        </p>
        <span className='text-sm mt-3 mb-5 flex justify-between'>
            <span>Member since : <Moment fromNow>{userData?.createdAt}</Moment></span>
        <span className='flex'>
        {(email !== userData?.email) && 
            <span className={' text-white bg-blue-900 rounded-full hover:bg-blue-400 p-2 cursor-pointer -mt-2 mr-3'}> 
                Follow
            </span>
        }
        </span>
        </span>
    
        <span>
            {userData?.imageUrl ? 
            <img src={userData?.imageUrl} width='100%' alt='imgurl' className='rounded' />
            :<span className=''><BsPersonFill size={300} /></span>}
        </span>
        
        
    </div>
    )
}
