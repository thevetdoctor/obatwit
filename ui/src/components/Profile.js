/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { IoCloseCircle } from 'react-icons/io5';
import { BsPersonFill } from 'react-icons/bs';
import { IoIosPeople } from 'react-icons/io';
import Moment from 'react-moment';
import axios from 'axios';
import { baseUrl } from '../helper';
import { LoadSpan } from './Twits';

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
                    console.log(error.response?.data?.error)
                    setError(error.response?.data?.error);
                    console.log('Error found');
                }
            });
            if(res && res.data.success) {
                    if(method === 'GET') {
                    // setUserData(res.data.data.user);
                    localStorage.setItem('users', JSON.stringify(res.data.data.users));
                    // const followers = res.data.data.user.followers.filter(user => user.follower.isFollowed);
                    // const following = res.data.data.user.following.filter(user => user.follower.isFollowed);
                    // setFollowerz(followers);
                    // setFollowingz(following);
                    // setFollowerCount(followers.length);
                    // setFollowingCount(following.length);
                    // const checkIsFollower = followers.filter(user => user.email === email).length > 0;
                    // const checkIsFollowing = following.filter(user => user.email === email).length > 0;
                    // setIsFollower(checkIsFollower);
                    // setIsFollowing(checkIsFollowing);
                    // console.log(followers, following, checkIsFollower, checkIsFollowing, isFollower, isFollowing);
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
        if(isFollower) {
            apiCallHook('PATCH', `${baseUrl}/followers/unfollow`, {followerId: userData?.id});
        } else {
            apiCallHook('POST', `${baseUrl}/followers/follow`, {followerId: userData?.id});
        }
    }

        
    useEffect(() => {
        console.log(user);
        const userTwits = JSON.parse(localStorage.getItem('twits')).filter(obj => obj.twits.username === user);
        const userDataInStore = JSON.parse(localStorage.getItem('users')).filter(obj => obj.username === user)[0];
        console.log(userDataInStore);
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
    }, []);

    useEffect(() => {
        apiCallHook('GET', `${baseUrl}/auth/users`);
        return () => {
            console.log('cleanup profile page');
        }
    }, [sync]);


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
            {<span className='text-left flex cursor-pointer' onClick= {e => history.push('people')}><IoIosPeople size={30}/></span>}
            <span className='text-left bg-black-400 cursor-pointer hover:invisible' onClick={() => history.push("/twits")}><IoCloseCircle size={35} /></span>
        </p>
        {error && <div style={{backgroundColor: 'white', fontWeight: 'bold'}} className='text-red-500 text-center py-2 mb-5 rounded'>{error}</div>}
        <span className='text-sm mt-3 mb-1 flex justify-between'>
            <span>
                <span className='ml-2'>Member since : <Moment fromNow>{userData?.createdAt}</Moment></span><br />
                {isFollowing && <span className='text-xs text-white bg-gray-500 rounded p-1 ml-2 mb-3'> 
                    Follows you
                </span>}
            </span>
            <span className='flex'>
            {(email !== userData?.email) && 
                <>
                {!followLoading ? 
                    <span className='flex flex-col'>
                        <span className={'text-white bg-blue-900 rounded hover:bg-blue-400 p-2 cursor-pointer -mt-2 mr-1'} onClick={() => handleFollow()}> 
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
            <img src={userData?.imageUrl} width='100%' alt='imgurl' className='mt-3 rounded-lg' />
            :
            <div className='flex'>
                <span className='m-auto'><BsPersonFill size={300} /></span>
            </div>}
        </span>
        
        
    </div>
    )
}
