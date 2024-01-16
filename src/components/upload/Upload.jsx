import React, { useState } from 'react'
import classes from './upload.module.css'
import {AiOutlineFileImage} from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Upload = () => {

  const [state,setState] = useState({})
  const [photo,setPhoto] = useState("")
  const {token} = useSelector((state)=>state.auth)
  const navigate = useNavigate();

  

  const handleState = (e)=>{
    setState(prev =>{
      return {...prev,[e.target.name]:e.target.value}
    })
  }

  const handleCreatePost = async(e)=>{
      e.preventDefault()

     try {
      let filename = null

      if(photo){
        const formData = new FormData()
        filename =crypto.randomUUID() + photo.name
       
        console.log(filename)
        console.log(formData)
        formData.append("filename",filename)
        formData.append("image",photo)

        await fetch('https://backend-social-media-jxj6.onrender.com/upload/image',{
          headers:{
           "Authorization": `${token}`
          },
          method:"POST",
          body:formData
       })

      }

     

       const res = await fetch('https://backend-social-media-jxj6.onrender.com/post',{
        headers:{
          'Content-Type': 'application/json',
          "Authorization":`${token}`
        },
        method:"POST",
        body:JSON.stringify({...state,photo:filename})
      })

      const data = await res.json()
      console.log(data)
       navigate('/')
     } catch (error) {
        console.error(error)
     }

 }

  return (
    <div className={classes.container}>
       <div className={classes.wrapper}>
           <h2>Upload Post</h2>
           <form action="" onSubmit={handleCreatePost} >
              <input type="text" name='title' placeholder='Title..' onChange={handleState} />
              <input type="text" name='desc' placeholder='Description..' onChange={handleState} />
              <label htmlFor="photo">Upload photo <AiOutlineFileImage/> </label>
              <input type="file"  id="photo" style={{display:"none"}} onChange={(e)=> setPhoto(e.target.files[0]) } />
              <input type="text" name='location' placeholder='Location..' onChange={handleState} />
              <button>Submit</button>
           </form>
       </div>
    </div>
  )
}

export default Upload