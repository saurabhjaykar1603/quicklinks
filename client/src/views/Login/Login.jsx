import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import "./Login.css"

function Login() {
  return (
    <>
      <div className="sticky-top bg-dark">
        <Navbar />
      </div>

      <div className="container d-flex justify-content-center align-content-center mt-5">
        <form class="form shadow ">
          <p class="title">Login </p>
          <p class="message">Login now and get full access to our app. </p>

          <label>
            <input required="" placeholder="" type="email" class="input" />
            <span>Email</span>
          </label>

          <label>
            <input required="" placeholder="" type="password" class="input" />
            <span>Password</span>
          </label>

          <button class="submit">Submit</button>
          <p class="signin">
            Don't have an acount ? <Link to="/Signup">Signup</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;
