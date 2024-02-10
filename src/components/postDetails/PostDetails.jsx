import React, { useEffect, useState } from 'react'
import classes from './postDetails.module.css'
import {useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import Comment from '../comment/Comment'
import man from '../../assets/man.jpg'


const PostDetails = () => {
  const [post,setPost] = useState("")
  const [comments,setComments] = useState([])
  const [commentText,setCommentText] = useState("")
  const [isCommentEmpty,setIsCommentEmpty] = useState(false)
  const [isCommentLong,setIsCommentLong] = useState(false)
  const {token} = useSelector((state)=> state.auth)
  const {id} = useParams()

  useEffect(()=>{
    const fetchPost = async ()=>{
      try {
         const res = await fetch(`http://localhost:5000/post/find/${id}`)
         const data = await res.json()
         setPost(data)
      } catch (error) {
        console.error(error)
      }
    }
    id && fetchPost()
  },[id])


  useEffect(()=>{
   const fetchComments = async ()=>{
      try {
          const res = await fetch(`http://localhost:5000/comment/${id}`,{
            headers:{
              "Authorization":`${token}`
            }
          })

          const data = await res.json()
          setComments(data)
      } catch (error) {
         console.error(error)
      }
   }
   fetchComments()
  },[post._id])


  const handlePostComment = async()=>{
       if(commentText==='')
       {
         setIsCommentEmpty(true)
         setTimeout(()=>{
            setIsCommentEmpty(false)
         },2000)
         return
       }

      if(commentText.length > 50){
        setIsCommentLong(true)
        setTimeout(()=>{
          setIsCommentLong(false)
        },2000)
        return
      }

      try {
        const res = await fetch(`http://localhost:5000/comment`,{
          headers:{
            'Content-Type':'application/json',
            'Authorization':`${token}`
          },
          method:"POST",
          body:JSON.stringify({commentText,post:post._id})
        })

        const data = await res.json()
        setComments(prev => [...prev, data])
        setCommentText("")
      } catch (error) {
        console.error(error)
      }

  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
         <div className={classes.left}>
             <img src={post?.photo && post?.photo} alt="" />
         </div>
        <div className={classes.right}>
            <div className={classes.wrapperTopSide}>
               <Link to={`/profileDetail/${post?.user?._id}`} className={classes.topRightSide}>
                 <img src={post?.user?.profileImg ? post?.user?.profileImg:man} alt="" className={classes.profileImage}/>
              
               <div className={classes.userData}>
                 <span>{post?.user?.username}</span>
                 <span>{post?.location ? post?.location : "Somewhere around Globe"}</span>
               </div>
               </Link>
            </div>
            {/* comment */}

            <div className={classes.comments}>
              {comments?.length > 0 ?
                comments.map((comment)=>(
                  <Comment c={comment} key={comment._id}/>
                ))
                :
                <h3 className={classes.noCommentMsg}>No comments yet</h3>
              }
            </div>

            {/* comment input field */}
            <div className={classes.postCommentSection}>
              <input type="text" placeholder='Type Comment...' value={commentText} onChange={(e)=> setCommentText(e.target.value)} className={classes.inputSection}/>
              <button onClick={handlePostComment}>Post</button>
            </div>
            {isCommentEmpty && <span className={classes.emptyCommentMsg} >You can not post Empty comment</span> }
            {isCommentLong && <span  className={classes.longCommentMsg} >Comment is too long</span> }
        </div>
      </div>
    </div>
  )
}

export default PostDetails