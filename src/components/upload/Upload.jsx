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
 const [url,setUrl] = useState("")
  

  const handleState = (e)=>{
    setState(prev =>{
      return {...prev,[e.target.name]:e.target.value}
    })
  }

  const handleCreatePost = async(e)=>{
      e.preventDefault()

     try {
      let imageUrl = null

      if(photo){
      //   const formData = new FormData()
      //   filename =crypto.randomUUID() + photo.name
       
      //   console.log(filename)
      //   console.log(formData)
      //   formData.append("filename",filename)
      //   formData.append("image",photo)

      //   await fetch('http://localhost:5000/upload/image',{
      //     headers:{
      //      "Authorization": `${token}`
      //     },
      //     method:"POST",
      //     body:formData
      //  })


       const data = new FormData()
       data.append('file',photo)
       data.append('upload_preset','social-media')
       data.append('cloud_name','aditya12xyz')

       const cloudinaryResponse =  await fetch("https://api.cloudinary.com/v1_1/aditya12xyz/image/upload",{
        method:"POST",
        body:data
       })
       .then(res=>res.json())
      
       imageUrl = cloudinaryResponse.secure_url;
        console.log("imageurl ",imageUrl)
        setUrl(imageUrl)
       
      }

     

       const res = await fetch('http://localhost:5000/post',{
        headers:{
          'Content-Type': 'application/json',
          "Authorization":`${token}`
        },
        method:"POST",
        body:JSON.stringify({...state,photo:imageUrl})
      })

      const data = await res.json()
      console.log("post data in cloud ",data)
      // console.log(data)
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