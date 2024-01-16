import React, { useState } from 'react'
import classes from './postPhoto.module.css'
import postdemoimg from '../../assets/people.jpg'
import { Link } from 'react-router-dom'
const PostPhoto = ({post}) => {

  const [isHovered,setIsHovered] = useState(false)


  return (
    <Link
      className={classes.post}
      onMouseEnter={()=> setIsHovered(true)}
      onMouseLeave={()=> setIsHovered(false)}
      to={`postDetails/${post._id}`}
    >
      <img src={postdemoimg} alt="" />
      {
         isHovered && <div className={classes.likes}>{post?.likes?.length} Likes</div>

      }
    </Link>
  )
}

export default PostPhoto