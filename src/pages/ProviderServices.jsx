import { useState, useEffect } from 'react';
import api from '../services/api';

const CATEGORIES = ['AC', 'CCTV', 'IT', 'Plumbing', 'Electrical', 'Other'];
const CATEGORY_ICONS = { AC: '❄️', CCTV: '📷', IT: '💻', Plumbing: '🔧', Electrical: '⚡', Other: '🏠' };

function ProviderServices({ user }) {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formErorr, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ category: '', title: '', description: 'AC', pricing: '' });


  useEffect(() => { fetchMyServices(); }, []);

  async function fetchMyServices() {
    setLoading(true);
    try {
      const res = await api.get('/api/services');
      const mine = res.data.filter(
        (s) => String(s.providerId?._id || s.providerId) === String(user.id)
      );
      setServices(mine);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      await api.post('/api/services', { ...formData, price: Number(formData.price) });
      setFormData({ title: '', description: '', category: 'AC', price: '' });
      setShowForm(false);
      fetchMyServices();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Unable to create service.');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(serviceId) {
    if (!confirm('Are sure you want to delete? it cannot be undone.')) return;
    try {
      await api.delete(`/api/services/${serviceId}`);
      setServices((prev) => prev.filter((s) => s._id !== serviceId));
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete service.');
    }
  }

  return (
    <div className="full-container">
      <div style={{ gap: '12px', display: 'flex', alignItems: 'center',justifyContent: 'space-between', marginBottom: '28px',  }}>
        <div>
          <span className="full-tag">Provider</span>
          <h1 className="full-title">My Services List</h1>
          <p className="full-subtitle">{services.length} The Listing{services.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Service'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="form-wrapper" style={{ maxWidth: '560px', marginBottom: '32px' }}>
          <div className="form-title" style={{ fontSize: '20px', marginBottom: '4px' }}>New list</div>
          <div className="form-subtitle">type in the details and create your list</div>

          {formError && <div className="form-error">{formError}</div>}

          <form onSubmit={handleCreate}>
            <div className="form">
              <label className="formTitle">Service Title</label>
              <input className="formControl" placeholder="e.g. AC Deep Clean & Gas Refill" value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="form">
              <label className="formTitle">Description</label>
              <textarea className="formControl" rows={3} placeholder="Describe what's included in this service…"
                value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form">
                <label className="formTitle">Category</label>
                <select className="formControl" value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form">
                <label className="formTitle">Price (BHD)</label>
                <input className="formControl" type="number" min="0" step="0.5" placeholder="e.g. 12"
                  value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={formLoading}>
              {formLoading ? 'Creating…' : 'Publish Service'}
            </button>
          </form>
        </div>
      )}

      {/* Services list */}
      {loading && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>Loading your services…</div>}

      {!loading && services.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔧</div>
          <h3>Services unavailable</h3>
          <p>Start your service list now and create one !</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add yours now </button>
        </div>
      )}

      <div className="cards-grid">
        {services.map((s) => {
          const icon = CATEGORY_ICONS[s.category] || '🏠';
          return (
            <div className="service-box" key={s._id}>
              <div className="service-card-img" style={{ background: 'linear-gradient(135deg,var(--deep-space-blue),var(--steel-blue))' }}>
                <span>{icon}</span>
                <span className="service-card-mix">{s.category}</span>
              </div>
              <div className="service-card-main">
                <div className="service-card-name">{s.title}</div>
                <div className="service-card-provider" style={{ marginBottom: '8px', lineHeight: 1.5 }}>{s.description}</div>
                <div className="service-card-bottom">
                  <div className="service-price">{s.price} <span>BHD</span></div>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Delete this!</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProviderServices;
