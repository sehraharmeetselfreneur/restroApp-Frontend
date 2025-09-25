import { Banknote, Bell } from "lucide-react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useAuthStore from "../../../store/useAuthStore";
import { useState } from "react";

const BankDetails = () => {
    const { user } = useAuthStore();
    
    const [showAccountNumber, setShowAccountNumber] = useState(false);
    const [showIFSC, setShowIFSC] = useState(false);
    const maskText = (text) => {
        if (!text) return "";
        return "*".repeat(text.length - 4) + text.slice(-4);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-green-100 rounded-xl">
                    <Banknote size={24} className="text-green-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Bank Details</h2>
                    <p className="text-gray-600">Secure payment information for your restaurant</p>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <Bell size={16} className="text-amber-600" />
                    </div>
                    <p className="text-amber-800 text-sm font-medium">
                        Bank details are securely encrypted. Contact support to update banking information.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {/* Account Holder Name */}
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Account Holder Name
                        </label>
                        <p className="text-xl font-bold text-gray-800 mt-3">
                            {user?.bankDetails?.accountHolderName}
                        </p>
                    </div>

                    {/* Account Number */}
                    <div className="p-6 bg-gray-50 rounded-xl flex justify-between items-center">
                        <div>
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                Account Number
                            </label>
                            <p className="text-xl font-mono text-gray-800 mt-3 tracking-wider">
                                {showAccountNumber
                                    ? user?.bankDetails?.accountNumber
                                    : maskText(user?.bankDetails?.accountNumber)}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAccountNumber(!showAccountNumber)}
                            className="text-gray-500 cursor-pointer flex justify-center p-2 rounded-xl items-center hover:text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                            {showAccountNumber ? <FiEyeOff size={25} /> : <FiEye size={25} />}
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Bank Name */}
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Bank Name
                        </label>
                        <p className="text-xl font-bold text-gray-800 mt-3">
                            {user?.bankDetails?.bankName}
                        </p>
                    </div>

                    {/* IFSC Code */}
                    <div className="p-6 bg-gray-50 rounded-xl flex justify-between items-center">
                        <div>
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                IFSC Code
                            </label>
                            <p className="text-xl font-mono text-gray-800 mt-3 tracking-wider">
                                {showIFSC ? user?.bankDetails?.IFSC : maskText(user?.bankDetails?.IFSC)}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowIFSC(!showIFSC)}
                            className="text-gray-500 cursor-pointer flex justify-center p-2 rounded-xl items-center hover:text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                            {showIFSC ? <FiEyeOff size={25} /> : <FiEye size={25} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankDetails;