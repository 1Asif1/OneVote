import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, CheckCircle } from 'lucide-react';

const VerifyIdentity = () => {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would handle the file upload
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setVerified(true);
      setStep(step + 1);
    }, 2000);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto card">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Identity</h1>
          <p className="text-gray-600">This step helps us prevent fraud and ensure one person, one vote</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 flex items-center justify-center rounded-full text-white font-medium ${
                    step >= i ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  {step > i ? <CheckCircle className="h-5 w-5" /> : i}
                </div>
                <div className="text-sm font-medium mt-2 text-gray-700">
                  {i === 1 && 'ID Verification'}
                  {i === 2 && 'Face Recognition'}
                  {i === 3 && 'Confirmation'}
                </div>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-1 mt-5 rounded">
            <div
              className="bg-primary-600 h-1 rounded"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {step === 1 && (
          <div>
            <p className="mb-6 text-gray-600">
              Please upload a photo of your government-issued ID (passport, driver's license, or ID card)
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="mb-4 font-medium">Drag and drop your ID photo here</p>
              <p className="text-sm text-gray-500 mb-6">OR</p>
              <label className="btn btn-primary inline-block cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                Browse File
              </label>
            </div>

            {uploading && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-700 flex items-center">
                  <span className="mr-2 animate-spin">⟳</span> Uploading and verifying your ID...
                </p>
              </div>
            )}

            {verified && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-green-700 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" /> ID document verified successfully!
                </p>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-6 text-gray-600">
              Please take a selfie or upload a clear photo of your face for biometric verification
            </p>

            <div className="mb-6 border rounded-lg p-4 bg-gray-50">
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <Camera className="h-16 w-16 text-gray-400" />
              </div>
              <div className="mt-4 flex justify-center">
                <button className="btn btn-primary flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span>Take Photo</span>
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">OR</p>
              <label className="btn btn-secondary inline-block cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                Upload Photo
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="bg-green-50 rounded-full p-6 inline-flex mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Complete!</h2>
            <p className="text-gray-600 mb-8">
              Your identity has been verified successfully. You can now access your voting dashboard.
            </p>
            <p className="text-sm text-gray-500 mb-6">Your unique voter ID: <span className="font-medium">VT29857463</span></p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {step < 3 ? (
            <button
              className="btn btn-primary"
              onClick={handleNextStep}
              disabled={step === 1 && !verified}
            >
              {step === 2 ? 'Verify' : 'Next'}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleNextStep}>
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyIdentity;
 