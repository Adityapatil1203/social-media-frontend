import React, { useEffect, useState } from 'react'
import woman from '../../assets/woman.jpg'
import classes from './post.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter'
import {format} from 'timeago.js'
import {HiOutlineDotsVertical} from 'react-icons/hi'
import { AiFillHeart , AiOutlineHeart } from 'react-icons/ai'
import {BiMessageRounded} from 'react-icons/bi'
import {BsBookmarkFill , BsBookmark} from 'react-icons/bs'
import Comment from '../comment/Comment'
import { bookmarkPost } from '../../redux/authSlice'

const Post = ({post}) => {

  const {token,user} = useSelector((state)=>state.auth)
  const [comments,setComments] = useState([])
  const [commentText,setCommentText] = useState('')
  const [isCommentEmpty, setIsCommentEmpty] = useState(false)
  const [isLiked, setIsLiked] = useState(post.likes.includes(user._id))
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(user?.bookmarkedPosts?.some(bookmarkedPost => bookmarkedPost._id === post._id))
  const [showComment, setShowComment] = useState(false)
  const dispatch = useDispatch()

  useEffect(()=>{
    const fetchComments = async(req,res)=>{
      try {
        const res = await fetch(`https://backend-social-media-jxj6.onrender.com/comment/${post._id}`,{
          headers:{
            "Authorization":`${token}`
          }
        })
  
        const data = await res.json()
        setComments(data);
       } catch (error) {
          console.error(error)
       }
    }
     fetchComments()
  },[post._id])


  const deletePost = async()=>{
     try {
       await fetch(`https://backend-social-media-jxj6.onrender.com/post/${post._id}`,{
         headers:{
           "Authorization":`${token}`
         },

         method:"DELETE"

       })
       window.location.reload()
     } catch (error) {
       console.error(error)
     }
  }

  // const handleLikePost = async()=>{
  //    try {
  //      await fetch(`https://backend-social-media-jxj6.onrender.com/post/toggleLike/${post._id}`,{
  //        headers:{
  //         "Authorization":`${token}`
  //        },
  //        method:"PUT"
  //      })
  //      setIsLiked(prev=> !prev)
  //    } catch (error) {
  //      console.error(error)
  //    }
  // }

  const handleLikePost = async () => {
    try {
     const response = await fetch(`https://backend-social-media-jxj6.onrender.com/post/toggleLikes/${post._id}`, {
        headers: {
          "Authorization": `${token}`
        },
        method: "PUT"
      })

      if (!response.ok) {
        // Handle non-successful response (e.g., status code other than 2xx)
        console.error(`Error: ${response.status} - ${response.statusText}`);
        // You might want to throw an error or handle it in a different way based on your requirements
        throw new Error(`Failed to toggle like for post ${post._id}`);
      }

      setIsLiked(prev => !prev)
    } catch (error) {
      console.error(error)
    }
  }

  const handleBookmark = async()=>{
     try {
        await fetch(`https://backend-social-media-jxj6.onrender.com/user/bookmark/${post._id}`,{
          headers:{
            "Authorization":`${token}`
          },
          method:"PUT"
        })
        dispatch(bookmarkPost(post))
        setIsBookmarked(prev => !prev)
     } catch (error) {
       console.error(error)
     }
  }

  const handlePostComment = async ()=>{
     if(commentText==='')
      {
        setIsCommentEmpty(true)
        setTimeout(()=>{
            setIsCommentEmpty(false)
        },2000)
        return;
      }

      try {
         const res = await fetch('https://backend-social-media-jxj6.onrender.com/comment',{
          headers:{
            "Content-Type":'application/json',
            "Authorization":`${token}`
          },
          method:"POST",
          body:JSON.stringify({commentText,post: post._id})
         })

         const data = await res.json()

         setComments(prev => [...prev,data])
         setCommentText('')

      } catch (error) {
        console.error(error)
      }
}




  return (
    <div className={classes.container} >
      <div className={classes.wrapper}>
         <div className={classes.top}>
           <Link to={`/profileDetail/${post?.user?._id}`} className={classes.topLeft}>
              <img src={woman} alt="" className={classes.profileUserImg} />
              <div className={classes.profileMetadata}>
                 <span>{capitalizeFirstLetter(post.user.username)}</span>
                 <span>{format(post.createdAt)}</span>
              </div>
           </Link>
           {
             (user._id === post.user._id)&&
             <HiOutlineDotsVertical size={25} onClick={()=>setShowDeleteModal(prev => !prev)}/>
           }
           {
             showDeleteModal && (
              <div className={classes.deleteModal}>
                 <h3>Delete Post</h3>
                 <div className={classes.buttons}>
                  <button onClick={deletePost}>Yes</button>
                  <button onClick={()=>setShowDeleteModal(prev => !prev)}>No</button>
                 </div>
              </div>
             )
           }
         </div>
         <div className={classes.center}>
          <div className={classes.desc}>{post.desc}</div>
          {post?.location && <div className={classes.location}>Location: {post.location}</div>}
          <img className={classes.postImg} src={post?.photo ? `https://backend-social-media-jxj6.onrender.com/images/${post?.photo}` : woman} />
        </div>
        <div className={`${classes.controls} ${showComment && classes.showComment}`}>
          <div className={classes.controlsLeft}>
            {
              isLiked
                ? <AiFillHeart onClick={handleLikePost} />
                : <AiOutlineHeart onClick={handleLikePost} />
            }
            <BiMessageRounded onClick={() => setShowComment(prev => !prev)} />
          </div>
          <div className={classes.controlsRight} onClick={handleBookmark}>
            {
              isBookmarked
                ? <BsBookmarkFill />
                : <BsBookmark />
            }
          </div>
        </div>
          
        {
          showComment &&
          <>
            <div className={classes.comments}>
              {
                comments?.length > 0 ? comments.map((comment) => (
                  <Comment c={comment} key={comment._id} />
                )) : <span style={{ marginLeft: '12px', fontSize: '20px' }}>No comments</span>
              }
            </div>
            <div className={classes.postCommentSection}>
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                type="text"
                className={classes.inputSection}
                placeholder='Type comment'
              />
              <button onClick={handlePostComment}>Post</button>
            </div>
            {isCommentEmpty && <span className={classes.emptyCommentMsg}>You can't post empty comment!</span>}
          </>
        }

      </div>
    </div>
  )
}

export default Post