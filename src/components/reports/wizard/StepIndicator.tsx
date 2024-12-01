import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  completedSteps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps,
}) => {
  return (
    <div className="mb-6">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center justify-center space-x-8">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className="relative">
              {stepIdx !== steps.length - 1 && (
                <div className="absolute top-4 left-7 w-full h-0.5 bg-gray-200">
                  <div
                    className="h-0.5 bg-blue-600 transition-all duration-300"
                    style={{
                      width: completedSteps.includes(step.id) ? '100%' : '0%',
                    }}
                  />
                </div>
              )}
              
              <div className="relative flex flex-col items-center group">
                <span className={`
                  h-8 w-8 flex items-center justify-center rounded-full transition-all
                  ${completedSteps.includes(step.id)
                    ? 'bg-blue-600'
                    : currentStep === step.id
                    ? 'border-2 border-blue-600 bg-white'
                    : 'border-2 border-gray-300 bg-white'
                  }
                `}>
                  {completedSteps.includes(step.id) ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className={`text-sm font-medium ${
                      currentStep === step.id ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {stepIdx + 1}
                    </span>
                  )}
                </span>
                
                <span className={`mt-2 text-xs font-medium ${
                  currentStep === step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                
                <div className="absolute bottom-full mb-2 hidden group-hover:block">
                  <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    {step.description}
                  </div>
                  <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default StepIndicator;