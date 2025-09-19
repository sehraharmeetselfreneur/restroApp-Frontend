import { FaCheckCircle } from 'react-icons/fa';

const MobileStepIndicator = ({ currentStep, steps }) => {
    return (
        <div className="bg-white border-b border-slate-200 rounded-2xl p-4 sticky top-0 z-50">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Step {currentStep} of {steps.length}</h2>
                <span className="text-orange-500 font-medium">{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
            
            <div className="relative">
                {/* Progress Bar */}
                <div className="h-2 bg-slate-200 rounded-full">
                    <div 
                        className="h-full bg-gradient-to-r from-red-600 to-green-400 rounded-full transition-all duration-500"
                        style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                </div>
                
                {/* Step Indicators */}
                <div className="absolute top-1 left-0 w-full flex justify-between -mt-4">
                    {steps.map((step, index) => (
                        <div 
                            key={step.id}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                currentStep > index + 1
                                    ? 'bg-green-500 text-white'
                                    : currentStep === index + 1
                                    ? 'bg-green-500 text-white'
                                    : 'bg-slate-200 text-slate-500'
                            }`}
                        >
                            {currentStep > index + 1 ? (
                                <FaCheckCircle className="w-4 h-4" />
                            ) : (
                                <span className="text-sm">{index + 1}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            <h3 className="mt-6 text-slate-800 font-medium">{steps[currentStep - 1].label}</h3>
            <p className="text-sm text-slate-500">{steps[currentStep - 1].description}</p>
        </div>
    );
};

export default MobileStepIndicator;
