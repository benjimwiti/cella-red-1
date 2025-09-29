import { useState } from 'react';
import AuthFlow from './AuthFlow';
import AuthLayout from './AuthLayout';

const LoginPage = () => {
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = () => {
    setIsComplete(true);
    // Here you would typically redirect to the main app
    // For now, we'll just show a success state
  };

  if (isComplete) {
    return (
      <AuthLayout title="Login Successful">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Login Successful!</h2>
            <p className="text-gray-600 mt-2">Welcome back to Cella</p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Welcome back">
      <AuthFlow onComplete={handleComplete} isLogin={true} />
    </AuthLayout>
  );
};

export default LoginPage;
