import React, { useState } from 'react'
import axios from 'axios';
import Loader from 'react-loader-spinner';
import { baseUrl } from '../helper';
import AttachImage from './AttachImage';

export default function TwitForm(props) {
    // const [title, setTitle] = useState(localStorage.getItem('twitTitle') ? localStorage.getItem('twitTitle') : '');
    const [text, setText] = useState(localStorage.getItem('twitText') ? localStorage.getItem('twitText') : '');
    const [imageUrl, setImageUrl] = useState(localStorage.getItem('twitImage') ? localStorage.getItem('twitImage') : '');
    const [textArea, setTextArea] = useState(550);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token'); 
    
    const apiUrl = `${baseUrl}/twits/post`; 

    const handleChange = (e) => {
        if(e.target.name === 'text') {
            setText(e.target.value);
            setTextArea(550 - e.target.value.length)
            localStorage.setItem('twitText', e.target.value)
        } else {
            setImageUrl(e.target.value);
            localStorage.setItem('twitImage', e.target.value)
        }
    }

    const sendTwit = async() => {
        console.log(text, imageUrl)
            if(!(text || imageUrl)) {
                setError('Inputs required');
                return;
            }
            setLoading(true);
            const res = await axios({
                method: 'POST',
                url: `${apiUrl}`,
                data: {text, imageUrl},
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
                    setLoading(false);
                    localStorage.removeItem('twitTitle');
                    localStorage.removeItem('twitText');
                    props.setSync(!props.sync);
                    props.showForm();
                } else {
                    setLoading(false);
                }
    }

    return (
        <div className='sticky text-center w-full h-full bg-blue-200 p-3 -mb-2 -m-4'>
            {/* <div className='text-center bg-blue-200 mt-3 pt-3 mb-1 pb-1 rounded'> */}
            <h1 className='font-bold text-lg mb-3 mt-2'>
                New Post 
            </h1>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '20%'}}>

            {/* <input 
                type='text'
                name='title'
                value={title} 
                placeholder='title'
                onChange={handleChange}
                className='px-3 py-1 rounded text-lg mb-2 font-bold'
                style={{width: '16em', border: 'none'}}
                required
                /> */}
            <textarea 
                type='textarea'
                name='text'
                rows={4}
                cols={3}
                style={{width: '100%', height: `${imageUrl ? '5em' : '13em'}`, border: 'none'}}
                maxLength={550}
                value={text}
                overflow="hidden"
                placeholder='Write and share ...' 
                onChange={handleChange}
                className='px-3 rounded mb-1 text-xs text-black w-full'
                required
            />
                <div style={{display: 'flex', width: '100%', fontSize: '1.2em', justifyContent: 'flex-end'}} className='shadow-md p-1 flex-end mb-2'>
                    <span>{textArea}</span>
                </div>
                <div style={{display: 'flex', width: '100%', fontSize: '1.2em', justifyContent: 'center'}} className='shadow-md p-1 flex-end mb-2'>
                    <AttachImage imageUrl={imageUrl} setImageUrl={setImageUrl} />
                </div>
            </div>
            <div style={{flexDirection: 'column'}} className='flex mb-3'>
                {error && <span className='mb-2 text-red-800 text-md'>{error}</span>}
                <div className='flex justify-center mt-2'>
                    {!loading ?
                    <>
                    <span 
                        style={{cursor: 'pointer'}}
                        onClick={() => props.showForm()}
                        className='hover:bg-gray-900 shadow-md bg-gray-400 text-md font-medium p-2 rounded text-white'
                        >    
                        Cancel
                    </span>

                    <span 
                    style={{cursor: 'pointer'}}
                    onClick={sendTwit}
                    className='hover:bg-green-900 shadow-md bg-green-400 text-md font-bold p-2 rounded text-white mx-2'
                    >    
                        Send
                    </span>
                    </>
                    :
                    <span className='m-auto self-center'>
                        <Loader 
                        type='ThreeDots'
                        color='#00bfff'
                        height={40} 
                        width={40} 
                        />
                     </span>}
                </div>
            </div>
            {/* </div> */}
        </div>
    )
}
