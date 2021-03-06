/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { IoCloseCircle } from 'react-icons/io5';
import { BsPersonFill } from 'react-icons/bs';
import { IoIosArrowBack, IoIosPeople } from 'react-icons/io';
import axios from 'axios';
import { baseUrl } from '../helper';
import { LoadSpan } from './Twits';
import TopSearch from './TopSearch';
import { AiFillHome } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';

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
    const defaultUsername = localStorage.getItem('username') ? localStorage.getItem('username') : '';
    const img = localStorage.getItem('img') ? localStorage.getItem('img') : '';
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
        }
    }, [searchQuery]);
    
    useEffect(() => {
        const userDataInStore = JSON.parse(localStorage.getItem('users')).filter(obj => obj.username === user)[0];
        const followers = userDataInStore.followers.filter(user => user.follower.isFollowed);
        setUserData(userDataInStore);
        setSearchData(followers);
        setPeopleData(followers);

        return () => {}
    }, []);
    
    return (
        <div id={`${user}`} style={{fontFamily: 'Raleway', fontSize: '1.1em'}} className='shadow-lg border border-gray-200 h-full rounded p-2 mb-4 md:w-1/2 m-auto'>
        <p className='flex justify-between mb-6 p-2 border-3 border shadow-md -mt-2 -mx-2 '>
            <span className='cursor-pointer' onClick={() => history.goBack()}><IoIosArrowBack size={30} /></span>
            <span style={{fontFamily: 'Raleway'}} className='text-xl font-bold self-center'>Followers</span>
            <span></span>
        </p>
        <div style={{bottom: '0em', margin: 'auto'}} className='pb-1 rounded flex justify-around border-2 border shadow-md fixed right-0 left-0 bg-white md:w-1/2'>
                <span className='cursor-pointer pt-2' onClick={() => history.push("/twits")}>
                    <AiFillHome size={25} color='gray' />
                </span>

                <span className='cursor-pointer pt-2' onClick= {e => history.push('/people')}>
                    <IoIosPeople size={30} color='gray'/>
                </span>

                <span className='cursor-pointer pt-2'  onClick= {e => history.push(`/chats/${defaultUsername}`)}><MdEmail size={25} color='gray' />
                </span>
            </div>


        {error && <div style={{backgroundColor: 'white', fontWeight: 'bold'}} className='text-red-500 text-center py-2 m-1 rounded'>Please check your network !</div>}
        <div className='-mb-9'>
            {userData?.imageUrl ?
            <span className='flex'>
                    {error ? <BsPersonFill size={'1.7em'} color='black' />:
                <img src={userData?.imageUrl} alt='Profile' style={{width: '2em', height: '2em', borderRadius: '50%'}} />}
                <span className='text-xl font-semibold ml-2 mb-2'>{userData?.username}</span>
            </span>
            : 
            <span className='flex'>
                <BsPersonFill size={30} />
                <span className='text-xl font-semibold ml-2 mb-2'>{userData?.username}</span>
            </span>}
        </div>
        <TopSearch searchQuery={searchQuery} handleChange={handleChange} setSearchQuery={setSearchQuery}/>
        <div className='flex flex-col text-md'>
            {searchData.sort((a, b) => a.email.localeCompare(b.email)).map((person, idx) => (
                <span key={idx} 
                    className={'bg-gray-200 rounded hover:bg-gray-400 p-2 mb-2 cursor-pointer'} 
                    onClick= {() => history.push(`/${person.username}`)}
                > 
                <span className='mx-2 flex cursor-pointer'  onClick= {e => history.push(`/${person.username}`)}>{error}
                {person.imageUrl ? (
                <span className='mr-2'>
                    {error ? <BsPersonFill size={'1.5em'} color='black' />:
                    <img src={person.imageUrl} alt='Profile' style={{width: '1.5em', height: '1.5em', borderRadius: '50%'}} />}
                </span>)
                : <span className='mr-2 text-black'><BsPersonFill size={'1.5em'}/></span>}
                {email === person.email ? 'Me' : person.username}{error}
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
