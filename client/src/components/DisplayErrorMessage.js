import React from 'react'
import { WRAPPER_ERROR_MESSAGE } from '../styles/DisplayErrorMessage.styled'

function DisplayErrorMessage({ error }) {
  return (
    <WRAPPER_ERROR_MESSAGE className='d-flex justify-content-center align-items-center'>
      <h1>{error}</h1>
    </WRAPPER_ERROR_MESSAGE>
  )
}

export default DisplayErrorMessage