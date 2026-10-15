import React, { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, Heart, ShieldCheck, ArrowLeft } from 'lucide-react';
import { CloverIcon } from './CloverLogo';
import { COUNTRY_CODES, SA_PROVINCES } from '../data/mockData';
import { ProvinceSA, UserProfile } from '../types';

interface SignUpScreenProps {
  onSignUpSuccess: (newUser: Partial<UserProfile>) => void;
  onNavigateToLogin: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSignUpSuccess,
  onNavigateToLogin
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+27');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [regionType, setRegionType] = useState<'SA' | 'Africa' | 'Europe'>('SA');
  const [selectedProvince, setSelectedProvince] = useState<ProvinceSA>('Gauteng');
  const [selectedCountry, setSelectedCountry] = useState('South Africa');
  const [gender, setGender] = useState<'female' | 'male' | 'non-binary'>('female');
  const [lookingFor, setLookingFor] = useState<'men' | 'women' | 'everyone'>('men');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter your phone number');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    if (!ageConfirmed) {
      setErrorMessage('You must confirm you are 18 years or older');
      return;
    }

    setIsLoading(true);

    const newUserProfile: Partial<UserProfile> = {
      name: fullName.trim(),
      age: 24,
      gender,
      lookingFor,
      location: regionType === 'SA' ? `${selectedProvince}, South Africa` : selectedCountry,
      province: regionType === 'SA' ? selectedProvince : undefined,
      country: regionType === 'SA' ? 'South Africa' : selectedCountry,
      flag: COUNTRY_CODES.find(c => c.code === selectedCountryCode)?.flag || '🇿🇦',
      bio: 'New member ready to connect e Mzansi!',
      occupation: 'Professional',
      verification: 'blue', // email verified automatically upon signup
      isOnline: true,
      interests: ['Mzansi Life', 'Music', 'Travel', 'Good Food'],
      languages: ['English'],
      isVipCreator: false
    };

    setTimeout(() => {
      setIsLoading(false);
      onSignUpSuccess(newUserProfile);
    }, 700);
  };

  return (
    <div className="w-full max-w-[430px] mx-auto px-5 py-6 flex flex-col justify-between min-h-[92vh]">
      {/* Top Header */}
      <div className="relative text-center pt-1 pb-4">
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="absolute left-0 top-1 p-2 text-white/90 hover:text-white rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Back to login"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center justify-center gap-2 mb-2">
          <CloverIcon size={22} />
          <span className="font-serif-mzansi text-lg font-bold tracking-wide text-[#9E7728] drop-shadow-sm">
            Mzansi Dating
          </span>
        </div>

        <h1 className="font-serif-mzansi text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
          Create Your Profile
        </h1>
        <p className="text-white/90 text-xs mt-1 font-normal tracking-wide">
          Join South Africa's most classy & verified dating community
        </p>
      </div>

      {/* Main White Card */}
      <div className="bg-white rounded-[24px] p-5 shadow-xl shadow-purple-950/10 border border-white/60 relative z-10 backdrop-blur-sm overflow-y-auto max-h-[75vh]">
        {errorMessage && (
          <div className="mb-4 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#C5A253]">
                <User size={16} strokeWidth={1.8} />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Lerato Molefe"
                required
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-900 placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#C5A253]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#C5A253]">
                <Mail size={16} strokeWidth={1.8} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-900 placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#C5A253]"
              />
            </div>
          </div>

          {/* Phone with Country Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
              Phone Number (All Africa & Europe)
            </label>
            <div className="flex gap-2">
              <select
                value={selectedCountryCode}
                onChange={(e) => setSelectedCountryCode(e.target.value)}
                className="w-32 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C5A253]"
              >
                {COUNTRY_CODES.map((country) => (
                  <option key={country.name} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              <div className="relative flex-1 flex items-center">
                <div className="absolute left-3 text-[#C5A253]">
                  <Phone size={16} strokeWidth={1.8} />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="082 123 4567"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-900 placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#C5A253]"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
              Create Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#C5A253]">
                <Lock size={16} strokeWidth={1.8} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-900 placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#C5A253]"
              />
            </div>
          </div>

          {/* Location Selector (Province if SA, Country if Africa/Europe) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
              Location
            </label>
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl mb-2 text-xs">
              <button
                type="button"
                onClick={() => setRegionType('SA')}
                className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  regionType === 'SA' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇿🇦 South Africa
              </button>
              <button
                type="button"
                onClick={() => setRegionType('Africa')}
                className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  regionType === 'Africa' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌍 Rest of Africa
              </button>
              <button
                type="button"
                onClick={() => setRegionType('Europe')}
                className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  regionType === 'Europe' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇪🇺 Europe
              </button>
            </div>

            {regionType === 'SA' ? (
              <div className="relative">
                <div className="absolute left-3 top-3 text-[#C5A253]">
                  <MapPin size={16} />
                </div>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value as ProvinceSA)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C5A253]"
                >
                  {SA_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov} Province
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-3 top-3 text-[#C5A253]">
                  <MapPin size={16} />
                </div>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C5A253]"
                >
                  {COUNTRY_CODES.filter(c => regionType === 'Africa' ? (c.region === 'Africa' && c.name !== 'South Africa') : c.region === 'Europe').map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Gender & Looking For */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                My Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C5A253]"
              >
                <option value="female">Woman</option>
                <option value="male">Man</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Looking For
              </label>
              <select
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value as any)}
                className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C5A253]"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="everyone">Everyone</option>
              </select>
            </div>
          </div>

          {/* Mandatory 18+ Checkbox */}
          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-[#C5A253] border-slate-300 accent-[#C5A253]"
              />
              <span className="text-xs text-slate-700 leading-tight">
                <strong>I confirm that I am 18 years of age or older</strong> and agree to treat all community members with dignity and respect.
              </span>
            </label>
          </div>

          {/* Gold Gradient Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gold-gradient text-white font-semibold text-sm rounded-xl shadow-md shadow-[#C5A253]/25 hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Creating Profile...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-4 text-center text-xs text-slate-600">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-semibold text-[#B78E3E] hover:text-[#9E7728] underline underline-offset-2 transition-colors cursor-pointer"
          >
            Log In
          </button>
        </div>
      </div>

      <div className="text-center py-2 text-[10px] text-white/80">
        Protected by South African POPIA privacy laws · 100% Secure
      </div>
    </div>
  );
};
