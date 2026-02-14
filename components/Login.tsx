import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { PASSWORD_HASH, COLORS } from '../constants';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Basic delay to prevent brute-force (simulated)
            await new Promise(resolve => setTimeout(resolve, 500));

            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            if (hashHex === PASSWORD_HASH) {
                localStorage.setItem('auth_token', hashHex);
                onLogin();
            } else {
                setError('Senha incorreta.');
            }
        } catch (err) {
            setError('Erro ao validar senha.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-falconi-primary/10 p-4 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-falconi-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Acesso Restrito</h1>
                    <p className="text-gray-500 text-sm mt-2 text-center">
                        Digite a chave de acesso para utilizar o gerador.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Chave de Acesso"
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falconi-primary outline-none transition-all placeholder:text-gray-400"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={!password || loading}
                        className={`w-full py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all
              ${!password || loading
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-falconi-primary hover:bg-opacity-90 shadow-md hover:shadow-lg'
                            }`}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                Entrar <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">Falconi Intelligence Unit</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
