/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { IoCloseCircle } from 'react-icons/io5';
import { BsPersonFill } from 'react-icons/bs';
import { IoIosArrowBack, IoIosPeople } from 'react-icons/io';
import axios from 'axios';
import { baseUrl, frontendUrl } from '../helper';
import { LoadSpan, Twit } from './Twits';
import TopSearch from './TopSearch';
import { AiFillHome } from 'react-icons/ai';

export default function UserTwits() {
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
  
    // useEffect(() => {
    //     handleSearch();
        
    //     return () => {
    //         console.log('cleanup people page2');
    //     }
    // }, [searchQuery]);
    
    useEffect(() => {
        const userTwitData = JSON.parse(localStorage.getItem('twits')).filter(obj => obj.twits.username === user);
        // const following = userDataInStore.following.filter(user => user.follower.isFollowed);
        setUserData(userTwitData[0].twits);
        setSearchData(userTwitData);
        setPeopleData(userTwitData);
        console.log(user, userTwitData);
    }, []);
    
    return (
        <div id={`${user}`} style={{fontSize: '1.1em'}} className='shadow-lg border border-gray-200 h-full rounded p-5 mb-4'>
        <p className='flex justify-between mb-6'>
        <span className='cursor-pointer text-left' onClick={() => history.goBack()}><IoIosArrowBack size={30} /></span>
            {/* <span className='cursor-pointer' onClick= {e => history.push(`/${userData?.username}`)}> */}
            {/* {userData?.imageUrl ?
            <span>
                <img src={userData?.imageUrl} alt='Profile' style={{width: '2.5em', height: '2.5em', borderRadius: '50%'}} />
            </span>
            : 
            <span className='text-left cursor-pointer'><BsPersonFill size={25} /></span>} */}
            {/* </span> */}
            <span style={{fontFamily: 'Roboto Slab'}} className='text-xl font-bold self-center'>Twits for {user}</span>
            <span className='text-left bg-black-400 cursor-pointer hover:invisible' onClick={() => history.push("/twits")}><AiFillHome size={30} /></span>
        </p>
        {error && <div style={{backgroundColor: 'white', fontWeight: 'bold'}} className='text-red-500 text-center py-2 m-1 rounded'>Please check your network !</div>}
        <span className='text-sm mt-3 mb-5'>
        </span>
        {/* <TopSearch searchQuery={searchQuery} handleChange={handleChange} setSearchQuery={setSearchQuery}/> */}
        <div style={{fontFamily: 'Roboto'}} className='text-md'>
        {
                    searchData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((twit, idx) => 
                        <div  key={idx} style={{backgroundColor: 'white', fontWeight: 'bold'}}>
                            <Twit key={idx} twit={twit} email={email} apiCallHook={apiCallHook} baseUrl={baseUrl} frontendUrl={frontendUrl} sync={sync} setSync={setSync} />
                        </div>
                    )
                }
        </div>
    </div>
    )
}
