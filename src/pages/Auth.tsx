import { useState } from 'react';
// import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { MoneyModel } from '../components/MoneyModel';
import { LogIn, UserPlus, Globe2 } from 'lucide-react';
import styles from './Auth.module.css';

export function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Using a mocked success just to allow preview without configuring Supabase keys
        // In production, uncomment the supabase calls
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 1000);

        /*
        try {
          if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
          } else {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
          }
          navigate('/dashboard');
        } catch (err: any) {
          setError(err.message || 'Authentication failed');
        } finally {
          setLoading(false);
        }
        */
    };

    return (
        <div className={styles.container}>
            <div className={styles.glow} />
            <div className={styles.glowRight} />

            <div className={styles.leftPanel}>
                <div className={`${styles.formWrapper} animate-fade-in`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Globe2 size={32} color="var(--primary)" />
                        <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>BorderPay</h2>
                    </div>

                    <h1 className={styles.title}>
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h1>
                    <p className={styles.subtitle}>
                        {isLogin
                            ? 'Enter your details to access your global payroll dashboard.'
                            : 'Join the future of borderless business payroll.'}
                    </p>

                    {error && <div className={styles.error}>{error}</div>}

                    <form onSubmit={handleAuth}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '16px' }}
                            disabled={loading}
                        >
                            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </button>
                    </form>

                    <p className={styles.toggleText}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Sign up' : 'Log in'}
                        </span>
                    </p>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <spotLight position={[0, 10, 0]} intensity={0.3} />
                    <Environment preset="city" />
                    <MoneyModel />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                        maxPolarAngle={Math.PI / 2 + 0.1}
                        minPolarAngle={Math.PI / 2 - 0.1}
                    />
                </Canvas>
            </div>
        </div>
    );
}
