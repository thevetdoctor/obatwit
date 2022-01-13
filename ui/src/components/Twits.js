/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-target-blank  */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import { BsPersonFill, BsChatText } from 'react-icons/bs';
import { AiTwotoneDelete, AiFillHome } from 'react-icons/ai';
import { IoIosPeople } from 'react-icons/io';
import { MdContentCopy } from 'react-icons/md';
import { BiLike } from 'react-icons/bi';
import { GrEdit } from 'react-icons/gr';
import { RiChatNewLine } from 'react-icons/ri';
import TwitForm from './TwitForm';
import CommentForm from './CommentForm';
import { baseUrl, frontendUrl } from '../helper';
import { Logout } from './GoogleAuth';
import Loader from 'react-loader-spinner';
import store from '../redux/store';
import { useSelector } from 'react-redux';

export default function Twits() {
    const [error, setError] = useState('');
    const [formActive, setFormActive] = useState(false);
    const [sync, setSync] = useState(false);

    const {getState, dispatch} = store;
    const state = getState();
    const { twits, users, searchQuery, networkStatus } = useSelector(state => state);

    const email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
    const userId = localStorage.getItem('email') ? localStorage.getItem('userId') : '';
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

    const apiCallHook = async(method, url, data) => {
        await axios({
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
            setSync(!sync);
    }

    const getTwits = async() => {
        if(!token) {
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
                    setError(error.response?.data?.error);
                }
            });
            if(res && res.data.success) {
                dispatch({
                    type: 'SET_TWIT_DATA',
                    data: res.data.data
                });
                localStorage.setItem('twits', JSON.stringify(res.data.data.map(x => {
                    x.formActive = false;
                    return x;
                })));
            } else {
                setError('Please check your network');
                dispatch({
                    type: 'SET_TWIT_DATA',
                    data: JSON.parse(localStorage.getItem('twits'))
                });
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
                    setError(error.response?.data?.error);
                }
            });
            if(res && res.data.success) {
                dispatch({
                    type: 'SET_USER_COUNT',
                    data: res.data.data.count
                });
                localStorage.setItem('userCount', res.data.data.count);
            } else {
                setError('Error found');
                setError('Please check your network');
                dispatch({
                    type: 'SET_USER_COUNT',
                    data: JSON.parse(localStorage.getItem('userCount'))
                });
            }
    }

    const checkOpenForms = () => {
        let closedTwits = twits.map(twit => {
            twit.formActive = false;
            return twit;
        });
    }

useEffect(() => {
    if(!token) {
        history.push('/');
    }
    getUsers();
    return () => {
    }
}, []);

useEffect(() => {
    if(!token) {
        history.push('/');
    }
    getUsers();
    return () => {
    }
}, []);

useEffect(async() => {
    getTwits();

    return () => {
    }
}, [sync]);

useEffect(() => {
    setTimeout(() => {
        const id = window.location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) element.scrollIntoView();
      }, 0);
});

    return (
        <div style={{fontFamily: 'Roboto', fontWeight: '600', height: '90vh'}} className='mb-5 p-3'>
            <span style={{cursor: 'pointer', borderRadius: '50%'}} className='fixed bottom-16 right-4 bg-green-500 p-4 text-white'><RiChatNewLine size={25} onClick={showForm} /></span>
            {formActive && <TwitForm error={error} showForm={showForm} sync={sync} setSync={setSync}/>}
            
            {!formActive && 
            <div>
                <p style={{fontFamily: 'Architects Daughter', fontWeight: '300'}} className='italic text-center mb-2'>
                    <span style={{fontSize: '1.8em'}} className='text-purple-900 font-bold'>Twitee<br/>
                    </span> 
                    <span style={{fontSize: '1em'}}> Feel free, express yourself & network </span>
                </p>
                <div className='py-2 px-2 rounded mb-4 flex justify-between border-3 border shadow-md'>
                    {img !== 'null' ? (
                        <span className='cursor-pointer'  onClick= {e => history.push(`/${email.split('@')[0]}`)}>
                            {error ? <BsPersonFill size={25} />:
                            <img src={img} alt='Profile' style={{width: '30px', height: '30px', borderRadius: '50%'}} />}
                        </span>) 
                        : <span className='text-left'><AiFillHome size={25} /></span>}
                    {users > 0 && <span className='text-left flex cursor-pointer'  onClick= {e => history.push('people')}><IoIosPeople size={30}/><span className='pt-1 pl-1'>{users}</span></span>}
                    
                    <span style={{cursor: 'pointer'}} className='text-right' onClick={logout}><Logout />
                    </span>
                </div>
                {error && <div style={{fontFamily: 'Roboto', backgroundColor: 'white', fontWeight: 'bold'}} className='text-red-500 text-center py-2 m-1 rounded'>Please check your network !</div>}

                <div className=''>
                {
                    twits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((twit, idx) => 
                        <Twit key={idx} twit={twit} email={email} userId={userId} apiCallHook={apiCallHook} baseUrl={baseUrl} frontendUrl={frontendUrl} sync={sync} setSync={setSync} showForm={showForm} formActive={formActive} checkOpenForms={checkOpenForms} error={error} />
                    )
                }
                </div>
            </div>}
        </div>
    )
}

export const Twit = (props) => {
    let { twit: {id, title, text, imageUrl, twits, likes, comments, createdAt, updatedAt }, email, userId, apiCallHook, baseUrl, frontendUrl, sync, setSync, checkOpenForms, error } = props;
    const [commentFormActive, setCommentFormActive] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [storyText, setStoryText] = useState(text);
    const [editForm, setEditForm] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [more, setMore] = useState(false);
    const [viewComments, setViewComments] = useState(false);

    const history = useHistory();
    const filteredComments = comments.filter(comment => !comment.isDeleted);
    const handleStoryChange = (e) => {
        setStoryText(e.target.value);
    }

    let link;
    if(text.search('http') >= 0) {
        const http = text.split(' ').filter(x => x.search('http') >= 0);
        link = http[0].split('\n').filter(x => x.search('http') >= 0);
        text = text.replace(link, '')
    }
    const isLiked = (() => {
        const liked = likes.filter(like => like.userlikes.email === email && like.isLiked === true);
       return liked.length ? true : false;
    })();

    const showMore = () => {
        if(more) {
            setMore(false);
        } else {
            setMore(true);
        }
    }

    const showComments = () => {
        if(viewComments) {
            setViewComments(false);
        } else {
            setViewComments(true);
        }
    }

    const copyTwitLink = () => {
        clipboardCopy(`${frontendUrl}/#${id}`);
        setTimeout(() => {
            setLinkCopied(false);
        }, 1000);
    }

    const editStory = () => {
        setEditForm(!editForm);
        setStoryText(text);
    }
   
    const updateStory = () => {
        apiCallHook('PATCH', `${baseUrl}/twits/${id}`, {text: storyText});
        setEditLoading(true);
        setTimeout(() => {
            setEditLoading(false);
            setEditForm(false);
        }, 1000);
    }
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
        apiCallHook('POST', `${baseUrl}/likes/like/${id}`);
    }
    const commentTwit = () => {
        showCommentForm();
    }
    const deleteTwit = () => {
        setDeleteLoading(true);
        setTimeout(() => {
            setDeleteLoading(false);
        }, 1000);
        apiCallHook('DELETE', `${baseUrl}/twits/${id}`);
    }

    const clipboardCopy = async (text) => {
        if ('clipboard' in navigator) {
            setLinkCopied(true);
          return await navigator.clipboard.writeText(text);
        } else {
        }
      }

    return (
    <div id={`${id}`} style={{fontSize: '1.1em'}} className='shadow-lg border border-gray-200 rounded p-5 mb-4'>
        <p className='flex justify-between mb-2'>
            <span></span>
            <span style={{fontFamily: 'Roboto Slab'}} className='text-xl font-bold self-center'>{title}</span>
            <span className={!linkCopied ? 'mr-2 mb-1 invisible text-xs self-end' : 'mr-2 mb-1 text-xs self-end'}>copied</span>
        </p>
        <span className='text-xs mb-2 flex justify-between'>
            <Moment fromNow>{createdAt}</Moment>
            <span className='flex'>
            {(email === twits.email) && !editForm && 
                <span className='cursor-pointer mr-2 text-black p-2 -mt-2 rounded-full' onClick={() => editStory()}> 
                    <GrEdit size={15} />
                </span>
            }
                <span className={linkCopied ? 'flex-col rounded-full p-2 text-white bg-blue-900 cursor-pointer -mt-2 mr-1' : 'rounded-full p-2 cursor-pointer -mt-2 mr-1'} onClick={() => copyTwitLink()}> 
                    <MdContentCopy  size={15} />
                </span>
            </span>
        </span>
        {editForm && <div className='mb-5'>
                <textarea 
                    className='border-gray-200 border-2 p-2 mb-2 rounded bg-white-300 focus:outline-none text-black'
                    style={{width: '100%'}}
                    cols={3}
                    rows={4}
                    maxLength={550}
                    value={storyText}
                    onChange={handleStoryChange}
                    required={true}
                    /><br />
                {!editLoading ? 
                 <>
                    <span 
                        className='text-xs cursor-pointer bg-gray-500 p-2 m-2 text-white rounded hover:bg-gray-400' onClick={() => editStory()}
                    > 
                        Cancel 
                    </span>
                    <span 
                    className='text-xs cursor-pointer bg-green-600 p-2 mb-2 text-white rounded hover:bg-green-400 hover:text-black' onClick={() => updateStory()}
                    > 
                        Update Story 
                    </span>
                </>
                :
                    <LoadSpan height={20} width={20} color='#00bfff' />}
                </div>}

        {!editForm && <div style={{fontSize: '0.9em', lineHeight: 2}} className='mt-2'>
            {text.length > 100 ? text.slice(0, 100) : text}{link && <a className='underline' href={link} target='_blank'>link</a>}
            {more ? 
                <>{text.slice(100)}
                    <>{text.length > 100 && 
                        <span style={{color: 'gray', fontWeight: '0.3em'}} className='cursor-pointer' onClick={showMore}>
                            ...<span className='underline'>See less</span>
                        </span>
                        }
                    </>
                </> :
                <>
                    {text.length > 100 && 
                        <span style={{color: 'gray', fontWeight: '0.3em'}} className='cursor-pointer' onClick={showMore}>
                            ...<span className='underline'>See more</span>
                        </span>
                    }
                </>
            }
        
        <br />
        {((new Date(updatedAt).getTime() - new Date(createdAt).getTime()) > 0) && <span className='text-xs'>Updated <Moment fromNow>{updatedAt}</Moment></span>}
        </div>}
        <span>
            {imageUrl && <img style={{width: "100%", height: 250}} src={imageUrl} alt='imgurl' className='rounded' />}
        </span>
        {/* likes and comments count section */}
            {(likeCount > 0 || comments.length > 0) && 
            <div className='flex text-xs p-1 px-3 mt-1 -mx-4'>
                {likeCount > 0 && <span className='mr-2'>{likeCount}{' '} {likeCount > 1 ? 'likes' : 'like'} </span>}
                {filteredComments.length > 0 && <span className=''>{filteredComments.length}{' '} {filteredComments.length > 1 ? 'comments' : 'comment'} </span>}
            </div>}

        {/*  */}
        <div style={{fontSize: '0.9em'}} className='justify-between text-gray-800 flex mt-1 pt-2 -mb-3 -ml-5 -mr-5 pt-1 border-t-2'>
            <span className='mx-1 flex cursor-pointer'  onClick= {e => history.push(`/${twits.username}`)}>
                {twits.imageUrl ? (
                <span className='mr-1'>
                    {error ? <BsPersonFill size={18}/>:
                    <img src={twits.imageUrl} alt='Profile' style={{width: '20px', height: '20px', borderRadius: '50%'}} />}
                </span>)
                : <BsPersonFill size={18}/>}
                {email === twits.email ? 'Me' : twits.username}
            </span>
            <span className='flex'>
            <span style={{cursor: 'pointer'}} className='mx-2 flex' onClick={() => likeTwit()}>
               {!likeLoading ? 
               <>
               <span className={isLiked ? 'text-blue-500' : 'text-gray-500'}><BiLike size={20}/></span>
                </>:
                <LoadSpan height={20} width={18} color='#00bfff' />}
            </span>
            <span style={{cursor: 'pointer'}} className='mx-2 flex text-gray-500' onClick={() => commentTwit()}>
                <BsChatText size={18}/>
            </span>
            {email === twits.email &&
            <span style={{cursor: 'pointer'}} className='mx-2 flex hover:text-red-800' onClick={() => deleteTwit()}>
                {!deleteLoading ? 
                <AiTwotoneDelete size={20} color='red'/>:
                <LoadSpan height={20} width={20} color='#00bfff' />}
            </span>}
            </span>
        </div>
        {commentFormActive && <CommentForm twitId={id} showCommentForm={showCommentForm} sync={sync} setSync={setSync}/>}
        
        {filteredComments.length > 0 &&
        <div className='mt-5'><span className='text-xs mt-4 -mb-2 cursor-pointer shadow-sm border-2 p-2' onClick={showComments}>{viewComments ? 'Hide Comments' : 'View Comments'}</span></div>
        }
        {viewComments && 
            <>{comments.length > 0 && 
                    (<div className='mt-4 rounded'>
                        {filteredComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((comment, idx) => (
                            <Comment key={idx} comment={comment} apiCallHook={apiCallHook} email={email} userId={userId} />
                        )
                    )}
                </div>)
            }</>
        }
    </div>
    )
}

const Comment = (props) => {
    const { comment: { id, text, usercomments, likecomments, createdAt }, email, userId, apiCallHook } = props;

    const [likeLoading, setLikeLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [more, setMore] = useState(false);
    const history = useHistory();

    const showMore = () => {
        if(more) {
            setMore(false);
        } else {
            setMore(true);
        }
    }

    const isLiked = (() => {
        const liked = likecomments.filter(like => like.userId === userId && like.isLiked === true);
       return liked.length ? true : false;
    })();

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
        apiCallHook('DELETE', `${baseUrl}/comments/${id}`);
    }

    return(
        <div className='border border-gray-200 shadow-lg mb-2 p-1 rounded'>
            <span className='text-xs mb-2 ml-2'>
            <Moment fromNow>{createdAt}</Moment>
            </span>
            <p style={{fontSize: '0.9em', lineHeight: 2}} className='p-2 font-semibold'>
            {text.length > 100 ? text.slice(0, 100) : text}
            {more ? 
                <>{text.slice(100)}
                    <>{text.length > 100 && 
                        <span style={{color: 'gray', fontWeight: '0.3em'}} className='cursor-pointer' onClick={showMore}>
                            ...<span className='underline'>See less</span>
                        </span>
                        }
                    </>
                </> :
                <>
                    {text.length > 100 && 
                        <span style={{color: 'gray', fontWeight: '0.3em'}} className='cursor-pointer' onClick={showMore}>
                            ...<span className='underline'>See more</span>
                        </span>
                    }
                </>
            }
            </p>

        {/* likes and comments count section */}

        {/* TODO refactor for replies count */}
        {(likeCount > 0) && 
            <div className='flex text-xs p-1 px-3 mt-1 -mx-1'>
                {likeCount > 0 && <span className='mr-2'>{likeCount}{' '} {likeCount > 1 ? 'likes' : 'like'} </span>}
                {/* TODO refactor for replies count */}
            </div>}

        {/*  */}
            <div style={{fontSize: '0.9em'}} className='flex justify-between text-gray-800 flex mt-1 mb-1 pt-2 -ml-1 -mr-1 border-t-2 border-gray-200'>
                <span className='mx-1 flex cursor-pointer'  onClick= {e => history.push(`/${usercomments.username}`)}>
                    {usercomments.imageUrl ? (
                    <span className='mr-1'>
                        {'error' ? <BsPersonFill size={20}/>:
                        <img src={usercomments.imageUrl} alt='Profile' style={{width: '20px', height: '20px', borderRadius: '50%'}} />}
                    </span>)
                    : <BsPersonFill size={20}/>}
                    {email === usercomments.email ? 'Me' : usercomments.username}
                </span>
                <span className='flex'>
                <span style={{cursor: 'pointer'}} className='mx-2 flex' onClick={() => likeComment()}>
                {!likeLoading ? 
                <>
                <span className={isLiked ? 'text-blue-500' : 'text-gray-500'}><BiLike size={20}/></span>
                    </>:
                    <LoadSpan height={20} width={18} color='#00bfff' />}
                </span>
                {/* TODO Implement reply comment component */}
             
                {email === usercomments.email &&
                <span style={{cursor: 'pointer'}} className='mx-2 flex hover:text-red-800' onClick={() => deleteComment()}>
                    {!deleteLoading ? 
                    <AiTwotoneDelete size={20} color='red'/>:
                    <LoadSpan height={20} width={20} color='#00bfff' />}
                </span>}
                </span>
            </div>
        </div>
    )
}

export const LoadSpan = ({height, width, color}) => (
            <span 
            className='m-auto mr-4'>
                        <Loader 
                        type='ThreeDots'
                        color={color}
                        height={height} 
                        width={width} 
                        />
            </span>
            )