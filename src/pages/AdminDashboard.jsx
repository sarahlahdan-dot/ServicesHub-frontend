import { useCallback, useEffect, useMemo, useState } from 'react';
import { bookingsApi, extractApiError, servicesApi } from '../lib/api';
import UserCard from '../components/UserCard';

function AdminDashboard({ user }) {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const loadAdminData = useCallback(async () => {
    setLoading(true);

    try {
      const [serviceData, bookingData] = await Promise.all([
        servicesApi.list(),
        bookingsApi.mine(),
      ]);
      setServices(serviceData);
      setBookings(bookingData);
      setErrorMessage('');
      setStatusMessage('Admin dashboard synced successfully.');
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to load admin dashboard data.'));
      setStatusMessage('');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const providerRoster = useMemo(() => {
    const map = new Map();

    services.forEach((service) => {
      if (service.providerId?._id && !map.has(service.providerId._id)) {
        map.set(service.providerId._id, {
          ...service.providerId,
          role: service.providerId.role || 'provider',
        });
      }
    });

    return Array.from(map.values());
  }, [services]);

  const approvedCount = bookings.filter((booking) => booking.status === 'approved').length;
  const pendingCount = bookings.filter((booking) => booking.status === 'pending').length;

  if (loading) {
    return <main className="page-shell"><p className="empty-state">Loading admin dashboard...</p></main>;
  }

  return (
    <main className="page-shell dashboard-shell">
      <section className="section-header left-aligned">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>{user.name}</h1>
          <p>Signed in as admin. This view tracks platform activity and provider coverage.</p>
        </div>
        <button className="secondary-button" type="button" onClick={loadAdminData}>Refresh data</button>
      </section>

      {(statusMessage || errorMessage) && (
        <div className={errorMessage ? 'status-card error' : 'status-card success'}>
          {errorMessage || statusMessage}
        </div>
      )}

      <section className="feature-grid">
        <article className="glass-card">
          <div className="section-header compact left-aligned">
            <div>
              <p className="eyebrow">Platform stats</p>
              <h2>Current totals</h2>
            </div>
          </div>
          <div className="stack-list">
            <article className="list-card">
              <div className="list-card-head">
                <strong>Total services</strong>
                <span>{services.length}</span>
              </div>
              <p>All published service listings from the backend.</p>
            </article>
            <article className="list-card">
              <div className="list-card-head">
                <strong>Total bookings</strong>
                <span>{bookings.length}</span>
              </div>
              <p>Bookings currently visible to this admin account.</p>
            </article>
            <article className="list-card">
              <div className="list-card-head">
                <strong>Pending approvals</strong>
                <span>{pendingCount}</span>
              </div>
              <p>Bookings waiting for provider action.</p>
            </article>
            <article className="list-card">
              <div className="list-card-head">
                <strong>Approved bookings</strong>
                <span>{approvedCount}</span>
              </div>
              <p>Confirmed bookings ready for delivery.</p>
            </article>
          </div>
        </article>

        <article className="glass-card">
          <div className="section-header compact left-aligned">
            <div>
              <p className="eyebrow">Admin account</p>
              <h2>Current operator</h2>
            </div>
          </div>
          <UserCard user={{ name: user.name, email: user.email, role: user.role }} />
        </article>
      </section>

      <section className="feature-grid">
        <article className="glass-card">
          <div className="section-header compact left-aligned">
            <div>
              <p className="eyebrow">Provider roster</p>
              <h2>Providers by active listings</h2>
            </div>
          </div>
          {providerRoster.length === 0 ? (
            <p className="empty-state">No providers found in current services data.</p>
          ) : (
            <div className="stack-list">
              {providerRoster.map((provider) => (
                <UserCard key={provider._id} user={provider} />
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

export default AdminDashboard;