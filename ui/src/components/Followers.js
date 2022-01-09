/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { IoCloseCircle } from 'react-icons/io5';
import { BsPersonFill } from 'react-icons/bs';
import { IoIosPeople } from 'react-icons/io';
import axios from 'axios';
import { baseUrl } from '../helper';
import { LoadSpan } from './Twits';
import TopSearch from './TopSearch';

export default function Follower() {
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [ userData, setUserData ] = useState({});
    const [ searchData, setSearchData ] = useState([]);
    const [ peopleData, setPeopleData ] = useState([]);
    const [followLoading, setFollowLoading] = useState(false);
    const [sync, setSync] = useState(false);
    let { user } = useParams();
    const history = useHistory();

    const email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
    const token = localStorage.getItem('token');


    const handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        setSearchQuery(value);  
    }

    const handleSearch = () => {
        const searchResults = peopleData.filter(person => {
            return person.username.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0;
        });
        setSearchData(searchResults);
    }

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
                    console.log('Error found');
                }
            });
            if(res && res.data.success) {
                    if(method === 'GET') {
                    setUserData(res.data.data.user);
                    setPeopleData(res.data.data.users);
                    setSearchData(res.data.data.users);
                    localStorage.setItem('users', JSON.stringify(res.data.data.users));
                    setError('');
                } else{
                    setSync(!sync); 
                }
            } else {
                setError('Please check your network');
            }
    }

    const handleFollow = () => {
        setFollowLoading(true);
        setTimeout(() => {
            setFollowLoading(false);
        }, 1000);
            apiCallHook('PATCH', `${baseUrl}/followers/unfollow`, {followerId: userData?.id});
    }
  
    useEffect(() => {
        handleSearch();
        
        return () => {
            console.log('cleanup people page2');
        }
    }, [searchQuery]);
    
    useEffect(() => {
        const userDataInStore = JSON.parse(localStorage.getItem('users')).filter(obj => obj.username === user)[0];
        const followers = userDataInStore.followers.filter(user => user.follower.isFollowed);
        setUserData(userDataInStore);
        setSearchData(followers);
        setPeopleData(followers);
        // console.log(user, userDataInStore, followers);
    }, []);
    
    return (
        <div id={`${user}`} style={{fontSize: '1.1em'}} className='shadow-lg border border-gray-200 bg-gray-200 h-full rounded p-5 mb-4'>
        <p className='flex justify-between mb-2'>
            <span className='cursor-pointer' onClick= {e => history.push(`/${userData?.username}`)}>
            {userData?.imageUrl ?
            <span>
                <img src={userData?.imageUrl} alt='Profile' style={{width: '3em', height: '3em', borderRadius: '50%'}} />
            </span>
            : 
            <span className='text-left'><BsPersonFill size={25} /></span>}
            </span>
            <span style={{fontFamily: 'Roboto Slab'}} className='text-xl font-bold self-center'>Followers</span>
            <span className='text-left bg-black-400 cursor-pointer hover:invisible' onClick={() => history.push("/twits")}><IoCloseCircle size={35} /></span>
        </p>
        {error && <div style={{backgroundColor: 'white', fontWeight: 'bold'}} className='text-red-500 text-center py-2 m-1 rounded'>Please check your network !</div>}
        <span className='text-sm mt-3 mb-5'>
        </span>
        <TopSearch searchQuery={searchQuery} handleChange={handleChange} setSearchQuery={setSearchQuery}/>
        <div className='flex flex-col text-md'>
            {searchData.sort((a, b) => a.email.localeCompare(b.email)).map((person, idx) => (
                <span key={idx} 
                    className={'text-white bg-blue-400 rounded hover:bg-blue-400 p-2 mb-2 cursor-pointer'} 
                    onClick= {() => history.push(`/${person.username}`)}
                > 
                <span className='mx-2 flex cursor-pointer'  onClick= {e => history.push(`/${person.username}`)}>
                {person.imageUrl ? (
                <span className='mr-2'>
                    <img src={person.imageUrl} alt='Profile' style={{width: '1.5em', height: '1.5em', borderRadius: '50%'}} />
                </span>)
                : <span className='mr-2 text-black'><BsPersonFill size={'1.5em'}/></span>}
                {email === person.email ? 'Me' : person.username}
            </span>
                </span>
            ))}
        </div>
        <div className='flex'>
            <span className='m-auto'><IoIosPeople size={300} /></span>
        </div>
    </div>
    )
}
