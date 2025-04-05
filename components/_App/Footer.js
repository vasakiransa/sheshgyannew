import React from 'react'
import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <>
      <footer className="footer-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <Link href="/">
                <a 
  className="logo" 
  style={{
    fontSize: '32px', 
    fontWeight: 'bold', 
    color: 'white', 
    textDecoration: 'none'
  }}
>
  Sheshgyan
</a>


                </Link>

                <p>
                  Working to bring significant changes in online-based learning by
                  doing extensive research for course curriculum preparation,
                  student engagements, and looking forward to the flexible
                  education!
                </p>

                <ul className="social-link">
                  <li>
                    <a href="https://www.facebook.com/" className="d-block" target="_blank" rel="noreferrer">
                      <i className="bx bxl-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.twitter.com/" className="d-block" target="_blank" rel="noreferrer">
                      <i className="bx bxl-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" className="d-block" target="_blank" rel="noreferrer">
                      <i className="bx bxl-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/" className="d-block" target="_blank" rel="noreferrer">
                      <i className="bx bxl-linkedin"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 col-sm-6 offset-lg-1">
              <div className="single-footer-widget">
                <h3>Explore</h3>
                <ul className="footer-links-list">
                  <li>
                    <Link href="/">
                      <a>Home</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-us">
                      <a>About Us</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/courses">
                      <a>Courses</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact-us">
                      <a>Contact Us</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq">
                      <a>FAQ</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
 
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <h3>Address</h3>
                <ul className="footer-contact-info">
                  <li>
                    <i className="bx bx-map"></i>
                    Banglore,Karntaka,India
                  </li>
                  <li>
                    <i className="bx bx-phone-call"></i>
                    <a href="tel:+917569503922">+91 7569503922</a>
                  </li>
                  <li>
                    <i className="bx bx-envelope"></i>
                    <a href="vasanthkiransambara98@gmail.com">vasanthkiransambara98@gmail.com</a>
                  </li>
                  <li>
                    <i className="bx bxs-inbox"></i>
                    <a href="tel:+917569503922">+91 7569503922</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom-area">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-6">
                <p>
                  <i className="bx bx-copyright"></i>
                  {currentYear} SheshGyan is Proudly Powered by{' '}
                  <a target="_blank" href="https://digifrills.in/" rel="noreferrer">
                    Digifrills Pvt Ltd
                  </a>
                </p>
              </div>

              <div className="col-lg-6 col-md-6">
                <ul>
                  <li>
                    <Link href="/privacy-policy">
                      <a>Privacy Policy</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-conditions">
                      <a>Terms & Conditions</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="lines">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </footer>
    </>
  )
}

export default Footer
