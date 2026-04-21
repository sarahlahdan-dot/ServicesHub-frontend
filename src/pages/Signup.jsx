import { useState } from 'react';
import { useNavigate } from 'react-router';
import { authApi, extractApiError } from '../lib/api';
import { storeAuthToken } from '../lib/auth';

function Signup({ onAuthSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await authApi.register(formData);
      const user = storeAuthToken(response.token);
      onAuthSuccess(user || response.user);
      setErrorMessage('');
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(extractApiError(err, 'Unable to create your account.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell auth-page">
      <section className="glass-card auth-card">
        <p className="eyebrow">New to ServicesHub</p>
        <h1>Create your account</h1>
        <p className="hero-copy">Choose whether you are booking services or offering them.</p>
        <form className="stack-form" onSubmit={handleSubmit}>
          <label htmlFor="name">
            Full name
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
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
          <label htmlFor="role">
            Account type
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="provider">Provider</option>
            </select>
          </label>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
      </section>
    </main>
  );
}

export default Signup;
