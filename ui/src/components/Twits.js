/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-target-blank  */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import { BsPersonFill, BsChatText, BsBox } from 'react-icons/bs';
import { AiFillLike, AiTwotoneDelete, AiFillHome } from 'react-icons/ai';
import { IoIosPeople, IoMdClose } from 'react-icons/io';
import { MdContentCopy, MdEdit, MdEmail, MdMessage } from 'react-icons/md';
import { BiMessage, BiMessageSquare, BiMessageX } from 'react-icons/bi';
import { GrEdit } from 'react-icons/gr';
import { RiArrowDownLine, RiArrowUpLine, RiChatNewLine } from 'react-icons/ri';
import TwitForm from './TwitForm';
import CommentForm from './CommentForm';
import Image from './Image';
import { baseUrl, frontendUrl } from '../helper';
import { Logout } from './GoogleAuth';
import Loader from 'react-loader-spinner';
import store from '../redux/store';
import { useSelector } from 'react-redux';
import { FaEllipsisV, FaRegComment } from 'react-icons/fa';

export default function Twits() {
    const [error, setError] = useState('');
    // const [formActive, setFormActive] = useState(false);
    const [sync, setSync] = useState(false);

    const {getState, dispatch} = store;
    const state = getState();
    const { twits, users, formActive } = useSelector(state => state);

    const email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
    const username = localStorage.getItem('username') ? localStorage.getItem('username') : '';
    const userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : '';
    const img = localStorage.getItem('img') ? localStorage.getItem('img') : '';
    const history = useHistory();
    const token = localStorage.getItem('token');

    const apiUrl = `${baseUrl}/twits`;

    const showForm = () => {
        dispatch({
            type: 'SET_FORM_ACTIVE',
            data: !formActive
        });
        // setFormActive(!formActive);
    }

    const logout = () => {
        localStorage.removeItem('token');
        history.push('/');
    }

    // if(!token) {
    //     console.log(window.location.hash)
    //     history.push('/');
    // }

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
                dispatch({
                    type: 'SET_PEOPL_DATA',
                    data: res.data.data.users
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
    localStorage.setItem('hash', window.location.hash);
    if(!token) {
        // console.log(window.location.hash)
        return history.push('/');
    }
    getUsers();
    return () => {}
}, []);

useEffect(() => {
    if(token) {
        getTwits();
    }

    return () => {}
}, [sync]);

useEffect(() => {
    if(token) {
        setTimeout(() => {
            const hash = localStorage.getItem('hash');
            let id = '';
            // if(hash) {
            //     id = hash.replace('#', '');
                // console.log('hash found', hash)
            // } else {
                id = window.location.hash.replace('#', '');
            // }
            const element = document.getElementById(id);
            if (element) element.scrollIntoView();
        }, 0);
    }
    return () => {}
}, [twits]);

return (
    <div style={{fontFamily: 'Roboto', fontWeight: '600', height: '90vh'}} className='mb-5 p-3 m-auto flex justify-center md:w-1/2'>
        <span style={{cursor: 'pointer', borderRadius: '50%'}} className='text-xs mb-3 fixed bottom-9 right-2 bg-green-500 px-5 py-3 text-white'><RiChatNewLine size={25} onClick={showForm} />post</span>
        {/* <span style={{cursor: 'pointer', borderRadius: '50%'}} className='text-xs fixed bottom-5 right-4 bg-purple-500 px-5 py-3 text-white'><RiArrowUpLine size={20} onClick={showForm} />top</span> */}
        {formActive && <TwitForm error={error} showForm={showForm} sync={sync} setSync={setSync}/>}
        
        {!formActive && 
        <div>
            <div className='flex justify-center m-auto -mt-3 p-2 md:w-1/2 flex-col'>
                <p style={{marginTop: '3em'}} className='text-center mb-2 grow'>
                <span style={{fontFamily: 'Architects Daughter', fontSize: '1.8em'}} className='text-purple-900 font-bold italic'>Buzz<br/>
                </span> 
                <span style={{fontSize: '1em'}}> Feel free, express yourself & network </span>
                </p> 

                <div style={{top: '0em', margin: 'auto'}} className='p-2 rounded mb-2 flex justify-between border-3 border shadow-md fixed right-0 left-0 bg-white md:w-1/2'>
                    {img !== 'null' ? (
                        <span className='cursor-pointer'  onClick= {e => history.push(`/${username}`)}>
                            {error ? <BsPersonFill size={25} />:
                            <img src={img} alt='Profile' style={{width: '30px', height: '30px', borderRadius: '50%'}} />}
                        </span>) 
                        : <span className='text-left cursor-pointer'><BsPersonFill size={25} onClick={e => history.push(`/${username}`)} /></span>}
                    <span className='text-left flex cursor-pointer'  onClick= {e => history.push('people')}><IoIosPeople size={30}/><span className='pt-1 pl-1'>{users > 0 && users}</span></span>
                    
                    <span style={{cursor: 'pointer'}} className='text-right' onClick={() => logout()}><Logout />
                    </span>
                </div>

                <div style={{bottom: '0em', margin: 'auto'}} className='p-2 rounded flex justify-around border-3 border shadow-md fixed right-0 left-0 bg-white md:w-1/2'>
                <span className='cursor-pointer pt-2 border-t-2 border-black' onClick={() => history.push("/twits")}>
                    <AiFillHome size={25} color='black' />
                </span>
                {img !== 'null' ? (
                            <span className='cursor-pointer pt-1'  onClick= {e => history.push('/twits')}>
                                {error ? <BsPersonFill size={25} color='gray' />:
                                <img src={img} alt='Profile' style={{width: '30px', height: '30px', borderRadius: '50%'}} />}
                            </span>) 
                            : <span className='cursor-pointer pt-2'><BsPersonFill size={25} color='gray' onClick={e => history.push('/twits')} /></span>}
                <span className='cursor-pointer pt-1' onClick= {e => history.push('/people')}>
                    <IoIosPeople size={30} color='gray'/>
                </span>
                {/* <span className='cursor-pointer pt-1'>
                    <RiChatNewLine size={25} color='gray' onClick={showForm} />
                </span> */}

                <span className='cursor-pointer pt-1'  onClick= {e => history.push(`/chats/${username}`)}><MdEmail size={25} color='gray' />
                </span>
            </div>
                {error && <div style={{fontFamily: 'Roboto', backgroundColor: 'white', fontWeight: 'bold'}} className='text-red-500 text-center py-1 m-0 rounded border-3 -mx-2 md:w-300'>Please check your network !</div>}
            </div>

            {/* <Bars color="#00BFFF" height={80} width={80} /> */}
            {twits.length < 1 ? 
            <div className='flex justify-center items-center pt-8 m-auto'>
                <Loader 
                type='Bars'
                color='#00bfff'
                height={80} 
                width={80} 
            />
            </div>:
            <div className=''>
            {
                twits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((twit, idx) => 
                    <Twit key={idx} twit={twit} email={email} userId={userId} apiCallHook={apiCallHook} baseUrl={baseUrl} frontendUrl={frontendUrl} sync={sync} setSync={setSync} showForm={showForm} formActive={formActive} checkOpenForms={checkOpenForms} error={error} />
                )
            }
            </div>}
        </div>}
    </div>
    )
}

export const Twit = (props) => {
    let { twit: {id, text, imageUrl, twits, likes, comments, createdAt, updatedAt }, email, userId, apiCallHook, baseUrl, frontendUrl, sync, setSync, checkOpenForms, error } = props;
    const [commentFormActive, setCommentFormActive] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    // const [likeLoading, setLikeLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [storyText, setStoryText] = useState(text);
    const [editForm, setEditForm] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [more, setMore] = useState(false);
    const [viewComments, setViewComments] = useState(false);
    const [show, setShow] = useState(false);
    const [sourceData, setSourceData] = useState({});
    const [menuShow, setMenuShow] = useState(false);
    
    
    const history = useHistory();
    const likeCount = likes.filter(like => like.isLiked).length;
    const filteredComments = comments.filter(comment => !comment.isDeleted);
    const isLiked = (() => {
        const liked = likes.filter(like => like.userlikes.email === email && like.isLiked === true);
       return liked.length ? true : false;
    })();

    const [llikeCount, setLikeCount] = useState(likeCount);
    const [lfilteredComents, setFilteredComments] = useState(filteredComments);
    const [lisLiked, setIsLiked] = useState(isLiked);

    const handleStoryChange = (e) => {
        setStoryText(e.target.value);
    }

    let link;
    if(text.search('http') >= 0) {
        const http = text.split(' ').filter(x => x.search('http') >= 0);
        link = http[0].split('\n').filter(x => x.search('http') >= 0);
        text = text.replace(link, '')
    }

    const showMenu = () => {
        if(menuShow) {
            setMenuShow(false);
        } else {
            setMenuShow(true);
        }
    }

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
        setMenuShow(false);
    }

    const editStory = () => {
        setEditForm(!editForm);
        setStoryText(text);
        setMenuShow(false);
    }
   
    const updateStory = () => {
        apiCallHook('PATCH', `${baseUrl}/twits/${id}`, {text: storyText});
        setEditLoading(true);
        setTimeout(() => {
            setEditLoading(false);
            setEditForm(false);
        }, 1000);
    }
    const showCommentForm = () => {
        setCommentFormActive(!commentFormActive);
        props.twit.formActive = !commentFormActive;
    }
    
    const likeTwit = () => {
        if(lisLiked) {
            setIsLiked(!lisLiked);
            setLikeCount(likeCount - 1);
        } else {
            setIsLiked(!lisLiked);
            setLikeCount(likeCount + 1);
        }

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
    
    const handleShow = (source) => {
        console.log(source);
        setShow(!show);
        setSourceData(source);
    }

    return (
    <div id={`${id}`} style={{fontSize: '1.1em'}} className='shadow-lg border-2 border-gray-200 rounded-lg px-4 pb-4 mb-4'>
        <p className='flex justify-between mb-2'>
            <span></span>
            {/* <span style={{fontFamily: 'Roboto Slab'}} className='text-xl font-bold self-center'>{title}</span> */}
            <span className={!linkCopied ? 'mr-2 mb-1 invisible text-xs self-end' : 'mr-2 mb-1 text-xs self-end'}>copied</span>
        </p>
        <span className='text-xs mb-2 -mt-2 flex justify-between'>
            <Moment fromNow>{createdAt}</Moment>
            <span className='flex'>
            {menuShow &&
                <>
                {(email === twits.email) && !editForm && 
                    <>
                    <span className={`flex flex-col cursor-pointer mr-2 p-2 -mt-2 rounded-full text-gray-500 ${menuShow ? '' : 'invisible'}`} onClick={() => editStory()}> 
                        <span className='m-auto mb-2'><MdEdit size={15} /></span><span>Edit</span>
                    </span>
                    <span className='cursor-pointer flex-col mr-2 p-2 -mt-2 flex' onClick={() => deleteTwit()}>
                        {!deleteLoading ? 
                        <><span className='m-auto mb-2'><AiTwotoneDelete size={15} color='red'/></span><span>Clear</span></>:
                        <LoadSpan height={20} width={20} color='#00bfff' />}
                    </span>
                    </>
                }
                <span className={linkCopied ? 'justify-center flex flex-col rounded-full p-2 text-white bg-blue-900 cursor-pointer -mt-2 mr-0' : `justify-center flex flex-col rounded-full p-2 cursor-pointer -mt-2 mr-0 text-gray-500 ${menuShow ? '' : 'invisible'}`} onClick={() => copyTwitLink()}> 
                    <span className='m-auto mb-2'><MdContentCopy size={15} /></span><span>Copy</span>
                </span>
                </>}
                <span className={'justify-center flex flex-col rounded-full p-2 cursor-pointer -mt-2 mr-0 text-gray-500'} onClick={() => showMenu()}> 
                    {!menuShow ? 
                    <>
                        <span className='m-auto mb-2'><FaEllipsisV size={15} /></span><span>More</span>
                    </>
                    :
                    <>
                        <span className='m-auto mb-2'><IoMdClose size={15} /></span><span>Hide</span>
                    </>}
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
            {text.length > 100 ? 
                text.slice(0, 100) 
                : 
                <>{text} {link && <a className='underline' href={link} target='_blank'>link</a>}</>
            }
            {more ? 
                <>{text.slice(100)}
                    <>{text.length > 100 && 
                        <span className='cursor-pointer' onClick={showMore}>
                           {link && <a className='underline' href={link} target='_blank'>link</a>} 
                           ...<span style={{fontStyle: 'italic', fontWeight: '0.3em'}} className='underline'>See less</span>
                        </span>
                        }
                    </>
                </> :
                <>
                    {text.length > 100 && 
                        <span style={{fontStyle: 'italic', fontWeight: '0.3em'}} className='cursor-pointer' onClick={showMore}>
                            ...<span className='underline'>See more</span>
                        </span>
                    }
                </>
            }
        
        <br />
        {((new Date(updatedAt).getTime() - new Date(createdAt).getTime()) > 0) && <span className='text-xs'>Updated <Moment fromNow>{updatedAt}</Moment></span>}
        </div>}
        <span>
            {/* {imageUrl && <img style={{width: "100%"}} src={imageUrl} onClick={() => handleShow()} alt='imgurl' className='rounded max-h-72 cursor-pointer' />} */}
            {imageUrl && <img style={{width: "100%"}} src={imageUrl} alt='imgurl' className='rounded max-h-100 cursor-pointer' />}
        </span> 
        <Image show={show} handleShow={handleShow} sourceData={sourceData} />
        {/* likes and comments count section */}
            {(llikeCount > 0 || comments.length > 0) && 
            <div className='flex text-xs p-1 px-3 mt-1 -mx-4'>
                {llikeCount > 0 && <span className='mr-2'>{llikeCount}{' '} {llikeCount > 1 ? 'likes' : 'like'} </span>}
                <span onClick={showComments}>
                {filteredComments.length > 0 && <span className='cursor-pointer'>{filteredComments.length}{' '} {filteredComments.length > 1 ? 'comments' : 'comment'} </span>}
                </span>
            </div>}

        {/*  */}
        <div className='justify-between text-gray-800 flex mt-1 pt-2 px-3 -mb-3 -mx-5 border-t-2'>
            <span className='mx-1 flex cursor-pointer'  onClick= {e => history.push(`/${twits.username}`)}>
                {twits.imageUrl ? (
                <span className='mr-1'>
                    {(error || twits.imageUrl === 'null') ? <BsPersonFill size={30}/>:
                    <img src={twits.imageUrl} alt='Profile' style={{width: '30px', height: '30px', borderRadius: '50%'}} />}
                </span>) 
                : <BsPersonFill size={30}/>}
                <span className='text-md pt-1 text-blue-600 underline'>{email === twits.email ? 'Me' : `@${twits.username}`}</span>
            </span>
            <span className='flex'> 
                <span style={{cursor: 'pointer'}} className='flex flex-col text-xs mx-2' onClick={() => likeTwit()}>
                    <span className={lisLiked ? 'text-blue-500 m-auto' : 'text-gray-500 m-auto'}><AiFillLike size={18}/></span><span>Like</span>
                </span> 
                <span className='text-xs cursor-pointer mx-2 flex text-gray-500 flex-col' onClick={() => commentTwit()}>
                    <span className='m-auto'><FaRegComment size={16}/></span><span>Comment</span>
                </span>
                {/* {email === twits.email &&
                <span className='cursor-pointer flex-col text-xs mx-2 flex' onClick={() => deleteTwit()}>
                    {!deleteLoading ? 
                    <><span className='m-auto'><AiTwotoneDelete size={18} color='red'/></span><span>Clear</span></>:
                    <LoadSpan height={20} width={20} color='#00bfff' />}
                </span>} */}
            </span>
        </div>
        {commentFormActive && <CommentForm twitId={id} showCommentForm={showCommentForm} sync={sync} setSync={setSync}/>}
        
        {/* {filteredComments.length > 0 &&
        <div className='mt-5'><span className='text-xs mt-4 -mb-2 cursor-pointer shadow-sm border-2 p-2' onClick={showComments}>{viewComments ? 'Hide Comments' : 'View Comments'}</span></div>
        } */}
        {viewComments && 
            <>{comments.length > 0 && 
                    (<div className='mt-4 rounded'>
                        {filteredComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((comment, idx) => (
                            <Comment key={idx} comment={comment} apiCallHook={apiCallHook} email={email} userId={userId} error={error} />
                        )
                    )}
                </div>)
            }</>
        }
    </div>
    )
}

const Comment = (props) => {
    let { comment: { id, text, usercomments, likecomments, createdAt }, email, userId, apiCallHook, error } = props;

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

    const [llikeCount, setLikeCount] = useState(likeCount);
    const [lisLiked, setIsLiked] = useState(isLiked);

    let link;
    if(text.search('http') >= 0) {
        const http = text.split(' ').filter(x => x.search('http') >= 0);
        link = http[0].split('\n').filter(x => x.search('http') >= 0);
        text = text.replace(link, '')
    }

    const likeComment = () => {
        // setLikeLoading(true);
        // setTimeout(() => {
        //     setLikeLoading(false);
        // }, 1000);
        if(lisLiked) {
            setIsLiked(!lisLiked);
            setLikeCount(likeCount - 1);
        } else {
            setIsLiked(!lisLiked);
            setLikeCount(likeCount + 1);
        }
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
            {/* {text.length > 100 ? text.slice(0, 100) : text} */}
            {text.length > 100 ? 
                text.slice(0, 100) 
                : 
                <>{text} {link && <a className='underline' href={link} target='_blank'>link</a>}</>
            }

            {more ? 
                <>{text.slice(100)}
                    <>{text.length > 100 && 
                        <span style={{color: 'gray', fontWeight: '0.3em'}} className='cursor-pointer' onClick={showMore}>
                            {link && <a className='underline' href={link} target='_blank'>link</a>}
                            ...<span className='italic underline'>See less</span>
                        </span>
                        }
                    </>
                </> :
                <>
                    {text.length > 100 && 
                        <span style={{color: 'gray', fontWeight: '0.3em'}} className='cursor-pointer' onClick={showMore}>
                            ...<span className='italic underline'>See more</span>
                        </span>
                    }
                </>
            }
            </p>

        {/* likes and comments count section */}

        {/* TODO refactor for replies count */}
        {(llikeCount > 0) && 
            <div className='flex text-xs p-1 px-3 mt-1 -mx-1'>
                {llikeCount > 0 && <span className='mr-2'>{llikeCount}{' '} {llikeCount > 1 ? 'likes' : 'like'} </span>}
                {/* TODO refactor for replies count */}
            </div>}

        {/*  */}
            <div style={{fontSize: '0.9em'}} className='flex justify-between text-gray-800 flex mt-1 mb-1 pt-2 -ml-1 -mr-1 border-t-2 border-gray-200'>
                <span className='mx-1 flex cursor-pointer'  onClick= {e => history.push(`/${usercomments.username}`)}>
                    {usercomments.imageUrl ? (
                    <span className='mr-1'>
                        {error ? <BsPersonFill size={20}/>:
                        <img src={usercomments.imageUrl} alt='Profile' style={{width: '20px', height: '20px', borderRadius: '50%'}} />}
                    </span>)
                    : <BsPersonFill size={20}/>}
                    {email === usercomments.email ? 'Me' : usercomments.username}
                </span>
                <span className='flex'>
                <span style={{cursor: 'pointer'}} className='mx-2 flex' onClick={() => likeComment()}>
                    <span className={lisLiked ? 'text-blue-500' : 'text-gray-500'}><AiFillLike size={20}/></span>
                {/* {!likeLoading ? 
                <>
                    </>:
                    <LoadSpan height={20} width={18} color='#00bfff' />} */}
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