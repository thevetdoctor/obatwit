import React, { useState } from 'react'
import axios from 'axios';
import Loader from 'react-loader-spinner';

export default function TwitForm(props) {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [textArea, setTextArea] = useState(160);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token'); 
    
    // const baseUrl = 'http://localhost:4000';
    const baseUrl = 'http://oba-twit.herokuapp.com';
    const apiUrl = `${baseUrl}/twits/post`; 

    const handleChange = (e) => {
        if(e.target.name === 'title') {
            setTitle(e.target.value);
        } else {
            setText(e.target.value);
            setTextArea(160 - e.target.value.length)
        }
    }

    const sendTwit = async() => {
                setLoading(true);
                const res = await axios({
                    method: 'POST',
                    url: `${apiUrl}`,
                    data: {title, text},
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                        }
                    })
                    .catch(error => {
                            console.log(error.response);
                            setError(error.response.data.error);
                    });
                    console.log(res);
                    if(res && res.data.success) {
                        setLoading(false);
                        props.setSync(!props.sync);
                        props.showForm();
                    } else {
                        setLoading(false);
                        console.log('Error found'); 
                    }
    }

    return (
        <div className='text-center'>
             <h1 style={{fontSize: 20}} className='font-bold text-md mb-7'>
                New twit
            </h1>
            <input 
                type='text'
                name='title'
                value={title} 
                placeholder='title'
                onChange={handleChange}
                className='px-3 py-1 rounded mb-5'
                />
            <input 
                type='textarea'
                name='text'
                rows={5}
                cols={8}
                maxLength={160}
                value={text} 
                placeholder='Drop in your twit ...' 
                onChange={handleChange}
                className='px-3 rounded mb-5 h-40 text-md text-gray-600'
            /><br/>
            {textArea}
            <div style={{flexDirection: 'column'}} className='flex mb-5'>
                {error && <span className='mb-2 text-red-800 text-md'>{error}</span>}
                <div className='justify-items-center'>
                    <span 
                        style={{cursor: 'pointer'}}
                        onClick={() => props.showForm()}
                        className='hover:bg-gray-900 bg-gray-400 font-medium p-1 rounded text-white'
                    >    
                        Cancel
                    </span>

                    {!loading ?
                    <span 
                        style={{cursor: 'pointer'}}
                        onClick={sendTwit}
                        className='hover:bg-green-900 bg-green-400 font-medium p-2 rounded text-white mx-2'
                    >    
                        Send
                    </span>
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
