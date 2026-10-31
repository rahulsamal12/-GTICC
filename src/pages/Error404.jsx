import React from 'react';
import { Link } from 'react-router-dom';

export default function Error404() {
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
                  <h1 className="title">404 Not Found</h1>
                  <ul className="breadcrumb mb-0 mt-0 p-0">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active"><span>404 Not Found</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        

        <div className="content-wrapper">

          
          <section className="space-ptb error-section">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-xl-10">
                  <div className="error-content text-center wow fadeInUp" data-wow-delay="0.4s" data-wow-duration="1500ms">
                    <div className="error-main-title">
                      <h2 className="error-title">
                        <span className="error-text">404</span>
                        <span className="bg-text-stroke">404</span>
                      </h2>
                    </div>
                    <h2 className="sub-title mb-4">Oops! Page Not Found</h2 >
                    <p className="description mb-4 mb-md-5">The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
                    <Link className="btn" to="/">
                      <span>Back to Home</span>
                      <svg fill="#ffffff" width="24px" height="24px" viewBox="0 0 100 100" stroke="#ffffff">
                        <path d="M75.5,42.467l9.177,7.484c0.375,0.314,0.956,0.468,1.409,0.468c0.57,0,1.201-0.243,1.596-0.715 c0.71-0.847,0.631-2.108-0.216-2.817l-35.121-29.46c-0.372-0.312-0.815-0.456-1.266-0.459c-0.032-0.003-0.062,0.001-0.094-0.001 c-0.032,0.002-0.063-0.002-0.095,0.001c-0.451,0.003-0.901,0.147-1.273,0.459L14.48,46.887c-0.846,0.709-0.957,1.971-0.248,2.817 c0.396,0.472,0.963,0.715,1.534,0.715c0.454,0,0.659-0.153,1.034-0.468l6.699-5.826v31.408c0,4.369,4.551,7.967,8.999,7.967h36 c4.206,0,7.001-3.286,7.001-7.967V42.467z M57.5,79.5h-15V57.692c0-1.067,2.376-2.192,4.061-2.192h9.579 c1.478,0,1.36,0.753,1.36,2.192V79.5z M71.5,75.533c0,2.137-0.81,3.967-3.001,3.967H61.5V57.692c0-3.639-1.691-6.192-5.36-6.192 h-9.579c-3.665,0-8.061,2.418-8.061,6.192V79.5h-6.001c-2.229,0-4.999-1.813-4.999-3.967V40.881c0-0.034,0.242-0.067,0.24-0.102 l23.125-19.282l21.342,18.051c-0.319,0.354-0.706,0.818-0.706,1.333V75.533z"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
  );
}
