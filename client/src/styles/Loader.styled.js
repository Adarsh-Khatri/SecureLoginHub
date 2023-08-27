import styled from 'styled-components';

export const WRAPPER = styled.div`

  .container{
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
  }

  .loader{
    width:20rem;
    height:20rem;
    border-radius:50%;
    border-top:0.5rem solid lime;
    animation: rotate 1s ease-in-out infinite;
  }

  @keyframes rotate{
    0%{border-color:lime;}
    10%{border-color:red}
    20%{border-color:blue}
    30%{border-color:blue}
    40%{border-color:lime}
    50%{border-color:lime}
    60%{border-color:lime}
    70%{border-color:lime}
    80%{border-color:lime}
    90%{border-color:lime}
    100%{transform:rotate(360deg)}
  }

`;