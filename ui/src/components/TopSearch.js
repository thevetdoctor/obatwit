import React from 'react';
// import { FaSearch } from "react-icons/fa";

export default function TopSearch({searchQuery, setSearchQuery, handleChange, error}) {

    return (
        <div className='flex mt-9 rounded'>
            <div className='flex-grow'>
                <input 
                    type='text'
                    name='top-search'
                    value={searchQuery}
                    placeholder='Search friends'
                    required
                    onChange={handleChange}
                    className='p-2 text-dark-3 text-md rounded font-semibold text-center bg-white-200 w-full outline-none mt-1'
                />
            </div>
            {searchQuery && <div className='flex text-white font-bold bg-blue-900 hover:bg-blue-500 cursor-pointer px-3 rounded items-center' onClick={() => setSearchQuery('')}>
                {/* <FaSearch
                    className='w-6 h-6 text-white' 
                /> */}
                Clear
            </div>}
        </div>
    );
}
