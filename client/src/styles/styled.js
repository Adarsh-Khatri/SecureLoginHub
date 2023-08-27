import styled from 'styled-components';


export const WRAPPER = styled.div`

  display:flex;
  justify-content:center;
  align-items:center;
  min-height:100vh;
  margin:0 1rem;

  .main{    

    background: ${({ theme }) => theme.app.bg};
    border-radius: 2rem;
    box-shadow: 0 0.4rem 3rem #474747;
    backdrop-filter: blur(0.7rem);
    border: 0.1rem solid rgba(255, 255, 255, 0.3);
    box-shadow: 0.2rem 0.2rem 1rem 0.5rem lightgray;
    max-width: 60rem;
    height:50rem;
    flex-grow: 1;
    margin:1rem;

  .title{
    margin-bottom:1rem;

    h1{
      font-size:4rem;
    }
    span{
      font-size:1.3rem;      
    }
  }

}


  form{
    width:80%;

    .profile {
      border: 0.5rem solid var(--profile_border);
      border-radius: 50%;
      max-width:10rem;
      overflow:hidden;
    }
    
    .profile-img{
        width:100%;
        transition: transform 0.3s ease-in-out;
      }
        
    img:hover{
        cursor:pointer;
        transform:scale(1.1);
      }
      
    .textbox{
       width:80%;
       
       input{
         min-width:100%;
         height: 5rem;
         border-radius:1rem;
         padding:0 2rem;
         font-size:1.2rem;
        }

       button{
          min-width:20rem;
          max-width:30rem;
          height:3.2rem;
          font-size:1.3rem;
        }       

      }

      div:last-child{
        font-size:1.2rem;
      }

  }

`;
