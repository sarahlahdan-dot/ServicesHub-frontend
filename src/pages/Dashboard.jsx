import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  bookingsApi,
  cartApi,
  extractApiError,
  messagesApi,
  reviewsApi,
  servicesApi,
} from '../lib/api';
import { getEntityId } from '../lib/utils';
import BookingCard from '../components/BookingCard';
import CartItem from '../components/CartItem';
import MessageBubble from '../components/MessageBubble';
import ServiceCard from '../components/ServiceCard';

const emptyServiceForm = {
  title: '',
  description: '',
  category: '',
  price: '',
  availability: true,
};

const serviceCategories = [
  'Cleaning',
  'Plumbing',
  'Electrical',
  'Tutoring',
  'Design',
  'Repair',
  'Moving',
  'Beauty',
  'Fitness',
  'Other',
];

function Dashboard({ user }) {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [editingServiceId, setEditingServiceId] = useState('');
  const [activeBookingId, setActiveBookingId] = useState('');
  const [bookingChatMessages, setBookingChatMessages] = useState([]);
  const [bookingChatDraft, setBookingChatDraft] = useState('');
  const [directInbox, setDirectInbox] = useState([]);
  const [activeDirectUser, setActiveDirectUser] = useState(null);
  const [directMessages, setDirectMessages] = useState([]);
  const [directMessageDraft, setDirectMessageDraft] = useState('');
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const currentUserId = getEntityId(user);
  const isCustomer = user.role === 'customer';
  const canManageServices = user.role === 'provider' || user.role === 'admin';

  const myServices = useMemo(
    () => services.filter((service) => getEntityId(service.providerId) === currentUserId),
    [currentUserId, services]
  );

  const loadDashboardData = useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const bookingRequest = isCustomer ? bookingsApi.mine() : bookingsApi.provider();
      const requests = [servicesApi.list(), bookingRequest];
      if (isCustomer) {
        requests.push(cartApi.get());
      }

      const [serviceData, bookingData, cartData] = await Promise.all(requests);
      setServices(serviceData);
      setBookings(bookingData);
      setCart(cartData || { items: [] });
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to load your dashboard.'));
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [isCustomer]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadDashboardData({ showLoading: false }).catch(() => {
        // The foreground status banner already handles fetch failures.
      });
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadDashboardData]);

  const loadDirectInbox = useCallback(async () => {
    const conversations = await messagesApi.inbox();
    setDirectInbox(conversations);
  }, []);

  useEffect(() => {
    if (user.role === 'admin') {
      setDirectInbox([]);
      setActiveDirectUser(null);
      setDirectMessages([]);
      return;
    }

    loadDirectInbox().catch(() => {
      setDirectInbox([]);
    });
  }, [loadDirectInbox, user.role]);

  const resetServiceForm = () => {
    setServiceForm(emptyServiceForm);
    setEditingServiceId('');
  };

  const handleServiceFormChange = (event) => {
    const { name, type, checked, value } = event.target;
    setServiceForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleServiceSubmit = async (event) => {
    event.preventDefault();
    setWorking(true);

    try {
      const payload = {
        ...serviceForm,
        price: Number(serviceForm.price),
      };

      if (editingServiceId) {
        await servicesApi.update(editingServiceId, payload);
        setStatusMessage('Service updated successfully.');
      } else {
        await servicesApi.create(payload);
        setStatusMessage('Service created successfully.');
      }

      setErrorMessage('');
      resetServiceForm();
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to save this service.'));
      setStatusMessage('');
    } finally {
      setWorking(false);
    }
  };

  const startEditingService = (service) => {
    setEditingServiceId(service._id);
    setServiceForm({
      title: service.title,
      description: service.description,
      category: service.category,
      price: String(service.price),
      availability: service.availability,
    });
  };

  const handleServiceDelete = async (serviceId) => {
    setWorking(true);

    try {
      await servicesApi.remove(serviceId);
      setStatusMessage('Service removed successfully.');
      setErrorMessage('');
      if (editingServiceId === serviceId) {
        resetServiceForm();
      }
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to delete this service.'));
      setStatusMessage('');
    } finally {
      setWorking(false);
    }
  };

  const handleCartRemove = async (serviceId) => {
    setWorking(true);

    try {
      await cartApi.removeItem(serviceId);
      setStatusMessage('Item removed from your cart.');
      setErrorMessage('');
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to remove that cart item.'));
      setStatusMessage('');
    } finally {
      setWorking(false);
    }
  };

  const handleCheckout = async () => {
    setWorking(true);

    try {
      await cartApi.checkout();
      setStatusMessage('Checkout completed. Your bookings were created.');
      setErrorMessage('');
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to complete checkout.'));
      setStatusMessage('');
    } finally {
      setWorking(false);
    }
  };

  const handleBookingStatusUpdate = async (bookingId, status) => {
    setWorking(true);

    try {
      await bookingsApi.updateStatus(bookingId, status);
      setStatusMessage(`Booking marked as ${status}.`);
      setErrorMessage('');
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to update the booking status.'));
      setStatusMessage('');
    } finally {
      setWorking(false);
    }
  };

  const loadBookingChat = useCallback(async (bookingId) => {
    const chat = await bookingsApi.getChat(bookingId);
    setBookingChatMessages(chat);
  }, []);

  const openBookingChat = async (bookingId) => {
    setActiveBookingId(bookingId);

    try {
      await loadBookingChat(bookingId);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to load this booking chat.'));
      setStatusMessage('');
    }
  };

  const handleBookingChatSubmit = async (event) => {
    event.preventDefault();
    setWorking(true);

    try {
      await bookingsApi.sendChatMessage(activeBookingId, bookingChatDraft);
      await loadBookingChat(activeBookingId);
      setBookingChatDraft('');
      setStatusMessage('Booking chat updated.');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to send that booking message.'));
      setStatusMessage('');
    } finally {
      setWorking(false);
    }
  };

  const openDirectConversation = async (conversationUser) => {
    setActiveDirectUser(conversationUser);

    try {
      const messages = await messagesApi.listForUser(conversationUser._id);
      setDirectMessages(messages);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to load this direct conversation.'));
      setStatusMessage('');
    }
  };

  const handleDirectMessageSubmit = async (event) => {
    event.preventDefault();
    if (!activeDirectUser?._id) {
      return;
    }

    setWorking(true);

    try {
      const message = await messagesApi.sendToUser(activeDirectUser._id, directMessageDraft);
      setDirectMessages((current) => [...current, message]);
      setDirectMessageDraft('');
      setStatusMessage('Direct message sent.');
      setErrorMessage('');
      await loadDirectInbox();
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to send that direct message.'));
      setStatusMessage('');
    } finally {
      setWorking(false);
    }
  };

  const handleReviewDraftChange = (bookingId, field, value) => {
    setReviewDrafts((current) => ({
      ...current,
      [bookingId]: {
        rating: current[bookingId]?.rating || '5',
        comment: current[bookingId]?.comment || '',
        [field]: value,
      },
    }));
  };

  const handleReviewSubmit = async (event, bookingId) => {
    event.preventDefault();
    setWorking(true);

    try {
      const draft = reviewDrafts[bookingId] || { rating: '5', comment: '' };
      await reviewsApi.create(bookingId, {
        rating: Number(draft.rating),
        comment: draft.comment,
      });
      setReviewDrafts((current) => ({
        ...current,
        [bookingId]: { rating: '5', comment: '' },
      }));
      setStatusMessage('Review submitted successfully.');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to submit your review.'));
      setStatusMessage('');
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return <main className="page-shell"><p className="empty-state">Loading your dashboard...</p></main>;
  }

  return (
    <main className="page-shell dashboard-shell">
      <section className="section-header left-aligned">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>{user.name}</h1>
          <p>Signed in as a {user.role}. This view is wired to live services, bookings, cart, reviews, and chat routes.</p>
        </div>
        <div className="action-row wrap">
          <span className="summary-chip">{bookings.length} bookings</span>
          <button className="secondary-button" type="button" onClick={() => loadDashboardData()} disabled={working}>
            Refresh data
          </button>
        </div>
      </section>

      {(statusMessage || errorMessage) && (
        <div className={errorMessage ? 'status-card error' : 'status-card success'}>
          {errorMessage || statusMessage}
        </div>
      )}

      {canManageServices && (
        <section className="feature-grid">
          <article className="glass-card">
            <div className="section-header compact left-aligned">
              <div>
                <p className="eyebrow">Provider tools</p>
                <h2>{editingServiceId ? 'Edit service' : 'Create a service'}</h2>
              </div>
            </div>
            <form className="stack-form" onSubmit={handleServiceSubmit}>
              <label>
                Title
                <input name="title" value={serviceForm.title} onChange={handleServiceFormChange} required />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  rows="4"
                  value={serviceForm.description}
                  onChange={handleServiceFormChange}
                  required
                />
              </label>
              <label>
                Category
                <select name="category" value={serviceForm.category} onChange={handleServiceFormChange} required>
                  <option value="" disabled>Select a category</option>
                  {serviceCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label>
                Price
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={serviceForm.price}
                  onChange={handleServiceFormChange}
                  required
                />
              </label>
              <label className="checkbox-row">
                <input
                  checked={serviceForm.availability}
                  name="availability"
                  type="checkbox"
                  onChange={handleServiceFormChange}
                />
                Available for booking
              </label>
              <div className="action-row">
                <button className="primary-button" type="submit" disabled={working}>
                  {editingServiceId ? 'Save changes' : 'Create service'}
                </button>
                {editingServiceId && (
                  <button className="ghost-button" type="button" onClick={resetServiceForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </article>

          <article className="glass-card">
            <div className="section-header compact left-aligned">
              <div>
                <p className="eyebrow">Your listings</p>
                <h2>Manage published services</h2>
              </div>
            </div>
            {myServices.length === 0 ? (
              <p className="empty-state">You have not published a service yet.</p>
            ) : (
              <div className="stack-list">
                {myServices.map((service) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    variant="list"
                    onEdit={startEditingService}
                    onDelete={handleServiceDelete}
                  />
                ))}
              </div>
            )}
          </article>
        </section>
      )}

      {isCustomer && (
        <section className="feature-grid">
          <article className="glass-card">
            <div className="section-header compact left-aligned">
              <div>
                <p className="eyebrow">Cart</p>
                <h2>Ready for checkout</h2>
              </div>
            </div>
            {!cart.items?.length ? (
              <p className="empty-state">Your cart is empty. Add a service from the homepage.</p>
            ) : (
              <>
                <div className="stack-list">
                  {cart.items.map((item) => (
                    <CartItem
                      key={item.serviceId?._id || item.serviceId}
                      item={item}
                      onRemove={handleCartRemove}
                    />
                  ))}
                </div>
                <button className="primary-button" type="button" onClick={handleCheckout} disabled={working}>
                  Checkout cart
                </button>
              </>
            )}
          </article>
        </section>
      )}

      <section className="feature-grid bookings-grid">
        <article className="glass-card bookings-panel">
          <div className="section-header compact left-aligned">
            <div>
              <p className="eyebrow">Bookings</p>
              <h2>Track jobs and requests</h2>
            </div>
          </div>
          {bookings.length === 0 ? (
            <p className="empty-state">No bookings yet.</p>
          ) : (
            <div className="stack-list">
              {bookings.map((booking) => {
                const reviewDraft = reviewDrafts[booking._id];

                return (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    currentUserId={currentUserId}
                    isCustomer={isCustomer}
                    onStatusUpdate={handleBookingStatusUpdate}
                    onOpenChat={openBookingChat}
                    isActiveChat={activeBookingId === booking._id}
                    reviewDraft={reviewDraft}
                    onReviewChange={(field, value) => handleReviewDraftChange(booking._id, field, value)}
                    onReviewSubmit={(event) => handleReviewSubmit(event, booking._id)}
                  />
                );
              })}
            </div>
          )}
        </article>

        <article className="glass-card bookings-panel">
          <div className="section-header compact left-aligned">
            <div>
              <p className="eyebrow">Booking chat</p>
              <h2>Coordinate booking details</h2>
            </div>
          </div>
          {!activeBookingId ? (
            <p className="empty-state">Choose a booking to load its chat thread.</p>
          ) : (
            <>
              <div className="message-thread booking-thread">
                {bookingChatMessages.length === 0 ? (
                  <p className="empty-state">No messages in this booking chat yet.</p>
                ) : (
                  bookingChatMessages.map((message, index) => {
                    const isCurrentUser = getEntityId(message.senderId) === currentUserId;

                    return (
                      <MessageBubble
                        key={`${message.createdAt || 'message'}-${index}`}
                        isCurrentUser={isCurrentUser}
                        senderName={isCurrentUser ? 'You' : 'Participant'}
                        content={message.message}
                      />
                    );
                  })
                )}
              </div>
              <form className="stack-form" onSubmit={handleBookingChatSubmit}>
                <label>
                  New message
                  <textarea
                    rows="4"
                    value={bookingChatDraft}
                    onChange={(event) => setBookingChatDraft(event.target.value)}
                    required
                  />
                </label>
                <button className="primary-button" type="submit" disabled={working}>
                  Send booking message
                </button>
              </form>
            </>
          )}
        </article>
      </section>

      {user.role !== 'admin' && (
        <section className="feature-grid bookings-grid">
          <article className="glass-card bookings-panel">
            <div className="section-header compact left-aligned">
              <div>
                <p className="eyebrow">Direct inbox</p>
                <h2>People messaging you</h2>
              </div>
            </div>
            {directInbox.length === 0 ? (
              <p className="empty-state">No direct conversations yet.</p>
            ) : (
              <div className="stack-list">
                {directInbox.map((conversation) => (
                  <article className="list-card" key={conversation.user?._id || conversation.latestMessage?._id}>
                    <div className="list-card-head wrap">
                      <strong>{conversation.user?.name || 'Unknown user'}</strong>
                      <span className="category-pill">{conversation.user?.role || 'user'}</span>
                    </div>
                    <p>{conversation.latestMessage?.content || 'No message preview available.'}</p>
                    <button
                      className="ghost-button"
                      type="button"
                      onClick={() => openDirectConversation(conversation.user)}
                    >
                      {activeDirectUser?._id === conversation.user?._id ? 'Refresh conversation' : 'Open conversation'}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </article>

          <article className="glass-card bookings-panel">
            <div className="section-header compact left-aligned">
              <div>
                <p className="eyebrow">Direct conversation</p>
                <h2>{activeDirectUser ? activeDirectUser.name : 'Choose a conversation'}</h2>
              </div>
            </div>
            {!activeDirectUser ? (
              <p className="empty-state">Select a person from your inbox to read and reply.</p>
            ) : (
              <>
                <div className="message-thread booking-thread">
                  {directMessages.length === 0 ? (
                    <p className="empty-state">No direct messages in this conversation yet.</p>
                  ) : (
                    directMessages.map((message) => {
                      const isCurrentUser = getEntityId(message.senderId) === currentUserId;

                      return (
                        <MessageBubble
                          key={message._id}
                          isCurrentUser={isCurrentUser}
                          senderName={isCurrentUser ? 'You' : message.senderId?.name || activeDirectUser.name}
                          content={message.content}
                        />
                      );
                    })
                  )}
                </div>
                <form className="stack-form" onSubmit={handleDirectMessageSubmit}>
                  <label>
                    Reply
                    <textarea
                      rows="4"
                      value={directMessageDraft}
                      onChange={(event) => setDirectMessageDraft(event.target.value)}
                      required
                    />
                  </label>
                  <button className="primary-button" type="submit" disabled={working}>
                    Send direct message
                  </button>
                </form>
              </>
            )}
          </article>
        </section>
      )}
    </main>
  );
}

export default Dashboard;