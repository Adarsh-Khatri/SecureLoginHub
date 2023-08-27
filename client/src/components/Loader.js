import React from 'react';
import { WRAPPER } from '../styles/Loader.styled';

function Loader() {
  return (
    <WRAPPER className="container-fluid">
      <div className='container'>
        <div className='loader'></div>
      </div>
    </WRAPPER>
  )
}

export default Loader