/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { IoCloseCircle } from 'react-icons/io5';
import { BsPersonFill } from 'react-icons/bs';
import { IoIosArrowBack, IoIosPeople } from 'react-icons/io';
import Moment from 'react-moment';
import axios from 'axios';
import { baseUrl } from '../helper';
import { LoadSpan } from './Twits';
import TopSearch from './TopSearch';
import store from '../redux/store';
import { useSelector } from 'react-redux';
import { AiFillHome } from 'react-icons/ai';
import Loader from 'react-loader-spinner';
import { RiChatNewLine } from 'react-icons/ri';
import { MdEmail } from 'react-icons/md';

export default function People() {
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [ userData, setUserData ] = useState({});
    // const [ searchData, setSearchData ] = useState([]);
    // const [ peopleData, setPeopleData ] = useState([]);
    const [ isFollower, setIsFollower ] = useState(false);
    const [ isFollowing, setIsFollowing ] = useState(false);
    const [ followerCount, setFollowerCount ] = useState(0);
    const [ followingCount, setFollowingCount ] = useState(0);
    const [followLoading, setFollowLoading] = useState(false);
    const [sync, setSync] = useState(false);
    let { user } = useParams();
    const history = useHistory();

    const {getState, dispatch} = store;
    const state = getState();
    const { twits, users, peopleData, searchData, networkStatus, formActive } = useSelector(state => state);

    const email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
    const username = localStorage.getItem('username') ? localStorage.getItem('username') : '';    
    const img = localStorage.getItem('img') ? localStorage.getItem('img') : '';    
    const token = localStorage.getItem('token');

    const handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        setSearchQuery(value);
      
    }

    const showForm = () => {
        dispatch({
            type: 'SET_FORM_ACTIVE',
            data: !formActive
        });
    }

    const handleSearch = () => {
        const searchResults = peopleData.filter(person => {
            return person.username.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0;
        });
        dispatch({
            type: 'SET_SEARCH_DATA',
            data: searchResults
        });
        localStorage.setItem('searchData', JSON.stringify(searchResults));
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
                    setError(error.response?.data?.error);
                }
            });
            if(res && res.data.success) {
                    if(method === 'GET') {
                    setUserData(res.data.data.user);
                    dispatch({
                        type: 'SET_PEOPLE_DATA',
                        data: res.data.data.users
                    });
                    localStorage.setItem('peopleData', JSON.stringify(res.data.data.users));
                    dispatch({
                        type: 'SET_SEARCH_DATA',
                        data: res.data.data.users
                    });
                    localStorage.setItem('searchData', JSON.stringify(res.data.data.users));
                    localStorage.setItem('users', JSON.stringify(res.data.data.users));
                    setError('');
                } else{
                    setSync(!sync); 
                }
            } else {
                setError('Please check your network');
                dispatch({
                    type: 'SET_PEOPLE_DATA',
                    data: JSON.parse(localStorage.getItem('peopleData'))
                });            
                dispatch({
                    type: 'SET_SEARCH_DATA',
                    data: JSON.parse(localStorage.getItem('peopleData'))
                });            
            }
    }

    const handleFollow = () => {
        setFollowLoading(true);
        setTimeout(() => {
            setFollowLoading(false);
        }, 1000);
        if(isFollower) {
            apiCallHook('PATCH', `${baseUrl}/followers/unfollow`, {followerId: userData?.id});
        } else {
            apiCallHook('POST', `${baseUrl}/followers/follow`, {followerId: userData?.id});
        }
    }

    useEffect(() => {
        apiCallHook('GET', `${baseUrl}/auth/users`);
        dispatch({
            type: 'SET_SEARCH_DATA',
            data: JSON.parse(localStorage.getItem('peopleData'))
        });

        return () => {
        }
    }, [sync]);
  
    useEffect(() => {
        handleSearch();
        
        return () => {
        }
    }, [searchQuery]);
    return (
        <div id={`${user}`} style={{fontFamily: 'Raleway', fontSize: '1.1em'}} className='shadow-lg border border-gray-200 h-full rounded p-2 mb-4 m-auto md:w-1/2'>
        <div style={{margin: 'auto', top: '0em'}} className='bg-white flex justify-between p-2 mb-2 border-3 border shadow-md -mt-2 -mx-2 fixed right-0 left-0 md:w-1/2'>
            <span className='cursor-pointer text-left' onClick={() => history.goBack()}><IoIosArrowBack size={30} /></span>
            <span style={{fontFamily: 'Raleway'}} className='text-xl font-bold self-center'>Buzzers</span>
            <span></span>
        </div>
        <div style={{bottom: '0em', margin: 'auto'}} className='pb-1 rounded flex justify-around border-2 border shadow-md fixed right-0 left-0 bg-white md:w-1/2'>
            <span className='cursor-pointer pt-2' onClick={() => history.push("/twits")}>
                <AiFillHome size={25} color='gray' />
            </span>

            <span className='cursor-pointer pt-1 border-t-2 border-black' onClick= {e => history.push('/people')}>
                <IoIosPeople size={30} color='black'/>
            </span>

            <span className='cursor-pointer pt-2'  onClick= {e => history.push(`/chats/${username}`)}><MdEmail size={25} color='gray' />
            </span>
        </div>


        {error && <div style={{backgroundColor: 'white', fontWeight: 'bold', marginTop: '2.5em'}} className='text-red-500 text-center py-1 -mb-9 m-1 rounded'>Please check your network !</div>}
        {/* <span className='text-sm mt-3 mb-2'>
        </span> */}
        {!peopleData.length > 0 ? 
            <div className='flex mt-9 justify-center items-center pt-8'>
                <Loader 
                type='Bars'
                color='#00bfff'
                height={80} 
                width={80} 
            />
            </div>:
            <>
            <TopSearch searchQuery={searchQuery} handleChange={handleChange} setSearchQuery={setSearchQuery} error={error} />
            <div className='flex flex-col text-md'>
                {searchData.sort((a, b) => a.email.localeCompare(b.email)).map((person, idx) => (
                    <span key={idx} 
                        className={'bg-gray-200 rounded hover:bg-gray-400 p-2 mb-2 cursor-pointer'} 
                        onClick= {() => history.push(`/${person.username}`)}
                    > 
                    <span className='mx-2 flex cursor-pointer'  onClick= {e => history.push(`/${person.username}`)}>
                    {person.imageUrl ? (
                    <span className='mr-2'>
                        {error ? <BsPersonFill size={'1.5em'} color='black' />:
                        <img src={person.imageUrl} alt='Profile' style={{width: '1.5em', height: '1.5em', borderRadius: '50%'}} />}
                    </span>)
                    : <span className='mr-2 text-black'><BsPersonFill size={'1.5em'}/></span>}
                    {email === person.email ? 'Me' : person.username}
                </span>
                    </span>
                ))}
            </div>
        </>}
        <div className='flex'>
            <span className='m-auto'><IoIosPeople size={300} /></span>
        </div>
    </div>
    )
}
