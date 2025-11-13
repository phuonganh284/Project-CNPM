import React, { useState, useEffect } from 'react';

const DAMAGE_RANGES = {
    MINOR: { min: 5, max: 10, default: 5 },
    MODERATE: { min: 20, max: 40, default: 20 },
    SEVERE: { min: 60, max: 80, default: 60 },
    LOST: { min: 100, max: 100, default: 100 },
};

const AssessDrawer = ({ isOpen, onClose, returnRequest, bookData, onSave }) => {
    const [condition, setCondition] = useState('OK');
    const [damageLines, setDamageLines] = useState([]);
    const [overdueRate, setOverdueRate] = useState(1); // % of book price per day
    
    const bookPriceUSD = bookData?.price || 6;
    const bookPriceOriginal = Math.round(bookPriceUSD * 25000);
    
    const copyCondition = returnRequest?.borrowedCondition || 100;
    const bookPriceCurrent = Math.round((bookPriceOriginal * copyCondition) / 100);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !returnRequest) return null;

    const calculateOverdue = () => {
        const dueDate = new Date(returnRequest.due_date);
        const today = new Date();
        const daysLate = Math.max(0, Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)));
        const overdueFee = Math.round((daysLate * overdueRate * bookPriceCurrent) / 100);
        return { daysLate, overdueFee };
    };

    const { daysLate, overdueFee } = calculateOverdue();
    const damageFee = damageLines.reduce((sum, line) => sum + (line.subtotal || 0), 0);
    const totalFee = overdueFee + damageFee;

    const addDamageLine = () => {
        const defaultLevel = 'MINOR';
        const defaultPercentage = DAMAGE_RANGES[defaultLevel].default;
        setDamageLines([...damageLines, {
            id: Date.now(),
            level: defaultLevel,
            percentage: defaultPercentage,
            note: '',
            subtotal: Math.round((defaultPercentage * bookPriceCurrent) / 100)
        }]);
    };

    const removeDamageLine = (id) => {
        setDamageLines(damageLines.filter(line => line.id !== id));
    };

    const updateDamageLine = (id, field, value) => {
        setDamageLines(damageLines.map(line => {
            if (line.id === id) {
                const updated = { ...line, [field]: value };

                if (field === 'level') {
                    const newRange = DAMAGE_RANGES[value];
                    updated.percentage = newRange.default;
                    updated.subtotal = Math.round((newRange.default * bookPriceCurrent) / 100);
                }
                
                if (field === 'percentage') {
                    const range = DAMAGE_RANGES[line.level];
                    const clampedValue = Math.max(range.min, Math.min(value, range.max));
                    updated.percentage = clampedValue;
                    updated.subtotal = Math.round((clampedValue * bookPriceCurrent) / 100);
                }
                return updated;
            }
            return line;
        }));
    };

    const handleSaveAssessment = () => {
        if (onSave) {
            onSave(returnRequest.id, {
                condition,
                charge_total: totalFee,
                overdueFee,
                damageFee,
                damageLines
            });
        }
        onClose();
    };

    const damageLevelOptions = Object.keys(DAMAGE_RANGES).map(key => ({ value: key, label: key }));

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/50 z-[70] transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />
            <div className={`
                fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl z-[80]
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="bg-[#4A90E2] text-white px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="font-inter text-xl font-semibold">Assess & Receive</h2>
                        <p className="font-inter text-sm opacity-90">
                            Loan #{returnRequest.loanId} • {returnRequest.userName}
                        </p>
                        <p className="font-inter text-sm opacity-90">Book: {returnRequest.bookTitle}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-80px)] px-6 py-6">
                    
                    <div className="mb-6">
                        <h3 className="font-inter text-base font-semibold text-gray-800 mb-3">📦 Copy Information</h3>
                        <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Copy ID:</span>
                                <span className="text-gray-900 font-mono font-semibold">{returnRequest.copyId}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Condition:</span>
                                <span className={`font-semibold ${
                                    copyCondition >= 80 ? 'text-green-600' :
                                    copyCondition >= 60 ? 'text-blue-600' :
                                    copyCondition >= 50 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                    {copyCondition}%
                                </span>
                            </div>
                            <div className="border-t border-blue-200 pt-2 mt-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Original price:</span>
                                    <span className="text-gray-500 line-through">{bookPriceOriginal.toLocaleString()} đ</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700 font-medium">Current value:</span>
                                    <span className="text-blue-600 font-bold text-lg">
                                        {bookPriceCurrent.toLocaleString()} đ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200" />

                    <div className="mb-6">
                        <h3 className="font-inter text-base font-semibold text-gray-800 mb-3">📅 Overdue (tự động)</h3>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Days late:</span>
                                <span className="text-red-600 font-semibold">{daysLate} days</span>
                            </div>
                            <div className="flex justify-between text-sm items-center">
                                <span className="text-gray-600">Rate per day:</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={overdueRate}
                                        onChange={(e) => setOverdueRate(Number(e.target.value))}
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        className="w-16 px-2 py-1 border border-gray-300 rounded text-right"
                                    />
                                    <span className="text-gray-800">% × {bookPriceCurrent.toLocaleString()}đ</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-300 pt-2 mt-2">
                                <div className="flex justify-between font-semibold">
                                    <span className="text-gray-700">Overdue fee:</span>
                                    <span className="text-red-600">{overdueFee.toLocaleString()} đ</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200" />

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-inter text-base font-semibold text-gray-800">🛠️ Damage lines (nhập tay)</h3>
                            <button
                                onClick={addDamageLine}
                                className="text-[#4A90E2] font-inter text-sm font-medium hover:underline"
                            >
                                + Add line
                            </button>
                        </div>

                        {damageLines.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">No damage reported</p>
                        ) : (
                            <div className="space-y-3">
                                {damageLines.map(line => {
                                    const range = DAMAGE_RANGES[line.level];
                                    return (
                                    <div key={line.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-gray-600 block mb-1">Level</label>
                                                <select
                                                    value={line.level}
                                                    onChange={(e) => updateDamageLine(line.id, 'level', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                >
                                                    {damageLevelOptions.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600 block mb-1">Percentage (%)</label>
                                                <input
                                                    type="number"
                                                    value={line.percentage}
                                                    onChange={(e) => updateDamageLine(line.id, 'percentage', Number(e.target.value))}
                                                    onBlur={(e) => updateDamageLine(line.id, 'percentage', Number(e.target.value))} // Clamp on blur
                                                    step="1"
                                                    min={range.min}
                                                    max={range.max}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600 block mb-1">Note</label>
                                            <input
                                                type="text"
                                                value={line.note}
                                                onChange={(e) => updateDamageLine(line.id, 'note', e.target.value)}
                                                placeholder="Rách bìa, vết viết..."
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeDamageLine(line.id)}
                                            className="text-red-600 font-inter text-xs hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )})}
                                <div className="border-t border-gray-300 pt-3 mt-3">
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-gray-700">Damage fee:</span>
                                        <span className="text-orange-600">{damageFee.toLocaleString()} đ</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <hr className="my-6 border-gray-200" />

                    <div className="mb-6">
                        <h3 className="font-inter text-base font-semibold text-gray-800 mb-3">💰 Total Summary</h3>
                        <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Overdue:</span>
                                <span className="text-gray-800">{overdueFee.toLocaleString()} đ</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Damage:</span>
                                <span className="text-gray-800">{damageFee.toLocaleString()} đ</span>
                            </div>
                            <div className="border-t border-blue-300 pt-2 mt-2">
                                <div className="flex justify-between font-bold text-lg">
                                    <span className="text-gray-900">TOTAL:</span>
                                    <span className="text-[#4A90E2]">{totalFee.toLocaleString()} đ</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSaveAssessment}
                        className="w-full bg-[#4A90E2] text-white py-3 rounded-lg font-inter text-base font-semibold hover:bg-[#3A7BC8] transition-colors"
                    >
                        Save Assessment
                    </button>
                </div>
            </div>
        </>
    );
};

export default AssessDrawer;
