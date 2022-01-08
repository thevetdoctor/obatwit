import React, { useState } from 'react'
import axios from 'axios';
import Loader from 'react-loader-spinner';
import { baseUrl } from '../helper';

export default function CommentForm(props) {
    const [text, setText] = useState('');
    const [textArea, setTextArea] = useState(160);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token'); 
    
    const apiUrl = `${baseUrl}/comments`; 

    const handleChange = (e) => {
        if(e.target.name === 'text') {
            setText(e.target.value);
            setTextArea(160 - e.target.value.length)
        }
    }

    const sendComment = async() => {
        if(!props.twitId) return;
        if(!text) {
            setError('Inputs required');
            return;
        }
        setLoading(true);
        const res = await axios({
            method: 'POST',
            url: `${apiUrl}/${props.twitId}`,
            data: {text},
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
                props.showCommentForm();
            } else {
                setLoading(false);
                console.log('Error found'); 
            }
    }

    return (
        <div className='text-center pt-4'>
             <p style={{fontSize: 20}} className='font-bold text-xs mb-3'>
                New Comment
            </p>
            <textarea 
                type='textarea'
                name='text'
                rows={5}
                cols={8}
                maxLength={160}
                style={{width: '15em', height: '8em'}}
                value={text} 
                placeholder='Drop in your comment ...' 
                onChange={handleChange}
                className='px-3 rounded mb-5 h-20 text-md text-gray-600'
                required
            /><br/>
            {textArea}
            <div style={{flexDirection: 'column'}} className='flex mb-5'>
                {error && <span className='mb-2 text-red-800 text-xs'>{error}</span>}
                <div className='justify-items-center'>
                    <span 
                        style={{cursor: 'pointer'}}
                        onClick={() => props.showCommentForm()}
                        className='hover:bg-gray-900 bg-gray-400 font-medium p-1 rounded text-white'
                    >    
                        Cancel
                    </span>

                    {!loading ?
                    <span 
                        style={{cursor: 'pointer'}}
                        onClick={sendComment}
                        className='hover:bg-green-900 bg-green-400 font-medium p-1 rounded text-white mx-2'
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
