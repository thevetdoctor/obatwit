/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import { Modal } from 'react-bootstrap';
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';
 
export default function PopUp({ show, handleShow, sourceData }) {
    return (
        <div>
            <Modal
                show={show}
                onHide={() => handleShow()}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                className="h-full bg-gray-300"
                size="lg"
            >
            <Modal.Header closeButton>
                <Modal.Title>
                {sourceData?.header}
                </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            
              <div className='image_box'>

                    <img
                      src={sourceData?.source}
                      alt={sourceData?.altTag}
                      style={{width: '27em', height: '15em', borderRadius: '1em', marginBottom: '1em' }}
                      className='image'
                  />

              </div>
              
            <div className='w-full h-full bg-green-400'>

              <div>
              {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. */}
              <div className='socials'>
                <a href='https://www.linkedin.com/in/k-kornienko/' target='_blank'><span><FaTwitter /></span></a>
                <a href='https://www.linkedin.com/in/k-kornienko/' target='_blank'><span><FaFacebook /></span></a>
                <a href='https://www.linkedin.com/in/k-kornienko/' target='_blank'><span><FaLinkedin /></span></a>
                <a href='https://www.linkedin.com/in/k-kornienko/' target='_blank'><span><FaInstagram /></span></a>
              </div>
              </div>
            </div> 
          </Modal.Body>
        </Modal>
        </div>
    )
}
