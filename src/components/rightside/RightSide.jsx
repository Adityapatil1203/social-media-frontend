import React, { useEffect, useState } from 'react'
import classes from './rightSide.module.css'
import {useSelector} from 'react-redux'
import man from '../../assets/man.jpg'
import {Link} from 'react-router-dom'
import {capitalizeFirstLetter} from '../../util/capitalizeFirstLetter'
const RightSide = () => {
  const [friends,setFriends] = useState([])
  const {user,token} =  useSelector((state)=> state.auth)
   
  useEffect(()=>{
     const fetchFriends = async()=>{
      try {
        const res  = await fetch(`https://backend-social-media-jxj6.onrender.com/user/find/friends`,{
           headers:{
            "Authorization" : `${token}`
           }
        })
        const data = await res.json()
        setFriends(data)

      } catch (error) {
        console.error(error)
      }
     }
     fetchFriends()
  },[user.followings])

  return (
    <div className={classes.container}>
       <div className={classes.wrapper}>
       
        {
         
          friends.length > 0 ? (
            friends?.map((friend)=>{
             return <Link className={classes.user} to={`/profileDetail/${friend._id} `}  key={friend._id}>
                  <img src={man} alt="" className={classes.profileUserImg}/>
                  <div className={classes.userData}>
                     <span>{capitalizeFirstLetter(friend.username)}</span>
                  </div>
              </Link>
            })
          ): <span>You currently have no friends. Follow someone!</span>
        }
       </div>
    </div>
  )
}

export default RightSide