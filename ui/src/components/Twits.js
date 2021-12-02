/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import { BsPersonFill, BsChatTextFill, BsFillChatDotsFill } from 'react-icons/bs';
import { AiTwotoneLike, AiTwotoneDelete, AiFillHome } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { IoIosPeople } from 'react-icons/io';
import TwitForm from './TwitForm';
import CommentForm from './CommentForm';
import { baseUrl } from '../helper';

export default function Twits() {
    const [error, setError] = useState('');
    const [twits, setTwits] = useState([]);
    const [formActive, setFormActive] = useState(false);
    const [sync, setSync] = useState(false);
    const [users, setUsers] = useState(0);

    const email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
    const history = useHistory();
    const token = localStorage.getItem('token');

    const apiUrl = `${baseUrl}/twits`;

    const showForm = () => {
        setFormActive(!formActive);
    }

    const logout = () => {
        localStorage.removeItem('token');
        history.push('/');
    }

    const apiCallHook = async(method, url) => {
        await axios({
            method,
            url,
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
            setSync(!sync);
    }

    const getTwits = async() => {
        const res = await axios({
            method: 'GET',
            url: `${apiUrl}`,
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
                setTwits(res.data.data);
            } else {
                console.log('Error found'); 
                setError('Error found');
            }
    }

    const getUsers = async() => {
        const res = await axios({
            method: 'GET',
            url: `${baseUrl}/auth/users`,
            headers: {
                'Content-Type': 'application/json'
            }
            })
            .catch(error => {
                if(error.isAxiosError) {
                    console.log(error.isAxiosError);
                }
            });
            if(res && res.data.success) {
                setUsers(res.data.data.count);
            } else {
                console.log('Error found');
                setError('Error found');
            }
    }

useEffect(() => {
    if(!token) {
        history.push('/');
    }
    getUsers();
    return () => {
        console.log('cleanup twits 1');
    }
}, []);

useEffect(async() => {
    getTwits();

    return () => {
        console.log('cleanup twits 2');
    }
}, [sync]);
    
    return (
        <div className='mb-5'>
            {formActive && <TwitForm error={error} showForm={showForm} sync={sync} setSync={setSync}/>}
            <p className='italic text-white-700 font-medium text-center'><span className='text-purple-900 font-bold text-xl'>Twitee</span> .... Feel free, express yourself, network ....</p>
            <p className='py-2 px-2 rounded bg-blue-300 mb-4 flex justify-between'>
                <span className='text-left'><AiFillHome /></span>
                {users > 0 && <span className='text-left flex'><IoIosPeople size={25}/>{users}</span>}
                <span style={{cursor: 'pointer'}} className='text-right' onClick={logout}>
                    <FiLogOut />
                </span>
            </p>
            <div style={{cursor: 'pointer'}} className='w-full text-white-400 flex justify-between' onClick={showForm}>
                <span></span>
                <span className='font-bold mb-4 italic'>Twits</span>
                <span style={{position: '-webkit-sticky'}} className='sticky top-4 mr-4 -ml-6'><BsFillChatDotsFill size={25} /></span>
            </div>
            {
                twits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((twit, idx) => 
                    <Twit key={idx} twit={twit} email={email} apiCallHook={apiCallHook} baseUrl={baseUrl} sync={sync} setSync={setSync} showForm={showForm} formActive={formActive}/>
                )
            }
        </div>
    )
}

const Twit = (props) => {
    const [commentFormActive, setCommentFormActive] = useState(false);

    const { twit: {id, title, text, twits, likes, comments, createdAt }, email, apiCallHook, baseUrl, sync, setSync } = props;

    const likeCount = likes.filter(like => like.isLiked).length;
    const showCommentForm = () => {
        setCommentFormActive(!commentFormActive);
    }

    const likeTwit = () => {
        console.log('like twit with id: ', id);
        apiCallHook('POST', `${baseUrl}/likes/like/${id}`);
    }
    const commentTwit = () => {
        console.log('comment twit with id: ', id);
        showCommentForm();
    }
    const deleteTwit = () => {
        console.log('delete twit with id: ', id);
        apiCallHook('DELETE', `${baseUrl}/twits/${id}`);
    }


    return (
    <div className='bg-blue-100 rounded p-5 mb-2'>
        <p className='font-bold text-center'>{title}</p>
        <span className='text-xs mb-2'>
            <Moment fromNow>{createdAt}</Moment>
        </span>
        <p className='font-sans antialiased'>{text}</p>
        <p className='text-xs text-gray-800 flex my-2'>
            <span className='mx-2 flex'><BsPersonFill size={15}/> {email === twits.email ? 'Me' : twits.username}</span>
            <span style={{cursor: 'pointer'}} className='mx-2 flex' onClick={() => likeTwit()}>
                <AiTwotoneLike color={likeCount > 0 ? 'blue' : 'gray'} size={15}/><span className='text-xs'>{likeCount}</span>
            </span>
            {/* <span className='flex'><FcLike size={15}/></span> */}
            {/* <span className='flex'><FcLike size={15}/></span> */}
            <span style={{cursor: 'pointer'}} className='mx-2 flex' onClick={() => commentTwit()}>
                <BsChatTextFill size={15}/>
            </span>
            {email === twits.email &&
            <span style={{cursor: 'pointer'}} className='mx-2 flex hover:text-red-800' onClick={() => deleteTwit()}>
                <AiTwotoneDelete size={15}/>
            </span>}
        </p>
        {commentFormActive && <CommentForm twitId={id} showCommentForm={showCommentForm} sync={sync} setSync={setSync}/>}

        {comments.length > 0 && 
                (<div className='mt-2 rounded'>
                    {comments.map((comment, idx) => 
                        <Comment key={idx} comment={comment} email={email}/>
                )}
            </div>)
        }
    </div>
    )
}

const Comment = (props) => {
    const { comment: { text, usercomments, createdAt }, email } = props;
    return(
        <div className='bg-green-300 mb-2 p-2 rounded'>
            <span className='text-xs mb-2'>
            <Moment fromNow>{createdAt}</Moment>
            </span>
            <p>{text}</p>
            <span className='mx-2 flex items-justify text-xs'>
                <BsPersonFill size={15}/>
                <span className=''>
                    {email === usercomments.email ? 'Me' : usercomments.username}
                </span>
            </span>
        </div>
    )
}