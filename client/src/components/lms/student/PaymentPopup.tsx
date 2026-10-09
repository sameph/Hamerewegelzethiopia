"use client";

import { useState } from "react";
import { X, CreditCard, Landmark, Phone, Globe, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface PaymentPopupProps {
  course: {
    _id: string;
    title: string;
    price: number;
    currency: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentPopup({ course, onClose, onSuccess }: PaymentPopupProps) {
  const { user } = useAuth();
  const [method, setMethod] = useState<'local' | 'international'>('local');
  const [selectedSubMethod, setSelectedSubMethod] = useState("");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');

  const handlePay = async () => {
    setProcessing(true);
    
    try {
      if (selectedSubMethod === 'stripe') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/stripe/enroll/${course._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('lms_token')}`
          }
        });
        const data = await res.json();
        if (data.success && data.url) {
          window.location.href = data.url; // Redirect to Stripe Checkout
          return;
        } else {
          alert(data.message || "Failed to initiate Stripe session");
          setProcessing(false);
          return;
        }
      }

      if (selectedSubMethod === 'chapa') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/chapa/enroll/${course._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('lms_token')}`
          }
        });
        const data = await res.json();
        if (data.success && data.url) {
          window.location.href = data.url; // Redirect to Chapa Checkout
          return;
        } else {
          alert(data.message || "Failed to initiate Chapa session");
          setProcessing(false);
          return;
        }
      }

      // Local or other payment simulation (Keeping existing logic for local)
      setTimeout(async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/courses/${course._id}/enroll`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('lms_token')}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setStep('success');
            setTimeout(() => onSuccess(), 2000);
          } else {
            alert(data.message || "Enrollment failed");
            setProcessing(false);
          }
        } catch (err) {
          console.error(err);
          setProcessing(false);
        }
      }, 2000);
    } catch (err) {
      console.error(err);
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#08120f]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111f16] shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="relative p-8 md:p-12">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <X size={20} />
          </button>

          {step === 'select' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-black text-white">Enroll in Course</h3>
                <p className="text-slate-400 mt-2">Secure access to <span className="text-[#d6ff00] font-bold">{course.title}</span></p>
              </div>

              <div className="flex rounded-2xl bg-white/5 p-1">
                <button 
                  onClick={() => setMethod('local')}
                  className={`flex-1 rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all ${method === 'local' ? 'bg-[#d6ff00] text-[#08120f]' : 'text-slate-400 hover:text-white'}`}
                >
                  Local Payment
                </button>
                <button 
                  onClick={() => setMethod('international')}
                  className={`flex-1 rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all ${method === 'international' ? 'bg-[#d6ff00] text-[#08120f]' : 'text-slate-400 hover:text-white'}`}
                >
                  International
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {method === 'local' ? (
                  <>
                    <button 
                      onClick={() => setSelectedSubMethod("chapa")}
                      className={`flex flex-col items-center gap-3 rounded-3xl border p-6 transition-all ${selectedSubMethod === 'chapa' ? 'border-[#d6ff00] bg-[#d6ff00]/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <img src="https://chapa.co/favicon.png" className="h-10 w-10 grayscale-0" alt="Chapa" />
                      <span className="text-sm font-bold text-white">Chapa</span>
                    </button>
                    <button 
                      onClick={() => setSelectedSubMethod("telebirr")}
                      className={`flex flex-col items-center gap-3 rounded-3xl border p-6 transition-all ${selectedSubMethod === 'telebirr' ? 'border-[#d6ff00] bg-[#d6ff00]/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-black text-xs">tb</div>
                      <span className="text-sm font-bold text-white">Telebirr</span>
                    </button>
                    <button 
                      onClick={() => setSelectedSubMethod("cbe")}
                      className={`flex flex-col items-center gap-3 rounded-3xl border p-6 transition-all ${selectedSubMethod === 'cbe' ? 'border-[#d6ff00] bg-[#d6ff00]/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <Landmark className="text-purple-400" size={32} />
                      <span className="text-sm font-bold text-white">CBE Mobile</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setSelectedSubMethod("stripe")}
                      className={`flex flex-col items-center gap-3 rounded-3xl border p-6 transition-all ${selectedSubMethod === 'stripe' ? 'border-[#d6ff00] bg-[#d6ff00]/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <CreditCard className="text-blue-400" size={32} />
                      <span className="text-sm font-bold text-white">Credit Card</span>
                    </button>
                    <button 
                      onClick={() => setSelectedSubMethod("paypal")}
                      className={`flex flex-col items-center gap-3 rounded-3xl border p-6 transition-all ${selectedSubMethod === 'paypal' ? 'border-[#d6ff00] bg-[#d6ff00]/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <Globe className="text-yellow-400" size={32} />
                      <span className="text-sm font-bold text-white">PayPal</span>
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Order Total</p>
                   <p className="text-3xl font-black text-white">{course.currency} {course.price.toLocaleString()}</p>
                </div>
                <button 
                  disabled={!selectedSubMethod}
                  onClick={() => setStep('confirm')}
                  className="rounded-2xl bg-[#d6ff00] px-10 py-5 text-sm font-black text-[#08120f] shadow-xl shadow-[#d6ff00]/10 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
               {selectedSubMethod === 'paypal' ? (
                 <div className="space-y-6 py-4">
                    <div className="flex justify-center">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-8" alt="PayPal" />
                    </div>
                    <div className="rounded-3xl border border-white/5 bg-white/5 p-8 space-y-4">
                       <h4 className="text-lg font-bold text-white text-center">PayPal Express Checkout</h4>
                       <div className="space-y-2">
                          <input type="email" placeholder="PayPal Email" className="w-full rounded-xl bg-white/10 border border-white/10 py-3 px-4 text-sm" defaultValue={user?.email} />
                          <input type="password" placeholder="Password" className="w-full rounded-xl bg-white/10 border border-white/10 py-3 px-4 text-sm" defaultValue="••••••••" />
                       </div>
                       <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                          <span>Merchant: Hamere Wegel Ethiopia</span>
                          <span>{course.currency} {course.price}</span>
                       </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setStep('select')} className="flex-1 py-4 text-sm font-bold text-slate-400">Cancel</button>
                      <button onClick={handlePay} disabled={processing} className="flex-[2] rounded-2xl bg-[#ffc439] py-4 text-sm font-black text-[#003087]">
                         {processing ? "Connecting to PayPal..." : "Pay with PayPal"}
                      </button>
                    </div>
                 </div>
               ) : selectedSubMethod === 'stripe' ? (
                 <div className="space-y-6">
                    <div>
                       <h3 className="text-2xl font-black text-white">Credit Card Secure Pay</h3>
                       <p className="text-slate-400 mt-2">Enter your payment details below.</p>
                    </div>
                    <div className="rounded-[2rem] border border-white/5 bg-white/5 p-8 space-y-5 shadow-inner">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Card Number</label>
                          <div className="relative">
                             <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                             <input type="text" placeholder="#### #### #### ####" className="w-full rounded-2xl bg-white/5 border border-white/10 py-4 pl-12 pr-4 text-sm font-mono tracking-widest" defaultValue="4242 4242 4242 4242" />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Expiry</label>
                             <input type="text" placeholder="MM/YY" className="w-full rounded-2xl bg-white/5 border border-white/10 py-4 px-4 text-sm uppercase tracking-widest" defaultValue="12/26" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">CVC / CVV</label>
                             <input type="password" placeholder="•••" className="w-full rounded-2xl bg-white/5 border border-white/10 py-4 px-4 text-sm" defaultValue="123" />
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setStep('select')} className="flex-1 py-4 text-sm font-bold text-slate-400">Go Back</button>
                      <button onClick={handlePay} disabled={processing} className="flex-[2] rounded-2xl bg-[#d6ff00] py-4 text-sm font-black text-[#08120f] shadow-xl shadow-[#d6ff00]/20">
                         {processing ? "Verifying Card..." : `Pay ${course.currency} ${course.price}`}
                      </button>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-8 text-center py-6">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#d6ff00]/10 text-[#d6ff00]">
                       <ShieldCheck size={48} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white">Confirm {selectedSubMethod}</h3>
                       <p className="text-slate-400 mt-2">Finalizing enrollment for <span className="text-white font-bold">{course.title}</span></p>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => setStep('select')} className="flex-1 py-4 text-sm font-bold text-slate-400">Cancel</button>
                       <button 
                         disabled={processing}
                         onClick={handlePay}
                         className="flex-[2] rounded-2xl bg-[#d6ff00] py-5 text-sm font-black text-[#08120f] shadow-2xl"
                       >
                         {processing ? "Processing..." : "Complete Enrollment"}
                       </button>
                    </div>
                 </div>
               )}
            </div>
          )}

          {step === 'success' && (
             <div className="space-y-6 text-center py-10 animate-in zoom-in-95 duration-500">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#d6ff00] text-[#08120f]">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                   <h3 className="text-3xl font-black text-white">Success!</h3>
                   <p className="text-slate-400 mt-2">Your enrollment is confirmed. Welcome to the course!</p>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#d6ff00] animate-pulse">Redirecting to Dashboard...</p>
             </div>
          )}
        </div>

        <div className="bg-white/5 px-8 py-4 flex items-center justify-between border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
             <ShieldCheck size={14} /> 256-bit Secure Encryption
          </div>
          <div className="flex gap-4 grayscale opacity-30">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-2" alt="Visa" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
          </div>
        </div>
      </div>
    </div>
  );
}
