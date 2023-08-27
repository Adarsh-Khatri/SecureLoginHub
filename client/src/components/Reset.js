import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { resetPasswordValidation } from '../helper/validate'
import { resetPassword } from '../helper/helper'
import { useAuthStore } from '../store/store';
import { useNavigate, Navigate } from 'react-router-dom';
import useFetch from '../hooks/fetch.hook'
import { WRAPPER_RESET } from '../styles/Reset.styled';
import Loader from './Loader';
import DisplayErrorMessage from './DisplayErrorMessage';

export default function Reset() {

  const { username } = useAuthStore(state => state.auth);
  const navigate = useNavigate();
  const [{ isLoading, apiData, status, serverError }] = useFetch('/createResetSession')

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_pwd: ''
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {

      let resetPromise = resetPassword({ username, password: values.password })

      toast.promise(resetPromise, {
        loading: 'Updating...',
        success: <b>Reset Successfully...!</b>,
        error: <b>Could not Reset!</b>
      });

      resetPromise.then(function () { navigate('/password') })

    }
  })

  if (isLoading) return <Loader />
  if (serverError) return <DisplayErrorMessage error={serverError.message} />
  if (status && status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>
  

  return (
    <WRAPPER_RESET>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='main d-flex flex-column align-items-center justify-content-center'>

        <div className="title d-flex flex-column align-items-center">
          <h1 className='fw-bold'>Reset</h1>
          <span className='text-muted'>
            Enter new password
          </span>
        </div>

        <form className='d-flex flex-column align-items-center' onSubmit={formik.handleSubmit}>

          <div className="textbox form-group d-flex flex-column align-items-center gap-3 py-3">
            <input {...formik.getFieldProps('password')} className="form-control" type="text" placeholder='New Password' />
            <input {...formik.getFieldProps('confirm_pwd')} className="form-control" type="text" placeholder='Repeat Password' />
            <button type='submit' className="button btn btn-outline-warning" >Reset</button>
          </div>

        </form>

      </div>
    </WRAPPER_RESET>
  )
}
