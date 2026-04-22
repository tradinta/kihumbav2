'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import SettingsNav from "@/components/settings/SettingsNav";
import { 
  Key, RefreshCw, Trash2, AlertTriangle, CheckCircle2,
  Loader2, Plus, ArrowRight, QrCode, Mail, Edit2, LogOut, ShieldAlert,
  ChevronRight, Shield, Lock, Fingerprint, Smartphone, ShieldCheck, History, Copy
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useSnackbar } from "@/context/SnackbarContext";
import { useAuth } from "@/context/AuthContext";
import { QRCodeSVG } from "qrcode.react";

import SettingsGuard from "@/components/settings/SettingsGuard";

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex items-center gap-3 mb-6 first:mt-0 pb-4 border-b border-[var(--border-color)]">
    <Icon size={16} className="text-primary-gold/70" strokeWidth={1.5} />
    <h3 className="text-[var(--text-main)] text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
  </div>
);

export default function SecuritySettingsPage() {
  return (
    <SettingsGuard title="Security & Access">
      <SecurityContent />
    </SettingsGuard>
  );
}

function SecurityContent() {
  const { session: currentSession } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  // MFA State
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [mfaStep, setMfaStep] = useState<'IDLE' | 'PASSWORD' | 'SETUP' | 'VERIFY'>('IDLE');
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaPassword, setMfaPassword] = useState("");
  const [isMfaLoading, setIsMfaLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [mfaMethod, setMfaMethod] = useState<'totp' | 'email-2fa' | 'sms-2fa' | null>(null);

  // Passkeys State
  const [passkeys, setPasskeys] = useState<any[]>([]);
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);

  // Sessions State
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionPage, setSessionPage] = useState(1);
  const SESSIONS_PER_PAGE = 5;

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  // Credential States (Password/Email)
  const [credentialView, setCredentialView] = useState<'root' | 'password' | 'email' | 'otp'>('root');
  const [credentialLoading, setCredentialLoading] = useState(false);
  const [credentialError, setCredentialError] = useState<string | null>(null);
  const [credentialSuccess, setCredentialSuccess] = useState<string | null>(null);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    fetchSecurityStatus();
  }, []);

  const fetchSecurityStatus = async () => {
    setIsPageLoading(true);
    try {
      // Fetch MFA Status
      const { data: twoFactorStatus } = await (authClient.twoFactor as any).getState();
      setIsTwoFactorEnabled(twoFactorStatus?.enabled || false);

      // Fetch Passkeys
      const { data: passkeyList } = await (authClient.passkey as any).listUserPasskeys();
      setPasskeys(passkeyList || []);

      // Fetch Sessions
      const { data: sessionList } = await authClient.listSessions();
      setSessions(sessionList || []);
    } catch (err) {
      console.error("Failed to fetch security status", err);
    } finally {
      setIsPageLoading(false);
    }
  };

  // ─── MFA Handlers ──────────────────────────────────────────────────────────

  const startMfaSetup = async (method?: 'totp' | 'email-2fa' | 'sms-2fa') => {
    setIsMfaLoading(true);
    const targetMethod = method || mfaMethod;
    if (method) setMfaMethod(method);
    
    // If we're coming from IDLE, move to PASSWORD step first
    if (mfaStep === 'IDLE' && targetMethod) {
      setMfaStep('PASSWORD');
      setIsMfaLoading(false);
      return;
    }

    try {
      const { data, error } = await (authClient.twoFactor as any).enable({
        method: targetMethod!,
        password: mfaPassword
      });
      if (error) throw error;
      
      if (targetMethod === 'totp' && data) {
        const uri = (data as any).totpURI;
        setTotpUri(uri);
        
        // Extract secret for manual entry
        const secretMatch = uri.match(/secret=([^&]+)/);
        if (secretMatch) {
          setTotpSecret(secretMatch[1]);
        }
        
        // Save backup codes now since they might not be available in verify step
        if ((data as any).backupCodes) {
          setBackupCodes((data as any).backupCodes);
        }
      }
      
      setMfaStep('SETUP');
    } catch (err: any) {
      showSnackbar(err.message || "Failed to start MFA setup", "error");
    } finally {
      setIsMfaLoading(false);
    }
  };

  const verifyMfa = async () => {
    if (mfaCode.length < 6) return;
    setIsMfaLoading(true);
    try {
      let result;
      if (mfaMethod === 'totp') {
        result = await authClient.twoFactor.verifyTotp({ code: mfaCode });
      } else {
        result = await authClient.twoFactor.verifyOtp({ code: mfaCode });
      }

      const { data, error } = result;
      if (error) throw error;
      
      // Some versions return backup codes here, others in enable
      if ((data as any).backupCodes) {
        setBackupCodes((data as any).backupCodes);
      }
      
      setIsTwoFactorEnabled(true);
      setMfaStep('VERIFY');
      showSnackbar("MFA enabled successfully. Save your backup codes!", "success");
    } catch (err: any) {
      showSnackbar(err.message || "Invalid verification code", "error");
    } finally {
      setIsMfaLoading(false);
    }
  };

  const disableMfa = async () => {
    const password = prompt("Please confirm your password to disable MFA:");
    if (!password) return;
    
    setIsMfaLoading(true);
    try {
      const { error } = await (authClient.twoFactor as any).disable({ password });
      if (error) throw error;
      setIsTwoFactorEnabled(false);
      showSnackbar("MFA has been disabled.", "info");
    } catch (err: any) {
      showSnackbar(err.message || "Failed to disable MFA", "error");
    } finally {
      setIsMfaLoading(false);
    }
  };

  // ─── Passkey Handlers ──────────────────────────────────────────────────────

  const addPasskey = async () => {
    setIsPasskeyLoading(true);
    try {
      const { data, error } = await authClient.passkey.addPasskey();
      if (error) throw error;
      showSnackbar(`Passkey "${data.name}" registered successfully.`, "success");
      fetchSecurityStatus();
    } catch (err: any) {
      showSnackbar(err.message || "Failed to register passkey", "error");
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  const deletePasskey = async (id: string) => {
    try {
      await authClient.passkey.deletePasskey({ id });
      showSnackbar("Passkey removed.", "info");
      fetchSecurityStatus();
    } catch (err: any) {
      showSnackbar("Failed to remove passkey", "error");
    }
  };

  // ─── Credential Handlers ──────────────────────────────────────────────────

  const resetCredentialForms = () => {
    setCurrentPassword("");
    setNewPassword("");
    setNewEmail("");
    setCredentialError(null);
    setCredentialSuccess(null);
  };

  const handleChangePassword = async () => {
    setCredentialLoading(true);
    setCredentialError(null);
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      setCredentialSuccess("Password updated successfully.");
      setTimeout(() => setCredentialView('root'), 2000);
    } catch (err: any) {
      setCredentialError(err.message || "Failed to update password.");
    } finally {
      setCredentialLoading(false);
    }
  };

  const handleEmailRequest = async () => {
    setCredentialLoading(true);
    setCredentialError(null);
    try {
      await authClient.changeEmail({
        newEmail,
        callbackURL: window.location.origin + '/settings',
      });
      setCredentialView('otp');
    } catch (err: any) {
      setCredentialError(err.message || "Email migration failed.");
    } finally {
      setCredentialLoading(false);
    }
  };

  // ─── Session Handlers ──────────────────────────────────────────────────────

  const revokeSession = async (token: string) => {
    try {
      const { error } = await authClient.revokeSession({ token });
      if (error) throw error;
      showSnackbar("Session revoked.", "info");
      // Optimistic update
      setSessions(prev => prev.filter(s => s.token !== token));
    } catch (err: any) {
      showSnackbar(err.message || "Failed to revoke session", "error");
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-color)]">
        <Loader2 className="animate-spin text-primary-gold" size={32} />
      </div>
    );
  }

  const getDeviceFriendlyName = (ua: string | null | undefined) => {
    if (!ua) return "Unknown Device";
    const lowerUA = ua.toLowerCase();
    
    let browser = "Browser";
    if (lowerUA.includes('chrome')) browser = 'Chrome';
    else if (lowerUA.includes('safari') && !lowerUA.includes('chrome')) browser = 'Safari';
    else if (lowerUA.includes('firefox')) browser = 'Firefox';
    else if (lowerUA.includes('edge')) browser = 'Edge';

    let os = "Device";
    if (lowerUA.includes('windows')) os = 'Windows';
    else if (lowerUA.includes('iphone') || lowerUA.includes('ipad')) os = 'iOS';
    else if (lowerUA.includes('android')) os = 'Android';
    else if (lowerUA.includes('macintosh')) os = 'macOS';
    else if (lowerUA.includes('linux')) os = 'Linux';

    return `${browser} on ${os}`;
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6 overflow-x-hidden font-inter">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12 px-4 lg:px-0">
        <TopBar />

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 mb-8"
        >
          <h1 className="text-4xl font-black tracking-tighter text-[var(--text-main)] mb-2">Security Vault</h1>
          <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.3em]">Identity Sovereignty & Access Control</p>
        </motion.div>

        <SettingsNav />

        <div className="space-y-6">
          
          {/* 0. CREDENTIALS SECTION (PASSWORD/EMAIL) */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 rounded-[6px] shadow-2xl"
          >
            <SectionHeader title="Access Credentials" icon={Lock} />
            
            <AnimatePresence mode="wait">
              {credentialView === 'password' ? (
                <motion.div key="password" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => setCredentialView('root')} className="text-zinc-500 hover:text-white transition-colors"><ArrowRight className="rotate-180" size={16} /></button>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Rotate Security Key</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1">Current Password</label>
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-[4px] px-4 py-3 text-xs text-white focus:border-primary-gold/50 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1">New Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-[4px] px-4 py-3 text-xs text-white focus:border-primary-gold/50 outline-none transition-all"
                        placeholder="Minimum 8 characters"
                      />
                    </div>
                    {credentialError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">{credentialError}</p>}
                    {credentialSuccess && <p className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">{credentialSuccess}</p>}
                    <button 
                      onClick={handleChangePassword}
                      disabled={credentialLoading || !currentPassword || !newPassword}
                      className="w-full py-4 bg-primary-gold text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-[4px] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {credentialLoading ? <RefreshCw className="animate-spin mx-auto" size={14} /> : "Update Access Credentials"}
                    </button>
                  </div>
                </motion.div>
              ) : credentialView === 'email' ? (
                <motion.div key="email" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => setCredentialView('root')} className="text-zinc-500 hover:text-white transition-colors"><ArrowRight className="rotate-180" size={16} /></button>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Migrate Digital Identity</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-gold/5 border border-primary-gold/10 rounded-[4px]">
                      <p className="text-[10px] text-primary-gold font-bold leading-relaxed">Identity migration requires verifying your new email address after confirming your current credentials.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1">New Email Address</label>
                      <input 
                        type="email" 
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-[4px] px-4 py-3 text-xs text-white focus:border-primary-gold/50 outline-none transition-all"
                        placeholder="new@domain.com"
                      />
                    </div>
                    {credentialError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">{credentialError}</p>}
                    <button 
                      onClick={handleEmailRequest}
                      disabled={credentialLoading || !newEmail}
                      className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-[4px] hover:bg-zinc-200 transition-all disabled:opacity-50"
                    >
                      {credentialLoading ? <RefreshCw className="animate-spin mx-auto" size={14} /> : "Request Migration Link"}
                    </button>
                  </div>
                </motion.div>
              ) : credentialView === 'otp' ? (
                <motion.div key="otp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <div className="size-16 bg-primary-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-gold">
                    <Mail size={32} />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-2">Check Your Inbox</h4>
                  <p className="text-[11px] text-zinc-500 max-w-xs mx-auto mb-8 font-medium leading-relaxed">A verification link has been sent to your new email address to finalize the migration.</p>
                  <button 
                    onClick={() => setCredentialView('root')}
                    className="text-[10px] font-black text-primary-gold uppercase tracking-widest hover:underline"
                  >
                    Return to Credentials
                  </button>
                </motion.div>
              ) : (
                <motion.div key="root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 gap-3">
                  <div 
                    onClick={() => { resetCredentialForms(); setCredentialView('password'); }}
                    className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-[var(--border-color)] group hover:border-primary-gold/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-zinc-900 border border-white/5 flex items-center justify-center text-primary-gold rounded-[4px]">
                        <Key size={18} />
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-white uppercase tracking-widest block">Password</span>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">Rotate Secret Key</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-zinc-700 group-hover:text-primary-gold transition-colors" />
                  </div>

                  <div 
                    onClick={() => { resetCredentialForms(); setCredentialView('email'); }}
                    className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-[var(--border-color)] group hover:border-primary-gold/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-zinc-900 border border-white/5 flex items-center justify-center text-primary-gold rounded-[4px]">
                        <Mail size={18} />
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-white uppercase tracking-widest block">Email</span>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">Migrate Identity</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-zinc-700 group-hover:text-primary-gold transition-colors" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 rounded-[6px] shadow-2xl"
          >
            <SectionHeader title="Passkeys" icon={Fingerprint} />
            
            <div className="space-y-6">
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">
                Passkeys use your device's biometrics or screen lock for a more secure, password-free login.
              </p>

              <div className="space-y-3">
                {passkeys.length > 0 ? (
                  passkeys.map((pk) => (
                    <div key={pk.id} className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-[var(--border-color)] group hover:border-primary-gold/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold">
                          <Fingerprint size={18} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest">{pk.name || "Biometric Key"}</h4>
                          <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-tighter">
                            Added {pk.createdAt ? new Date(pk.createdAt).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => deletePasskey(pk.id)}
                        className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Remove Passkey"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-8 px-4 border border-dashed border-[var(--border-color)] rounded-xl text-center">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">No passkeys added yet</p>
                  </div>
                )}

                <button 
                  onClick={addPasskey}
                  disabled={isPasskeyLoading}
                  className="w-full py-4 border-2 border-dashed border-[var(--border-color)] rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-primary-gold hover:border-primary-gold/30 hover:bg-primary-gold/5 transition-all group"
                >
                  {isPasskeyLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} className="group-hover:scale-125 transition-transform" />}
                  Register New Passkey
                </button>
              </div>
            </div>
          </motion.section>

          {/* 2. MFA SECTION */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 rounded-[6px] shadow-2xl overflow-hidden relative"
          >
             {isTwoFactorEnabled && (
                <div className="absolute top-0 right-0 p-4">
                   <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20">
                      <ShieldCheck size={12} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Active Protection</span>
                   </div>
                </div>
             )}

            <SectionHeader title="Security Verification" icon={Shield} />

            <AnimatePresence mode="wait">
              {mfaStep === 'IDLE' ? (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-primary-gold/5 border border-primary-gold/10">
                    <AlertTriangle size={20} className="text-primary-gold mt-1 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest mb-1">Security Verification</h4>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">
                        Two-factor authentication adds an extra layer of security. Choose how you want to receive your codes.
                      </p>
                    </div>
                  </div>

                  {!isTwoFactorEnabled ? (
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div 
                        onClick={() => startMfaSetup('totp')}
                        className="p-5 rounded-lg bg-black/20 border border-[var(--border-color)] hover:border-primary-gold/30 transition-all cursor-pointer text-center group"
                      >
                        <QrCode size={24} className="mx-auto mb-3 text-zinc-500 group-hover:text-primary-gold transition-colors" />
                        <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Authenticator</h5>
                        <p className="text-[8px] text-zinc-500 uppercase mt-1">App based codes</p>
                      </div>
                      <div 
                        onClick={() => startMfaSetup('email-2fa')}
                        className="p-5 rounded-lg bg-black/20 border border-[var(--border-color)] hover:border-primary-gold/30 transition-all cursor-pointer text-center group"
                      >
                        <Mail size={24} className="mx-auto mb-3 text-zinc-500 group-hover:text-primary-gold transition-colors" />
                        <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Email OTP</h5>
                        <p className="text-[8px] text-zinc-500 uppercase mt-1">Codes via Email</p>
                      </div>
                      <div 
                        onClick={() => startMfaSetup('sms-2fa')}
                        className="p-5 rounded-lg bg-black/20 border border-[var(--border-color)] hover:border-primary-gold/30 transition-all cursor-pointer text-center group opacity-50 cursor-not-allowed"
                        title="SMS provider not configured"
                      >
                        <Smartphone size={24} className="mx-auto mb-3 text-zinc-500" />
                        <h5 className="text-[10px] font-black text-white uppercase tracking-widest">SMS Code</h5>
                        <p className="text-[8px] text-zinc-500 uppercase mt-1">Phone verification</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                       <div className="p-4 rounded-xl border border-[var(--border-color)] bg-black/20 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="size-8 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold">
                               <ShieldCheck size={16} />
                             </div>
                             <span className="text-xs font-bold text-[var(--text-main)] uppercase tracking-widest">Active Protection Enabled</span>
                          </div>
                          <button 
                            onClick={disableMfa}
                            disabled={isMfaLoading}
                            className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500/10 px-4 py-2 rounded-lg transition-all"
                          >
                             Disable
                          </button>
                       </div>
                    </div>
                  )}
                </motion.div>
              ) : mfaStep === 'PASSWORD' ? (
                <motion.div key="password" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                   <div className="text-center space-y-2">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest">Confirm Identity</h4>
                      <p className="text-[10px] text-zinc-500 font-medium">Please enter your password to continue with security setup.</p>
                   </div>
                   <div className="space-y-4 max-w-xs mx-auto">
                      <input 
                        type="password" 
                        value={mfaPassword}
                        onChange={(e) => setMfaPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-black/40 border border-[var(--border-color)] rounded-xl px-4 py-4 text-xs font-bold tracking-widest text-center focus:border-primary-gold focus:outline-none transition-all"
                      />
                      <div className="flex gap-2">
                         <button 
                           onClick={() => { setMfaStep('IDLE'); setMfaPassword(""); }}
                           className="flex-1 py-4 bg-zinc-900 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all"
                         >
                           Cancel
                         </button>
                         <button 
                           onClick={() => startMfaSetup()}
                           disabled={isMfaLoading || !mfaPassword}
                           className="flex-[2] py-4 bg-primary-gold text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                         >
                           {isMfaLoading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={16} />}
                           Confirm
                         </button>
                      </div>
                   </div>
                </motion.div>
              ) : mfaStep === 'SETUP' ? (
                <motion.div key="setup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  {mfaMethod === 'totp' && (
                    <div className="text-center space-y-4 py-4">
                       <div className="mx-auto p-4 bg-white rounded-2xl inline-block shadow-2xl border-4 border-primary-gold/20">
                          {totpUri && <QRCodeSVG value={totpUri} size={180} />}
                       </div>
                       <div className="space-y-2">
                          <p className="text-[11px] text-[var(--text-main)] font-black uppercase tracking-widest">Scan with Authenticator</p>
                          <p className="text-[9px] text-[var(--text-muted)] font-medium max-w-xs mx-auto">Use Google Authenticator, Authy, or any TOTP app to scan the code above.</p>
                       </div>
                       <div className="flex items-center gap-2 p-3 rounded-lg bg-black/20 border border-white/5 max-w-xs mx-auto group/key">
                          <Key size={14} className="text-primary-gold" />
                          <code className="flex-1 text-[10px] font-mono text-[var(--text-main)] tracking-widest uppercase truncate">{totpSecret}</code>
                          <button 
                            onClick={() => {
                              if (totpSecret) {
                                navigator.clipboard.writeText(totpSecret);
                                showSnackbar("Secret key copied to clipboard", "success");
                              }
                            }}
                            className="p-1.5 hover:bg-primary-gold/10 rounded transition-colors text-primary-gold/40 hover:text-primary-gold"
                          >
                            <Copy size={12} />
                          </button>
                       </div>
                    </div>
                  )}

                  {mfaMethod === 'email-2fa' && (
                    <div className="text-center py-6">
                      <div className="size-16 bg-primary-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-gold">
                        <Mail size={32} />
                      </div>
                      <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Check Your Inbox</h4>
                      <p className="text-[11px] text-zinc-500 max-w-xs mx-auto mb-4 font-medium leading-relaxed">
                        We've sent a 6-digit verification code to your registered email address.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-primary-gold uppercase tracking-[0.2em] ml-1">Verification Code</label>
                       <div className="flex gap-4">
                          <input 
                            type="text" 
                            maxLength={6}
                            placeholder="000000"
                            value={mfaCode}
                            onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                            className="flex-1 bg-black/40 border border-[var(--border-color)] rounded-xl px-6 py-4 text-xl font-black tracking-[0.5em] text-center focus:border-primary-gold focus:outline-none transition-all placeholder:text-white/5"
                          />
                          <button 
                            onClick={verifyMfa}
                            disabled={isMfaLoading || mfaCode.length < 6}
                            className="bg-primary-gold text-black px-8 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center"
                          >
                             {isMfaLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={18} />}
                          </button>
                       </div>
                    </div>
                    <button 
                      onClick={() => { setMfaStep('IDLE'); setMfaCode(""); }}
                      className="w-full text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all py-2"
                    >
                      Change Method
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="verify" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center py-8">
                  <div className="size-20 bg-primary-gold/10 rounded-full flex items-center justify-center mx-auto text-primary-gold shadow-[0_0_50px_rgba(197,160,89,0.2)]">
                    <ShieldCheck size={40} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Protection Active</h4>
                    <p className="text-[11px] text-[var(--text-muted)] max-w-xs mx-auto font-medium">
                      Store these backup codes in a safe place. You can use them to recover your account if you lose access to your primary method.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                    {backupCodes.map((code, i) => (
                      <div key={i} className="p-3 bg-black/40 border border-white/5 rounded-[4px] font-mono text-[10px] text-zinc-400 tracking-widest">
                        {code}
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => { setMfaStep('IDLE'); setMfaMethod(null); }}
                    className="mt-6 px-10 py-4 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* 3. ACTIVE SESSIONS */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 rounded-[6px] shadow-2xl"
          >
            <SectionHeader title="Active Sessions" icon={Smartphone} />
            
            <div className="space-y-4">
              {sessions.slice(0, sessionPage * SESSIONS_PER_PAGE).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-[var(--border-color)] group hover:border-primary-gold/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold">
                      <Smartphone size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest">
                        {getDeviceFriendlyName(session.userAgent)}
                      </h4>
                      <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-tighter">
                        {session.ipAddress} • {new Date(session.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {/* Identify the current device and prevent revocation of the active session */}
                  {session.token === currentSession?.token ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary-gold/10 border border-primary-gold/20 rounded-lg">
                       <div className="size-1.5 bg-primary-gold rounded-full animate-pulse" />
                       <span className="text-[8px] font-black text-primary-gold uppercase tracking-[0.2em]">Active Device</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => revokeSession(session.token)}
                      className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500/10 px-3 py-1 rounded transition-all opacity-0 group-hover:opacity-100"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}

              {sessions.length > sessionPage * SESSIONS_PER_PAGE && (
                <div className="pt-4 flex justify-center">
                  <button 
                    onClick={() => setSessionPage(prev => prev + 1)}
                    className="text-[9px] font-black text-primary-gold uppercase tracking-[0.2em] border border-primary-gold/20 px-6 py-2 rounded-full hover:bg-primary-gold/10 transition-all"
                  >
                    Load More Sessions
                  </button>
                </div>
              )}

              {sessions.length === 0 && (
                <div className="py-8 text-center">
                   <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">No active sessions found</p>
                </div>
              )}
            </div>
          </motion.section>

          {/* 5. SECURITY AUDIT LOG */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 rounded-[6px] shadow-2xl"
          >
             <SectionHeader title="Security Audit Log" icon={History} />
             <div className="space-y-4">
                <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-4">Critical Access Timeline</p>
                
                {/* Simulated Logs for now - In a real app, these come from the prisma SecurityAuditLog table */}
                <div className="space-y-3 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-white/5">
                   <div className="flex gap-4 relative">
                      <div className="size-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 z-10 shrink-0">
                         <CheckCircle2 size={16} />
                      </div>
                      <div className="pt-1.5">
                         <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Security Audit System Initialized</h4>
                         <p className="text-[9px] text-zinc-500 uppercase tracking-tighter mt-1 font-bold">Identity Sovereignty Protection Active</p>
                      </div>
                   </div>
                </div>

                <div className="mt-6 p-4 bg-white/[0.02] border border-white/5 rounded-[4px]">
                   <p className="text-[10px] text-zinc-500 leading-relaxed italic font-medium">
                      Note: All identity migrations (Email/Password) are recorded permanently. In the event of a breach, these logs allow the Kihumba Sovereignty Team to trace and revert unauthorized changes.
                   </p>
                </div>
             </div>
          </motion.section>

          {/* 4. DANGER ZONE */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-red-500/10 bg-red-500/[0.02] p-6 sm:p-8 rounded-[6px] shadow-2xl"
          >
             <SectionHeader title="Sovereignty Termination" icon={ShieldAlert} />
             <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
                <div className="max-w-md">
                   <h4 className="text-xs font-black text-red-500 uppercase tracking-widest">Decommission Account</h4>
                   <p className="text-[11px] text-[var(--text-muted)] font-medium mt-1 leading-relaxed">
                      Entering sleep mode will hide your profile and content. Permanent removal is irreversible and will purge all data from the Kihumba mainframes.
                   </p>
                </div>
                <button className="flex items-center gap-2 text-red-500 font-black text-[9px] uppercase tracking-[0.3em] border border-red-500/20 bg-red-500/5 px-6 py-4 hover:bg-red-500 hover:text-black transition-all rounded-[4px] w-full sm:w-auto justify-center group shadow-lg shadow-red-500/5">
                   <LogOut size={14} className="group-hover:rotate-180 transition-transform duration-500" /> 
                   Initialize Exit
                </button>
             </div>
          </motion.section>

        </div>
      </main>

      <RightSidebar />
      <BottomNav />
    </div>
  );
}
