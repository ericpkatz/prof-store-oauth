import React, { useState } from 'react';

const Login = ({ login })=> {
  return (
    <a href={`https://github.com/login/oauth/authorize?client_id=${window.GITHUB_CLIENT_ID}`}>Login through github</a>
  );
}

export default Login;
