import React from 'react';
import { useHistory } from "react-router-dom";

export default function UserAssetTab({url, count, status}) {
    const history = useHistory();

  return (
    <span className={'flex-col flex text-center p-2 cursor-pointer'} onClick= {e => history.push(url)}> 
    {/* <span className={'flex-col flex text-center p-2 cursor-pointer'} onClick= {e => history.push(`/twits/${user}`)}>  */}
        <span className='text-lg font-bold'>
        {/* {userTwits.length} */}
        {count}
        </span>
        {/* <span className='text-xs'> {userTwits.length  > 1 ? 'posts' : 'post'}</span> */}
        <span className='text-xs'> {status}</span>
    </span>
  )
}
