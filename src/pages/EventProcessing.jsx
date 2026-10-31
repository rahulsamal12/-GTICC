import React from 'react';
import { Link } from 'react-router-dom';

export default function EventProcessing() {
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
                  <h1 className="title">Event Processing</h1>
                  <ul className="breadcrumb mb-0 mt-0 p-0">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/services">Service</Link>
                    </li>
                    <li className="breadcrumb-item active"><span>Event Processing</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        

        <div className="content-wrapper">

          
          <section className="space-ptb ellipse-bottom">
            <div className="container">
              <div className="row justify-content-start">
                <div className="col-lg-4">
                  <div className="sidebar service-sidebar is-sticky">
                    <div className="widget widget-menu menu-style-2 wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                      <h5 className="widget-title">Our Services</h5>
                      <ul>
                        <li><a href="information-security.html">Information Security</a></li>
                        <li><a href="process-automation.html">Process Automation</a></li>
                        <li><Link to="/services/data-synchronization">Data Synchronization</Link></li>
                        <li><a href="mobile-platforms.html">Mobile Platforms</a></li>
                        <li><Link className="active" to="/services/event-processing">Event Processing</Link></li>
                        <li><Link to="/services/content-management">Content Management</Link></li>
                      </ul>
                    </div>
                    <div className="action-box action-box-style-03 wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                      <div className="action-box-content">
                        <h5 className="title mb-0">For those of you who are serious about having more.</h5>
                        <p className="description">Optimize your marketing approach with a high-impact, professional website.</p>
                        <ul className="contact-details">
                          <li className="contact-info">
                            <svg width="24" height="24" fill="#23a455" viewBox="0 0 16 16">
                              <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                              <path fill-rule="evenodd" d="M12.5 1a.5.5 0 0 1 .5.5V3h1.5a.5.5 0 0 1 0 1H13v1.5a.5.5 0 0 1-1 0V4h-1.5a.5.5 0 0 1 0-1H12V1.5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                            <h6 className="mb-0"><a href="tel:1(123)4567890">+(123) 456-7890</a></h6>
                          </li>
                          <li className="contact-info">
                            <svg fill="#23a455" width="24px" height="24px" viewBox="0 0 16 16">
                              <path d="M15 2.5H1a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1zm-1.3 1.25L8.42 8.56a.62.62 0 0 1-.84 0L2.3 3.75zm-12.45 8.5V4.48l5.49 5a1.86 1.86 0 0 0 2.52 0l5.49-5v7.77z"/>
                            </svg>
                            <h6 className="mb-0"><a href="mailto:info@gmail.com">info@example.com</a></h6>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-8 mt-5 mt-lg-0">
                  <div className="service-single">
                    <div className="service-img">
                      <img className="img-fluid pgsDownToUP wow" src="images/service/service-single/event-processing.webp" alt="" />
                    </div>
                    <div className="service-content ps-0 ps-md-5 mt-4 mt-sm-5">
                      <h3 className="service-title wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">Transforming Complex Data into Engaging Visual Insights</h3>
                      <div className="description wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                        <p className="text-white">One of the main areas that I work on with my clients is shedding these non-supportive beliefs and replacing them with beliefs that will help them to accomplish their desires.</p>
                        <p>The first thing to remember about success is that it is a process – nothing more, nothing less. There is really no magic to it and it’s not reserved only for a select few people. As such, success really has nothing to do with luck, coincidence or fate. It really comes down to understanding the steps in the process and then executing on those steps.</p>
                      </div>
                      <div className="list-wrapper py-4 wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                        <ul className="list col-2 col-xs-1">
                          <li><img className="img-fluid" src="images/arrow-right.webp" alt="" />For those of you who are serious about having more.</li>
                          <li><img className="img-fluid" src="images/arrow-right.webp" alt="" />This is the beginning of creating the life that you want to live.</li>
                          <li><img className="img-fluid" src="images/arrow-right.webp" alt="" />Success is something of which we all want more.</li>
                          <li><img className="img-fluid" src="images/arrow-right.webp" alt="" />This is the beginning of creating the life that you want to live.</li>
                        </ul>
                      </div>
                      <div className="mt-4 mt-sm-5 wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                         <h5>We do things differently</h5>
                         <p>The other virtues practice in succession by Franklin were silence, order, resolution, frugality, industry, sincerity, Justice, moderation, cleanliness, tranquility, chastity and humility.</p>
                      </div>
                      <div className="row mt-4 mt-sm-5">
                        <div className="col-md-5">
                          <img className="img-fluid radius-25 pgsDownToUP wow" src="images/service/service-single-02.webp" alt="#" />
                        </div>
                        <div className="col-md-7 mt-4 mt-md-0">
                          <div className="list-wrapper mb-5 wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">
                          <ul className="list">
                            <li><img className="img-fluid" src="images/arrow-right.webp" alt="" />Making the decision</li>
                            <li><img className="img-fluid" src="images/arrow-right.webp" alt="" />Clarity developing the vision</li>
                            <li><img className="img-fluid" src="images/arrow-right.webp" alt="" />Focus having a plan</li>
                            <li><img className="img-fluid" src="images/arrow-right.webp" alt="" />From my perspective then</li>
                            <li><img className="img-fluid" src="images/arrow-right.webp" alt="" />Just to bring it into focus</li>
                            <li><img className="img-fluid" src="images/arrow-right.webp" alt="" />Just to bring it into focus</li>
                          </ul>
                        </div>
                        <img className="img-fluid pgsDownToUP wow" src="images/service/service-single-03.webp" alt="#" />
                        </div>
                      </div>
                      <div className="section-title mt-5 mb-4 mb-sm-5">
                        <h4 className="title mb-0 wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms">Frequently Asked Questions</h4>
                      </div>
                       <div className="accordion accordion-style-pgs-two wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1500ms" id="pgsaccordion">
                        <div className="accordion-item">
                          <h5 className="accordion-header" id="headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">01. It turned out to be the Hope Diamond?</button>
                          </h5>
                          <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#pgsaccordion">
                            <div className="accordion-body">Imagine reaching deep inside you for all the strength and wisdom that you need to make this decision today. As you do so, imagine that when you choose to make that decision that deep inside your mind you are switching off the alternative path.</div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h5 className="accordion-header" id="headingTwo">
                            <button
                            className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            02. So why do we do it?
                            </button>
                          </h5>
                          <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#pgsaccordion">
                            <div className="accordion-body">Step out on to the path to your left. Where there is no change. Instead, you continue doing what you have in the past. What will life be like about staying on this path. Walk out into your future to the 10 year point.</div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h5 className="accordion-header" id="headingThree">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">03. I am worried about e-mail scams...</button>
                          </h5>
                          <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#pgsaccordion">
                            <div className="accordion-body"> Walk out 10 years into your future and feel how it feels to carry on doing the same thing. I want you to think about how you will feel in 10 years if you continue doing the exact same things you have done to date. What will your daily life  be like? </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h5 className="accordion-header" id="headingFour">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseThree">04. Why IT Staff Management?</button>
                          </h5>
                          <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#pgsaccordion">
                            <div className="accordion-body">Really experience that. See what you see, hear what you hear, feel the feelings. Notice everything that you need to know about what it will be like if you carry on with the same behaviour, putting off change. Drift back to where the path splits.</div>
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
