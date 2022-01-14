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

export default function Profile() {
    const [error, setError] = useState('');
    const [ userData, setUserData ] = useState({});
    const [ isFollower, setIsFollower ] = useState(false);
    const [ isFollowing, setIsFollowing ] = useState(false);
    const [ followerCount, setFollowerCount ] = useState(0);
    const [ followingCount, setFollowingCount ] = useState(0);
    const [ twitCount, setTwitCount ] = useState(0);
    const [followLoading, setFollowLoading] = useState(false);
    const [sync, setSync] = useState(false);
    let { user } = useParams();
    const history = useHistory();

    const email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
    const token = localStorage.getItem('token');
    const {getState, dispatch} = store;
    const state = getState();
    const { twits } = useSelector(state => state);

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
                    dispatch({
                        type: 'SET_USERS_DATA',
                        data: res.data.data.users
                    });
                    localStorage.setItem('usersData', JSON.stringify(res.data.data.users));
                    localStorage.setItem('users', JSON.stringify(res.data.data.users));
                    const userTwits = twits.filter(obj => obj.twits.username === user);
                    const userDataInStore = res.data.data.users.filter(obj => obj.username === user)[0];
                    const followers = userDataInStore.followers.filter(user => user.follower.isFollowed);
                    const following = userDataInStore.following.filter(user => user.follower.isFollowed);
                    const checkIsFollower = followers.filter(user => user.email === email).length > 0;
                    const checkIsFollowing = following.filter(user => user.email === email).length > 0;
                    setUserData(userDataInStore);
                    setFollowerCount(followers.length);
                    setFollowingCount(following.length);
                    setIsFollower(checkIsFollower);
                    setIsFollowing(checkIsFollowing);
                    setTwitCount(userTwits.length);

                    setError('');
                } else{
                    setSync(!sync);
                }
            } else {
                setError('Please check your network');
                dispatch({
                    type: 'SET_USERS_DATA',
                    data: JSON.parse(localStorage.getItem('usersData'))
                });
                const userTwits = twits.filter(obj => obj.twits.username === user);
                const userDataInStore = JSON.parse(localStorage.getItem('usersData')).filter(obj => obj.username === user)[0];
                const followers = userDataInStore.followers.filter(user => user.follower.isFollowed);
                const following = userDataInStore.following.filter(user => user.follower.isFollowed);
                const checkIsFollower = followers.filter(user => user.email === email).length > 0;
                const checkIsFollowing = following.filter(user => user.email === email).length > 0;
                setUserData(userDataInStore);
                setFollowerCount(followers.length);
                setFollowingCount(following.length);
                setIsFollower(checkIsFollower);
                setIsFollowing(checkIsFollowing);
                setTwitCount(userTwits.length);         
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
        return () => {
        }
    }, [sync]);


    return (
        <div id={`${user}`} style={{fontSize: '1.1em'}} className='shadow-lg border border-gray-200 h-full rounded p-5 mb-4'>
        <p className='flex justify-between mb-6 border-3 border shadow-md p-2'>
            <span className='cursor-pointer' onClick={() => history.goBack()}><IoIosArrowBack size={30} /></span>
            {<span className='flex cursor-pointer' onClick= {e => history.push('people')}><IoIosPeople size={35}/></span>}
            <span className='bg-black-400 cursor-pointer' onClick={() => history.push("/twits")}><AiFillHome size={28} /></span>
        </p>
        <div className='mb-1'>
        <>
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
            </>
        </div>
        {error && <div style={{backgroundColor: 'white', fontWeight: 'bold'}} className='text-red-500 text-center py-2 mb-5 rounded'>{error}</div>}
        <span className='text-sm mt-3 mb-1 flex justify-between'>
            <span>
                <span className=''>Member since : <Moment fromNow>{userData?.createdAt}</Moment></span><br />
                {isFollowing && <span className='text-xs text-white bg-gray-500 rounded p-1 mb-3'> 
                    Follows you
                </span>}
            </span>
            <span className='flex'>
            {(email !== userData?.email) && 
                <>
                {!followLoading ? 
                    <span className='flex flex-col'>
                        <span className={'text-white bg-blue-900 rounded hover:bg-blue-400 p-1 cursor-pointer -mt-2 mr-1'} onClick={() => handleFollow()}> 
                        {!isFollower ? 'Follow' : 'Following'}
                        </span>
                        <span className={'invisible -mt-2 mr-1'}></span>
                    </span>
                    :
                    <LoadSpan height={20} width={20} color='' />}
                </>
            }
            </span>
        </span>
        <div className='flex justify-between text-sm mt-5'>
            <span>
                {followerCount > 0 && <span className={'text-white bg-blue-500 rounded hover:bg-blue-400 p-2 cursor-pointer mr-3'}  onClick= {e => history.push(`/follower/${user}`)}> 
                        {followerCount} {followerCount  > 1 ? 'followers' : 'follower'}
                </span>}
                {followingCount > 0 && <span className={' text-white bg-green-500 rounded hover:bg-green-400 p-2 cursor-pointer mr-3'}  onClick= {e => history.push(`/following/${user}`)}> 
                        {followingCount} following
                </span>}
                {twitCount > 0 && <span className={' text-white bg-yellow-500 rounded hover:bg-yellow-400 p-2 cursor-pointer mr-3'}  onClick= {e => history.push(`/twits/${user}`)}> 
                        {twitCount} {twitCount  > 1 ? 'posts' : 'post'}
                </span>}
            </span>
           
        </div>
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
