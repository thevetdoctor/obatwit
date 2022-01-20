import React from 'react';
import { useHistory } from 'react-router-dom';
import { BsPersonFill } from 'react-icons/bs';

export default function Chat({messages}) {
    console.log(messages);
    return (
        <div>
            {messages.map((msg, idx) => (
                <Message key={idx} texts={msg}/>
            ))}
        </div>
    )
}

const Message = ({texts}) => {
    const history = useHistory();

    const {messages } = texts;
    return (
        <div>
            Message ({messages.length})
            {messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((message, idx) => (
                <div key={idx} className='border border-gray-200 shadow-lg mb-2 p-1 rounded'>
                    <div className='flex justify-between'>
                        <span className='mx-1 flex cursor-pointer'  onClick= {e => history.push(`/${message.sender.username}`)}>
                        {message.sender.imageUrl ? (
                        <span className='mr-1'>
                            <img src={message.sender.imageUrl} alt='Profile' style={{width: '2em', height: '2em', borderRadius: '50%'}} />
                        </span>)
                        : <BsPersonFill size={20}/>}
                        <span className='text-md'>{message.sender.username}</span>
                        </span>
                        <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                    </div>                
                    <span className='ml-9'>{message.text}</span>
                </div>
            ))}
        </div>
    )
}