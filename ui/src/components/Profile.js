/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { BsPersonFill, BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { IoIosArrowBack, IoIosPeople, IoMdCloudUpload } from 'react-icons/io';
import { GrEdit, GrUploadOption } from 'react-icons/gr';
import Moment from 'react-moment';
import axios from 'axios';
import { baseUrl } from '../helper';
import { LoadSpan } from './Twits';
import store from '../redux/store';
import { useSelector } from 'react-redux';
import { AiFillHome } from 'react-icons/ai';
import Loader from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdEmail } from 'react-icons/md';
import { RiChatNewLine } from 'react-icons/ri';

export default function Profile() {
    const [error, setError] = useState('');
    const [profileImg, setProfileImg] = useState('');
    const [followLoading, setFollowLoading] = useState(false);
    const [sync, setSync] = useState(false);
    let { user } = useParams();
    const history = useHistory();
    
    const email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
    const defaultUsername = localStorage.getItem('username') ? localStorage.getItem('username') : '';    
    const img = localStorage.getItem('img') ? localStorage.getItem('img') : '';
    const token = localStorage.getItem('token');
    const {getState, dispatch} = store;
    const state = getState();
    const { twits, formActive, userData, followers, following, followerCount, isFollower, isFollowing, followingCount, userTwits } = useSelector(state => state);
    // console.log(userData, followers, following, followerCount, followingCount, isFollower, isFollowing, userTwits);

    useEffect(() => {
        dispatch({
            type: 'SET_USER',
            data: {user, email}
        });
        return () => {}
    }, []);

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
                // console.log(res.data)
                    if(method === 'GET') {
                    dispatch({
                        type: 'SET_USERS_DATA',
                        data: res.data.data.users
                    });
                    dispatch({
                        type: 'SET_PEOPLE_DATA',
                        data: res.data.data.users
                    });
                    dispatch({
                        type: 'SET_USER',
                        data: {user, email} 
                    });
                    localStorage.setItem('peopleData', JSON.stringify(res.data.data.users));
                    localStorage.setItem('usersData', JSON.stringify(res.data.data.users));
                    localStorage.setItem('users', JSON.stringify(res.data.data.users));
                    // const userTwits = twits.filter(obj => obj.twits.username === user);
                    // const userDataInStore = res.data.data.users.filter(obj => obj.username === user)[0];
                    // const followers = userDataInStore.followers.filter(user => user.follower.isFollowed);
                    // const following = userDataInStore.following.filter(user => user.follower.isFollowed);
                    // const checkIsFollower = followers.filter(user => user.email === email).length > 0;
                    // const checkIsFollowing = following.filter(user => user.email === email).length > 0;
                    // dispatch({
                    //     type: 'SET_USER_DATA',
                    //     data: userDataInStore
                    // });
                    // setFollowerCount(followers.length);
                    // setFollowingCount(following.length);
                    // setIsFollower(checkIsFollower);
                    // setIsFollowing(checkIsFollowing);
                    // setTwitCount(userTwits.length);

                    // if(userDataInStore.imageUrl) {
                    //     localStorage.setItem('profileImg', userDataInStore.imageUrl);
                    //     setProfileImg(userDataInStore.imageUrl);
                    // }
                    
                    setError('');
                } else{
                    toast("updated successfully!");
                    setSync(!sync);
                }
            } else {
                setError('Please check your network');
                dispatch({
                    type: 'SET_USERS_DATA',
                    data: JSON.parse(localStorage.getItem('usersData'))
                });
                dispatch({
                    type: 'SET_PEOPLE_DATA',
                    data: JSON.parse(localStorage.getItem('usersData'))
                });
                dispatch({
                    type: 'SET_USER',
                    data: {user, email} 
                });
                // const userTwits = twits.filter(obj => obj.twits.username === user);
                // const userDataInStore = JSON.parse(localStorage.getItem('usersData')).filter(obj => obj.username === user)[0];
                // const followers = userDataInStore?.followers.filter(user => user.follower.isFollowed);
                // const following = userDataInStore?.following.filter(user => user.follower.isFollowed);
                // const checkIsFollower = followers?.filter(user => user.email === email).length > 0;
                // const checkIsFollowing = following?.filter(user => user.email === email).length > 0;
                // dispatch({
                //     type: 'SET_USER_DATA',
                //     data: userDataInStore
                // });
                // setFollowerCount(followers?.length);
                // setFollowingCount(following?.length);
                // setIsFollower(checkIsFollower);
                // setIsFollowing(checkIsFollowing);
                // setTwitCount(userTwits?.length);         
            }
    }

    const showForm = () => {
        dispatch({
            type: 'SET_FORM_ACTIVE',
            data: !formActive
        });
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
        if(token) {
            apiCallHook('GET', `${baseUrl}/auth/users`);
        }
        return () => {
        }
    }, [sync]);
   
    // useEffect(() => {
    //     if(token) {
    //         getTwits();
    //     }
    
    //     return () => {}
    // }, []);
 
    return (
        <div id={`${user}`} style={{fontFamily: 'Raleway', fontSize: '1.1em'}} className='shadow-lg border border-gray-200 rounded p-2 mb-4 m-auto justify-center md:w-1/2'>
            <div style={{margin: 'auto', top: '0em'}} className='flex justify-between mb-6 border-3 border -mt-2 -mx-2 shadow-md p-2 bg-white fixed right-0 left-0 md:w-1/2'>
                <span className='cursor-pointer' onClick={() => history.goBack()}><IoIosArrowBack size={30} /></span>
                <span style={{fontFamily: 'Raleway'}} className='text-xl font-bold self-center'>Profile</span>
                <span></span>
            </div>
    
            <div style={{bottom: '0em', margin: 'auto'}} className='pb-1 rounded flex justify-around border-2 border shadow-md fixed right-0 left-0 bg-white md:w-1/2'>
                <span className='cursor-pointer pt-2' onClick={() => history.push("/twits")}>
                    <AiFillHome size={25} color='gray' />
                </span>

                <span className='cursor-pointer pt-2' onClick= {e => history.push('/people')}>
                    <IoIosPeople size={30} color='gray'/>
                </span>

                <span className='cursor-pointer pt-2'  onClick= {e => history.push(`/chats/${defaultUsername}`)}><MdEmail size={25} color='gray' />
                </span>
            </div>

            <ToastContainer />
        {!userData ? 
        <div style={{marginTop: '3.5em'}} className='flex justify-center items-center pt-8'>
            <Loader 
            type='Bars'
            color='#00bfff'
            height={80} 
            width={80} 
        />
        </div>:
        <>
            <div style={{marginTop: '3.5em'}} className='mb-1 flex border-b-2'>
                <>
                    <AttachProfileImage imgUrl={userData?.imageUrl} error={error} email={email} userData={userData} apiCallHook={apiCallHook} />
                </>
                <div className='ml-2 flex-grow mb-1'>
                    <div>
                        <span className='text-xl font-semibold ml-2 mb-2'>{userData?.username}</span>
                    </div>
                    <div className='flex justify-between mt-3 p-1 rounded bg-gray-200'>
                            <span className={'flex-col flex text-center p-2 cursor-pointer mr-3'} onClick= {e => history.push(`/follower/${user}`)}> 
                                <span className='text-lg font-bold'>
                                    {followerCount}
                                     {/* !== null ?
                                    followerCount
                                    :
                                    <LoadSpan height={20} width={20} color='#000' className='-mb-3' />} */}
                                </span> 
                                <span className='text-xs'>
                                        {followerCount  > 1 ? 'followers' : 'follower'}
                                </span>
                            </span>
                            <span className={'flex-col flex text-center p-2 cursor-pointer mr-3'}  onClick= {e => history.push(`/following/${user}`)}> 
                                <span className='text-lg font-bold'>
                                {followingCount}
                                 {/* !== null ?
                                    followingCount
                                    :
                                    <LoadSpan height={20} width={20} color='#000' className='-mb-3' />} */}
                                </span>
                                <span className='text-xs'> following</span>
                            </span>
                            <span className={'flex-col flex text-center p-2 cursor-pointer mr-3'} onClick= {e => history.push(`/twits/${user}`)}> 
                                <span className='text-lg font-bold'>
                                {userTwits.length}
                                 {/* !== null ?
                                    twitCount
                                    :
                                    <LoadSpan height={20} width={20} color='#000' className='-mb-3' />} */}
                                </span>
                                <span className='text-xs'> {userTwits.length  > 1 ? 'posts' : 'post'}</span>
                            </span>
                    </div>
                </div>
            </div>
            <>
            {error && 
                <div style={{backgroundColor: 'white', fontWeight: 'bold'}} className='text-red-500 text-center py-1 mb-0 rounded'>
                    {error}
                </div>
            }
            </>
            <span className='text-sm mt-3 mb-4 flex justify-between'>
                <span>
                    <span className=''>Joined: <Moment fromNow>{userData?.createdAt}</Moment></span><br />
                    {isFollowing && <span className='text-xs text-white bg-gray-500 rounded p-1 mb-3'> 
                        Follows you
                    </span>}
                </span>
                <span className='flex'>
                {(email !== userData?.email) && 
                    <>
                    {!followLoading ? 
                        <span className='flex flex-col'>
                            <span className={'invisible mt-2 mr-1'}></span>
                            <span className={'text-white bg-blue-900 rounded hover:bg-blue-400 p-1 cursor-pointer -mt-2 mr-1'} onClick={() => handleFollow()}> 
                            {!isFollower ? 'Follow' : 'Following'}
                            </span>
                        </span>
                        :
                        <LoadSpan height={20} width={20} color='' />}
                    </>
                }
                </span>
            </span>
            <>
            {(email === userData?.email) && 
                <span className={'text-sm text-white bg-gray-900 rounded hover:bg-gray-400 p-2 cursor-pointer mr-3 mt-5'}  onClick= {e => history.push(`/chats/${user}`)}> 
                    Messages
                </span>
            }
            </>
            <UserProfile email={email} userData={userData} apiCallHook={apiCallHook} defaultUsername={defaultUsername} />
                    
        </>
        }
        {!userData?.username &&
        <div className='flex'>
            <span className='m-auto'><BsPersonFill size={300} /></span>
        </div>}
    </div>
    )
}


const UserProfile = ({userData, email, apiCallHook, defaultUsername}) => {
    const {name, username, bio, location, mobile, dob} = userData;
    // console.log(userData, username, defaultUsername);

    const [editForm, setEditForm] = useState(false); 
    const [lname, setName] = useState(name);
    const [lusername, setUserName] = useState(username);
    const [lbio, setBio] = useState(bio);
    const [llocation, setLocation] = useState(location);
    const [ldob, setDob] = useState(dob);
    const [lmobile, setMobile] = useState(mobile);

    const [nameHidden, setNameHidden] = useState(false);
    const [usernameHidden, setUsernameHidden] = useState(false);
    const [bioHidden, setBioHidden] = useState(false);
    const [locationHidden, setLocationHidden] = useState(false);
    const [dobHidden, setDobHidden] = useState(false);
    const [mobileHidden, setMobileHidden] = useState(false);

    const editProfile = () => {
        setEditForm(!editForm);
        if(editForm) {
            apiCallHook('PATCH', `${baseUrl}/auth/update`, {name: lname, username: lusername, bio: lbio, location: llocation, dob: ldob, mobile: lmobile});
        }
    }

    const handleProfileInfo = (e) => {
        if(e.target.name === 'name') {
            setName(e.target.value);
        } else if(e.target.name === 'username') {
            setUserName(e.target.value);
        } else if(e.target.name === 'bio') {
            setBio(e.target.value);
        } else if(e.target.name === 'location') {
            setLocation(e.target.value);
        } else if(e.target.name === 'date-of-birth'){
            setDob(e.target.value);
        } else {
            setMobile(e.target.value);
        }
    }

    return (
        <div className='text-sm border border-t-1 shadow-md rounded mt-2 mb-8'>
        <div className='flex mt-2 justify-between'>
            <span className='ml-2 underline'>Profile Information</span>
            {(email === userData?.email) &&
            <>
                {!editForm && <span className=' flex cursor-pointer text-black p-2 rounded-full justify-items-end' onClick={() => editProfile()}> 
                    <GrEdit size={18} /> <span className='text-sm ml-1'>Edit</span>
                </span>}
                {editForm && <span className='flex cursor-pointer text-black p-2 rounded-full' onClick={() => editProfile()}> 
                    <GrUploadOption size={18} /><span className='text-sm ml-1'>Update</span>
                </span>}
            </>
            }
        </div>
        <div className='mb-2'>
            <div className='flex justify-between'>
                <label htmlFor="Name" className='px-2 font-bold'> Name</label>
                {(email === userData?.email) &&
                <span className='cursor-pointer mr-4'>
                    {nameHidden ? 
                    <span onClick={() => setNameHidden(false)}><BsToggleOff size={30} /></span> 
                    : 
                    <span onClick={() => setNameHidden(true)}><BsToggleOn size={30} /></span>}
                </span>}
            </div>
            {editForm && <input
            type="text"
            name="name"
            value={lname ? lname : name}
            style={{width: '16em'}}
            onChange={handleProfileInfo}
            placeholder="Your name"
            className='p-1 my-1 rounded'
            />}
            {!editForm && <div className={`${nameHidden && 'hidden'} px-2`}>{name ? name : 'Not available'}</div>}
        </div>
        <div className='mb-2'>
            <div className='flex justify-between'>
                <label htmlFor="Username" className='px-2 font-bold'> Username</label>
                {(email === userData?.email) &&
                <span className='cursor-pointer mr-4'>
                    {usernameHidden ? 
                    <span onClick={() => setUsernameHidden(false)}><BsToggleOff size={30} /></span> 
                    : 
                    <span onClick={() => setUsernameHidden(true)}><BsToggleOn size={30} /></span>}
                </span>}
            </div>
            {editForm && <input
            type="text"
            name="username"
            value={lusername ? lusername : username}
            style={{width: '16em'}}
            onChange={handleProfileInfo}
            disabled
            placeholder="Update your username"
            className='p-1 my-1 rounded'
            />}
            {!editForm && <div className={`${usernameHidden && 'hidden'} px-2`}>{username ? username : 'Not available'}</div>}
        </div>
        <div className='mb-2'>
            <div className='flex justify-between'>
                <label htmlFor="Bio" className='px-2 font-bold'> Bio</label>
                {(email === userData?.email) &&
                <span className='cursor-pointer mr-4'>
                    {bioHidden ? 
                    <span onClick={() => setBioHidden(false)}><BsToggleOff size={30} /></span> 
                    : 
                    <span onClick={() => setBioHidden(true)}><BsToggleOn size={30} /></span>}
                </span>}
            </div>
            {editForm && <textarea
            type="textarea"
            name="bio"
            value={lbio ? lbio : bio}
            rows={4}
            cols={3}
            style={{width: '18em', height: '8em'}}
            onChange={handleProfileInfo} 
            placeholder="Tell the world briefly about yourself"
            className='text-sm p-1 my-1 rounded'
            />}
            {!editForm && <div className={`${bioHidden && 'hidden'} px-2`}>{bio  ? bio : 'Not available'}</div>}
        </div>
        <div className='mb-2'>
            <div className='flex justify-between'>
                <label htmlFor="Location" className='px-2 font-bold'> Location</label>
                {(email === userData?.email) &&
                <span className='cursor-pointer mr-4'>
                    {locationHidden ? 
                    <span onClick={() => setLocationHidden(false)}><BsToggleOff size={30} /></span> 
                    : 
                    <span onClick={() => setLocationHidden(true)}><BsToggleOn size={30} /></span>}
                </span>}
            </div>
            {editForm && <input
            type="text"
            name="location"
            value={llocation ? llocation : location}
            style={{width: '16em'}}
            onChange={handleProfileInfo}
            placeholder="Share your location"
            className='p-1 my-1 rounded'
            />}
            {!editForm && <div className={`${locationHidden && 'hidden'} px-2`}>{location ? location : 'Not available'}</div>}
        </div>
        <div className='mb-2'>
            <div className='flex justify-between'>
                <label htmlFor="Date of Birth" className='px-2 font-bold'> Date of Birth</label>
                {(email === userData?.email) &&
                <span className='cursor-pointer mr-4'>
                    {dobHidden ? 
                    <span onClick={() => setDobHidden(false)}><BsToggleOff size={30} /></span> 
                    : 
                    <span onClick={() => setDobHidden(true)}><BsToggleOn size={30} /></span>}
                </span>}
            </div>
            {editForm && <input
            type="date"
            name="date-of-birth"
            value={ldob ? ldob : dob}
            style={{width: '16em'}}
            onChange={handleProfileInfo}
            placeholder="Date of Birth"
            className='p-1 my-1 rounded'
            />}
            {!editForm && <div className={`${dobHidden && 'hidden'} px-2`}>{dob ? dob : 'Not available'}</div>}
        </div>
        <div className='mb-2'>
            <div className='flex justify-between'>
                <label htmlFor="Phone Number" className='px-2 font-bold'> Phone Number</label>
                {(email === userData?.email) &&
                <span className='cursor-pointer mr-4'>
                    {mobileHidden ? 
                    <span onClick={() => setMobileHidden(false)}><BsToggleOff size={30} /></span> 
                    : 
                    <span onClick={() => setMobileHidden(true)}><BsToggleOn size={30} /></span>}
                </span>}
            </div>
            {editForm && <input
            name="mobile"
            value={lmobile ? lmobile : mobile}
            type="tel"
            pattern="/^[0]\d{10, 12}$/"
            style={{width: '16em'}}
            onChange={handleProfileInfo}
            placeholder="Drop your mobile number "
            className='p-1 my-1 rounded'
            />}
            {!editForm && <div className={`${mobileHidden && 'hidden'} px-2`}>{mobile ? mobile : 'Not available'}</div>}
        </div>
      </div>
    )
}

function AttachProfileImage({imgUrl, error, email, userData, apiCallHook}) {
    
    const [limgUrl, setlImgUrl] = useState("");

    const handleImage = async(e) => {
        const serviceImage = e.target.files[0];
        const data = new FormData();
        const url = "https://api.cloudinary.com/v1_1/thevetdoctor/image/upload";
        data.append("file", serviceImage);
        data.append("upload_preset", "zunt8yrw");
        const res = await fetch(url, {
          method: "POST",
          body: data
        });
        const imgLink = await res.json();
        setlImgUrl(imgLink.secure_url);
        apiCallHook('PATCH', `${baseUrl}/auth/imageurl/update`, {imageUrl: imgLink.secure_url});
      }

    return (
        <div className="flex p-1 rounded ml-1 mr-4 md:w-1/5">
            <label className={`${(email === userData?.email) && 'cursor-pointer'} -ml-2 -mr-5 flex`}>
            {(limgUrl || imgUrl) ?
                <>
                {!error ? 
                    <img src={limgUrl ? limgUrl : imgUrl} alt='avatar' className='w-40 flex-grow rounded-lg -mr-2'
                    />:
                    <span className='flex bg-gray-300 p-3 rounded flex-grow'>
                        <BsPersonFill size={80} />
                    </span>}
                </>
            :
            <>
                <span className='flex bg-gray-300 p-3 rounded flex-grow'>
                    <BsPersonFill size={80} />
                </span>
            </>
            //   {uploading === "loading" &&
            //   <Loader 
            //       type='TailSpin'
            //       color='#000'
            //       height={20} 
            //       width={20} 
            //   />}
            }
            {(email === userData?.email) &&

            <input 
                type="file"
                placeholder=""
                accept="image/*;capture"
                className="hidden"
                onChange={e => handleImage(e)}
            />}
        </label>
        </div>
    )
}
