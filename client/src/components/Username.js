import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'
import { WRAPPER_USERNAME } from '../styles/Username.styled';

export default function Username() {

  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);

  const formik = useFormik({
    initialValues: {
      username: ''
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      setUsername(values.username);
      navigate('/password')
    }
  })

  return (
    <WRAPPER_USERNAME>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='main d-flex flex-column align-items-center justify-content-center'>
        <div className="title d-flex flex-column align-items-center">
          <h1 className='fw-bold'>Hello Again!</h1>
          <span className='text-muted'>
            Explore More by connecting with us
          </span>
        </div>

        <form className='d-flex flex-column align-items-center' onSubmit={formik.handleSubmit}>

          <div className='profile'>
            <img src={avatar} className="profile-img" alt="avatar" />
          </div>

          <div className="textbox form-group d-flex flex-column align-items-center gap-3 py-3">
            <input {...formik.getFieldProps('username')} className="form-control" type="text" placeholder='Username' />
            <button type='submit' className="button btn btn-outline-primary" >Let's Go</button>
          </div>

          <div className="text-center pt-4 d-flex gap-2">
            <span className='text-muted'>Not a Member</span>
            <Link className='text-info fw-bold' to="/register">Register Now</Link>
          </div>

        </form>
      </div>
    </WRAPPER_USERNAME >
  )
}
