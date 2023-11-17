import React from "react";
import "./Signup.css";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <>
      <div className="sticky-top">
        <Navbar />
      </div>
      <div className="container d-flex justify-content-center align-content-center mt-5">
        <form class="form shadow ">
          <p class="title">Register </p>
          <p class="message">Signup now and get full access to our app. </p>
          <div class="flex">
            <label>
              <input required="" placeholder="" type="text" class="input" />
              <span>Firstname</span>
            </label>

            <label>
              <input required="" placeholder="" type="text" class="input" />
              <span>Lastname</span>
            </label>
          </div>

          <label>
            <input required="" placeholder="" type="email" class="input" />
            <span>Email</span>
          </label>

          <label>
            <input required="" placeholder="" type="password" class="input" />
            <span>Password</span>
          </label>
          <label>
            <input required="" placeholder="" type="password" class="input" />
            <span>Confirm password</span>
          </label>
          <button class="submit">Submit</button>
          <p class="signin">
            Already have an acount ? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Signup;
