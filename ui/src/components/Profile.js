/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { IoCloseCircle } from 'react-icons/io5';
import { BsPersonFill } from 'react-icons/bs';
import Moment from 'react-moment';
import axios from 'axios';
import { baseUrl } from '../helper';
import { LoadSpan } from './Twits';

export default function Profile() {
    const [ userData, setUserData ] = useState({});
    const [ isFollower, setIsFollower ] = useState(false);
    const [ isFollowing, setIsFollowing ] = useState(false);
    // const [ followerz, setFollowerz ] = useState([]);
    // const [ followingz, setFollowingz ] = useState([]);
    const [ followerCount, setFollowerCount ] = useState(0);
    const [ followingCount, setFollowingCount ] = useState(0);
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
                    console.log(error.isAxiosError);
                }
            });
            if(res && res.data.success) {
                    if(method === 'GET') {
                    setUserData(res.data.data.user);
                    const followers = res.data.data.user.followers.filter(user => user.follower.isFollowed);
                    const following = res.data.data.user.following.filter(user => user.follower.isFollowed);
                    // setFollowerz(followers);
                    // setFollowingz(following);
                    setFollowerCount(followers.length);
                    setFollowingCount(following.length);
                    const checkIsFollower = followers.filter(user => user.email === email).length > 0;
                    const checkIsFollowing = following.filter(user => user.email === email).length > 0;
                    setIsFollower(checkIsFollower);
                    setIsFollowing(checkIsFollowing);
                    // console.log(followers, following, checkIsFollower, checkIsFollowing, isFollower, isFollowing);
                } else{
                    setSync(!sync);
                }
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
        apiCallHook('GET', `${baseUrl}/auth/users/${user}`);
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
            <span className='text-left bg-black-400 cursor-pointer hover:invisible' onClick={() => history.push("/")}><IoCloseCircle size={35} /></span>
        </p>
        <span className='text-sm mt-3 mb-5 flex justify-between'>
            <span>Member since : <Moment fromNow>{userData?.createdAt}</Moment></span>
            <span className='flex'>
            {(email !== userData?.email) && 
                <>{!followLoading ? <span className={' text-white bg-blue-900 rounded-lg hover:bg-blue-400 p-2 cursor-pointer -mt-2 mr-1'} onClick={() => handleFollow()}> 
                   {!isFollower ? 'Follow' : 'Following'}
                </span>:
                <LoadSpan height={20} width={20} color='' />}
                </>
            }
            </span>
        </span>
        <div className='flex justify-between text-xs'>
            <span>
                {followerCount > 0 && <span className={'text-xs text-white bg-blue-500 rounded hover:bg-blue-400 p-2 cursor-pointer'}> 
                        {followerCount} {followerCount  > 1 ? 'followers' : 'follower'}
                </span>}
                {followingCount > 0 && <span className={' text-white bg-green-500 rounded hover:bg-blue-400 p-2 cursor-pointer m-3'}> 
                        {followingCount} following
                </span>}
            </span>
            <span>
                {isFollowing && <span className={' text-white bg-gray-500 rounded p-2 cursor-pointer m-1'}> 
                        Follows you
                </span>}
            </span>
        </div>
        <span>
            {userData?.imageUrl ? 
            <img src={userData?.imageUrl} width='100%' alt='imgurl' className='mt-3 rounded-lg' />
            :<span className=''><BsPersonFill size={300} /></span>}
        </span>
        
        
    </div>
    )
}
