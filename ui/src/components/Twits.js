/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import { BsPersonFill, BsChatTextFill } from 'react-icons/bs';
import { AiTwotoneLike, AiTwotoneDelete, AiFillHome } from 'react-icons/ai';
import { IoIosPeople } from 'react-icons/io';
import { RiChatNewLine } from 'react-icons/ri';
import TwitForm from './TwitForm';
import CommentForm from './CommentForm';
import { baseUrl } from '../helper';
import { Logout } from './GoogleAuth';
import Loader from 'react-loader-spinner';

export default function Twits() {
    const [error, setError] = useState('');
    const [twits, setTwits] = useState([]);
    const [formActive, setFormActive] = useState(false);
    const [sync, setSync] = useState(false);
    const [users, setUsers] = useState(0);

    const email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
    const img = localStorage.getItem('img') ? localStorage.getItem('img') : '';
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
        if(!token) {
            console.log('Not loggedin');
            return;
        }
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
                setTwits(res.data.data.map(x => {
                    x.formActive = false;
                    return x;
                }));
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

    const checkOpenForms = () => {
        console.log('checking open forms', twits.filter(twit => twit.formActive));
        let closedTwits = twits.map(twit => {
            twit.formActive = false;
            return twit;
        });
        setTwits(closedTwits);
        console.log('closing open forms', twits.filter(twit => twit.formActive));
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
        <div style={{fontFamily: 'Roboto', fontWeight: '600', height: '90vh'}} className='mb-5'>
            <span style={{cursor: 'pointer', borderRadius: '50%'}} className='fixed bottom-16 right-4 bg-green-500 p-4 text-white'><RiChatNewLine size={25} onClick={showForm} /></span>
            {formActive && <TwitForm error={error} showForm={showForm} sync={sync} setSync={setSync}/>}
            
            {!formActive && <>
            <p style={{fontFamily: 'Architects Daughter', fontWeight: '600'}} className='italic text-center mb-2'>
                <span style={{fontSize: '1.8em'}} className='text-purple-900 font-bold'>Twitee<br/>
                </span> 
                <span style={{fontSize: '1em'}}>.... Feel free, express yourself, network ....</span>
            </p>
            <div className='py-2 px-2 rounded bg-gray-100 mb-4 flex justify-between'>
                {img !== 'null' ? (
                    <span>
                        <img src={img} alt='Profile' style={{width: '30px', height: '30px', borderRadius: '50%'}} />
                    </span>) 
                    : <span className='text-left'><AiFillHome size={25} /></span>}
                {users > 0 && <span className='text-left flex'><IoIosPeople size={25}/>{users}</span>}
                {/* <span style={{cursor: 'pointer', borderRadius: '50%'}} className='sticky top-4  bg-green-300 p-2 text-white mr-4 -ml-6'><RiChatNewLine size={25} onClick={showForm} /></span> */}
                <span style={{cursor: 'pointer'}} className='text-right' onClick={logout}><Logout />
                </span>
            </div>
            <div className='w-full text-white-400 flex justify-between' onClick={showForm}>
                <span></span>
                {/* <span className='font-bold mb-4 italic'>Twits</span> */}
                {/* <span style={{cursor: 'pointer'}} className='sticky top-4 mr-4 -ml-6'><RiChatNewLine size={25} /></span> */}
            </div>
            {
                twits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((twit, idx) => 
                    <Twit key={idx} twit={twit} email={email} apiCallHook={apiCallHook} baseUrl={baseUrl} sync={sync} setSync={setSync} showForm={showForm} formActive={formActive} checkOpenForms={checkOpenForms} />
                )
            }
            </>}
        </div>
    )
}

const Twit = (props) => {
    const [commentFormActive, setCommentFormActive] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { twit: {id, title, text, imageUrl, twits, likes, comments, createdAt }, email, apiCallHook, baseUrl, sync, setSync, checkOpenForms } = props;

    // console.log(comments);
    const likeCount = likes.filter(like => like.isLiked).length;
    const showCommentForm = () => {
        setCommentFormActive(!commentFormActive);
        props.twit.formActive = !commentFormActive;
    }
    
    const likeTwit = () => {
        setLikeLoading(true);
        setTimeout(() => {
            setLikeLoading(false);
        }, 1000);
        // console.log('like twit with id: ', id);
        apiCallHook('POST', `${baseUrl}/likes/like/${id}`);
    }
    const commentTwit = () => {
        // console.log('comment twit with id: ', id);
        checkOpenForms();
        showCommentForm();
    }
    const deleteTwit = () => {
        // console.log('delete twit with id: ', id);
        setDeleteLoading(true);
        setTimeout(() => {
            setLikeLoading(false);
        }, 1000);
        apiCallHook('DELETE', `${baseUrl}/twits/${id}`);
    }


    return (
    <div  style={{backgroundColor: 'white', fontSize: '1.2em'}} className='bg-gray-200 rounded p-5 mb-2'>
        <p style={{fontWeight: '800', fontFamily: 'Architects Daughter'}} className='text-md text-center'>{title}</p>
        <span className='text-xs mb-2'>
            <Moment fromNow>{createdAt}</Moment>
        </span>
        <div  style={{fontFamily: 'Architects Daughter', fontWeight: '500'}} className='text-start'>{text}</div>
        <span>
            {imageUrl && <img src={imageUrl} width='100%' alt='imgurl' />}
        </span>
        <div style={{fontSize: '0.8em'}} className='text-xs text-gray-800 flex my-2'>
            <span className='mx-2 flex'>
                {twits.imageUrl ? (
                <span className='mr-1'>
                    <img src={twits.imageUrl} alt='Profile' style={{width: '20px', height: '20px', borderRadius: '50%'}} />
                </span>)
                : <BsPersonFill size={15}/>}
                {email === twits.email ? 'Me' : twits.username}
            </span>
            <span style={{cursor: 'pointer'}} className='mx-2 flex' onClick={() => likeTwit()}>
               {!likeLoading ? 
               <>
               <AiTwotoneLike color={likeCount > 0 ? 'blue' : 'gray'} size={15}/>
                <span className='text-xs'>{likeCount}</span>
                </>:
                <LoadSpan height={20} width={20} color='#00bfff' />}
            </span>
            <span style={{cursor: 'pointer'}} className='mx-2 flex' onClick={() => commentTwit()}>
                <BsChatTextFill size={15}/>
            </span>
            {email === twits.email &&
            <span style={{cursor: 'pointer'}} className='mx-2 flex hover:text-red-800' onClick={() => deleteTwit()}>
                {!deleteLoading ? 
                <AiTwotoneDelete size={15} color='red'/>:
                <LoadSpan height={20} width={20} color='#00bfff' />}
            </span>}
        </div>
        {commentFormActive && <CommentForm twitId={id} showCommentForm={showCommentForm} sync={sync} setSync={setSync}/>}

        {comments.length > 0 && 
                (<div className='mt-2 rounded'>
                    {comments.filter(comment => !comment.isDeleted).map((comment, idx) => (
                        <Comment key={idx} comment={comment} apiCallHook={apiCallHook} email={email} />
                    )
                )}
            </div>)
        }
    </div>
    )
}

const Comment = (props) => {
    const { comment: { id, text, usercomments, likecomments, createdAt }, email, apiCallHook } = props;

    const [likeLoading, setLikeLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const likeCount = likecomments?.filter(like => like.isLiked).length;
    const likeComment = () => {
        setLikeLoading(true);
        setTimeout(() => {
            setLikeLoading(false);
        }, 1000);
        apiCallHook('POST', `${baseUrl}/likecomments/like/${id}`);
    }
    const deleteComment = () => {
        setDeleteLoading(true);
        setTimeout(() => {
            setLikeLoading(false);
        }, 1000);
        // console.log('delete twit with id: ', id);
        apiCallHook('DELETE', `${baseUrl}/comments/${id}`);
    }

    return(
        <div className='bg-blue-300 mb-2 p-2 rounded'>
            <span className='text-xs mb-2'>
            <Moment fromNow>{createdAt}</Moment>
            </span>
            <p style={{fontFamily: 'Architects Daughter', fontWeight: '500', fontSize: '18px'}} className=''>{text}</p>
            <span style={{fontSize: '0.8em'}} className='mx-2 flex items-justify text-xs my-2'>
                {usercomments.imageUrl ? (
                <span className='mr-1'>
                    <img src={usercomments.imageUrl} alt='Profile' style={{width: '20px', height: '20px', borderRadius: '50%'}} />
                </span>)
                : <BsPersonFill size={15}/>}
                <span className=''>
                    {email === usercomments.email ? 'Me' : usercomments.username}
                </span>
                <span style={{cursor: 'pointer'}} className='mx-2 flex' onClick={() => likeComment()}>
                {!likeLoading ? 
                    <>
                    <AiTwotoneLike color={likeCount > 0 ? 'blue' : 'gray'} size={15}/>
                    <span className='text-xs'>{likeCount}</span>
                    </>:
                    <LoadSpan height={20} width={20} color='white' />}
                </span>
                {email === usercomments.email &&
                <span style={{cursor: 'pointer'}} className='mx-2 flex hover:text-red-800' onClick={() => deleteComment()}>
                {!deleteLoading ? 
                    <AiTwotoneDelete size={15} color='red'/>
                    :
                    <LoadSpan height={20} width={20} color='white' />}
                </span>}
            </span>
        </div>
    )
}

const LoadSpan = ({height, width, color}) => (
            <span 
            className='m-auto'>
                        <Loader 
                        type='ThreeDots'
                        color={color}
                        height={height} 
                        width={width} 
                        />
            </span>
            )