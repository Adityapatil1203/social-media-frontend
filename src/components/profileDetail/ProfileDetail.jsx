import React, { useEffect, useState } from 'react'
import classes from './profileDetail.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import man from '../../assets/man.jpg'
import PostPhoto from '../postPhoto/PostPhoto'
import { deleteUser, handleFollow } from '../../redux/authSlice'

const ProfileDetail = () => {

  const [profile,setProfile] = useState('')
  const [profilePosts,setProfilePosts] = useState([])
  const {user,token} = useSelector((state)=> state.auth)
  const [isFollowed,setIsFollowed] = useState(false)
  const [show,setShow] = useState('mypost')
  const {id} = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  //fetch profile
   useEffect(()=>{
       const fetchProfile = async ()=>{
        try {
          const res = await fetch(`http://localhost:5000/user/find/${id}`,{
            headers: {
              'Authorization': `${token}`
            }
          })
          const data = await res.json()
          setProfile(data)

          if(user?._id !== data?._id){
             setIsFollowed(user?.followings?.includes(data?._id))
          }

        } catch (error) {
          console.error(error)
        }
       
       }
       fetchProfile()
   },[id])

  //fetch profile posts
   useEffect(()=>{
    const fetchProfilePosts = async ()=>{
      try {
        const res = await fetch(`http://localhost:5000/post/find/userposts/${id}`)

        const data = await res.json()
        setProfilePosts(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchProfilePosts()
   },[profile])

  //handle follow function
  const handleFollowFunction =async ()=>{
      try {
         await fetch(`http://localhost:5000/user/toggleFollow/${profile?._id}`,{
            headers:{
              "Authorization": `${token}`
            },
            method:"PUT"
         })

         dispatch(handleFollow(id))

         setProfile((prev) => {
          return {
             ...prev,
             followers: isFollowed
             ? [...prev.followers].filter((id) => id !== user._id)
             : [...prev.followers, user._id]
          }
        })
        setIsFollowed(prev => !prev)

      } catch (error) {
        console.error(error)
      }
  }


  const handleDelete = async()=>{
      try {
        const res =  await fetch(`http://localhost:5000/user/deleteUser/${profile?._id}`,{
          headers:{
            "Authorization": `${token}`
          },
          method:"DELETE"
       })

       const data = await res.json()
       console.log(data)
       dispatch(deleteUser())
       navigate("/signup")

      } catch (error) {
        console.log(error)
      }
  }

  return (
     <div className={classes.container}>
       <div className={classes.wrapper}>
         <div className={classes.top}>
              <div className={classes.topLeftSide}>
                <img src={profile?.profileImg ?profile?.profileImg:man} alt=""
                className={classes.profileImg} />
              </div>
              <div className={classes.topRightSide}>
                <h4>{profile?.username}</h4>
                {
                  console.log("profile ",profile)
                }
                <h4>Bio: {profile?.bio ? profile.bio: "Life is full of adventures"}</h4>
                
              </div>
             {profile?._id === user._id && <button className={classes.btn} onClick={handleDelete} >Delete Account</button>} 
              {
                profile?._id !== user._id &&
                <button onClick={handleFollowFunction} className={classes.followBtn}>{isFollowed?"Unfollow":"Follow"}</button>
              }
         </div>
         <div className={classes.center}>
          <div className={classes.followings}>
            Followings: {profile?.followings?.length}
          </div>
          <div className={classes.followers}>
           Followers: {profile?.followers?.length}
          </div>
        </div>
        {
          user._id === profile?._id &&
          <div className={classes.postsOrBookmarked}>
             <button onClick={() => setShow("mypost")} className={`${show === 'mypost' && classes.active}`}>My posts</button>
             <button onClick={() => setShow("bookmarked")} className={`${show === 'bookmarked' && classes.active}`}>Bookmarked</button>
          </div>
        }
       {(show === 'mypost' && profilePosts?.length > 0) ?
        <div className={classes.bottom}>
          {profilePosts?.map((post) => (
            <PostPhoto post={post} key={post._id}/>
          ))}
        </div>
        : show === 'mypost' ? <h2>Profile has no posts</h2> : ''}
       {(show === 'bookmarked' && profilePosts?.length > 0) ?
        <div className={classes.bottom}>
          {user?.bookmarkedPosts?.map((post) => (
            <PostPhoto post={post} key={post._id}/>
          ))}
        </div>
        : show === 'bookmarked' ? <h2>You have no bookmarked posts</h2> : ''}
       </div>
     </div>
  )
}

export default ProfileDetail