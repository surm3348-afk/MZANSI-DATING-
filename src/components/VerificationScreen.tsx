import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Camera, Upload, AlertCircle, Sparkles, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { CloverIcon } from './CloverLogo';
import { VerificationType } from '../types';

interface VerificationScreenProps {
  currentVerification: VerificationType;
  onUpdateVerification: (type: VerificationType) => void;
  onBack?: () => void;
  onContinueToDiscover?: () => void;
}

export const VerificationScreen: React.FC<VerificationScreenProps> = ({
  currentVerification,
  onUpdateVerification,
  onBack,
  onContinueToDiscover
}) => {
  const [activeStep, setActiveStep] = useState<'overview' | 'selfie' | 'id_upload' | 'completed'>('overview');
  const [livenessStage, setLivenessStage] = useState<number>(0);
  const [livenessProgress, setLivenessProgress] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  
  // ID Upload states
  const [documentType, setDocumentType] = useState('SA Smart ID Card');
  const [blurSensitiveData, setBlurSensitiveData] = useState(true);
  const [idUploaded, setIdUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startLivenessCheck = () => {
    setActiveStep('selfie');
    setIsScanning(true);
    setLivenessStage(1); // Stage 1: Align Face
    setLivenessProgress(20);

    setTimeout(() => {
      setLivenessStage(2); // Stage 2: Turn head slightly right
      setLivenessProgress(55);
    }, 1800);

    setTimeout(() => {
      setLivenessStage(3); // Stage 3: Smile warmly
      setLivenessProgress(85);
    }, 3600);

    setTimeout(() => {
      setLivenessStage(4); // Stage 4: Verified
      setLivenessProgress(100);
      setIsScanning(false);
    }, 5200);
  };

  const handleFinishVerification = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onUpdateVerification('purple');
      setActiveStep('completed');
    }, 1200);
  };

  return (
    <div className="w-full max-w-[430px] mx-auto px-4 py-5 flex flex-col justify-between min-h-[90vh]">
      {/* Header */}
      <div className="relative text-center pb-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute left-0 top-0 p-2 text-white/90 hover:text-white rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="flex items-center justify-center gap-2 mb-1">
          <CloverIcon size={22} />
          <span className="font-serif-mzansi text-lg font-bold tracking-wide text-[#9E7728]">
            Safety & Trust
          </span>
        </div>

        <h1 className="font-serif-mzansi text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
          Mzansi Verification
        </h1>
        <p className="text-white/90 text-xs mt-1">
          Protecting our community with gold-standard identity assurance
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[24px] p-5 shadow-xl shadow-purple-950/10 border border-white/60 relative z-10 backdrop-blur-sm overflow-y-auto max-h-[76vh]">
        {/* OVERVIEW STEP */}
        {activeStep === 'overview' && (
          <div className="space-y-4">
            {/* Current Badge Status */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center shrink-0">
                {currentVerification === 'purple' ? (
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800">Your Current Status:</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    currentVerification === 'purple' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {currentVerification === 'purple' ? 'Purple Verified' : 'Blue Verified'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {currentVerification === 'purple' 
                    ? '100% verified with liveness video & ID document.' 
                    : 'Email confirmed. Upgrade to Purple for priority visibility & VIP chats.'}
                </p>
              </div>
            </div>

            {/* Verification Tiers Explained */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mzansi Trust Badges
              </h3>

              {/* Blue Tick explanation */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">Blue Tick</span>
                    <span className="text-[10px] text-slate-500">Email & Phone Verified</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Standard safety level. Confirms the user has an active phone number and authenticated email address.
                  </p>
                </div>
              </div>

              {/* Purple Tick explanation */}
              <div className="p-3 bg-purple-50/80 rounded-xl border border-purple-200 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-purple-950">Purple Tick</span>
                    <span className="text-[10px] bg-purple-200/60 text-purple-800 px-1.5 py-0.2 rounded font-semibold">Video Selfie + ID</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Highest prestige level. Proven 3D video selfie match against valid photo ID. Unlocks VIP creator requests and 5x match rate.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits list */}
            <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-1.5 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles size={14} className="text-[#C5A253]" />
                <span>Why Get Purple Verified?</span>
              </div>
              <ul className="text-[11px] text-slate-600 space-y-1 pl-5 list-disc">
                <li>Eliminate bots and catfishes completely</li>
                <li>Unlock access to verified VIP meetups and private chats</li>
                <li>Stand out at the top of the Mzansi Discover feed</li>
              </ul>
            </div>

            {/* Start Button */}
            <button
              type="button"
              onClick={startLivenessCheck}
              className="w-full py-3 px-4 bg-gold-gradient text-white font-semibold text-sm rounded-xl shadow-md shadow-[#C5A253]/25 hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera size={16} />
              <span>Start Selfie Liveness Check</span>
            </button>
          </div>
        )}

        {/* STEP 2: LIVENESS CAMERA CHECK */}
        {activeStep === 'selfie' && (
          <div className="text-center space-y-4">
            <h3 className="font-serif-mzansi text-lg font-bold text-slate-900">
              3D Liveness Selfie Scan
            </h3>
            <p className="text-xs text-slate-500">
              Hold your phone at eye level. Make sure your face is well-lit.
            </p>

            {/* Oval Camera Viewport */}
            <div className="relative w-52 h-64 mx-auto rounded-[100px] border-4 border-dashed border-[#C5A253] overflow-hidden bg-gradient-to-b from-purple-100 to-slate-200 flex flex-col items-center justify-center shadow-inner">
              {/* Simulated camera background */}
              <img
                src="/src/assets/images/mzansi_profile_thandeka_1792002715162.jpg"
                alt="Camera Stream Simulation"
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isScanning ? 'scale-105 filter brightness-105' : ''
                }`}
              />

              {/* Oval Scanner Overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-purple-500/15 pointer-events-none">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse absolute top-1/2 -translate-y-1/2"></div>
                </div>
              )}

              {/* Status Indicator over camera */}
              <div className="absolute bottom-3 inset-x-3 bg-black/65 backdrop-blur-xs text-white rounded-xl py-1.5 px-2 text-[11px] font-medium">
                {livenessStage === 1 && '📍 Center your face in the oval...'}
                {livenessStage === 2 && '➡️ Turn head slightly to the right...'}
                {livenessStage === 3 && '😊 Smile for the camera...'}
                {livenessStage === 4 && '✅ Liveness confirmed!'}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gold-gradient h-full transition-all duration-500"
                style={{ width: `${livenessProgress}%` }}
              ></div>
            </div>

            {livenessStage === 4 ? (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>3D Face Geometry Verified Successfully!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStep('id_upload')}
                  className="w-full py-3 bg-gold-gradient text-white font-semibold text-xs rounded-xl shadow-md hover:shadow cursor-pointer"
                >
                  Continue to ID Document Upload →
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                Scanning biometric patterns... ({livenessProgress}%)
              </div>
            )}
          </div>
        )}

        {/* STEP 3: ID UPLOAD & BLUR DATA */}
        {activeStep === 'id_upload' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif-mzansi text-lg font-bold text-slate-900">
                Upload Identification Document
              </h3>
              <p className="text-xs text-slate-500">
                Government issued ID to guarantee high integrity matching.
              </p>
            </div>

            {/* Document Type Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C5A253]"
              >
                <option value="SA Smart ID Card">🇿🇦 South African Smart ID Card</option>
                <option value="Green Barcoded ID">🇿🇦 Green Barcoded ID Book</option>
                <option value="South African Passport">🇿🇦 South African Passport</option>
                <option value="International Passport">🌍 International Passport</option>
                <option value="Drivers License">🚗 Valid Driver's License</option>
              </select>
            </div>

            {/* Blur Sensitive Data Toggle */}
            <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-purple-600">
                  {blurSensitiveData ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">
                    Privacy Shield (POPIA)
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Automatically mask your national ID number
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBlurSensitiveData(!blurSensitiveData)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  blurSensitiveData ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    blurSensitiveData ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Document Preview Card */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50/60 text-center">
              {idUploaded ? (
                <div className="space-y-2">
                  <div className="relative mx-auto w-64 h-36 bg-gradient-to-r from-emerald-100 to-teal-50 border border-emerald-300 rounded-xl p-3 text-left shadow-xs flex flex-col justify-between">
                    <div className="flex justify-between items-center text-[10px] text-emerald-900 font-semibold">
                      <span>REPUBLIC OF SOUTH AFRICA</span>
                      <span>SMART ID</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-14 bg-emerald-200 rounded border border-emerald-400 overflow-hidden">
                        <img
                          src="/src/assets/images/mzansi_profile_thandeka_1792002715162.jpg"
                          alt="ID Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[11px] space-y-0.5">
                        <div className="font-bold text-slate-800">THANDEKA ZULU</div>
                        <div className="text-slate-500 text-[10px]">DOB: 12 AUG 2001</div>
                        <div className="font-mono text-slate-700">
                          ID: {blurSensitiveData ? '010812 •••• •••' : '010812 5028 084'}
                        </div>
                      </div>
                    </div>
                    <div className="text-[9px] text-emerald-700 font-mono flex justify-between">
                      <span>VERIFIED BIOMETRIC MATCH</span>
                      <span className="font-bold">STATUS: VALID</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium inline-block">
                    ✓ Document Scanned & Encrypted
                  </span>
                </div>
              ) : (
                <div className="py-4 space-y-2">
                  <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center text-slate-400 shadow-xs">
                    <Upload size={20} />
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    Take Photo or Upload Front of ID
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    JPEG, PNG or PDF. Max 10MB. Document will be securely wiped after verification.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIdUploaded(true)}
                    className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-medium hover:bg-slate-800 cursor-pointer"
                  >
                    Simulate Document Scan
                  </button>
                </div>
              )}
            </div>

            {/* Admin Approval Queue Notice */}
            <div className="p-3 bg-slate-100/80 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
              <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Admin Approval Queue:</strong> AI biometric verification matches in real-time. Manual high-trust moderation completes within 2 minutes.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={!idUploaded || isSubmitting}
              onClick={handleFinishVerification}
              className={`w-full py-3.5 px-4 font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                idUploaded && !isSubmitting
                  ? 'bg-gold-gradient text-white shadow-[#C5A253]/25 hover:shadow-lg cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Submitting to Admin Queue...</span>
                </div>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Get Purple Verified Badge Now</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 4: COMPLETED CELEBRATION */}
        {activeStep === 'completed' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto flex items-center justify-center text-purple-600 shadow-md">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <h3 className="font-serif-mzansi text-2xl font-bold text-purple-950">
                Halala! You Are Purple Verified
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Your profile now displays the coveted purple checkmark. Enjoy unlocked VIP chat privileges and top placement on Discover.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 inline-flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">Purple Badge Active</div>
                <div className="text-slate-500 text-[10px]">Approved by Mzansi Trust Team</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onContinueToDiscover}
              className="w-full py-3.5 bg-gold-gradient text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg cursor-pointer"
            >
              Explore Discover Feed →
            </button>
          </div>
        )}
      </div>

      <div className="text-center py-2 text-[10px] text-white/80">
        All verification files are cryptographically salted and POPIA compliant.
      </div>
    </div>
  );
};
