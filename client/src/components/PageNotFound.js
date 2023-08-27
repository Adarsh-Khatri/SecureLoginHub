import React from 'react';
import { Link } from 'react-router-dom'
import { WRAPPER_PAGE_NOT_FOUND } from '../styles/PageNotFound.styled';


export default function PageNotFound() {

  const PAGE_NOT_FOUND = "https://static-00.iconduck.com/assets.00/404-page-not-found-illustration-2048x998-yjzeuy4v.png";

  return (
    <WRAPPER_PAGE_NOT_FOUND className="container" >
      <div class="d-flex flex-column justify-content-center align-items-center gap-5">
        <img src={PAGE_NOT_FOUND} alt='PAGE NOT FOUND' />
        <div>
          <Link className='btn btn-secondary btn-lg' to="/">Back To Home</Link>
        </div>
      </div>
    </WRAPPER_PAGE_NOT_FOUND>
  )
}
