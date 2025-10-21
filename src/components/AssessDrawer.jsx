import React, { useState, useEffect } from 'react';

const AssessDrawer = ({ isOpen, onClose, returnRequest, bookData, onSave }) => {
    const [condition, setCondition] = useState('OK');
    const [damageLines, setDamageLines] = useState([]);
    const [overdueRate, setOverdueRate] = useState(1); // % of book price per day
    
    // Get book price from bookData (convert USD to VND if needed)
    const bookPriceUSD = bookData?.price || 6; // Default $6
    const bookPrice = Math.round(bookPriceUSD * 25000); // Convert to VND (1 USD ≈ 25,000 VND)

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

    // Calculate overdue
    const calculateOverdue = () => {
        const dueDate = new Date(returnRequest.due_date);
        const today = new Date();
        const daysLate = Math.max(0, Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)));
        const overdueFee = Math.round((daysLate * overdueRate * bookPrice) / 100);
        return { daysLate, overdueFee };
    };

    const { daysLate, overdueFee } = calculateOverdue();

    // Calculate damage total
    const damageFee = damageLines.reduce((sum, line) => sum + (line.subtotal || 0), 0);

    // Total
    const totalFee = overdueFee + damageFee;

    // Add damage line
    const addDamageLine = () => {
        setDamageLines([...damageLines, {
            id: Date.now(),
            level: 'MODERATE',
            percentage: 30, // % of book price
            note: '',
            subtotal: Math.round((30 * bookPrice) / 100)
        }]);
    };

    // Remove damage line
    const removeDamageLine = (id) => {
        setDamageLines(damageLines.filter(line => line.id !== id));
    };

    // Update damage line
    const updateDamageLine = (id, field, value) => {
        setDamageLines(damageLines.map(line => {
            if (line.id === id) {
                const updated = { ...line, [field]: value };
                // Recalculate subtotal based on percentage
                if (field === 'percentage') {
                    updated.subtotal = Math.round((value * bookPrice) / 100);
                }
                return updated;
            }
            return line;
        }));
    };

    const handleSaveAssessment = () => {
        // Call parent callback to update status
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

    const damageLevelOptions = [
        { value: 'MINOR', label: 'MINOR', suggest: 10000 },
        { value: 'MODERATE', label: 'MODERATE', suggest: 40000 },
        { value: 'SEVERE', label: 'SEVERE', suggest: 100000 },
        { value: 'LOST', label: 'LOST', suggest: 0 }
    ];

    return (
        <>
            {/* Backdrop - dark overlay without blur */}
            <div 
                className="fixed inset-0 bg-black/50 z-[70] transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`
                fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl z-[80]
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                {/* Header */}
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

                {/* Content */}
                <div className="overflow-y-auto h-[calc(100vh-80px)] px-6 py-6">
                    
                    {/* Assess Condition */}
                    <div className="mb-6">
                        <h3 className="font-inter text-base font-semibold text-gray-800 mb-3">📋 Assess condition</h3>
                        <div className="flex flex-wrap gap-3">
                            {['OK', 'MINOR', 'MODERATE', 'SEVERE', 'LOST'].map(opt => (
                                <label key={opt} className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="condition"
                                        value={opt}
                                        checked={condition === opt}
                                        onChange={(e) => setCondition(e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="font-inter text-sm text-gray-700">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Penalty Reference Guide */}
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-inter text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Penalty Reference Guide
                        </h4>
                        <div className="space-y-3 text-xs">
                            {/* Overdue Reference */}
                            <div className="bg-white rounded-lg p-3">
                                <p className="font-semibold text-gray-800 mb-2">📅 Overdue Fee</p>
                                <div className="space-y-1 text-gray-700">
                                    <p><span className="font-medium">Formula:</span> Days late × Rate% × Book price</p>
                                    <p><span className="font-medium">Rate:</span> 1-5% of book price per day</p>
                                    <p><span className="font-medium">Book price:</span> {bookPrice.toLocaleString()} đ</p>
                                    <p className="text-gray-600 italic">Example: 3 days × 1% × 150,000đ = 4,500đ</p>
                                </div>
                            </div>

                            {/* Damage Reference */}
                            <div className="bg-white rounded-lg p-3">
                                <p className="font-semibold text-gray-800 mb-2">🛠️ Damage Fee</p>
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left py-1 px-2 font-medium text-gray-700">Level</th>
                                            <th className="text-left py-1 px-2 font-medium text-gray-700">% of Price</th>
                                            <th className="text-left py-1 px-2 font-medium text-gray-700">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700">
                                        <tr className="border-t">
                                            <td className="py-1 px-2 font-medium">MINOR</td>
                                            <td className="py-1 px-2">5-10%</td>
                                            <td className="py-1 px-2">Nhăn nhẹo, vết viết nhỏ</td>
                                        </tr>
                                        <tr className="border-t">
                                            <td className="py-1 px-2 font-medium">MODERATE</td>
                                            <td className="py-1 px-2">20-40%</td>
                                            <td className="py-1 px-2">Rách trang, bìa gãy</td>
                                        </tr>
                                        <tr className="border-t">
                                            <td className="py-1 px-2 font-medium">SEVERE</td>
                                            <td className="py-1 px-2">60-80%</td>
                                            <td className="py-1 px-2">Hư hỏng nặng, mất nhiều trang</td>
                                        </tr>
                                        <tr className="border-t">
                                            <td className="py-1 px-2 font-medium">LOST</td>
                                            <td className="py-1 px-2">100%</td>
                                            <td className="py-1 px-2">Mất sách → Charge giá mua mới</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p className="text-gray-600 italic mt-2">Note: Librarian điều chỉnh % theo tình trạng thực tế</p>
                            </div>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200" />

                    {/* Overdue Section */}
                    <div className="mb-6">
                        <h3 className="font-inter text-base font-semibold text-gray-800 mb-3">📅 Overdue (tự động)</h3>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Borrowed:</span>
                                <span className="text-gray-800">{returnRequest.borrowed_at}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Due date:</span>
                                <span className="text-gray-800">{returnRequest.due_date}</span>
                            </div>
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
                                    <span className="text-gray-800">% × {bookPrice.toLocaleString()}đ</span>
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

                    {/* Damage Lines */}
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
                                {damageLines.map(line => (
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
                                                    step="1"
                                                    min="0"
                                                    max="100"
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-gray-600 block mb-1">Book price (đ)</label>
                                                <input
                                                    type="text"
                                                    value={bookPrice.toLocaleString()}
                                                    disabled
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600 block mb-1">Subtotal (đ)</label>
                                                <input
                                                    type="text"
                                                    value={line.subtotal.toLocaleString()}
                                                    disabled
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100 font-semibold"
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
                                ))}
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

                    {/* Total Summary */}
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

                    {/* Save Button */}
                    <button
                        onClick={handleSaveAssessment}
                        className="w-full bg-[#4A90E2] text-white py-3 rounded-lg font-inter text-base font-semibold hover:bg-[#3A7BC8] transition-colors"
                    >
                        Save Assessment
                    </button>

                    <hr className="my-6 border-gray-200" />

                    {/* Receive Book Section (after assessment) */}
                    <div className="mb-6">
                        <h3 className="font-inter text-base font-semibold text-gray-800 mb-3">📦 Receive book (hoàn tất)</h3>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Condition:</span>
                                <span className="text-gray-800 font-semibold">{condition}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total charge:</span>
                                <span className="text-red-600 font-semibold">{totalFee.toLocaleString()} đ</span>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 bg-white text-gray-700 py-2 rounded-lg font-inter text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-inter text-sm font-semibold hover:bg-green-700 transition-colors"
                            >
                                Receive Book
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default AssessDrawer;
