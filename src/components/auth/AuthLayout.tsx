
import { Heart } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  step?: number;
  totalSteps?: number;
}

const AuthLayout = ({ children, title, subtitle, step, totalSteps }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cella-rose-light to-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-cella-rose rounded-full p-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cella</h1>
          </div>

          {/* Progress Steps */}
          {step && totalSteps && (
            <div className="flex items-center justify-center mb-8 space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i + 1 <= step ? 'bg-cella-rose' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Title and Subtitle */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            {subtitle && <p className="text-cella-grey">{subtitle}</p>}
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
