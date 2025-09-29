import { ShieldAlert, FileWarning } from "lucide-react";
import useAuthStore from "../../../store/useAuthStore";
import { Link } from "react-router-dom";

const VerificationBanner = () => {
  const { user } = useAuthStore();

  if (!user?.profile) return null;

  const { isVerified, documents } = user.profile;
  const missingDocs = !documents?.fssaiLicense || !documents?.gstCertificate || !documents?.panCard;

  // If verified & all documents uploaded -> no banner
  if (isVerified && !missingDocs) return null;

  return (
    <div className="space-y-4 min-h-fit">
      {/* Not Verified Banner */}
      {!isVerified && (
        <div className="flex flex-col h-[35vh] items-center justify-center gap-4 p-20 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl shadow-sm">
          <div className="p-3 bg-red-500 rounded-xl">
            <ShieldAlert size={28} className="text-white" />
          </div>
          <div className="flex-1 text-center">
            <h3 className="font-bold text-red-700 text-3xl">Restaurant Not Verified</h3>
            <p className="text-lg text-red-600">
              Your restaurant has not been verified by the admin yet. Please wait until the verification process is complete.
            </p>
          </div>
        </div>
      )}

      {/* Missing Documents Banner */}
      {missingDocs && (
        <div className="flex flex-col h-[35vh] items-center justify-center gap-4 p-20 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl shadow-sm">
          <div className="p-3 bg-yellow-500 rounded-xl">
            <FileWarning size={28} className="text-white" />
          </div>
          <div className="flex-1 text-center">
            <h3 className="font-bold text-yellow-700 text-3xl">Documents Pending</h3>
            <p className="text-lg text-yellow-600">
              Some required documents are not uploaded. Please upload all documents to proceed with verification.
            </p>
          </div>
          <Link
            to="/restaurant/dashboard/documents"
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Upload Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerificationBanner;