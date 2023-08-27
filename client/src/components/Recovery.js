import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/store'
import { generateOTP, verifyOTP } from '../helper/helper';
import { useNavigate } from 'react-router-dom'
import { WRAPPER_RECOVERY } from '../styles/Recovery.styled';

export default function Recovery() {

  const { username } = useAuthStore(state => state.auth);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate()

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      console.log(OTP)
      if (OTP) return toast.success('OTP has been send to your email!');
      return toast.error('Problem while generating OTP!')
    })
  }, [username]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code: OTP })
      if (status === 201) {
        toast.success('Verify Successfully!')
        return navigate('/reset')
      }
    } catch (error) {
      return toast.error('Wront OTP! Check email again!')
    }
  }

  // handler of resend OTP
  function resendOTP() {

    let sentPromise = generateOTP(username);

    toast.promise(sentPromise,
      {
        loading: 'Sending...',
        success: <b>OTP has been send to your email!</b>,
        error: <b>Could not Send it!</b>,
      }
    );

    sentPromise.then((OTP) => {
      console.log(OTP)
    });

  }

  return (
    <WRAPPER_RECOVERY>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='main d-flex flex-column align-items-center justify-content-center'>

        <div className="title d-flex flex-column align-items-center">
          <h1 className='fw-bold'>Recovery</h1>
          <span className='text-muted'>
            Enter OTP to recover password
          </span>
        </div>

        <form className='d-flex flex-column align-items-center' onSubmit={onSubmit}>

          <div className="textbox form-group d-flex flex-column align-items-center gap-3 py-3">
            <span>Enter 6 digit OTP sent to your email address</span>
            <input className="form-control" type="text" name='OTP' placeholder='OTP' onChange={(e) => setOTP(e.target.value)} />
            <button type='submit' className="button btn btn-success" >Recover</button>
          </div>


          <div className="text-center pt-4 d-flex gap-2">
            <span className='text-muted'>Can't get OTP?</span>
            <button className='text-danger fw-bold border-0' onClick={resendOTP}>Resend</button>
          </div>

        </form>

      </div>
    </WRAPPER_RECOVERY>
  )
}
