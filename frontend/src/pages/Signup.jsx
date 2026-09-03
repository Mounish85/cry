import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { REGISTERED_NGOS } from '../data/ngos';
import { 
  Shield, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Building2, 
  Loader2, 
  AlertCircle,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'FRONTLINER',
    ngoId: REGISTERED_NGOS[0]._id, // default to first NGO if Partner NGO is selected
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});

    // Client-side quick checks
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please enter your full name';
    if (!formData.email.trim()) errors.email = 'Please enter your email address';
    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.role === 'PARTNER_NGO' && !formData.ngoId) {
      errors.ngoId = 'Please select your partner NGO';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // Build request payload according to role
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === 'PARTNER_NGO') {
        payload.ngoId = formData.ngoId;
      }

      await signup(payload);
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setGeneralError(
          err.response?.data?.message || 'Registration failed. Please check your information.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-glow-blue mb-4">
            <div className="w-full h-full bg-[#0b1120] rounded-[14px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Join the CRY Monitoring Network as a Frontliner or Partner NGO
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
          {generalError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Aditi Sharma"
                  className={`w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 ${
                    fieldErrors.name ? 'border-red-500/80 focus:ring-red-500' : ''
                  }`}
                  disabled={loading}
                />
              </div>
              {fieldErrors.name && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. aditi.sharma@example.org"
                  className={`w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 ${
                    fieldErrors.email ? 'border-red-500/80 focus:ring-red-500' : ''
                  }`}
                  disabled={loading}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className={`w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 ${
                    fieldErrors.password ? 'border-red-500/80 focus:ring-red-500' : ''
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Operational Role <span className="text-blue-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.role === 'FRONTLINER'
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-glow-blue'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="FRONTLINER"
                    checked={formData.role === 'FRONTLINER'}
                    onChange={handleChange}
                    className="sr-only"
                    disabled={loading}
                  />
                  <UserCheck className={`w-5 h-5 mb-1 ${formData.role === 'FRONTLINER' ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold">Frontliner</span>
                  <span className="text-[10px] text-slate-400">Field Coordinator</span>
                </label>

                <label
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.role === 'PARTNER_NGO'
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-glow-blue'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="PARTNER_NGO"
                    checked={formData.role === 'PARTNER_NGO'}
                    onChange={handleChange}
                    className="sr-only"
                    disabled={loading}
                  />
                  <Building2 className={`w-5 h-5 mb-1 ${formData.role === 'PARTNER_NGO' ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold">Partner NGO</span>
                  <span className="text-[10px] text-slate-400">Implementing Org</span>
                </label>
              </div>
            </div>

            {/* NGO Dropdown — Only shown when PARTNER_NGO is selected */}
            {formData.role === 'PARTNER_NGO' && (
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>Select Registered Partner NGO <span className="text-blue-400">*</span></span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Select your organization name. Your NGO identifier is linked automatically.
                </p>
                <select
                  name="ngoId"
                  value={formData.ngoId}
                  onChange={handleChange}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white bg-slate-900 border border-slate-700 focus:ring-1 focus:ring-blue-500"
                  disabled={loading}
                >
                  {REGISTERED_NGOS.map((ngo) => (
                    <option key={ngo._id} value={ngo._id} className="bg-slate-900 text-white">
                      {ngo.name} ({ngo.region})
                    </option>
                  ))}
                </select>
                {fieldErrors.ngoId && (
                  <p className="text-[11px] text-red-400">{fieldErrors.ngoId}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-glow-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login redirection */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

