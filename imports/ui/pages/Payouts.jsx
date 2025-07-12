import React, { useState, useEffect } from 'react';
import { HeadProvider, Title } from 'react-head';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Payouts as PayoutsCollection } from '../../api/payouts';

const Payouts = () => {
  const { user, loading: userLoading } = useTracker(() => {
    const handle = Meteor.subscribe('users.me');
    return { user: Meteor.user(), loading: !handle.ready() };
  }, []);

  const [accountStatus, setAccountStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { payouts, loading: payoutsLoading } = useTracker(() => {
    const handle = Meteor.subscribe('payouts.myPayouts');
    return { 
      payouts: PayoutsCollection.find({ toUserId: Meteor.userId() }).fetch(), 
      loading: !handle.ready(),
    };
  }, []);

  console.log({ payouts, payoutsLoading })

  useEffect(() => {
    const fetchAccountStatus = async () => {
      if (user && user.profile?.stripeAccountId) {
        try {
          setLoadingStatus(true);
          const status = await Meteor.callAsync('stripe.getAccountStatus', user.profile.stripeAccountId);
          setAccountStatus(status);
        } catch (err) {
          console.error('Error fetching Stripe account status:', err);
          setError(err.reason || 'Failed to fetch Stripe account status.');
        } finally {
          setLoadingStatus(false);
        }
      } else {
        setLoadingStatus(false);
        setAccountStatus(null);
      }
    };

    if (!userLoading) {
      fetchAccountStatus();
    }
  }, [user, userLoading]);

  const handleOnboardStripe = async () => {
    try {
      setError(null);
      let accountId = user?.profile?.stripeAccountId;
      if (!accountId) {
        accountId = await Meteor.callAsync('stripe.createConnectAccount');
      }
      const accountLinkUrl = await Meteor.callAsync('stripe.createAccountLink', accountId);
      window.location.href = accountLinkUrl;
    } catch (err) {
      console.error('Error onboarding Stripe:', err);
      setError(err.reason || 'Failed to onboard with Stripe.');
    }
  };

  const handleProcessAllPendingPayouts = async () => {
    try {
      setError(null);
      setSuccess(null);
      const result = await Meteor.callAsync('stripe.processAllPendingPayouts');
      setSuccess(`Processed ${result.successCount} payouts. ${result.failedCount} failed.`);
    } catch (err) {
      console.error('Error processing payouts:', err);
      setError(err.reason || 'Failed to process payouts.');
    }
  };

  const totalUnprocessedAmount = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amountInCents, 0);

  if (userLoading) {
    return <div className="text-center py-8">Loading user data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <HeadProvider>
        <Title>Payouts - Sounds Social</Title>
      </HeadProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Your Payouts</h2>
          <p className="mt-4 text-lg text-gray-600">Manage your Stripe Connect account and view your payout history here.</p>
        </div>

        <div className="mt-10 bg-white rounded-lg shadow-lg p-6 md:p-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Stripe Connect Status</h3>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}
          {loadingStatus ? (
            <p className="text-gray-600">Loading Stripe Connect status...</p>
          ) : user && user.profile?.stripeAccountId ? (
            <div>
              <p className="text-gray-700">Account ID: {user.profile.stripeAccountId}</p>
              {accountStatus && (
                <div className="mt-2">
                  <p className="text-gray-700">Charges Enabled: {accountStatus.charges_enabled ? 'Yes' : 'No'}</p>
                  <p className="text-gray-700">Payouts Enabled: {accountStatus.payouts_enabled ? 'Yes' : 'No'}</p>
                  <p className="text-gray-700">Details Submitted: {accountStatus.details_submitted ? 'Yes' : 'No'}</p>
                  {!accountStatus.details_submitted && (
                    <button
                      onClick={handleOnboardStripe}
                      className="cursor-pointer mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                    >
                      Complete Onboarding
                    </button>
                  )}
                </div>
              )}
              {accountStatus?.payouts_enabled && totalUnprocessedAmount > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Available for Payout: ${(totalUnprocessedAmount / 100).toFixed(2)}</h3>
                  <div className="text-gray-600">
                    This amount is available for payout. Click the button below to process all pending payouts.
                  </div>
                  <button
                    onClick={handleProcessAllPendingPayouts}
                    className="cursor-pointer mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
                  >
                    Payout ${(totalUnprocessedAmount / 100).toFixed(2)}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4 italic">To start earning money click on the button below.</p>
              <button
                onClick={handleOnboardStripe}
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
              >
                Onboard with Stripe
              </button>
            </div>
          )}

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Payout History</h3>
          {payoutsLoading ? (
            <p className="text-gray-600">Loading payout history...</p>
          ) : payouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout._id}>
                      <td className="py-2 px-4 border-b text-gray-800">${(payout.amountInCents / 100).toFixed(2)}</td>
                      <td className="py-2 px-4 border-b text-gray-800">{payout.status}</td>
                      <td className="py-2 px-4 border-b text-gray-800">{new Date(payout.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No payout history found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payouts;
