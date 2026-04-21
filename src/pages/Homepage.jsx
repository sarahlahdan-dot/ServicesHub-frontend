import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { extractApiError, servicesApi } from '../lib/api';
import ServiceCard from '../components/ServiceCard';

function Homepage({ user }) {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadServices() {
      setLoading(true);

      try {
        const serviceData = await servicesApi.list();
        setServices(serviceData);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(extractApiError(error, 'Unable to load services right now.'));
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    if (!normalizedQuery) {
      return services;
    }

    return services.filter((service) => {
      const haystack = [
        service.title,
        service.category,
        service.description,
        service.providerId?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [searchTerm, services]);

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Service marketplace</p>
          <h1>Connect customers and providers through the project3 backend.</h1>
          <p className="hero-copy">
            Browse live services, add bookings to your cart, leave reviews after completed work, and keep
            conversations moving without leaving the app.
          </p>
        </div>
        <div className="hero-actions">
          <label className="search-field">
            <span>Search services</span>
            <input
              type="search"
              placeholder="Cleaning, design, tutoring..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          {!user && <Link className="primary-button" to="/sign-up">Create an account</Link>}
          {user && <Link className="secondary-button" to="/dashboard">Open dashboard</Link>}
        </div>
      </section>

      <section className="section-header">
        <div>
          <p className="eyebrow">Live inventory</p>
          <h2>Available services</h2>
        </div>
        <span className="summary-chip">{filteredServices.length} listings</span>
      </section>

      {errorMessage && <div className="status-card error">{errorMessage}</div>}

      {loading ? (
        <p className="empty-state">Loading services...</p>
      ) : filteredServices.length === 0 ? (
        <p className="empty-state">No services matched your search.</p>
      ) : (
        <section className="service-grid">
          {filteredServices.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </section>
      )}
    </main>
  );
}

export default Homepage;