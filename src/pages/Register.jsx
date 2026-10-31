import React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="site-content">

        <div className="container-fluid">
          <div className="item-efftect">
             <div className="efftect overflow-hidden"></div>
             <div className="efftect overflow-hidden"></div>
             <div className="efftect overflow-hidden"></div>
             <div className="efftect overflow-hidden"></div>
             <div className="efftect overflow-hidden"></div>
          </div>
        </div>

        
        <section>
          <div className="inner-banner bg-holder rounded-section jarallax" style={{ backgroundImage: 'url("/images/banner/inner-header/01.webp")' }}>
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <h1 className="title">My account</h1>
                  <ul className="breadcrumb mb-0 mt-0 p-0">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active"><span>My account</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        

        <div className="content-wrapper">

          <section className="space-ptb">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                  <div className="login-form wow fadeInUp" data-wow-delay="0.8s" data-wow-duration="1500ms">
                    
                    <form  className="form-style-border">
                      <h3 className="mb-3">Register</h3>
                      <div className="row">
                        <div className="col-sm-6">
                          <input type="text" className="form-control" id="Username" placeholder="Username" />
                        </div>
                        <div className="col-sm-6">
                          <input type="email" className="form-control" id="email" placeholder="Email" />
                        </div>
                        <div className="col-sm-6">
                          <input type="password" className="form-control" id="inputPassword" placeholder="Password" />
                        </div>
                        <div className="col-sm-6">
                          <input type="password" className="form-control" id="ConfirmPassword" placeholder="Confirm Password" />
                        </div>
                        <div className="mb-3 col-sm-12">
                          <div className="form-check my-2">
                            <input className="form-check-input" type="checkbox"  id="flexCheckIndeterminate" />
                            <label className="form-check-label" for="flexCheckIndeterminate">I agree to the terms of service</label>
                          </div>
                        </div>
                        <div className="col-sm-12">
                          <a href="#" className="btn"><span>Sign Up</span> <i className="fa-regular fa-user"></i></a>
                        </div>
                      </div>
                    </form>
                    
                    
                    <div className="login-social-media">
                      <p className="mt-4 mb-0">Have you an account?  <a href="my-account.html" className="sign-up">Sign in</a></p>
                    </div>
                    
                  </div> 
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
  );
}
