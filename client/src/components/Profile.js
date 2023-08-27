import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook';
import { updateUser } from '../helper/helper'
import { WRAPPER_PROFILE } from '../styles/Profile.styled.js';
import Loader from './Loader';
import ErrorMessage from './DisplayErrorMessage';
import DisplayErrorMessage from './DisplayErrorMessage';


export default function Profile() {

  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || ''
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = Object.assign(values, { profile: file || apiData?.profile || '' })
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>
      });

    }
  })

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  // logout handler function
  function userLogout() {
    localStorage.removeItem('token');
    navigate('/')
  }


  if (isLoading) return <Loader />
  if (serverError) return <DisplayErrorMessage error={serverError.message} />


  return (
    <WRAPPER_PROFILE>

      {/* <Loader /> */}
      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='main d-flex flex-column align-items-center justify-content-center'>

        <div className="title d-flex flex-column align-items-center">
          <h1 className='fw-bold'>Profile</h1>
          <span className='text-muted'>
            You can update the details
          </span>
        </div>

        <form className='d-flex flex-column align-items-center' onSubmit={formik.handleSubmit}>

          <div className='profile' >
            <label htmlFor="profile">
              <img src={apiData?.profile || file || avatar} className="profile-img" alt="avatar" />
            </label>
            <input onChange={onUpload} type="file" id='profile' name='profile' />
          </div>

          <div className="textbox form-group d-flex flex-column align-items-center gap-3 py-3">
            {/* <div className='textbox'> */}
            <div class="row">
              <div className='col-sm-6'>
                <input {...formik.getFieldProps('firstName')} className="form-control" type="text" placeholder='FirstName' />
              </div>
              <div className='col-sm-6'>
                <input {...formik.getFieldProps('lastName')} className="form-control" type="text" placeholder='LastName' />
              </div>
            </div>

            <div class="row">
              <div className='col-sm-6'>
                <input {...formik.getFieldProps('mobile')} className="form-control" type="text" placeholder='Mobile No.' />
              </div>
              <div className='col-sm-6'>
                <input {...formik.getFieldProps('email')} className="form-control" type="text" placeholder='Email*' />
              </div>
            </div>

            <input {...formik.getFieldProps('address')} className="form-control" type="text" placeholder='Address' />
            <button type='submit' className='btn btn-outline-danger'>Update</button>

          </div>

          <div className="text-center pt-4 d-flex gap-2">
            <span className='text-muted'>come back later?</span>
            <button type='button' className='btn p-0 text-info fw-bold' onClick={userLogout} >Logout</button>
          </div>


        </form>

      </div>
    </WRAPPER_PROFILE>

  )
}

