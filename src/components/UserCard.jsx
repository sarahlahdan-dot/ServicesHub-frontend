import React from 'react';
function UserCard({ user }) {
  return (
    <article className="list-card">
      <div className="list-card-head">
        <strong>{user.name}</strong>
        <span className="category-pill">{user.role}</span>
      </div>
      {user.email && <p>{user.email}</p>}
    </article>
  );
}

export default UserCard;
