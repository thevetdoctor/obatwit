/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
// import Loader from "react-loader-spinner";
import { FaCamera } from "react-icons/fa";

export default function AttachImage({imageUrl, setImageUrl}) {
    
    const [uploading, setUploading] = useState("");
    const [imgUrl, setImgUrl] = useState("");

    const handleImage = async(e) => {
        setUploading("loading");
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
        setImgUrl(imgLink.secure_url);
        setImageUrl(imgLink.secure_url);
        // const images = [imgLink.secure_url, ...serviceImages];
        // setServiceImages(images);
        setUploading("done");
      }
    return (
        <div className="flex p-1 rounded ml-1">
            {imgUrl ? 
                <img 
                    src={imgUrl} alt='post' style={{width: '20em', height: '9em'}} className='rounded'
                /> :
                <>
                <label className='cursor-pointer flex'>
                    <span className='-ml-2 pt-1'>Upload</span>
                    <span className='ml-2'><FaCamera size={25} />
                    </span>
                    <input 
                        type="file"
                        placeholder=""
                        accept="image/*;capture"
                        className="hidden"
                        onChange={e => handleImage(e)}
                        />
                </label>
                </>
            }</div>
        )
}
        
/* <span className='ml-3 cursor-pointer flex'><FaCamera size={25}  /> */
/* <span className='ml-2'>Add Image</span> */
/* </span> */
//   {uploading === "loading" &&
//   <Loader 
//       type='TailSpin'
//       color='#000'
//       height={20} 
//       width={20} 
//   />}
//   {/* {<FaCheck />} */}