/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { IoCloseCircle } from 'react-icons/io5';
import { BsPersonFill } from 'react-icons/bs';
import { IoIosPeople } from 'react-icons/io';
import Moment from 'react-moment';
import axios from 'axios';
import { baseUrl } from '../helper';
import { LoadSpan } from './Twits';

export default function People() {
    const [ userData, setUserData ] = useState({});
    const [ peopleData, setPeopleData ] = useState([]);
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
                    setPeopleData(res.data.data.users);
                    // console.log(res.data.data.users);
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
        apiCallHook('GET', `${baseUrl}/auth/users`);
        return () => {
            console.log('cleanup people page');
        }
    }, [sync]);
    return (
        <div id={`${user}`} style={{fontSize: '1.1em'}} className='shadow-lg border border-gray-200 bg-gray-200 h-full rounded p-5 mb-4'>
        <p className='flex justify-between mb-2'>
            <span className='text-left'><IoIosPeople size={25} /></span>
            <span style={{fontFamily: 'Roboto Slab'}} className='text-xl font-bold self-center'>People</span>
            <span className='text-left bg-black-400 cursor-pointer hover:invisible' onClick={() => history.push("/twits")}><IoCloseCircle size={35} /></span>
        </p>
        <span className='text-sm mt-3 mb-5'>
        </span>
        <div className='flex flex-col text-md'>
            {peopleData.sort((a, b) => a.email.localeCompare(b.email)).map((person, idx) => (
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
    </div>
    )
}
