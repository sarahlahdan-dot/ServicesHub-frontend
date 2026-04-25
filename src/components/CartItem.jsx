
import React from 'react';
function CartItem({ item, onRemove }) {
  const serviceId = item.serviceId?._id || item.serviceId;

  return (
    <article className="list-card">
      <div className="list-card-head">
        <strong>{item.serviceId?.title || 'Service'}</strong>
        <span>${Number(item.serviceId?.price || 0).toFixed(2)}</span>
      </div>
      <p>
        {new Date(item.fromDate).toLocaleDateString()} to {new Date(item.toDate).toLocaleDateString()}
      </p>
      <button className="ghost-button" type="button" onClick={() => onRemove(serviceId)}>
        Remove
      </button>
    </article>
  );
}

export default CartItem;
