import React from 'react';
import { Link } from 'react-router-dom';

export default function FAQ() {
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
                  <h1 className="title">FAQ</h1>
                  <ul className="breadcrumb mb-0 mt-0 p-0">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active"><span>FAQ</span></li>
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
                <div className="col-xl-4 col-lg-5 col-md-5 ">
                  <div className="sidebar faq-sidebar is-sticky">
                    <div className="widget wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                      <div className="widget-title">
                        <h5>Have Any Questions On your Minds!</h5>
                      </div>
                      <div className="widget-content">
                        <form className="form-style-border">
                          <div className="row">
                            <div className="col-md-12">
                              <input type="text" className="form-control" placeholder="Full Name*" aria-label="Full Name" />
                            </div>
                            <div className="col-md-12">
                              <input type="email" className="form-control" placeholder="Email*" aria-label="Email" />
                            </div>
                            <div className="col-md-12">
                               <input type="text" className="form-control" id="phone" placeholder="Phone*" />
                            </div>
                            <div className="col-lg-12">
                               <textarea className="form-control" rows="3" placeholder="Write Message"></textarea>
                            </div>
                            <div className="col-lg-12 mt-3">
                              <a href="#" className="btn">Submit
                                <svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 32 32" version="1.1">
                                  <path d="M30.713 16.090c0.009-0.041 0.014-0.087 0.014-0.135 0-0.004-0-0.008-0-0.011v0.001c-0.006-0.184-0.079-0.35-0.196-0.475l0 0-10-10c-0.136-0.135-0.323-0.218-0.529-0.218-0.415 0-0.751 0.336-0.751 0.751 0 0.206 0.083 0.393 0.218 0.528l8.721 8.72h-26.189c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h26.188l-8.72 8.719c-0.136 0.136-0.22 0.324-0.22 0.531 0 0.415 0.336 0.751 0.751 0.751 0.207 0 0.395-0.084 0.531-0.22l10-10.001c0.025-0.026 0.017-0.064 0.038-0.093 0.040-0.052 0.098-0.088 0.124-0.151 0.013-0.050 0.020-0.108 0.020-0.167 0-0.011-0-0.021-0.001-0.032l0 0.002z"></path>
                                </svg>
                              </a>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="action-box action-box-style-02 bg-holder wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1500ms" style={{ backgroundImage: 'url("/images/service/01.webp")' }}>
                      <div className="action-box-content">
                        <h4 className="title">Professional & Experience Business Services</h4>
                        <p className="description">Optimize your marketing approach with a high-impact, professional website.</p>
                        <a href="case-studies.html" className="btn btn-white">Get Consultation 
                          <svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 32 32" version="1.1">
                            <path d="M30.713 16.090c0.009-0.041 0.014-0.087 0.014-0.135 0-0.004-0-0.008-0-0.011v0.001c-0.006-0.184-0.079-0.35-0.196-0.475l0 0-10-10c-0.136-0.135-0.323-0.218-0.529-0.218-0.415 0-0.751 0.336-0.751 0.751 0 0.206 0.083 0.393 0.218 0.528l8.721 8.72h-26.189c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h26.188l-8.72 8.719c-0.136 0.136-0.22 0.324-0.22 0.531 0 0.415 0.336 0.751 0.751 0.751 0.207 0 0.395-0.084 0.531-0.22l10-10.001c0.025-0.026 0.017-0.064 0.038-0.093 0.040-0.052 0.098-0.088 0.124-0.151 0.013-0.050 0.020-0.108 0.020-0.167 0-0.011-0-0.021-0.001-0.032l0 0.002z"></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-8 col-lg-7 col-md-7">
                  <div className="space-medium-pb">
                    <div className="section-title wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                      <span className="sub-title">[ FAQ ]</span>
                      <h3 className="title"> General Questions </h3>
                    </div>
                    <div className="accordion accordion-style-pgs-two wow fadeInUp" data-wow-delay="0.3s" data-wow-duration="1500ms" id="pgsaccordion">
                      <div className="accordion-item">
                        <h5 className="accordion-header" id="headingOne">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">01. It turned out to be the Hope Diamond?</button>
                        </h5>
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#pgsaccordion">
                          <div className="accordion-body">Benjamin Franklin, inventor, statesman, writer, publisher and economist relates in his autobiography that early in his life he decided to focus on arriving at moral perfection. He made a list of 13 virtues, assigning a page to each.</div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <h5 className="accordion-header" id="headingTwo">
                          <button  className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                          02. So why do we do it?</button>
                        </h5>
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#pgsaccordion">
                          <div className="accordion-body">Every time he made a fault, he made a mark in the appropriate column. Each week he focused his attention on a different virtue. Over time, through repetition, he hoped to one day experience the pleasure of “viewing a clean Book.”</div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <h5 className="accordion-header" id="headingThree">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">03. I am worried about e-mail scams...</button>
                        </h5>
                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#pgsaccordion">
                          <div className="accordion-body">Positive pleasure-oriented goals are much more powerful motivators than negative fear-based ones. Although each is successful separately, the right combination of both is the most powerful motivational force known to humankind.</div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <h5 className="accordion-header" id="headingFour">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseThree">04. Why IT Staff Management?</button>
                        </h5>
                        <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#pgsaccordion">
                          <div className="accordion-body">From five to seven each morning he spent in bodily personal attention, saying a short prayer, thinking over the day’s business and resolutions, studying and eating breakfast. From eight till twelve he worked at his trade.</div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <h5 className="accordion-header" id="headingFive">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseThree">05. Believing in yourself and those around you.</button>
                        </h5>
                        <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#pgsaccordion">
                          <div className="accordion-body">From twelve to one he read or overlooked his accounts and dined. From two to five he worked at his trade. The rest of the evening until 10 he spent in music, or diversion of some sort. This time is used also to put things in their places.</div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <h5 className="accordion-header" id="headingSix">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseThree">06. A short history of equitable compensation</button>
                        </h5>
                        <div id="collapseSix" className="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#pgsaccordion">
                          <div className="accordion-body">Concentrate on your breathing, engage in the moment and spend some time being still, quiet and drift inside of your own mind. Hypnotize yourself here. Step two: Use your imagination to imagine walking down the path of your life. Ok, I know that some of you just cried out “but I can’t visualise!” First up, if you believe you can’t then of course you can’t. Second up, just imagine these things. They do not have to be in cinema screen perfect detail.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div >
                    <div className="section-title wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                      <span className="sub-title">[ FAQ ]</span>
                      <h3 className="title"> Privacy Policy </h3>
                    </div>
                    <div className="accordion accordion-style-pgs-two wow fadeInUp" data-wow-delay="0.3s" data-wow-duration="1500ms" id="pgsaccordionTwo">
                      <div className="accordion-item">
                        <h6 className="accordion-header" id="pgsTwoheadingOne">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#pgsTwocollapseOne" aria-expanded="true" aria-controls="pgsTwocollapseOne">01. It turned out to be the Hope Diamond?</button>
                        </h6>
                        <div id="pgsTwocollapseOne" className="accordion-collapse collapse show" aria-labelledby="pgsTwoheadingOne" data-bs-parent="#pgsaccordionTwo">
                          <div className="accordion-body">Benjamin Franklin, inventor, statesman, writer, publisher and economist relates in his autobiography that early in his life he decided to focus on arriving at moral perfection. He made a list of 13 virtues, assigning a page to each.</div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <h6 className="accordion-header" id="pgsTwoheadingTwo">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#pgsTwocollapseTwo" aria-expanded="false" aria-controls="pgsTwocollapseTwo">02. So why do we do it?</button>
                        </h6>
                        <div id="pgsTwocollapseTwo" className="accordion-collapse collapse" aria-labelledby="pgsTwoheadingTwo" data-bs-parent="#pgsaccordionTwo">
                          <div className="accordion-body">Every time he made a fault, he made a mark in the appropriate column. Each week he focused his attention on a different virtue. Over time, through repetition, he hoped to one day experience the pleasure of “viewing a clean Book.”</div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <h6 className="accordion-header" id="pgsTwoheadingThree">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#pgsTwocollapseThree" aria-expanded="false" aria-controls="pgsTwocollapseThree">03. I am worried about e-mail scams...</button>
                        </h6>
                        <div id="pgsTwocollapseThree" className="accordion-collapse collapse" aria-labelledby="pgsTwoheadingThree" data-bs-parent="#pgsaccordionTwo">
                          <div className="accordion-body">Positive pleasure-oriented goals are much more powerful motivators than negative fear-based ones. Although each is successful separately, the right combination of both is the most powerful motivational force known to humankind.</div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <h6 className="accordion-header" id="pgsTwoheadingFour">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#pgsTwocollapseFour" aria-expanded="false" aria-controls="collapseFour">04. Why IT Staff Management?</button>
                        </h6>
                        <div id="pgsTwocollapseFour" className="accordion-collapse collapse" aria-labelledby="pgsTwoheadingFour" data-bs-parent="#pgsaccordionTwo">
                          <div className="accordion-body">From five to seven each morning he spent in bodily personal attention, saying a short prayer, thinking over the day’s business and resolutions, studying and eating breakfast. From eight till twelve he worked at his trade.</div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <h6 className="accordion-header" id="pgsTwoheadingFive">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#pgsTwocollapseFive" aria-expanded="false" aria-controls="collapseFive">05. Believing in yourself and those around you.</button>
                        </h6>
                        <div id="pgsTwocollapseFive" className="accordion-collapse collapse" aria-labelledby="pgsTwoheadingFive" data-bs-parent="#pgsaccordionTwo">
                          <div className="accordion-body">From twelve to one he read or overlooked his accounts and dined. From two to five he worked at his trade. The rest of the evening until 10 he spent in music, or diversion of some sort. This time is used also to put things in their places.</div>
                        </div>
                      </div>

                      <div className="accordion-item mb-0">
                        <h6 className="accordion-header" id="pgsTwoheadingSix">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#pgsTwocollapseSix" aria-expanded="false" aria-controls="collapseSix">06. A short history of equitable compensation</button>
                        </h6>
                        <div id="pgsTwocollapseSix" className="accordion-collapse collapse" aria-labelledby="pgsTwoheadingSix" data-bs-parent="#pgsaccordionTwo">
                          <div className="accordion-body">Concentrate on your breathing, engage in the moment and spend some time being still, quiet and drift inside of your own mind. Hypnotize yourself here. Step two: Use your imagination to imagine walking down the path of your life. Ok, I know that some of you just cried out “but I can’t visualise!” First up, if you believe you can’t then of course you can’t. Second up, just imagine these things. They do not have to be in cinema screen perfect detail.</div>
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
