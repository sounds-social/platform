import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { HeadProvider, Title } from 'react-head';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const StripeSuccess = () => {
  const location = useLocation();
  const history = useHistory();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');

    if (sessionId) {
      Meteor.call('stripe.checkPaymentStatus', sessionId, (error, result) => {
        if (error) {
          console.error('Error checking payment status:', error);
          setStatus('error');
          setMessage('There was an error processing your payment. Please try again or contact support.');
        } else if (result.success) {
          setStatus('success');
          setMessage('Payment successful! Your plan has been upgraded to PRO.');
          // Redirect to homepage after a short delay
          setTimeout(() => {
            history.push('/');
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Payment not successful. Please try again or contact support.');
        }
      });
    } else {
      setStatus('error');
      setMessage('Invalid payment session. Please try again.');
    }
  }, [location, history]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12">
      <HeadProvider>
        <Title>Payment Status - Sounds Social</Title>
      </HeadProvider>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="animate-spin text-blue-500 mb-4">
              <FiCheckCircle size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}
        {status === 'success' && (
          <div className="flex flex-col items-center">
            <FiCheckCircle className="text-green-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="flex flex-col items-center">
            <FiXCircle className="text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripeSuccess;
