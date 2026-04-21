import { Link } from 'react-router';

/**
 * ServiceCard — renders one Service document.
 *
 * variant="card"  (default) → full homepage tile with category pill, meta dl, and a link
 * variant="list"            → compact dashboard list-card with optional edit / delete actions
 */
function ServiceCard({ service, variant = 'card', onEdit, onDelete }) {
  if (variant === 'list') {
    return (
      <article className="list-card">
        <div className="list-card-head">
          <strong>{service.title}</strong>
          <span>${Number(service.price).toFixed(2)}</span>
        </div>
        <p>{service.description}</p>
        <div className="action-row">
          {onEdit && (
            <button className="secondary-button" type="button" onClick={() => onEdit(service)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className="ghost-button" type="button" onClick={() => onDelete(service._id)}>
              Delete
            </button>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="service-card">
      <div className="service-card-top">
        <span className="category-pill">{service.category}</span>
        <span className={service.availability ? 'status-pill available' : 'status-pill unavailable'}>
          {service.availability ? 'Available' : 'Unavailable'}
        </span>
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <dl className="service-meta">
        <div>
          <dt>Provider</dt>
          <dd>{service.providerId?.name || 'Unknown'}</dd>
        </div>
        <div>
          <dt>Price</dt>
          <dd>${Number(service.price).toFixed(2)}</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>{service.rating || 0}/5</dd>
        </div>
      </dl>
      <Link className="secondary-button" to={`/services/${service._id}`}>
        View details
      </Link>
    </article>
  );
}

export default ServiceCard;
