export default function Twit(props) {
    export const Twit = (props) => {
    let { twit: {id, text, imageUrl, twits, likes, comments, createdAt, updatedAt }, email, userId, apiCallHook, baseUrl, frontendUrl, sync, setSync, checkOpenForms, error, handleDeleteTwit } = props;
    let textIntact = text;
    const [commentFormActive, setCommentFormActive] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [storyText, setStoryText] = useState(textIntact);
    const [editForm, setEditForm] = useState(false); 
    const [linkCopied, setLinkCopied] = useState(false);
    const [more, setMore] = useState(false);
    const [viewLikes, setViewLikes] = useState(false);
    const [viewComments, setViewComments] = useState(false);
    const [show, setShow] = useState(false);
    const [sourceData, setSourceData] = useState({});
    const [menuShow, setMenuShow] = useState(false);
    
    const history = useHistory();
    const likeCount = likes.filter(like => like.isLiked).length;
    const filteredComments = comments.filter(comment => !comment.isDeleted);
    const isLiked = (() => {
        const liked = likes.filter(like => like.userlikes.email === email && like.isLiked === true);
       return liked.length ? true : false;
    })();

    // const [likeCount, setLikeCount] = useState(likeCount);
    // let llikeCount = 0;
    // let lisLiked = false;
    const [lfilteredComents, setFilteredComments] = useState(filteredComments);
    // const [lisLiked, setIsLiked] = useState(isLiked);

    const share = (id, text) => {
        // console.log('Welcome to sharing!');
        if (navigator.share) {
            // console.log('Sharing exist!');
          navigator.share({
            title: 'Buzz',
            url: `https://obabuzz.netlify.app/twits/#${id}`,
            text: `${text?.slice(0, 80)}...`,
            // files: ['./mm.txt'],
          }).then(() => {
            // console.log('Thanks for sharing!', id, text?.slice(0, 80));
            setMenuShow(false);
          }).catch(console.error);
        } else {
                // console.log('Sharing is not supported!');
        }
    }

    const handleStoryChange = (e) => {
        setStoryText(e.target.value);
    }

    let link;
    if(text.search('http') >= 0) {
        const http = text.split(' ').filter(x => x.search('http') >= 0);
        link = http[0].split('\n').filter(x => x.search('http') >= 0);
        text = text.replace(link, '')
    }

    const showMenu = () => {
        if(menuShow) {
            setMenuShow(false);
        } else {
            setMenuShow(true);
        }
    }

    const showMore = () => {
        if(more) {
            setMore(false);
        } else {
            setMore(true);
        }
    }

    const showLikes = () => {
        if(viewLikes) {
            setViewLikes(false);
        } else {
            setViewComments(false);
            setViewLikes(true);
        }
    }

    const showComments = () => {
        if(viewComments) {
            setViewComments(false);
        } else {
            setViewLikes(false);
            setViewComments(true);
        }
    }

    // const copyTwitLink = () => {
    //     clipboardCopy(`${frontendUrl}/#${id}`);
    //     setTimeout(() => {
    //         setLinkCopied(false);
    //     }, 1000);
    //     setMenuShow(false);
    // }

    const editStory = () => {
        // console.log(text, storyText)
        setEditForm(!editForm);
        setStoryText(text);
        setMenuShow(false);
    }
   
    const updateStory = () => {
        apiCallHook('PATCH', `${baseUrl}/twits/${id}`, {text: storyText});
        setEditLoading(true);
        setTimeout(() => {
            setEditLoading(false);
            setEditForm(false);
        }, 1000);
    }
    const showCommentForm = () => {
        setCommentFormActive(!commentFormActive);
        props.twit.formActive = !commentFormActive;
    }
    
    const likeTwit = () => {
        setLikeLoading(true); 
        // if(lisLiked) {
        //     setIsLiked(!lisLiked);
        //     // setLikeCount(likeCount - 1);
        // } else {
        //     setIsLiked(!lisLiked);
        //     // setLikeCount(likeCount + 1);
        // }
        apiCallHook('POST', `${baseUrl}/likes/like/${id}`);
        setTimeout(() => {
            setLikeLoading(false);
        }, 800);
    }

    const commentTwit = () => {
        showCommentForm();
    }
    const deleteTwit = () => {
        // setDeleteLoading(true);
        // setTimeout(() => {
        //     setDeleteLoading(false);
        // }, 1000);
        // handleDeleteTwit(id);
        apiCallHook('DELETE', `${baseUrl}/twits/${id}`);
        setMenuShow(false);
    }

    // const clipboardCopy = async (text) => {
    //     if ('clipboard' in navigator) {
    //         setLinkCopied(true);
    //       return await navigator.clipboard.writeText(text);
    //     } else {
    //     }
    //   }
    
    const handleShow = (source) => {
        // console.log(source);
        setShow(!show);
        setSourceData(source);
    }

    return (
    <div id={`${id}`} style={{fontSize: '1.1em', fontWeight: '400'}} className='bg-white text-black shadow-lg border-2 border-gray-300 rounded-lg px-2 m-0 pb-4 mb-4'>
        <p className='flex justify-between mb-2'>
            <span></span>
            <span className={!linkCopied ? 'mr-2 mb-1 invisible text-xs self-end' : 'mr-2 mb-1 text-xs self-end'}>copied</span>
        </p>
        <span className='text-xs mb-2 -mt-2 flex justify-between'>
            <Moment fromNow>{createdAt}</Moment>
            <span className='flex'>
            {menuShow &&
                <>
                {(email === twits.email) && !editForm && 
                    <>
                    <span className={`flex flex-col cursor-pointer mr-2 p-2 -mt-2 rounded-full text-gray-500 ${menuShow ? '' : 'invisible'}`} onClick={() => editStory()}> 
                        <span className='m-auto mb-2'><MdEdit size={18} /></span><span>Edit</span>
                    </span>
                    <span className='cursor-pointer flex-col mr-2 p-2 -mt-2 flex text-gray-500' onClick={() => deleteTwit()}>
                        {!deleteLoading ? 
                        <><span className='m-auto mb-2'><AiTwotoneDelete size={18} color='red'/></span><span>Clear</span></>:
                        <LoadSpan height={20} width={20} color='#00bfff' />}
                    </span>
                    </>
                }
                <span className={`justify-center flex flex-col rounded-full p-2 cursor-pointer -mt-2 mr-0 text-gray-500 ${menuShow ? '' : 'invisible'}`} onClick={() => share(id, text)}> 
                    <span className='m-auto mb-2'><BsShareFill size={16} /></span><span>Share</span>
                </span>
                </>}
                <span className={'justify-center flex flex-col rounded-full p-2 cursor-pointer -mt-2 mr-0 text-gray-500'} onClick={() => showMenu()}> 
                    {menuShow ? 
                    <>
                        <span className='m-auto mb-2'><IoMdClose size={18} /></span><span>Hide</span>
                    </>
                    :
                    <>
                        <span className='m-auto mb-2'><FaEllipsisV size={18} /></span><span>More</span>
                    </>}
                </span>
            </span>
        </span>
        {editForm && <div className='mb-5'>
                <textarea 
                    className='border-gray-200 border-2 p-2 mb-2 rounded bg-white-300 focus:outline-none text-black'
                    style={{width: '100%'}}
                    cols={3}
                    rows={4}
                    maxLength={550}
                    value={storyText}
                    onChange={handleStoryChange}
                    required={true}
                    /><br />
                {!editLoading ? 
                 <>
                    <span 
                        className='text-xs cursor-pointer bg-gray-500 p-2 m-2 text-white rounded hover:bg-gray-400' onClick={() => editStory()}
                    > 
                        Cancel 
                    </span>
                    <span 
                    className='text-xs cursor-pointer bg-green-600 p-2 mb-2 text-white rounded hover:bg-green-400 hover:text-black' onClick={() => updateStory()}
                    > 
                        Update Story 
                    </span>
                </>
                :
                    <LoadSpan height={20} width={20} color='#00bfff' />}
                </div>}

        {!editForm && <div style={{fontSize: '1.3em', lineHeight: 2}} className='mt-6 px-2'>
            {text.length > 100 ? 
                text.slice(0, 100) 
                : 
                <>{text} {link && <a className='underline' href={link} target='_blank'>link</a>}</>
            }
            {more ? 
                <>{text.slice(100)}
                    <>{text.length > 100 && 
                        <span className='cursor-pointer' onClick={showMore}>
                           {link && <a className='underline' href={link} target='_blank'>link</a>} 
                           ...<span style={{fontStyle: 'italic', fontWeight: '0.3em'}} className='underline'>See less</span>
                        </span>
                        }
                    </>
                </> :
                <>
                    {text.length > 100 && 
                        <span style={{fontStyle: 'italic', fontWeight: '0.3em'}} className='cursor-pointer' onClick={showMore}>
                            ...<span className='underline'>See more</span>
                        </span>
                    }
                </>
            }
        
        <br />
        {((new Date(updatedAt).getTime() - new Date(createdAt).getTime()) > 0) && <span className='text-xs'>Updated <Moment fromNow>{updatedAt}</Moment></span>}
        </div>}
        <span>
            {/* {imageUrl && <img style={{width: "100%"}} src={imageUrl} onClick={() => handleShow()} alt='imgurl' className='rounded max-h-72 cursor-pointer' />} */}
            {imageUrl && <img style={{width: "100%"}} src={imageUrl} alt='imgurl' className='rounded max-h-100 cursor-pointer' />}
        </span> 
        <Image show={show} handleShow={handleShow} sourceData={sourceData} />
        {/* likes and comments count section */}
            {(likeCount > 0 || comments.length > 0) && 
            <div className='flex text-md p-1 px-3 mt-1 -mx-4'>
                <span onClick={showLikes}>
                    {likeCount > 0 && <span className='mr-2 cursor-pointer'>{likeCount}{' '} {likeCount > 1 ? 'likes' : 'like'} </span>}
                </span>
                <span onClick={showComments}>
                    {filteredComments.length > 0 && <span className='cursor-pointer'>{filteredComments.length}{' '} {filteredComments.length > 1 ? 'comments' : 'comment'} </span>}
                </span>
            </div>}

        {/*  */}
        <div className='justify-between text-gray-800 flex mt-1 pt-2 px-3 -mb-3 -mx-5 border-t-2'>
            <span className='mx-1 flex cursor-pointer' onClick= {e => history.push(`/${twits.username}`)}>
                {twits.imageUrl !== null ? (
                <span className='mr-1'>
                    {(error) ? <BsPersonFill size={30}/>:
                    <img src={twits.imageUrl} alt='Profile' style={{width: '30px', height: '30px', borderRadius: '50%'}} />}
                </span>) 
                : <BsPersonFill size={30}/>}
                <span className='text-md pt-1 text-blue-600'>{email === twits.email ? 'Me' : `@${twits.username}`}</span>
            </span>
            <span className='flex'> 
                {!likeLoading ? <span style={{cursor: 'pointer'}} className='flex flex-col text-xs mx-2' onClick={() => likeTwit()}>
                    <span className={isLiked ? 'text-blue-500 m-auto' : 'text-gray-500 m-auto'}><AiFillLike size={18}/></span><span>Like</span>
                </span> 
                :<LoadSpan height={20} width={18} color='#00bfff' />
                }
                <span className='text-xs cursor-pointer mx-2 flex text-gray-500 flex-col' onClick={() => commentTwit()}>
                    <span className='m-auto'><FaRegComment size={16}/></span><span>Comment</span>
                </span>
                {/* {email === twits.email &&
                <span className='cursor-pointer flex-col text-xs mx-2 flex' onClick={() => deleteTwit()}>
                    {!deleteLoading ? 
                    <><span className='m-auto'><AiTwotoneDelete size={18} color='red'/></span><span>Clear</span></>:
                    <LoadSpan height={20} width={20} color='#00bfff' />}
                </span>} */}
            </span>
        </div>
        {commentFormActive && <CommentForm twitId={id} showCommentForm={showCommentForm} sync={sync} setSync={setSync}/>}
        
        {/* {filteredComments.length > 0 &&
        <div className='mt-5'><span className='text-xs mt-4 -mb-2 cursor-pointer shadow-sm border-2 p-2' onClick={showComments}>{viewComments ? 'Hide Comments' : 'View Comments'}</span></div>
        } */}
        {viewLikes && 
            <div className='border-2 border-gray-200 shadow-lg mt-4 rounded'>
                {likes.map((person, idx) => (
                    <LikeUsers key={idx} person={person} email={email} error={error} />
                ))}
            </div>
        }
        {viewComments && 
            <>{comments.length > 0 &&
                    (<div className='mt-4 rounded'>
                        {filteredComments.sort((a, b) => - new Date(b.createdAt).getTime() + new Date(a.createdAt).getTime()).map((comment, idx) => (
                            <Comment key={idx} comment={comment} apiCallHook={apiCallHook} email={email} userId={userId} error={error} />
                        )
                    )}
                </div>)
            }</>
        }
    </div>
    )
}
