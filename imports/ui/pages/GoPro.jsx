import React from 'react';

const GoPro = () => {
  return (
    <div className="container mx-auto">
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Go PRO!</h1>
            <p className="py-6">Support your favorite artists and get access to exclusive features.</p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <h2 className="card-title">PRO Plan</h2>
              <p className="text-2xl font-bold">$20/month</p>
              <ul className="list-disc list-inside">
                <li>Support your favorite musicians</li>
                <li>More features to come...</li>
              </ul>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Go PRO</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoPro;
