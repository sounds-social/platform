import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { HeadProvider, Title } from 'react-head';

const VerifyEmail = () => {
  const { token } = useParams();
  const history = useHistory();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    Accounts.verifyEmail(token, (error) => {
      if (error) {
        setStatus(`Verification failed: ${error.reason}`);
      } else {
        setStatus('Email verified successfully! Redirecting to the homepage...');
        setTimeout(() => {
          history.push('/');
        }, 3000);
      }
    });
  }, [token, history]);

  return (
    <div className="text-center py-8">
      <HeadProvider>
        <Title>Email Verification - Sounds Social</Title>
      </HeadProvider>
      <h1 className="text-2xl font-bold">{status}</h1>
    </div>
  );
};

export default VerifyEmail;
