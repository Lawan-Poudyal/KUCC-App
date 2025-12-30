import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clubLogo from '../assets/kucc.png'
import { supabase } from '../services/supabaseClient'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            setError(error.message)
        } else {
            navigate('/dashboard')
        }
    }

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession()
            if (data.session) {
                navigate('/dashboard')
            }
        }
        checkSession()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
                    style={{ backgroundColor: '#585F8A' }}
                ></div>
                <div
                    className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
                    style={{ backgroundColor: '#585F8A' }}
                ></div>
            </div>

            <div className="w-full max-w-md px-6 relative z-10">
                {/* Logo/Title Section */}
                <div className="text-center mb-8">
                    <div className="w-30 h-30 mx-auto mb-4">
                        <img
                            src={clubLogo}
                            alt="Club Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: '#585F8A' }}>
                        Admin Panel
                    </h1>
                    <p className="text-gray-600">Sign in to manage our departmental club </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        Welcome back!
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 transition-all"
                                    style={{
                                        focusRingColor: '#585F8A',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#585F8A'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 transition-all"
                                    onFocus={(e) => e.target.style.borderColor = '#585F8A'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300"
                                    style={{ accentColor: '#585F8A' }}
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <a
                                href="#"
                                className="text-sm font-medium hover:underline"
                                style={{ color: '#585F8A' }}
                            >
                                Forgot password?
                            </a>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            style={{ backgroundColor: '#585F8A' }}
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
