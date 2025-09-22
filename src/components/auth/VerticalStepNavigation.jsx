import { FaCheckCircle } from "react-icons/fa";

const VerticalStepNavigation = ({ currentStep, steps, onStepClick, validateCurrentStep  }) => {
    const handleStepClick = (stepId) => {
        if (stepId > currentStep) {
            const errors = validateCurrentStep();
            if (Object.keys(errors).length > 0) {
                toast.error(Object.values(errors)[0]);
                return;
            }
        }
      
        if (onStepClick) onStepClick(stepId);
    };

    return(
        <div className="w-80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 py-11 rounded-2xl shadow-2xl sticky top-8 h-fit">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Partner Registration</h2>
                <p className="text-slate-400 text-sm">Complete all steps to join our platform</p>
            </div>

            <div className="">
                {steps.map((step, index) => (
                    <div key={step.id}>
                        <div
                            onClick={() => handleStepClick(step.id)}
                            className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                                currentStep === step.id
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30"
                                    : currentStep > step.id
                                    ? "bg-green-500/20 hover:bg-green-500/30"
                                    : "hover:bg-slate-700/50"
                            }`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                                    currentStep === step.id
                                        ? "bg-white text-orange-600 shadow-md"
                                        : currentStep > step.id
                                        ? "bg-green-500 text-white"
                                        : "bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-300"
                                }`}>
                                    {currentStep > step.id ? (
                                        <FaCheckCircle className="w-5 h-5" />
                                    ) : (
                                        <div className="text-lg">{step.icon}</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-semibold text-sm transition-colors duration-300 ${
                                        currentStep === step.id
                                            ? "text-white"
                                            : currentStep > step.id
                                            ? "text-green-200"
                                            : "text-slate-300 group-hover:text-white"
                                    }`}>
                                        {step.label}
                                    </h3>
                                    <p className={`text-xs mt-1 transition-colors duration-300 ${
                                        currentStep === step.id
                                            ? "text-orange-100"
                                            : currentStep > step.id
                                            ? "text-green-300"
                                            : "text-slate-500 group-hover:text-slate-400"
                                    }`}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                                
                        {/* Connection Line */}
                        {index < steps.length - 1 && (
                            <div className={`ml-9 h-2 w-0.5 transition-colors duration-500 ${
                                currentStep > step.id ? "bg-green-500" : "bg-slate-700"
                            }`} />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-slate-300 text-sm font-medium">Progress</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2 mb-2">
                    <div 
                        className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                </div>
                <p className="text-slate-400 text-xs">
                    Step {currentStep} of {steps.length} completed
                </p>
            </div>
        </div>
    );
};

export default VerticalStepNavigation;