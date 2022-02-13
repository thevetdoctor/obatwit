/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-target-blank  */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import { BsPersonFill, BsShareFill } from 'react-icons/bs';
import { AiFillLike, AiTwotoneDelete, AiFillHome } from 'react-icons/ai';
import { IoIosPeople, IoMdClose } from 'react-icons/io';
import { MdEdit, MdEmail } from 'react-icons/md';
import { RiArrowUpLine, RiChatNewLine } from 'react-icons/ri';
import { SiSubstack } from 'react-icons/si';
import TwitForm from './TwitForm';
import CommentForm from './CommentForm';
import Image from './Image';
import { baseUrl, frontendUrl } from '../helper';
import { Logout } from './GoogleAuth';
import Loader from 'react-loader-spinner';
import store from '../redux/store';
import { useSelector } from 'react-redux';
import { FaEllipsisV, FaRegComment } from 'react-icons/fa';
import TopSearch from './TopSearch';

export default function Twits() {
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [ twitData, setTwitData ] = useState([]);
    // const [formActive, setFormActive] = useState(false);
    const [sync, setSync] = useState(false);
    const [scrollValue, setScrollValue] = useState(0);
    const [loadMore, setLoadMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const {getState, dispatch} = store;
    const state = getState(); 
    const { twits, twitCount, users, formActive, page, perPage } = useSelector(state => state);

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
    
    const scrollToTop = () => {
        const element = document.getElementById('top');
        element.scrollIntoView();
    }

    const getMoreTwits = () =>  {
        console.log(page, perPage);
        setLoadingMore(true);
        let newPage = page + 1;
        if(twits.length < twitCount) {
            getTwits(newPage);
            dispatch({
                type: 'SET_PAGE',
                data: newPage
            });
        }
    }

    const onScroll = e => {
     
        setScrollValue(window.document.documentElement.scrollTop);
        if(twits.length < twitCount) {
            if(e.target.documentElement.scrollHeight - (window.innerHeight + e.target.documentElement.scrollTop) < 1720) {
                setLoadMore(true);
            } else {
              setLoadMore(false);
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        history.push('/');
    }

    // if(!token) {
    //     console.log(window.location.hash)
    //     history.push('/');
    // }

    const handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        console.log(searchQuery);
        setSearchQuery(value);  
    }

    const handleSearch = () => {
        const searchResults = twits.filter(twit => {
            return twit.text.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0;
        });
        setTwitData(searchResults);
    }
    
    useEffect(() => {
        handleSearch();
        
        return () => {
        }
    }, [searchQuery]);

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
            console.log(res.data);
            dispatch({
                type: 'UPDATE_TWIT',
                data: res.data.data
            })
            // setSync(!sync);
    }

  

    const getTwits = async(page = 1, perPage = 50) => {
        if(!token) {
            return;
        }
        const res = await axios({
            method: 'GET',
            url: `${apiUrl}?page=${page}&perPage=${perPage}`,
            // url: `${apiUrl}`,
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
                localStorage.setItem('twits', JSON.stringify(res.data.data));
                // .map(x => {
                //     x.formActive = false;
                //     return x;
                // })));
                setLoadMore(false);
                setLoadingMore(false);
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

    const handleDeleteTwit = (id) => {
            dispatch({
                type: 'DELETE_TWIT',
                data: id
            });
    }

    const checkOpenForms = () => {
        let closedTwits = twits.map(twit => {
            twit.formActive = false;
            return twit;
        });
    }


    const checkSub = async() => {
        const sub = localStorage.getItem('sub');
        // console.log('sub', sub);
        if(sub) {
        const res = await axios({
            method: 'POST',
            url: `${baseUrl}/checksub`,
            data: {sub: JSON.parse(sub), id: userId},
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            })
            .catch(error => {
                console.log('sub', error.response?.data?.error);
                if(error.isAxiosError) {
                    setError(error.response?.data?.error);
                }
            });
                if(res && res.data.success) {
                    localStorage.setItem('subed', true);
                }
            }
        }

        const push = async() => {
            await axios({
            method: 'GET', url: `${baseUrl}/push`
        }).then(res => {
            dispatch({
                type: 'SET_SUBS',
                data: res.data.data
            });
            localStorage.setItem('subs', JSON.stringify(res.data.data));
            return res;
        });
    }

useEffect(() => { 
    if(token) {
        getTwits((page > 1) ? page + 1 : page);
    }

    return () => {}
}, []);

useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

useEffect(() => {
    localStorage.setItem('hash', window.location.hash);
    if(!token) {
        // console.log(window.location.hash)
        return history.push('/');
    }
    getUsers();
    if(username === 'hobar') {
        push();
    }

    // console.log(localStorage.getItem('subed'))
    // if(!localStorage.getItem('subed')) {
        checkSub();
    // }
    return () => {}
}, []);

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
    <div id='top' style={{fontFamily: 'Raleway', height: '90vh', fontSize: '0.8em'}} className='text-md mb-5 p-3 m-auto flex justify-center md:w-1/2'>
        <span style={{cursor: 'pointer', borderRadius: '50%'}} className='text-xs mb-3 fixed bottom-10 right-2 bg-green-500 px-4 py-2 text-white'><RiChatNewLine size={25} onClick={showForm} />post</span>
        {(scrollValue > 3000) && <span style={{cursor: 'pointer', borderRadius: '50%', bottom: '10em'}} className='text-xs fixed bottom-5 right-2 bg-purple-500 px-5 py-3 text-white'><RiArrowUpLine size={20} onClick={scrollToTop} />top</span>}
        {formActive && <TwitForm error={error} showForm={showForm} sync={sync} setSync={setSync}/>}
        
        {!formActive && 
        <div>
            <div className='flex justify-center m-auto -mt-3 p-2 md:w-1/2 flex-col'>
                <p style={{marginTop: '3em'}} className='text-center mb-2 pt-2 grow'>
                <span style={{fontFamily: 'Architects Daughter', fontSize: '2em'}} className='text-purple-900 font-bold italic'>Buzz<br/>
                </span> 
                <span style={{fontSize: '1.2em'}}> Feel free, express yourself & network </span>
                </p> 

                <div style={{top: '0em', margin: 'auto'}} className='p-2 rounded mb-2 flex justify-between border-4 border shadow-md fixed right-0 left-0 bg-white md:w-1/2'>
                    {img !== 'null' ? (
                        <span className='cursor-pointer'  onClick= {e => history.push(`/${username}`)}>
                            {error ? <BsPersonFill size={25} />:
                            <img src={img} alt='Profile' style={{width: '30px', height: '30px', borderRadius: '50%'}} />}
                        </span>) 
                        : <span className='text-left cursor-pointer'><BsPersonFill size={25} onClick={e => history.push(`/${username}`)} /></span>}
                        {twits.length}{'/'}{twitCount}{'/'}{scrollValue}{/* {window.innerHeight} - {document.documentElement.scrollTop} - {document.scrollingElement.scrollHeight} */}
                    <span className='text-left flex cursor-pointer'  onClick= {e => history.push('people')}><IoIosPeople size={30}/><span className='pt-1 pl-1'>{users > 0 && users}</span></span>
                    
                    <span style={{cursor: 'pointer'}} className='text-right' onClick={() => logout()}><Logout />
                    </span>
                </div>
                    {/* <TopSearch placeholder='Search' searchQuery={searchQuery} handleChange={handleChange} setSearchQuery={setSearchQuery} error={error} /> */}
                {(twits.length < twitCount) &&
                <>
                {loadMore && <div onClick={() => getMoreTwits()} style={{bottom: '2.5em', margin: 'auto'}} className='animate-bounce transition p-2 hover:bg-blue-400 cursor-pointer text-lg rounded flex justify-around shadow-md fixed right-0 left-0 bg-blue-500 text-white md:w-1/2'>
                 {loadingMore ? 'Loading ...' : 'Load more posts ...'}
                </div>}
                </>
                }
                <div style={{bottom: '0em', margin: 'auto'}} className='pb-1 rounded flex justify-around border-2 border shadow-md fixed right-0 left-0 bg-white md:w-1/2'>
                    <span className='cursor-pointer pt-1 border-t-2 border-black' onClick={() => history.push("/twits")}>
                        <AiFillHome size={25} color='black' />
                    </span>
                    {username === 'hobar' && <span className='cursor-pointer pt-3' onClick= {e => history.push('/subscriptions')}>
                        <SiSubstack size={20} color='gray'/>
                    </span>}
                    <span className='cursor-pointer pt-2' onClick= {e => history.push('/people')}>
                        <IoIosPeople size={30} color='gray'/>
                    </span>

                    <span className='cursor-pointer pt-2'  onClick= {e => history.push(`/chats/${username}`)}><MdEmail size={25} color='gray' />
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
                    <Twit key={idx} twit={twit} email={email} userId={userId} apiCallHook={apiCallHook} baseUrl={baseUrl} frontendUrl={frontendUrl} sync={sync} setSync={setSync} showForm={showForm} formActive={formActive} checkOpenForms={checkOpenForms} error={error} handleDeleteTwit={handleDeleteTwit} />
                )
            }
            </div>}
        </div>}
    </div>
    )
}

export const Twit = (props) => {
    let { twit: {id, text, imageUrl, twits, likes, comments, createdAt, updatedAt }, email, userId, apiCallHook, baseUrl, frontendUrl, sync, setSync, checkOpenForms, error, handleDeleteTwit } = props;
    let textIntact = text;
    const [commentFormActive, setCommentFormActive] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [storyText, setStoryText] = useState(textIntact);
    const [editForm, setEditForm] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [more, setMore] = useState(false);
    const [viewLikes, setViewLikes] = useState(false);
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

    // const [likeCount, setLikeCount] = useState(likeCount);
    // let llikeCount = 0;
    // let lisLiked = false;
    const [lfilteredComents, setFilteredComments] = useState(filteredComments);
    // const [lisLiked, setIsLiked] = useState(isLiked);

    const share = (id, text) => {
        // console.log('Welcome to sharing!');
        if (navigator.share) {
            // console.log('Sharing exist!');
          navigator.share({
            title: 'Buzz',
            url: `https://obabuzz.netlify.app/twits/#${id}`,
            text: `${text?.slice(0, 80)}...`,
            // files: ['./mm.txt'],
          }).then(() => {
            // console.log('Thanks for sharing!', id, text?.slice(0, 80));
            setMenuShow(false);
          }).catch(console.error);
        } else {
                // console.log('Sharing is not supported!');
        }
    }

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

    const showLikes = () => {
        if(viewLikes) {
            setViewLikes(false);
        } else {
            setViewComments(false);
            setViewLikes(true);
        }
    }

    const showComments = () => {
        if(viewComments) {
            setViewComments(false);
        } else {
            setViewLikes(false);
            setViewComments(true);
        }
    }

    // const copyTwitLink = () => {
    //     clipboardCopy(`${frontendUrl}/#${id}`);
    //     setTimeout(() => {
    //         setLinkCopied(false);
    //     }, 1000);
    //     setMenuShow(false);
    // }

    const editStory = () => {
        console.log(text, storyText)
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
        setLikeLoading(true);
        // if(lisLiked) {
        //     setIsLiked(!lisLiked);
        //     // setLikeCount(likeCount - 1);
        // } else {
        //     setIsLiked(!lisLiked);
        //     // setLikeCount(likeCount + 1);
        // }
        apiCallHook('POST', `${baseUrl}/likes/like/${id}`);
        setTimeout(() => {
            setLikeLoading(false);
        }, 800);
    }

    const commentTwit = () => {
        showCommentForm();
    }
    const deleteTwit = () => {
        // setDeleteLoading(true);
        // setTimeout(() => {
        //     setDeleteLoading(false);
        // }, 1000);
        handleDeleteTwit(id);
        apiCallHook('DELETE', `${baseUrl}/twits/${id}`);
    }

    // const clipboardCopy = async (text) => {
    //     if ('clipboard' in navigator) {
    //         setLinkCopied(true);
    //       return await navigator.clipboard.writeText(text);
    //     } else {
    //     }
    //   }
    
    const handleShow = (source) => {
        console.log(source);
        setShow(!show);
        setSourceData(source);
    }

    return (
    <div id={`${id}`} style={{fontSize: '1.1em', fontWeight: '400'}} className='bg-white text-black shadow-lg border-2 border-gray-300 rounded-lg px-2 m-0 pb-4 mb-4'>
        <p className='flex justify-between mb-2'>
            <span></span>
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
                        <span className='m-auto mb-2'><MdEdit size={18} /></span><span>Edit</span>
                    </span>
                    <span className='cursor-pointer flex-col mr-2 p-2 -mt-2 flex text-gray-500' onClick={() => deleteTwit()}>
                        {!deleteLoading ? 
                        <><span className='m-auto mb-2'><AiTwotoneDelete size={18} color='red'/></span><span>Clear</span></>:
                        <LoadSpan height={20} width={20} color='#00bfff' />}
                    </span>
                    </>
                }
                <span className={`justify-center flex flex-col rounded-full p-2 cursor-pointer -mt-2 mr-0 text-gray-500 ${menuShow ? '' : 'invisible'}`} onClick={() => share(id, text)}> 
                    <span className='m-auto mb-2'><BsShareFill size={16} /></span><span>Share</span>
                </span>
                </>}
                <span className={'justify-center flex flex-col rounded-full p-2 cursor-pointer -mt-2 mr-0 text-gray-500'} onClick={() => showMenu()}> 
                    {menuShow ? 
                    <>
                        <span className='m-auto mb-2'><IoMdClose size={18} /></span><span>Hide</span>
                    </>
                    :
                    <>
                        <span className='m-auto mb-2'><FaEllipsisV size={18} /></span><span>More</span>
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

        {!editForm && <div style={{fontSize: '1.3em', lineHeight: 2}} className='mt-6 px-2'>
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
            {(likeCount > 0 || comments.length > 0) && 
            <div className='flex text-md p-1 px-3 mt-1 -mx-4'>
                <span onClick={showLikes}>
                    {likeCount > 0 && <span className='mr-2 cursor-pointer'>{likeCount}{' '} {likeCount > 1 ? 'likes' : 'like'} </span>}
                </span>
                <span onClick={showComments}>
                    {filteredComments.length > 0 && <span className='cursor-pointer'>{filteredComments.length}{' '} {filteredComments.length > 1 ? 'comments' : 'comment'} </span>}
                </span>
            </div>}

        {/*  */}
        <div className='justify-between text-gray-800 flex mt-1 pt-2 px-3 -mb-3 -mx-5 border-t-2'>
            <span className='mx-1 flex cursor-pointer' onClick= {e => history.push(`/${twits.username}`)}>
                {twits.imageUrl !== null ? (
                <span className='mr-1'>
                    {(error) ? <BsPersonFill size={30}/>:
                    <img src={twits.imageUrl} alt='Profile' style={{width: '30px', height: '30px', borderRadius: '50%'}} />}
                </span>) 
                : <BsPersonFill size={30}/>}
                <span className='text-md pt-1 text-blue-600'>{email === twits.email ? 'Me' : `@${twits.username}`}</span>
            </span>
            <span className='flex'> 
                {!likeLoading ? <span style={{cursor: 'pointer'}} className='flex flex-col text-xs mx-2' onClick={() => likeTwit()}>
                    <span className={isLiked ? 'text-blue-500 m-auto' : 'text-gray-500 m-auto'}><AiFillLike size={18}/></span><span>Like</span>
                </span> 
                :<LoadSpan height={20} width={18} color='#00bfff' />
                }
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
        {viewLikes && 
            <div className='border-2 border-gray-200 shadow-lg mt-4 rounded'>
                {likes.map((person, idx) => (
                    <LikeUsers key={idx} person={person} email={email} error={error} />
                ))}
            </div>
        }
        {viewComments && 
            <>{comments.length > 0 &&
                    (<div className='mt-4 rounded'>
                        {filteredComments.sort((a, b) => - new Date(b.createdAt).getTime() + new Date(a.createdAt).getTime()).map((comment, idx) => (
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
        <div id={`${id}`} className='bg-gray-200 border-2 border-gray-200 shadow-md mb-3 p-1 rounded'>
            <span className='text-xs mb-2 ml-2'>
            <Moment fromNow>{createdAt}</Moment>
            </span>
            <p style={{fontSize: '1.1em', lineHeight: 2}} className='p-2 pl-4'>
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
                        <img src={usercomments.imageUrl} alt='Profile' style={{width: '1.5em', height: '1.5em', borderRadius: '50%'}} />}
                    </span>)
                    : <BsPersonFill size={20}/>}
                    <span className=' text-blue-600'>@{email === usercomments.email ? 'Me' : usercomments.username}</span>
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


const LikeUsers = ({person, email, error}) => {
    const history = useHistory();

    return(
            
            <div className='flex cursor-pointer hover:bg-gray-300 justify-between p-2 border-t-2 border-gray-200 pb-1' onClick= {e => history.push(`/${person.userlikes.username}`)}>
                <span className='mx-1 flex'>
                    {person.userlikes.imageUrl ? (
                    <span>
                        {error ? <BsPersonFill size={23}/>:
                        <img src={person.userlikes.imageUrl} alt='Profile' style={{width: '1.5em', height: '1.5em', borderRadius: '50%'}} />}
                    </span>)
                    : <BsPersonFill size={23}/>}
                    <span className=' text-blue-600 ml-1'>@{email === person.userlikes.email ? 'Me' : person.userlikes.username}</span>
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



            // console.log(e.target.documentElement.scrollHeight);
            // console.log(e.target.documentElement.scrollTop);
            // console.log(e.target.documentElement.scrollHeight - e.target.documentElement.scrollTop);
            // console.log(e.target.documentElement.scrollHeight - (window.innerHeight + e.target.documentElement.scrollTop));