import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../helper/validate'
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store'
import { verifyPassword } from '../helper/helper'
import { WRAPPER_PASSWORD } from '../styles/Password.styled';
import Loader from './Loader';
import DisplayErrorMessage from './DisplayErrorMessage';

export default function Password() {

  const navigate = useNavigate()
  const { username } = useAuthStore(state => state.auth)
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`)

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {

      let loginPromise = verifyPassword({ username, password: values.password })
      toast.promise(loginPromise, {
        loading: 'Checking...',
        success: <b>Login Successfully...!</b>,
        error: <b>Password Not Match!</b>
      });

      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/profile')
      })
    }
  })

  if (isLoading) return <Loader />
  if (serverError) return <DisplayErrorMessage error={serverError.message} />

  return (

    <WRAPPER_PASSWORD>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='main d-flex flex-column align-items-center justify-content-center'>
        <div className="title d-flex flex-column align-items-center">
          <h1 className='fw-bold'>Hello {apiData?.firstName || apiData?.username}</h1>
          <span className='text-muted'>
            Explore More by connecting with us.
          </span>
        </div>

        <form className='d-flex flex-column align-items-center' onSubmit={formik.handleSubmit}>

          <div className='profile'>
            <img src={apiData?.profile || avatar} className="profile-img" alt="avatar" />
          </div>

          <div className="textbox form-group d-flex flex-column align-items-center gap-3 py-3">
            <input {...formik.getFieldProps('password')} className="form-control" type="text" placeholder='Password' />
            <button type='submit' className="button btn btn-outline-primary" >Sign In</button>
          </div>

          <div className="text-center pt-4 d-flex gap-2">
            <span className='text-muted'>Forgot Password? </span>
            <Link className='text-info fw-bold' to="/recovery">Recover Now</Link>
          </div>

        </form>

      </div>
    </WRAPPER_PASSWORD>

  )
}
