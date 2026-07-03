import React, { useState } from 'react';
import { User, Student, Fee } from '../types';
import { Wallet, Plus, Trash2, ShieldCheck, CreditCard, CheckCircle2, AlertCircle, X, ExternalLink, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface FeesPageProps {
  currentUser: User;
  students: Student[];
  fees: Fee[];
  onAddFee: (newFee: Fee) => void;
  onPayFee: (feeId: string, transactionId: string) => void;
  onDeleteFee: (feeId: string) => void;
}

export default function FeesPage({
  currentUser,
  students,
  fees,
  onAddFee,
  onPayFee,
  onDeleteFee
}: FeesPageProps) {
  const isStudent = currentUser.role === 'student';
  const isAdmin = currentUser.role === 'admin';
  const isFaculty = currentUser.role === 'faculty';

  const [isAddingFee, setIsAddingFee] = useState(false);
  const [payingFee, setPayingFee] = useState<Fee | null>(null);

  // New Fee Invoice Form state
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [feeTitle, setFeeTitle] = useState('');
  const [feeAmount, setFeeAmount] = useState(100);
  const [feeDueDate, setFeeDueDate] = useState('');

  // Simulated Payment Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const currentStudent = isStudent ? students.find(s => s.email === currentUser.email) : null;

  // Revenue analytics for Admin
  const totalRevenueLogged = fees.reduce((sum, f) => sum + f.amount, 0);
  const revenueCollected = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const revenuePending = fees.filter(f => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !feeTitle || feeAmount <= 0) return;

    const newFee: Fee = {
      id: 'fee-' + Math.random().toString(36).substr(2, 9),
      studentId,
      title: feeTitle,
      amount: Number(feeAmount),
      dueDate: feeDueDate || '2026-07-31',
      status: 'unpaid'
    };

    onAddFee(newFee);
    setIsAddingFee(false);
    setFeeTitle('');
    setFeeAmount(100);
  };

  const handleConfirmMockPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingFee) return;

    setIsProcessingPayment(true);
    
    // Simulate API network latency
    setTimeout(() => {
      const generatedTxnId = 'TXN-' + Math.floor(Math.random() * 90000 + 10000) + '-' + Math.floor(Math.random() * 900 + 100);
      onPayFee(payingFee.id, generatedTxnId);
      setIsProcessingPayment(false);
      setPayingFee(null);
      setCardNumber('');
      setCardExpiry('');
      setCardCVV('');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Finance, Invoices & Fees</h1>
          <p className="text-xs text-slate-400 mt-0.5">Campus billing records and secure transaction portal</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddingFee(!isAddingFee)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Issue Billing Invoice
          </button>
        )}
      </div>

      {/* Admin issue invoice panel */}
      {isAddingFee && isAdmin && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm"
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Wallet className="h-4.5 w-4.5 text-indigo-600" /> Issue Student Billing Invoice
            </h3>
            <button onClick={() => setIsAddingFee(false)} className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleCreateInvoice} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Invoice Label</label>
              <input
                type="text"
                required
                value={feeTitle}
                onChange={(e) => setFeeTitle(e.target.value)}
                placeholder="e.g. Course Lab Fee - Semester 4"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Select Student</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Amount Due ($)</label>
              <input
                type="number"
                required
                min="10"
                value={feeAmount}
                onChange={(e) => setFeeAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Payment Deadline</label>
              <input
                type="date"
                required
                value={feeDueDate}
                onChange={(e) => setFeeDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
              />
            </div>

            <div className="flex items-end justify-end md:col-span-3">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Publish Invoice Bill
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* ADMIN REVENUE ANALYTICS BOX */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Issuances Logged</span>
            <p className="text-2xl font-bold text-slate-800 mt-1">${totalRevenueLogged.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">all pending & settled bills</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Total Settled Collections</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">${revenueCollected.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">
              settlement rate: {Math.round((revenueCollected / totalRevenueLogged) * 100) || 0}%
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">Outstanding Receivables</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">${revenuePending.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">requires student portal alert</p>
          </div>
        </div>
      )}

      {/* Student: Personal Invoice ledger */}
      {isStudent && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-md font-bold text-slate-800 flex items-center gap-2 mb-4">
            <CreditCard className="h-4.5 w-4.5 text-indigo-600" /> Settle Student Outstanding Bills
          </h2>

          <div className="space-y-3.5">
            {fees.filter(f => f.studentId === currentStudent?.id).length > 0 ? (
              fees.filter(f => f.studentId === currentStudent?.id).map(fee => (
                <div key={fee.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{fee.title}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Due: {fee.dueDate} {fee.transactionId && `• Txn: ${fee.transactionId}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-start md:self-auto">
                    <span className="text-lg font-bold font-mono text-slate-800">${fee.amount.toLocaleString()}</span>
                    
                    {fee.status === 'paid' ? (
                      <span className="text-[10px] font-bold px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Paid Settled
                      </span>
                    ) : (
                      <button
                        onClick={() => setPayingFee(fee)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                      >
                        Settle Balance <CreditCard className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-400 italic">No bill statements recorded for your ledger.</div>
            )}
          </div>
        </div>
      )}

      {/* MODAL MOCK CHECKOUT PAYMENT POPUP (STUDENT DELIVERABLE) */}
      {payingFee && isStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-200 p-6 rounded-3xl w-full max-w-md space-y-4 shadow-xl relative"
          >
            <button 
              onClick={() => setPayingFee(null)} 
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Secure Payment Gateway</h3>
                <p className="text-[10px] text-slate-400">Smart Campus Automated Billing Portal</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Invoice:</span>
                <span className="font-semibold text-slate-700">{payingFee.title}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Amount:</span>
                <span className="font-mono font-bold text-slate-800">${payingFee.amount.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmMockPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Credit Card Number</label>
                <input
                  type="text"
                  required
                  pattern="\d{16}"
                  maxLength={16}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="4111222233334444"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs font-mono text-center tracking-widest placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/28"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs text-center placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">CVV Security</label>
                  <input
                    type="password"
                    required
                    pattern="\d{3}"
                    maxLength={3}
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs text-center placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="h-4.5 w-4.5 animate-spin" /> Authorizing with Bank...
                  </>
                ) : (
                  `Pay $${payingFee.amount.toLocaleString()} Now`
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* ADMIN/FACULTY LEDGER TABLE VIEW */}
      {(isAdmin || isFaculty) && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-indigo-600" /> Global Campus Invoicing Records
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs divide-y divide-slate-200">
              <thead>
                <tr className="text-slate-400 bg-slate-50/75">
                  <th className="px-4 py-3 font-bold">Student Name</th>
                  <th className="px-4 py-3 font-bold">Roll Number</th>
                  <th className="px-4 py-3 font-bold">Invoice Details</th>
                  <th className="px-4 py-3 font-mono font-bold">Amount</th>
                  <th className="px-4 py-3 font-bold">Deadline</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  {isAdmin && <th className="px-4 py-3 text-right font-bold">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {fees.map((fee) => {
                  const student = students.find(s => s.id === fee.studentId);
                  return (
                    <tr key={fee.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-slate-800">{student?.name || 'Deleted student'}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{student?.rollNumber || 'N/A'}</td>
                      <td className="px-4 py-3">{fee.title}</td>
                      <td className="px-4 py-3 font-mono font-bold">${fee.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{fee.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded ${
                          fee.status === 'paid' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm('Void and delete this student invoice record?')) {
                                onDeleteFee(fee.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Delete invoice"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
