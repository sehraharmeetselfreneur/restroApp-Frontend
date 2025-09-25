import { CheckCircle, CircleAlert, FileText, X } from "lucide-react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useAuthStore from "../../../store/useAuthStore";
import { Link } from "react-router-dom";
import { useState } from "react";

const Documents = () => {
    const { user } = useAuthStore();

    const [showFssai, setShowFssai] = useState(false);
    const [showGst, setShowGst] = useState(false);
    const maskNumber = (num) => "*".repeat(num.length - 4) + num.slice(-4);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-xl">
                    <FileText size={24} className="text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Legal Documents</h2>
                    <p className="text-gray-600">Verify your restaurant with required legal documents</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* FSSAI License */}
              <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:shadow-lg transition-all group">
                <div className="text-center">
                  <div className="p-4 bg-green-100 rounded-xl inline-block mb-4 group-hover:bg-green-200 transition-colors">
                    <FileText size={32} className="text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-lg">FSSAI License</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Food Safety and Standards Authority License
                  </p>
                  {user.profile.documents.fssaiLicense ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      {user.profile.isVerified ? (<CheckCircle size={20} />) : (<CircleAlert size={20} />)}
                      <span className="font-medium">{user.profile.isVerified ? "Verified" : "Not Verified"}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-red-600">
                      <X size={20} />
                      <span className="font-medium">Not Uploaded</span>
                    </div>
                  )}

                  {user.profile.documents.fssaiLicense ? (
                    <Link
                      to={user.profile.documents.fssaiLicense}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Document
                    </Link>
                  ) : (
                    <button className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      Upload Document
                    </button>
                  )}
                </div>
              </div>
              
              {/* GST Certificate */}
              <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:shadow-lg transition-all group">
                <div className="text-center">
                  <div className="p-4 bg-green-100 rounded-xl inline-block mb-4 group-hover:bg-green-200 transition-colors">
                    <FileText size={32} className="text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-lg">GST Certificate</h3>
                  <p className="text-sm text-gray-600 mb-4">Goods and Services Tax Registration</p>
                  {user.profile.documents.gstCertificate ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      {user.profile.isVerified ? (<CheckCircle size={20} />) : (<CircleAlert size={20} />)}
                      <span className="font-medium">{user.profile.isVerified ? "Verified" : "Not Verified"}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-red-600">
                      <X size={20} />
                      <span className="font-medium">Not Uploaded</span>
                    </div>
                  )}

                  {user.profile.documents.gstCertificate ? (
                    <Link
                      to={user.profile.documents.gstCertificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Document
                    </Link>
                  ) : (
                    <button className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      Upload Document
                    </button>
                  )}
                </div>
              </div>
              
              {/* PAN Card */}
              <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:shadow-lg transition-all group">
                <div className="text-center">
                  <div className="p-4 bg-green-100 rounded-xl inline-block mb-4 group-hover:bg-green-200 transition-colors">
                    <FileText size={32} className="text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-lg">PAN Card</h3>
                  <p className="text-sm text-gray-600 mb-4">Permanent Account Number</p>
                  {user.profile.documents.panCard ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      {user.profile.isVerified ? (<CheckCircle size={20} />) : (<CircleAlert size={20} />)}
                      <span className="font-medium">{user.profile.isVerified ? "Verified" : "Not Verified"}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-red-600">
                      <X size={20} />
                      <span className="font-medium">Not Uploaded</span>
                    </div>
                  )}

                  {user.profile.documents.panCard ? (
                    <Link
                      to={user.profile.documents.panCard}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Document
                    </Link>
                  ) : (
                    <button className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      Upload Document
                    </button>
                  )}
                </div>
              </div>
            </div>
                
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-4 text-lg">License Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* FSSAI */}
                <div className="p-4 bg-white rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-500">FSSAI Number</span>
                    <p className="text-lg font-mono text-gray-800 mt-1">
                      {showFssai
                        ? user.profile.licenseNumber.fssai
                        : maskNumber(user.profile.licenseNumber.fssai)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFssai(!showFssai)}
                    className="text-gray-500 p-2 rounded-xl cursor-pointer flex items-center justify-center hover:text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    {showFssai ? <FiEyeOff size={25} /> : <FiEye size={25} className="" />}
                  </button>
                </div>
                    
                {/* GST */}
                <div className="p-4 bg-white rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-500">GST Number</span>
                    <p className="text-lg font-mono text-gray-800 mt-1">
                      {showGst
                        ? user.profile.licenseNumber.gst
                        : maskNumber(user.profile.licenseNumber.gst)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowGst(!showGst)}
                    className="text-gray-500 p-2 rounded-xl cursor-pointer flex items-center justify-center hover:text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    {showGst ? <FiEyeOff size={25} /> : <FiEye size={25} className="" />}
                  </button>
                </div>
              </div>
            </div>
        </div>
    );
};

export default Documents;