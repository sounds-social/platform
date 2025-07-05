import React from 'react';
import { HeadProvider, Title } from 'react-head';

const TermsOfService = () => {
  return (
    <div className="container mx-auto p-8 prose">
      <HeadProvider>
        <Title>Terms of Service - Sounds Social</Title>
      </HeadProvider>
      <h1>Terms of Service (Placeholder)</h1>
      <p >
        Welcome to Sounds Social! These terms and conditions outline the rules and regulations for the use of Sounds Social's Website.
      </p>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing this website, we assume you accept these terms and conditions. Do not continue to use Sounds Social if you do not agree to take all of the terms and conditions stated on this page.
      </p>
      <h2>2. Content</h2>
      <p>
        Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
      </p>
      <h2>3. Accounts</h2>
      <p>
        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
      </p>
      <h2>4. Termination</h2>
      <p>
        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
      </p>
      <h2>5. Changes to Terms</h2>
      <p>
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
      </p>
      <p>
        By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
      </p>
    </div>
  );
};

export default TermsOfService;
