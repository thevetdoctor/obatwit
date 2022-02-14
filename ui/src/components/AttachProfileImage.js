import React, { useState } from 'react';
import { BsPersonFill } from 'react-icons/bs';
import { baseUrl } from '../helper';

export default function AttachProfileImage({imgUrl, error, email, userData, apiCallHook}) {
    
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
                    <img style={{width: '25em'}} src={limgUrl ? limgUrl : imgUrl} alt='avatar' className='w-40 max-h-52 rounded-lg -mr-2'
                    />:
                    <span className='flex bg-gray-200 p-3 rounded flex-grow'>
                        <BsPersonFill size={100} />
                    </span>}
                </>
            :
            <>
                <span className='flex bg-gray-300 p-3 rounded flex-grow'>
                    <BsPersonFill size={100} />
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
