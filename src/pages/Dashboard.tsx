import { useState, useMemo } from 'react';
import {
    Briefcase, Globe, CreditCard,
    Settings, Clock, ChevronUp, Bell, PieChart, Focus, RefreshCw, CheckCircle2, FileText
} from 'lucide-react';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

function calculateMonthlyTDS(monthlySalary: number) {
    // Rough estimate based on India New Tax Regime
    const yearly = monthlySalary * 12;
    let tax = 0;
    if (yearly > 300000) tax += Math.min(yearly - 300000, 300000) * 0.05;
    if (yearly > 600000) tax += Math.min(yearly - 600000, 300000) * 0.10;
    if (yearly > 900000) tax += Math.min(yearly - 900000, 300000) * 0.15;
    if (yearly > 1200000) tax += Math.min(yearly - 1200000, 300000) * 0.20;
    if (yearly > 1500000) tax += (yearly - 1500000) * 0.30;

    if (yearly <= 700000) tax = 0; // Tax rebate u/s 87A

    const cess = tax * 0.04;
    return Math.round((tax + cess) / 12);
}

const EMPLOYEES = [
    { id: 1, name: 'Aarav Patel', role: 'Senior Engineer', state: 'Maharashtra', amount: 150000 },
    { id: 2, name: 'Priya Sharma', role: 'Designer', state: 'Karnataka', amount: 85000 },
    { id: 3, name: 'Rahul Verma', role: 'Backend Lead', state: 'Delhi', amount: 200000 },
    { id: 4, name: 'Ananya Gupta', role: 'Support', state: 'Telangana', amount: 65000 },
    { id: 5, name: 'Vikram Singh', role: 'Product Manager', state: 'Haryana', amount: 120000 },
];

const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
};

export function Dashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('payroll');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processed, setProcessed] = useState(false);

    const [virtualAccount, setVirtualAccount] = useState<{ acc: string, ifsc: string } | null>(null);
    const [generatingVirtual, setGeneratingVirtual] = useState(false);

    const employeesWithTax = useMemo(() => {
        return EMPLOYEES.map(emp => {
            const tax = calculateMonthlyTDS(emp.amount);
            const net = emp.amount - tax;
            return { ...emp, tax, net };
        });
    }, []);

    const totalPayroll = employeesWithTax.reduce((acc, emp) => acc + emp.amount, 0);
    const totalTax = employeesWithTax.reduce((acc, emp) => acc + emp.tax, 0);

    const handleRunPayroll = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setProcessed(true);
            setTimeout(() => setProcessed(false), 3000);
        }, 2000);
    };

    const generateVirtualAccount = () => {
        setGeneratingVirtual(true);
        setTimeout(() => {
            const randAcc = `VACC${Math.floor(10000000 + Math.random() * 90000000)}`;
            const ifsc = 'YESB0CMSNOC';
            setVirtualAccount({ acc: randAcc, ifsc });
            setGeneratingVirtual(false);
        }, 1500);
    };

    return (
        <div className={styles.dashboard}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
                <div className={styles.logo}>
                    <Globe size={28} color="var(--primary)" />
                    <h2>BorderPay India</h2>
                </div>

                <nav className={styles.nav}>
                    <button
                        className={`${styles.navItem} ${activeTab === 'payroll' ? styles.active : ''}`}
                        onClick={() => setActiveTab('payroll')}
                    >
                        <Briefcase size={20} />
                        Payroll Batch
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'taxes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('taxes')}
                    >
                        <PieChart size={20} />
                        Tax Withholding
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'ibans' ? 'active' : ''}`}
                        onClick={() => setActiveTab('ibans')}
                    >
                        <CreditCard size={20} />
                        Virtual Accounts
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'forex' ? 'active' : ''}`}
                        onClick={() => setActiveTab('forex')}
                    >
                        <Focus size={20} />
                        Compliance
                    </button>
                </nav>

                <div style={{ padding: '0 16px', marginTop: 'auto' }}>
                    <button className={styles.navItem} onClick={() => navigate('/')}>
                        <Settings size={20} />
                        Log Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>India Payroll Dashboard</div>
                    <div className={styles.profile}>
                        <div style={{ position: 'relative' }}>
                            <Bell size={24} color="var(--text-secondary)" />
                            <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                        </div>
                        <div className={styles.avatar}>A</div>
                    </div>
                </div>

                <div className={styles.content}>
                    {activeTab === 'payroll' && (
                        <>
                            <div className={`${styles.statsGrid} animate-fade-in`}>
                                <div className={styles.statCard}>
                                    <div className={styles.statHeader}>
                                        <span>Total Payroll (INR)</span>
                                        <Globe size={20} color="var(--primary)" />
                                    </div>
                                    <div className={styles.statValue}>{formatINR(totalPayroll)}</div>
                                    <div className={styles.statChange}>
                                        <ChevronUp size={16} className={styles.positive} />
                                        <span className={styles.positive}>5.2%</span>
                                        <span className="text-secondary" style={{ marginLeft: '4px' }}>vs last month</span>
                                    </div>
                                </div>

                                <div className={styles.statCard}>
                                    <div className={styles.statHeader}>
                                        <span>Active States</span>
                                        <Map size={20} color="var(--accent)" />
                                    </div>
                                    <div className={styles.statValue}>5</div>
                                    <div className={styles.statChange}>
                                        <span className={styles.positive}>Across India</span>
                                    </div>
                                </div>

                                <div className={styles.statCard}>
                                    <div className={styles.statHeader}>
                                        <span>Auto-Withheld Taxes (TDS)</span>
                                        <PieChart size={20} color="var(--secondary)" />
                                    </div>
                                    <div className={styles.statValue}>{formatINR(totalTax)}</div>
                                    <div className={styles.statChange}>
                                        <span>Calculated per New Tax Regime</span>
                                    </div>
                                </div>
                            </div>

                            <div className={`${styles.panelGrid} animate-fade-in`} style={{ animationDelay: '0.1s' }}>
                                {/* Employee List */}
                                <div className={styles.panel}>
                                    <div className={styles.panelTitle}>
                                        Distributed Team Payroll
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                                            TDS dynamically calculated
                                        </span>
                                    </div>

                                    <div className={styles.employeeList}>
                                        {employeesWithTax.map(emp => (
                                            <div key={emp.id} className={styles.employeeItem}>
                                                <div className={styles.employeeInfo}>
                                                    <div className={styles.avatar} style={{ width: 36, height: 36, fontSize: '0.9rem' }}>
                                                        {emp.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{emp.name}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{emp.role} • {emp.state}</div>
                                                    </div>
                                                </div>

                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                                        {formatINR(emp.amount)}
                                                        <span className={styles.currencyPill}>Gross</span>
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: '4px' }}>
                                                        TDS: {formatINR(emp.tax)} | Net: {formatINR(emp.net)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        className={`btn ${processed ? 'btn-secondary' : 'btn-primary'} ${styles.actionBtn}`}
                                        onClick={handleRunPayroll}
                                        disabled={isProcessing || processed}
                                    >
                                        {isProcessing ? <Clock size={20} className="spin" /> : <CreditCard size={20} />}
                                        {processed ? 'Payroll Scheduled Successfully!' : 'Run B2B Batch Payroll'}
                                    </button>
                                </div>

                                {/* Quick Actions / Info */}
                                <div className={styles.panel} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div className={styles.taxAlert}>
                                        <div style={{ fontWeight: 600, color: '#b45309', marginBottom: '4px' }}>Tax Regime Alert</div>
                                        <div style={{ fontSize: '0.85rem', color: '#92400e' }}>
                                            The new tax regime applies by default. TDS has been dynamically calculated for your employees. Those under ₹7 LPA have 0 TDS.
                                        </div>
                                    </div>

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div className={styles.panelTitle} style={{ marginBottom: '16px' }}>Virtual Bank Accounts</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                            Generate a dedicated virtual account to fund this payroll run instantly without banking fees.
                                        </div>

                                        {virtualAccount ? (
                                            <div style={{ background: 'var(--surface-light)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '12px', fontWeight: 600 }}>
                                                    <CheckCircle2 size={18} /> Account Generated
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Account Number</div>
                                                <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '1px', marginTop: '2px', marginBottom: '12px' }}>
                                                    {virtualAccount.acc}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>IFSC Code</div>
                                                <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '1px', marginTop: '2px' }}>
                                                    {virtualAccount.ifsc}
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ marginTop: 'auto', background: 'var(--surface-light)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                                <FileText size={32} color="var(--text-secondary)" style={{ margin: '0 auto 12px' }} />
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>No active funding account for this batch.</p>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ width: '100%' }}
                                                    onClick={generateVirtualAccount}
                                                    disabled={generatingVirtual}
                                                >
                                                    {generatingVirtual ? <RefreshCw size={18} className="spin" /> : <CreditCard size={18} />}
                                                    {generatingVirtual ? 'Generating...' : 'Generate Account'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'taxes' && (
                        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <div className={styles.statHeader}><span>Total TDS Deducted</span><PieChart size={20} color="var(--primary)" /></div>
                                    <div className={styles.statValue}>{formatINR(totalTax)}</div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statHeader}><span>Tax Challan Status</span><CheckCircle2 size={20} color="var(--accent)" /></div>
                                    <div className={styles.statValue}>Verified</div>
                                </div>
                            </div>
                            <div className={styles.panel}>
                                <div className={styles.panelTitle}>Employee Tax Breakdown (New Tax Regime)</div>
                                <div className={styles.employeeList}>
                                    {employeesWithTax.map(emp => (
                                        <div key={emp.id} className={styles.employeeItem}>
                                            <div className={styles.employeeInfo}>
                                                <div className={styles.avatar} style={{ width: 36, height: 36, fontSize: '0.9rem' }}>{emp.name.charAt(0)}</div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{emp.name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Gross: {formatINR(emp.amount)} • TDS: {formatINR(emp.tax)}</div>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Download Form 16</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ibans' && (
                        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className={styles.panelGrid}>
                                <div className={styles.panel}>
                                    <div className={styles.panelTitle}>Active Virtual Accounts</div>
                                    {virtualAccount ? (
                                        <div style={{ background: 'var(--surface-light)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '12px', fontWeight: 600 }}>
                                                <CheckCircle2 size={18} /> Active Receiving Account
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Account Number</div>
                                            <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '1px', marginTop: '4px', marginBottom: '16px' }}>
                                                {virtualAccount.acc}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>IFSC Code</div>
                                            <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '1px', marginTop: '4px', marginBottom: '16px' }}>
                                                {virtualAccount.ifsc}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Bank Partner</div>
                                            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '1px', marginTop: '4px' }}>
                                                YES BANK LTD.
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ background: 'var(--surface-light)', padding: '40px 20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                            <FileText size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px' }} />
                                            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>No active funding account currently generated.</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={generateVirtualAccount}
                                                disabled={generatingVirtual}
                                            >
                                                {generatingVirtual ? <RefreshCw size={20} className="spin" /> : <CreditCard size={20} />}
                                                {generatingVirtual ? 'Generating Account...' : 'Generate Virtual Account'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.panel} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div className={styles.panelTitle}>About Virtual Accounts</div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                        Virtual Accounts allow you to directly accept domestic IMPS, NEFT, and RTGS payments in India without needing to setup complex banking integrations or pay high cross-border transaction fees.
                                    </p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                        Each account generated acts as a dedicated treasury bucket for executing your automated employer payroll batch operations seamlessly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'forex' && (
                        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className={styles.panel}>
                                <div className={styles.panelTitle}>Compliance & Forex Tracking</div>
                                <p style={{ color: 'var(--text-secondary)' }}>All transactions are audited for FEMA compliance and forex rates are automatically locked 24 hours prior to batch execution.</p>
                                <div style={{ marginTop: '24px', background: 'var(--surface-light)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '12px' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Locked Rate (USD to INR)</span>
                                        <span style={{ fontWeight: 'bold' }}>₹82.94</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Compliance Status</span>
                                        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>All Clear</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Map icon fake component
function Map({ size, color }: { size: number, color: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
            <line x1="9" y1="3" x2="9" y2="18"></line>
            <line x1="15" y1="6" x2="15" y2="21"></line>
        </svg>
    );
}
