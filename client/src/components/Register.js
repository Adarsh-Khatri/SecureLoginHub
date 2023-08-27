import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper'
import { WRAPPER_REGISTER } from '../styles/Register.styled.js';


export default function Register() {

  const navigate = useNavigate()
  const [file, setFile] = useState()

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: ''
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = Object.assign(values, { profile: file || '' })
      let registerPromise = registerUser(values);
      console.log(registerPromise);
      registerPromise.then(data => console.log(data))
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Registered Successfully...!</b>,
        error: <b>Could not Register.</b>
      });
      registerPromise.then(function () { navigate('/') });
    }
  })

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <WRAPPER_REGISTER>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='main d-flex flex-column align-items-center justify-content-center'>
        <div className="title d-flex flex-column align-items-center">
          <h1 className='fw-bold'>Register</h1>
          <span className='text-muted'>
            Happy to join you!
          </span>
        </div>

        <form className='d-flex flex-column align-items-center' onSubmit={formik.handleSubmit}>
          <div className='profile' >
            <label htmlFor="profile">
              <img src={file || avatar} className="profile-img" alt="avatar" />
            </label>
            <input onChange={onUpload} type="file" id='profile' name='profile' />
          </div>

          <div className="textbox form-group d-flex flex-column align-items-center gap-3 py-3">
            <input {...formik.getFieldProps('email')} className="form-control" type="text" placeholder='Email*' />
            <input {...formik.getFieldProps('username')} className="form-control" type="text" placeholder='Username*' />
            <input {...formik.getFieldProps('password')} className="form-control" type="text" placeholder='Password*' />
            <button type='submit' className="button btn btn-warning">Register</button>
          </div>

          <div className="text-center pt-4 d-flex gap-2">
            <span className='text-muted'>Already Register? </span>
            <Link className='text-info fw-bold' to="/">Login Now</Link>
          </div>

        </form>

      </div>
    </WRAPPER_REGISTER>
  )
}

