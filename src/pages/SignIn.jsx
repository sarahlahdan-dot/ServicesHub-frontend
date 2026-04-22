import { useState } from 'react';
import { useNavigate } from 'react-router';
import { authApi, extractApiError } from '../lib/api';
import { storeAuthToken } from '../lib/auth';

function SignIn({ onAuthSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await authApi.login(formData);
      const userInfo = storeAuthToken(response.token) || response.user;
      onAuthSuccess(userInfo);
      setErrorMessage('');

      navigate(userInfo?.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setErrorMessage(extractApiError(err, 'Unable to sign in.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell auth-page">
      <section className="glass-card auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in</h1>
        <p className="hero-copy">Sign in to manage bookings, messages, and account details.</p>
        <form className="stack-form" onSubmit={handleSubmit}>
          <label htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
      </section>
    </main>
  );
}

export default SignIn;
