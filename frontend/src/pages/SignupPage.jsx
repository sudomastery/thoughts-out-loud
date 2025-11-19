import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { signup as signupRequest } from '../api/auth.js';
import { useAuthStore } from '../store/authStore.js';

function SignUpPage() {
  const navigate = useNavigate();
  const authLogin = useAuthStore(s => s.login);

  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // DONT NEED TERMS AND CONDITIONS AT THIS TIME
    // if (!agree) {
    //   setError('Please agree to the terms first');
    //   return;
    // }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const resp = await signupRequest({ username, email, password });
      authLogin({ token: resp.token, user: resp.user }); // auto-login after signup
      navigate('/feed', { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="inset-0 min-h-screen w-full flex items-start justify-center bg-transparent px-4 pt-[20px]">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-md xl:max-w-md">
        {/* Brand/header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-black dark:bg-white flex items-center justify-center shadow-sm">
            <span className="text-white dark:text-black text-xl font-bold">T</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Create your account</h1>
        </div>
        <div
          className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 shadow-xl p-6 sm:p-8"
        >
          {/* static subtle gradient overlay */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background:
                "radial-gradient(420px circle at 50% 30%, rgba(255,255,255,0.10), rgba(255,255,255,0.04) 18%, transparent 40%)",
              opacity: 1,
              mixBlendMode: "overlay",
            }}
          />
          <form className="space-y-5 text-left" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block text-left">
                <Label htmlFor="username" className="text-left font-semibold text-gray-700 dark:text-gray-200">
                  Username
                </Label>
              </div>
              <TextInput
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}                
                required
                sizing="lg"
                shadow
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 
                           text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 
                           focus:ring-blue-500/30 focus:border-blue-400/50 transition-colors"
              />
            </div>

            <div>
              <div className="mb-2 block text-left">
                <Label htmlFor="email2" className="text-left font-semibold text-gray-700 dark:text-gray-200">
                  Email address
                </Label>
              </div>
              <TextInput
                id="email2"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}                
                required
                sizing="lg"
                shadow
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 
                           text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 
                           focus:ring-blue-500/30 focus:border-blue-400/50 transition-colors"
              />
            </div>

            <div>
              <div className="mb-2 block text-left">
                <Label htmlFor="password2" className="text-left font-semibold text-gray-700 dark:text-gray-200">
                  Password
                </Label>
              </div>
              <TextInput
                id="password2"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                sizing="lg"
                shadow
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 
                           text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 
                           focus:ring-blue-500/30 focus:border-blue-400/50 transition-colors"
              />
            </div>

            <div>
              <div className="mb-2 block text-left">
                <Label htmlFor="repeat-password" className="text-left font-semibold text-gray-700 dark:text-gray-200">
                  Confirm password
                </Label>
              </div>
              <TextInput
                id="repeat-password"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                sizing="lg"
                shadow
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 
                           text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 
                           focus:ring-blue-500/30 focus:border-blue-400/50 transition-colors"
              />
            </div>
            
            {/* DONT NEED TERMS AND CONDITIONS AT THIS TIME */}
            {/* <div className="flex items-center gap-2">
              <Checkbox id="agree" checked={agree} onChange={e => setAgree(e.target.checked)} />
              <Label htmlFor="agree" className="text-gray-700 dark:text-gray-200">
                I agree with the&nbsp;
                <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">terms and conditions</a>
              </Label>
            </div> */}

            {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full !bg-blue-600 !hover:bg-blue-700 !text-white !border-0 focus:!ring-4 !ring-blue-500/30 disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create account'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;