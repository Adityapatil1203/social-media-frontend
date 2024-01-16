import React, { useState } from 'react'
import classes from './comment.module.css'
import { useSelector } from 'react-redux'
import man from '../../assets/man2.jpg'
import { AiFillHeart , AiOutlineHeart } from 'react-icons/ai'
import {format} from 'timeago.js'
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter'


const Comment = ({c}) => {
    const {token,user} = useSelector((state)=>state.auth)
    const [comment,setComment] = useState(c)
    const [isLiked,setIsLiked] = useState(comment?.likes?.includes(user._id))

    // https://backend-social-media-jxj6.onrender.com
    const handleLikeComment = async() => {
      try {
        await fetch(`https://backend-social-media-jxj6.onrender.com/comment/toggleLike/${c?._id}`, {
          headers: {
            "Authorization": `${token}`
          },
          method: "PUT"
        })
  
        setComment(prev => {
          return {
            ...prev,
            likes: isLiked
            ? [...prev.likes].filter((id) => id !== user._id)
            : [...prev.likes, user._id]
          }
        })
        setIsLiked(prev => !prev)
      } catch (error) {
        console.error(error)
      }
     }


  return (
    <div className={classes.container}>
      <div className={classes.commentLeft}>
        <img src={man} className={classes.commentImg}/>
        <div className={classes.commentData}>
          <span>{comment?.user?.username ? capitalizeFirstLetter(comment?.user?.username) : ''}</span>
          <span className={classes.commentTimeago}>{format(comment?.createdAt)}</span>
        </div>
        <div className={classes.commentText}>{comment?.commentText}</div>
      </div>
      <div className={classes.commentRight}>
        {
          isLiked 
          ? <AiFillHeart onClick={handleLikeComment} />
          : <AiOutlineHeart onClick={handleLikeComment} />
        }
        <span>{comment?.likes?.length || 0}</span>
        <span>likes</span>
      </div>
    </div>
  )
}

export default Comment