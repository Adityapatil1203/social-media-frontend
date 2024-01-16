import React, { useEffect, useState } from 'react'
import classes from './suggestedUsers.module.css'
import man from '../../assets/man.jpg'
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { handleFollow } from '../../redux/authSlice'

const SuggestedUsers = () => {

   const {user , token} = useSelector((state)=>state.auth)
   const [suggestedUsers,setSuggestedUsers] = useState({})
   const dispatch = useDispatch();

  useEffect(()=>{
    
    const fetchSuggestedUsers = async()=>{
      try {
         const res = await fetch('https://backend-social-media-jxj6.onrender.com/user/find/suggestedUsers',{
           headers:{
            "Authorization": `${token}`
           }
         })

         const data = await res.json()
         setSuggestedUsers(data)
      } catch (error) {
        console.error(error)
      }
  }
    fetchSuggestedUsers();
   
  },[])

  const toggleFollow = async (id)=>{
     try {
        await fetch(`https://backend-social-media-jxj6.onrender.com/user/toggleFollow/${id}`,{
           headers:{
            'Authorization': `${token}`
           },
           method:"PUT"
        })
        setSuggestedUsers((prev)=>{
          return [...prev].filter((user)=> user._id !== id)
        })
        dispatch(handleFollow(id))
     } catch (error) {
       console.error(error)
     }
  }

  return (
    <div className={classes.container}>
       <div className={classes.wrapper}>
          <div className={classes.myProfile}>
            <img src={man} alt="" className={classes.profileUserImg} />
            <div className={classes.profileData}>
               <span>{capitalizeFirstLetter(user.username)}</span>
               <span className={classes.shortBio}>{user?.bio ? user.bio : "Life is full of adventure "}</span>
            </div>
          </div>
          {suggestedUsers?.length > 0 ? (
          <div className={classes.suggestedUsers}>
              <h3 className={classes.title}>Recommended users to follow</h3>
              {suggestedUsers?.map((suggestedUser) => (
                <div className={classes.suggestedUser} key={suggestedUser._id}>
                  <Link to={`/profileDetail/${suggestedUser._id}`}>
                    <img src={suggestedUser?.photo ? suggestedUser.photo : man} alt='' className={classes.imgUser}/>
                  </Link> 
                  <div className={classes.suggestedUserData}>
                    <span>{capitalizeFirstLetter(suggestedUser.username)}</span>
                    <span className={classes.suggestedMsg}>Suggested to you</span>
                  </div>
                  <button onClick={() => toggleFollow(suggestedUser._id)} className={classes.followBtn}>Follow</button>
                </div>
              ))}
          </div>
        ) : <h3 className={classes.title}>You have no suggested users</h3>}
       </div>
    </div>
  )
}

export default SuggestedUsers