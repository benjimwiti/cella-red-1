
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
    <div className="min-h-screen cella-gradient flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-brand-red rounded-full p-4 shadow-card">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-brand-charcoal mb-2">Cella</h1>
          </div>

          {/* Progress Steps */}
          {step && totalSteps && (
            <div className="flex items-center justify-center mb-8 space-x-3">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i + 1 <= step ? 'bg-brand-red shadow-sm' : 'bg-brand-grey'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Title and Subtitle */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-brand-charcoal mb-3">{title}</h2>
            {subtitle && (
              <p className="text-brand-charcoal/70 leading-relaxed text-lg">{subtitle}</p>
            )}
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
