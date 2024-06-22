import React, { useState } from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {

  const [state,setState] = useState("Login");

  //creating state variable to save the input states
  const [formData, setFormData] = useState({
      username:"",
      password:"",
      email: ""
  });

  //function to handle the input texts ONCHANGE
  //e for event
  const changeHandler =  (e) =>{
    setFormData({...formData, [e.target.name]:e.target.value})
  }
  const login = async () => {
    console.log("Login Function executed", formData);

    let responseData;
    await fetch('http://localhost:4000/login',{
      method: 'POST',
      headers:{
        Accept: 'application/form-data',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData)
    }).then((response)=> response.json()).then((data)=>responseData = data);

    if(responseData.success){
      //adding authentication token in locval storage
      localStorage.setItem('auth-token', responseData.token);
      //if successful, navigate to the homepage
      window.location.replace("/");
    }
    else{
      alert(responseData.errors);
    }
  }

  const signup = async () => {
    console.log("Sign up  Function executed", formData);
    let responseData;
    await fetch('http://localhost:4000/signup',{
      method: 'POST',
      headers:{
        Accept: 'application/form-data',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData)
    }).then((response)=> response.json()).then((data)=>responseData = data);

    if(responseData.success){
      //adding authentication token in locval storage
      localStorage.setItem('auth-token', responseData.token);
      //if successful, navigate to the homepage
      window.location.replace("/");
    }
    else{
      alert(responseData.errors);
    }
  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {/* Ternary operator, if our state is in the SIGN UP state, we will ask for an input field pending for users name, if they have account this text field will not show */}
          {state==="Sign Up"?<input name='username' value={formData.username}  onChange={changeHandler}type="text" placeholder='Your Name'/>:<></> }
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address'/>
          <input name='password' value={formData.password} onChange={changeHandler} type="password"  placeholder='Password'/>
        </div>
        {/* By using the Continue button, we will check if user is trying to login or sign up (Ternary operator) */}
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {/* Hiding paragraphs depending on whether or not someone is on the Login or Signup page */}
        {state==="Sign Up"
        ?<p className='loginsignup-login'> Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p>
        :<p className='loginsignup-login'> Create an account <span onClick={()=>{setState("Sign Up")}}>Click here</span></p>}
        
        
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id=''/>
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>  
    </div>
  )
}

export default LoginSignup