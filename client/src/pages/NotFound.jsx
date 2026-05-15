import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 relative z-10">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[300px] h-[300px] bg-error/20 blur-[100px] rounded-full -z-10"></div>

      <div className="glass p-2xl rounded-xl voxly-glow border border-error/20 text-center max-w-[500px]">
        <div className="w-20 h-20 bg-error-container text-on-error-container rounded-2xl flex items-center justify-center mx-auto mb-lg">
          <span className="material-symbols-outlined text-4xl">travel_explore</span>
        </div>
        <h1 className="text-9xl font-display-lg font-black bg-clip-text text-transparent brand-gradient mb-4">
          404
        </h1>
        <h2 className="font-headline-xl text-headline-xl text-on-surface mb-sm">Lost in Space</h2>
        <p className="text-on-surface-variant text-lg mb-xl font-medium">
          The page you are looking for has drifted into the unknown. Let's get you back to civilization.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" className="px-xl py-md">
            <span className="material-symbols-outlined text-sm mr-xs">rocket_launch</span>
            Return to Base
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
