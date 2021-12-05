import React, { useState } from 'react';
// import Loader from "react-loader-spinner";
// import { FaCheck } from "react-icons/fa";

export default function AttachImage() {
    
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
        console.log('image uploaded' ,imgLink.secure_url);
        // const images = [imgLink.secure_url, ...serviceImages];
        // setServiceImages(images);
        setUploading("done");
        console.log(imgUrl);
      }
    return (
        <div className="service-section attach-images flex">
            {imgUrl ? 
                <img 
                    src={imgUrl} alt='post' style={{width: '200px', height: '100px', marginLeft: '-50px'}}
                /> :
                <input
                    type="file"
                    placeholder=""
                    accept="image/*"
                    capture
                    className=""
                    onChange={e => handleImage(e)}
                />
            //   {uploading === "loading" &&
            //   <Loader 
            //       type='TailSpin'
            //       color='#000'
            //       height={20} 
            //       width={20} 
            //   />}
            //   {/* {<FaCheck />} */}
            }</div>
    )
}
