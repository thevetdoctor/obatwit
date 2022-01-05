import React, { useState } from 'react'
import axios from 'axios';
import Loader from 'react-loader-spinner';
import { baseUrl } from '../helper';
import AttachImage from './AttachImage';

export default function TwitForm(props) {
    const [title, setTitle] = useState(localStorage.getItem('twitTitle') ? localStorage.getItem('twitTitle') : '');
    const [text, setText] = useState(localStorage.getItem('twitText') ? localStorage.getItem('twitText') : '');
    const [imageUrl, setImageUrl] = useState(localStorage.getItem('twitImage') ? localStorage.getItem('twitImage') : '');
    const [textArea, setTextArea] = useState(160);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token'); 
    
    const apiUrl = `${baseUrl}/twits/post`; 

    const handleChange = (e) => {
        if(e.target.name === 'title') {
            setTitle(e.target.value);
            localStorage.setItem('twitTitle', e.target.value)
        } else {
            setText(e.target.value);
            setTextArea(160 - e.target.value.length)
            localStorage.setItem('twitText', e.target.value)
        }
    }

    const sendTwit = async() => {
            if(!(title && text)) {
                if(!title) {
                    setError('Title is required');
                    return;
                }
                setError('Inputs required');
                return;
            }
            setLoading(true);
            const res = await axios({
                method: 'POST',
                url: `${apiUrl}`,
                data: {title, text, imageUrl},
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    }
                })
                .catch(error => {
                        console.log(error.response);
                        setError(error.response.data.error);
                });
                // console.log(res);
                if(res && res.data.success) {
                    setLoading(false);
                    localStorage.removeItem('twitTitle');
                    localStorage.removeItem('twitText');
                    props.setSync(!props.sync);
                    props.showForm();
                } else {
                    setLoading(false);
                    console.log('Error found'); 
                }
    }

    return (
        <div className='text-center sticky top-0 rounded pb-1 bg-blue-200 mt-3 pt-3 mb-1'>
             <h1 style={{fontSize: '1.5em'}} className='font-bold text-base mb-3'>
                New twit
            </h1>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '20%'}}>

            <input 
                type='text'
                name='title'
                value={title} 
                placeholder='title'
                onChange={handleChange}
                className='px-3 py-1 rounded mb-2'
                style={{width: '20em', border: 'none'}}
                required
                />
            <textarea 
                type='textarea'
                name='text'
                rows={4}
                cols={3}
                style={{width: '20em', height: `${imageUrl ? '5em' : '13em'}`, border: 'none'}}
                maxLength={160}
                value={text}
                overflow="hidden"
                placeholder='Drop in your twit ...' 
                onChange={handleChange}
                className='px-3 rounded mb-1 text-md text-gray-600'
                required
            />
                <span style={{display: 'flex', width: '20em'}} className='justify-between px-3 mt-2 mb-2'>
                    <AttachImage imageUrl={imageUrl} setImageUrl={setImageUrl} />
                <span>{textArea}</span>
                </span>
                </div>
            <div style={{flexDirection: 'column'}} className='flex mb-5'>
                {error && <span className='mb-2 text-red-800 text-md'>{error}</span>}
                <div className='justify-items-center mt-2'>
                    {!loading ?
                    <>
                    <span 
                        style={{cursor: 'pointer'}}
                        onClick={() => props.showForm()}
                        className='hover:bg-gray-900 bg-gray-400 font-medium p-1 rounded text-white'
                        >    
                        Cancel
                    </span>

                    <span 
                    style={{cursor: 'pointer'}}
                    onClick={sendTwit}
                    className='hover:bg-green-900 bg-green-400 font-medium p-1 rounded text-white mx-2'
                    >    
                        Send
                    </span>
                    </>
                    :
                    <span className='m-auto'>
                        <Loader 
                        type='ThreeDots'
                        color='#00bfff'
                        height={40} 
                        width={40} 
                        />
                     </span>}
                </div>
            </div>
        </div>
    )
}
