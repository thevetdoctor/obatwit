import React from 'react';
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png';
import dotenv from "dotenv";

dotenv.config();
export default function LinkedinAuth() {
    const { linkedInLogin } = useLinkedIn({
        clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
        redirectUri: `${window.location.origin}/linkedin`,
        onSuccess: (code) => {
          console.log(code, window.location.origin);
        },
        onError: (error) => {
          console.log(error);
        },
      });
    return (
        <img
            onClick={linkedInLogin}
            src={linkedin}
            alt="Login with Linked In"
            style={{ maxWidth: '170px', cursor: 'pointer', marginLeft: '90px' }}
      />
    )
}
