import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { cartApi, extractApiError, messagesApi, reviewsApi, servicesApi } from '../lib/api';
import { getEntityId } from '../lib/utils';
import MessageBubble from '../components/MessageBubble';
import ReviewCard from '../components/ReviewCard';

function ServiceDetails({ user }) {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [bookingWindow, setBookingWindow] = useState({ fromDate: '', toDate: '' });
  const [messageDraft, setMessageDraft] = useState('');
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const providerId = getEntityId(service?.providerId);
  const isOwner = Boolean(user && providerId && user.id === providerId);

  const loadDetails = useCallback(async () => {
    setLoading(true);

    try {
      const [serviceData, reviewsData] = await Promise.all([
        servicesApi.get(serviceId),
        reviewsApi.byService(serviceId),
      ]);

      setService(serviceData);
      setReviews(reviewsData);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to load this service.'));
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  useEffect(() => {
    const loadConversation = async () => {
      if (!user || !providerId || user.id === providerId) {
        setConversation([]);
        return;
      }

      try {
        const messages = await messagesApi.listForUser(providerId);
        setConversation(messages);
      } catch {
        setConversation([]);
      }
    };

    loadConversation();
  }, [providerId, user]);

  const handleBookingWindowChange = (event) => {
    setBookingWindow((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAddToCart = async (event) => {
    event.preventDefault();
    setWorking(true);

    try {
      await cartApi.addItem({
        serviceId,
        fromDate: bookingWindow.fromDate,
        toDate: bookingWindow.toDate,
      });
      setFeedback('Service added to cart. You can check out from your dashboard.');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to add this service to your cart.'));
      setFeedback('');
    } finally {
      setWorking(false);
    }
  };

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    setWorking(true);

    try {
      const createdMessage = await messagesApi.sendToUser(providerId, messageDraft);
      setConversation((current) => [...current, createdMessage]);
      setMessageDraft('');
      setFeedback('Message sent to the provider.');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(extractApiError(error, 'Unable to send your message.'));
      setFeedback('');
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return <main className="page-shell"><p className="empty-state">Loading service details...</p></main>;
  }

  if (!service) {
    return <main className="page-shell"><p className="empty-state">Service not found.</p></main>;
  }

  return (
    <main className="page-shell service-details-page">
      <div className="section-header left-aligned">
        <div>
          <p className="eyebrow">Service details</p>
          <h1>{service.title}</h1>
          <p>
            {service.category} · ${Number(service.price).toFixed(2)} · {service.availability ? 'Available' : 'Unavailable'}
          </p>
        </div>
        <Link className="ghost-button" to="/">Back to services</Link>
      </div>

      {(feedback || errorMessage) && (
        <div className={errorMessage ? 'status-card error' : 'status-card success'}>
          {errorMessage || feedback}
        </div>
      )}

      <section className="feature-grid detail-grid">
        <article className="glass-card detail-card">
          <h2>About this service</h2>
          <p>{service.description}</p>
          <dl className="detail-list">
            <div>
              <dt>Provider</dt>
              <dd>{service.providerId?.name || 'Unknown provider'}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{service.providerId?.email || 'Unavailable'}</dd>
            </div>
            <div>
              <dt>Rating</dt>
              <dd>{service.rating || 0}/5</dd>
            </div>
          </dl>
          {isOwner && <p className="helper-text">Manage this listing from your dashboard.</p>}
        </article>

        <article className="glass-card detail-card">
          <h2>Book this service</h2>
          {!user && (
            <p className="helper-text">
              <Link to="/sign-in">Sign in</Link> to add this service to your cart or message the provider.
            </p>
          )}
          {user && !isOwner && user.role === 'customer' && (
            <form className="stack-form" onSubmit={handleAddToCart}>
              <label>
                From date
                <input
                  name="fromDate"
                  type="date"
                  value={bookingWindow.fromDate}
                  onChange={handleBookingWindowChange}
                  required
                />
              </label>
              <label>
                To date
                <input
                  name="toDate"
                  type="date"
                  value={bookingWindow.toDate}
                  onChange={handleBookingWindowChange}
                  required
                />
              </label>
              <button className="primary-button" type="submit" disabled={working}>
                {working ? 'Adding...' : 'Add to cart'}
              </button>
            </form>
          )}
          {user && !isOwner && user.role !== 'customer' && (
            <p className="helper-text">Only customer accounts can use the cart and checkout flow.</p>
          )}
        </article>
      </section>

      <section className="feature-grid detail-grid">
        <article className="glass-card detail-card">
          <div className="section-header compact left-aligned">
            <div>
              <p className="eyebrow">Reviews</p>
              <h2>What customers said</h2>
            </div>
          </div>
          {reviews.length === 0 ? (
            <p className="empty-state">No reviews yet for this service.</p>
          ) : (
            <div className="stack-list">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </article>

        <article className="glass-card detail-card">
          <div className="section-header compact left-aligned">
            <div>
              <p className="eyebrow">Direct messages</p>
              <h2>Talk to the provider</h2>
            </div>
          </div>
          {!user && <p className="helper-text">Sign in to start a conversation.</p>}
          {user && !isOwner && (
            <>
              <div className="message-thread">
                {conversation.length === 0 ? (
                  <p className="empty-state">No messages yet.</p>
                ) : (
                  conversation.map((message) => {
                    const isCurrentUser = getEntityId(message.senderId) === user.id;

                    return (
                      <MessageBubble
                        key={message._id}
                        isCurrentUser={isCurrentUser}
                        senderName={isCurrentUser ? 'You' : message.senderId?.name || 'Provider'}
                        content={message.content}
                      />
                    );
                  })
                )}
              </div>
              <form className="stack-form" onSubmit={handleMessageSubmit}>
                <label>
                  Message
                  <textarea
                    value={messageDraft}
                    onChange={(event) => setMessageDraft(event.target.value)}
                    rows="4"
                    required
                  />
                </label>
                <button className="secondary-button" type="submit" disabled={working}>
                  {working ? 'Sending...' : 'Send message'}
                </button>
              </form>
            </>
          )}
          {user && isOwner && <p className="helper-text">You cannot message yourself through this panel.</p>}
        </article>
      </section>
    </main>
  );
}

export default ServiceDetails;