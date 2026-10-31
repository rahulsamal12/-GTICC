import React from 'react';
import { Link } from 'react-router-dom';

export default function MissionVision() {
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
                  <h1 className="title">Mission Vision And Value</h1>
                  <ul className="breadcrumb mb-0 mt-0 p-0">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active"><span>Mission Vision And Value</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        

        <div className="content-wrapper">

          
          <section className="space-ptb our-mission-section">
            <div className="container">
              <div className="row justify-content-between">
                <div className="col-lg-5 mb-5 mb-lg-0">
                  <div className="about-img">
                    <img className="img-fluid radius-20 wow pgsLeftToRight" src="images/about/about-01.webp" alt="#" />
                  </div>
                </div>
                <div className="col-lg-7">
                    <div className="section-title wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                      <span className="sub-title">[ About Us ]</span>
                      <h2 className="title"> Our Mission and Vision for Business Success </h2>
                      <p>Although each is successful separately, the right combination of both is the most powerful motivational force known to humankind.</p>
                    </div>
                    <div className="icon-box-wrapper">
                      <div className="icon-box-item wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                        <div className="icon">
                          <img className="img-fluid" src="images/svg/vision.svg" alt="#" />
                        </div>
                        <div className="content">
                          <h6 className="title">Company Vision & Goals</h6>
                          <p className="description">We specialize in creating custom, responsive websites tailored to your business objectives.</p>
                        </div>
                      </div>
                      <div className="icon-box-item wow fadeInUp" data-wow-delay="0.3s" data-wow-duration="1500ms">
                        <div className="icon">
                          <img className="img-fluid" src="images/svg/mission.svg" alt="#" />
                        </div>
                        <div className="content">
                          <h6 className="title">Company Vision & Goals</h6>
                          <p className="description">We specialize in creating custom, responsive websites tailored to your business objectives.</p>
                        </div>
                      </div>
                      <div className="icon-box-item wow fadeInUp" data-wow-delay="0.6s" data-wow-duration="1500ms">
                        <div className="icon">
                          <img className="img-fluid" src="images/svg/support.svg" alt="#" />
                        </div>
                        <div className="content">
                          <h6 className="title">Company Vision & Goals</h6>
                          <p className="description">We specialize in creating custom, responsive websites tailored to your business objectives.</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </section>
          

          
          <section>
            <div className="bg-dark space-ptb rounded-section bg-holder jarallax" style={{ backgroundImage: 'url("/images/bg/video-bg-1.webp")' }}>
             <div className="container">
              <div className="row justify-content-start">
                <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-8 col-sm-11">
                  <div className="experience-section bg-primary wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                  <div className="experience-years">
                    <h2 className="title">25<sub>Years of experience on IT Services</sub></h2>
                  </div>
                  <div className="skill-wrapper">
                    <div className="skill">
                      <div className="skill-bar" data-percent="85" data-delay="0" data-type="%">
                        <div className="skill-title">IT Managment</div>
                      </div>
                    </div>
                    <div className="skill">
                      <div className="skill-bar" data-percent="90" data-delay="0" data-type="%">
                        <div className="skill-title">Information Technology</div>
                      </div>
                    </div>
                    <div className="skill">
                      <div className="skill-bar" data-percent="95" data-delay="0" data-type="%">
                        <div className="skill-title">Technology Solution</div>
                      </div>
                    </div>
                  </div>
                 </div>
                </div>
              </div>
             </div>
            </div>
          </section>
          

          
           <section className="space-ptb">
            <div className="container">
              <div className="row">
                <div className="col-xxl-8 col-lg-8">
                  <div className="section-title wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                    <span className="sub-title">[ Our Features ]</span>
                    <h2 className="title"> Drive Conversions Using Effective Marketing Features</h2>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                 <div className="infobox-wrapper grid-wrapper grid-xl-3 grid-lg-3 grid-md-2 grid-sm-2 grid-xs-1">
                  <div className="infobox wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                    <div className="infobox-info">
                      <h5 className="infobox-title mb-0">SEO Marketing</h5>
                      <Link className="infobox-link" to="/services/data-synchronization">
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                          <path d="M1.125 19.6639L19.875 1.03809M19.875 1.03809H3M19.875 1.03809V17.8013" stroke="#23a455" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </Link>
                    </div>
                    <div className="infobox-content">
                      <div className="infobox-description">Get the oars in the water and start rowing. Execution is the single biggest factor in achievement will get to the goals!</div>
                    </div>
                  </div>
                  <div className="infobox wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1500ms">
                    <div className="infobox-info">
                      <h5 className="infobox-title mb-0">Content Marketing</h5>
                      <Link className="infobox-link" to="/services/content-management">
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                          <path d="M1.125 19.6639L19.875 1.03809M19.875 1.03809H3M19.875 1.03809V17.8013" stroke="#23a455" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </Link>
                    </div>
                    <div className="infobox-content">
                      <div className="infobox-description">We specialize in creating custom, responsive websites tailored to your business objectives. From concept to brand identity.</div>
                    </div>
                  </div>
                  <div className="infobox wow fadeInUp" data-wow-delay="0.3s" data-wow-duration="1500ms">
                    <div className="infobox-info">
                      <h5 className="infobox-title mb-0">Digital Marketing</h5>
                      <a className="infobox-link" href="mobile-platforms.html">
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                          <path d="M1.125 19.6639L19.875 1.03809M19.875 1.03809H3M19.875 1.03809V17.8013" stroke="#23a455" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </a>
                    </div>
                    <div className="infobox-content">
                      <div className="infobox-description">Digital marketing leverages online platforms and tools to promote products, engage audiences, and drive business growth.</div>
                    </div>
                  </div>
                  <div className="infobox wow fadeInUp" data-wow-delay="0.4s" data-wow-duration="1500ms">
                    <div className="infobox-info">
                      <h5 className="infobox-title mb-0">Security System</h5>
                      <a className="infobox-link" href="information-security.html">
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                          <path d="M1.125 19.6639L19.875 1.03809M19.875 1.03809H3M19.875 1.03809V17.8013" stroke="#23a455" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </a>
                    </div>
                    <div className="infobox-content">
                      <div className="infobox-description">A security system uses technology to monitor, detect, and protect against unauthorized access or threats to property and information.</div>
                    </div>
                  </div>
                  <div className="infobox wow fadeInUp" data-wow-delay="0.5s" data-wow-duration="1500ms">
                    <div className="infobox-info">
                      <h5 className="infobox-title mb-0">Data Analysis</h5>
                      <Link className="infobox-link" to="/services/event-processing">
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                          <path d="M1.125 19.6639L19.875 1.03809M19.875 1.03809H3M19.875 1.03809V17.8013" stroke="#23a455" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </Link>
                    </div>
                    <div className="infobox-content">
                      <div className="infobox-description">Data analysis involves examining and interpreting data to uncover patterns, trends, and insights for informed decision-making.</div>
                    </div>
                  </div>
                  <div className="infobox wow fadeInUp" data-wow-delay="0.6s" data-wow-duration="1500ms">
                    <div className="infobox-info">
                     <h5 className="infobox-title mb-0">Data Protection</h5>
                      <Link className="infobox-link" to="/services/data-synchronization">
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                          <path d="M1.125 19.6639L19.875 1.03809M19.875 1.03809H3M19.875 1.03809V17.8013" stroke="#23a455" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </Link>
                    </div>
                    <div className="infobox-content">
                      <div className="infobox-description">Data protection involves safeguarding sensitive information from unauthorized access, loss, or theft through security protocols.</div>
                    </div>
                  </div>
                 </div>
                </div>
              </div>
            </div>
          </section>
          

          
          <section className="space-pb">
            <div className="container">
              <div className="row">
                <div className="col-lg-5">
                  <div className="section-title mb-0 wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                    <span className="sub-title">[ Pricing Plan ]</span>
                    <h2 className="title"> Choose the plan that’s right for you </h2>
                    <p>It is truly amazing the damage that we, as parents, can inflict on our children. So why do we do it? For the most part, we don’t do it intentionally or with malice.</p>
                    <a href="pricing.html" className="btn">
                    Get a Quote
                    <svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 32 32"><path d="M30.713 16.090c0.009-0.041 0.014-0.087 0.014-0.135 0-0.004-0-0.008-0-0.011v0.001c-0.006-0.184-0.079-0.35-0.196-0.475l0 0-10-10c-0.136-0.135-0.323-0.218-0.529-0.218-0.415 0-0.751 0.336-0.751 0.751 0 0.206 0.083 0.393 0.218 0.528l8.721 8.72h-26.189c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h26.188l-8.72 8.719c-0.136 0.136-0.22 0.324-0.22 0.531 0 0.415 0.336 0.751 0.751 0.751 0.207 0 0.395-0.084 0.531-0.22l10-10.001c0.025-0.026 0.017-0.064 0.038-0.093 0.040-0.052 0.098-0.088 0.124-0.151 0.013-0.050 0.020-0.108 0.020-0.167 0-0.011-0-0.021-0.001-0.032l0 0.002z"/></svg>
                  </a>
                  </div>
                </div>
                <div className="col-lg-7 ps-xxl-5">
                  <div className="pgs-accordion pgs-pricing ps-0 ps-lg-5 mt-5 mt-lg-0">
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                      <div className="accordion-header">
                        <div className="package-info">
                          <span className="package-check"><i className="fa-solid fa-check"></i></span>
                          <div className="package-name">
                            <h5 className="package-title">Weekly Package</h5><span className="package-discount">10% Discount</span>
                          </div>
                        </div>
                        <div className="package-price">
                          <h5 className="price">$19</h5><span className="period">/Weekly</span>
                        </div>
                      </div>
                      <div className="accordion-content">
                        <div className="content-inner">
                          <div className="pricing-lists">
                            <ul className="pricing-list">
                              <li><i className="fa-regular fa-circle-check"></i> Unlimited updates</li>
                              <li><i className="fa-regular fa-circle-check"></i> Custom infrastructure</li>
                              <li><i className="fa-regular fa-circle-check"></i> Custom permissions</li>
                              <li><i className="fa-regular fa-circle-check"></i> Custom infrastructure</li>
                            </ul>
                          </div>
                          <div className="pricing-link">
                            <a href="#"><svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 32 32"><path d="M30.713 16.090c0.009-0.041 0.014-0.087 0.014-0.135 0-0.004-0-0.008-0-0.011v0.001c-0.006-0.184-0.079-0.35-0.196-0.475l0 0-10-10c-0.136-0.135-0.323-0.218-0.529-0.218-0.415 0-0.751 0.336-0.751 0.751 0 0.206 0.083 0.393 0.218 0.528l8.721 8.72h-26.189c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h26.188l-8.72 8.719c-0.136 0.136-0.22 0.324-0.22 0.531 0 0.415 0.336 0.751 0.751 0.751 0.207 0 0.395-0.084 0.531-0.22l10-10.001c0.025-0.026 0.017-0.064 0.038-0.093 0.040-0.052 0.098-0.088 0.124-0.151 0.013-0.050 0.020-0.108 0.020-0.167 0-0.011-0-0.021-0.001-0.032l0 0.002z"/></svg></a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item is-active wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1500ms">
                      <div className="accordion-header">
                        <div className="package-info">
                          <span className="package-check"><i className="fa-solid fa-check"></i></span>
                          <div className="package-name">
                            <h5 className="package-title">Monthly Package</h5><span className="package-discount">15% Discount</span>
                          </div>
                        </div>
                        <div className="package-price">
                          <h5 className="price">$29</h5><span className="period">/Monthly</span>
                        </div>
                      </div>
                      <div className="accordion-content">
                        <div className="content-inner">
                          <div className="pricing-lists">
                            <ul className="pricing-list">
                              <li><i className="fa-regular fa-circle-check"></i> Unlimited updates</li>
                              <li><i className="fa-regular fa-circle-check"></i> Custom infrastructure</li>
                              <li><i className="fa-regular fa-circle-check"></i> Custom permissions</li>
                              <li><i className="fa-regular fa-circle-check"></i> Custom infrastructure</li>
                            </ul>
                          </div>
                          <div className="pricing-link">
                            <a href="#"><svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 32 32"><path d="M30.713 16.090c0.009-0.041 0.014-0.087 0.014-0.135 0-0.004-0-0.008-0-0.011v0.001c-0.006-0.184-0.079-0.35-0.196-0.475l0 0-10-10c-0.136-0.135-0.323-0.218-0.529-0.218-0.415 0-0.751 0.336-0.751 0.751 0 0.206 0.083 0.393 0.218 0.528l8.721 8.72h-26.189c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h26.188l-8.72 8.719c-0.136 0.136-0.22 0.324-0.22 0.531 0 0.415 0.336 0.751 0.751 0.751 0.207 0 0.395-0.084 0.531-0.22l10-10.001c0.025-0.026 0.017-0.064 0.038-0.093 0.040-0.052 0.098-0.088 0.124-0.151 0.013-0.050 0.020-0.108 0.020-0.167 0-0.011-0-0.021-0.001-0.032l0 0.002z"/></svg></a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.3s" data-wow-duration="1500ms">
                      <div className="accordion-header">
                        <div className="package-info">
                          <span className="package-check"><i className="fa-solid fa-check"></i></span>
                          <div className="package-name">
                            <h5 className="package-title">Yearly Package</h5><span className="package-discount">18% Discount</span>
                          </div>
                        </div>
                        <div className="package-price">
                          <h5 className="price">$39</h5><span className="period">/Yearly</span>
                        </div>
                      </div>
                      <div className="accordion-content">
                        <div className="content-inner">
                          <div className="pricing-lists">
                            <ul className="pricing-list">
                              <li><i className="fa-regular fa-circle-check"></i> Unlimited updates</li>
                              <li><i className="fa-regular fa-circle-check"></i> Custom infrastructure</li>
                              <li><i className="fa-regular fa-circle-check"></i> Custom permissions</li>
                              <li><i className="fa-regular fa-circle-check"></i> Custom infrastructure</li>
                            </ul>
                          </div>
                          <div className="pricing-link">
                            <a href="#"><svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 32 32"><path d="M30.713 16.090c0.009-0.041 0.014-0.087 0.014-0.135 0-0.004-0-0.008-0-0.011v0.001c-0.006-0.184-0.079-0.35-0.196-0.475l0 0-10-10c-0.136-0.135-0.323-0.218-0.529-0.218-0.415 0-0.751 0.336-0.751 0.751 0 0.206 0.083 0.393 0.218 0.528l8.721 8.72h-26.189c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h26.188l-8.72 8.719c-0.136 0.136-0.22 0.324-0.22 0.531 0 0.415 0.336 0.751 0.751 0.751 0.207 0 0.395-0.084 0.531-0.22l10-10.001c0.025-0.026 0.017-0.064 0.038-0.093 0.040-0.052 0.098-0.088 0.124-0.151 0.013-0.050 0.020-0.108 0.020-0.167 0-0.011-0-0.021-0.001-0.032l0 0.002z"/></svg></a>
                          </div>
                        </div>
                      </div>
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
