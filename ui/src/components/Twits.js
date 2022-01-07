/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import { BsPersonFill, BsChatTextFill, BsShareFill } from 'react-icons/bs';
import { AiTwotoneLike, AiTwotoneDelete, AiFillHome } from 'react-icons/ai';
import { IoIosPeople } from 'react-icons/io';
import { GrEdit } from 'react-icons/gr';
import { RiChatNewLine } from 'react-icons/ri';
import TwitForm from './TwitForm';
import CommentForm from './CommentForm';
import { baseUrl, frontendUrl } from '../helper';
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
                    <span style={{fontSize: '1em'}}>.... Feel free, express yourself, network ....</span>
                </p>
                <div className='py-2 px-2 rounded mb-4 flex justify-between'>
                    {img !== 'null' ? (
                        <span className= 'cursor-pointer'  onClick= {e => history.push(`/${email.split('@')[0]}`)}>
                            <img src={img} alt='Profile' style={{width: '30px', height: '30px', borderRadius: '50%'}} />
                        </span>) 
                        : <span className='text-left'><AiFillHome size={25} /></span>}
                    {users > 0 && <span className='text-left flex'><IoIosPeople size={25}/>{users}</span>}
                    
                    <span style={{cursor: 'pointer'}} className='text-right' onClick={logout}><Logout />
                    </span>
                </div>
                <div className=''>
                {
                    twits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((twit, idx) => 
                        <Twit key={idx} twit={twit} email={email} apiCallHook={apiCallHook} baseUrl={baseUrl} frontendUrl={frontendUrl} sync={sync} setSync={setSync} showForm={showForm} formActive={formActive} checkOpenForms={checkOpenForms} />
                    )
                }
                </div>
            </div>}
        </div>
    )
}

const Twit = (props) => {
    const { twit: {id, title, text, imageUrl, twits, likes, comments, createdAt, updatedAt }, email, apiCallHook, baseUrl, frontendUrl, sync, setSync, checkOpenForms } = props;
    const [commentFormActive, setCommentFormActive] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [storyText, setStoryText] = useState(text);
    const [editForm, setEditForm] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const history = useHistory();

    const handleStoryChange = (e) => {
        setStoryText(e.target.value);
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
        checkOpenForms();
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
            console.log('Link copied');
            setLinkCopied(true);
          return await navigator.clipboard.writeText(text);
        } else {
            console.log('Link copy is not supported');
        }
      }
    return (
    <div id={`${id}`} style={{fontSize: '1.1em'}} className='shadow-lg border border-gray-200 rounded p-5 mb-4'>
        <p className='flex justify-between mb-2'>
            <span></span>
            <span style={{fontFamily: 'Roboto Slab'}} className='text-xl font-bold self-center'>{title}</span>
            <span className={!linkCopied ? 'mr-2 mb-1 invisible text-xs self-end' : 'mr-2 mb-1 text-xs self-end'}>copied</span>
        </p>
        <span className='text-xs mb-5 flex justify-between'>
            <Moment fromNow>{createdAt}</Moment>
        <span className='flex'>
        {(email === twits.email) && !editForm && 
            <span className='cursor-pointer mr-3 hover:bg-blue-400 text-black hover:text-white p-2 -mt-2 rounded-full' onClick={() => editStory()}> 
                <GrEdit size={20} />
            </span>
        }
            <span className={linkCopied ? 'flex-col hover:bg-blue-400 rounded-full p-2 text-white bg-blue-900 cursor-pointer -mt-2 mr-3' : 'rounded-full hover:bg-blue-400 p-2 cursor-pointer -mt-2 mr-3'} onClick={() => copyTwitLink()}> 
                <BsShareFill size={20} />
            </span>
        </span>
        </span>
        {editForm && <div className='mb-5'>
                <textarea 
                    className='border-gray-200 border-2 p-2 mb-2 rounded bg-white-300 focus:outline-none'
                    style={{width: '100%'}}
                    cols={3}
                    rows={4}
                    maxLength={160}
                    value={storyText}
                    onChange={handleStoryChange}
                    required={true}
                    /><br />
                {!editLoading ? 
                 <>
                    <span 
                        className='cursor-pointer bg-gray-500 p-2 m-2 text-white rounded hover:bg-gray-400' onClick={() => editStory()}
                    > 
                        Cancel 
                    </span>
                    <span 
                    className='cursor-pointer bg-green-600 p-2 mb-2 text-white rounded hover:bg-green-400 hover:text-black' onClick={() => updateStory()}
                    > 
                        Update Story 
                    </span>
                </>
                :
                    <LoadSpan height={20} width={20} color='#00bfff' />}
                </div>}

        {!editForm && <div className='p-3 font-semibold'>{text}<br />
        {((new Date(updatedAt).getTime() - new Date(createdAt).getTime()) > 0) && <span className='text-xs'>Updated <Moment fromNow>{updatedAt}</Moment></span>}
        </div>}
        <span>
            {imageUrl && <img src={imageUrl} width='100%' alt='imgurl' className='rounded' />}
        </span>
        <div style={{fontSize: '0.8em'}} className='text-xs text-gray-800 flex mt-2'>
            <span className='mx-2 flex cursor-pointer'  onClick= {e => history.push(`/${twits.username}`)}>
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
    const history = useHistory();

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
        <div className='bg-blue-200 mb-2 p-2 rounded'>
            <span className='text-xs mb-2'>
            <Moment fromNow>{createdAt}</Moment>
            </span>
            <p className='p-3 font-semibold'>{text}</p>
            <span style={{fontSize: '0.8em'}} className='mx-2 flex items-justify text-xs mt-2'>
                {usercomments.imageUrl ?
                <span className='mr-1 cursor-pointer' onClick= {e => history.push(`/${usercomments.username}`)}>
                    <img src={usercomments.imageUrl} alt='Profile' style={{width: '20px', height: '20px', borderRadius: '50%'}} />
                </span>
                : <BsPersonFill size={15}/>}
                <span className='cursor-pointer' onClick= {e => history.push(`/${usercomments.username}`)}>
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