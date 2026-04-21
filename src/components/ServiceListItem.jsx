import React from 'react'

function ServiceListItem({ service, onEdit, onDelete}) {

  return (
    <div className = "list-card">
        <h4>{service.title}</h4>
        <p>{service.description}</p>
        <p>Price: ${service.price}</p>
        <button onClick={() => onEdit(service)}>Edit</button>
        <button onClick={() => onDelete(service._id)}>Delete</button>

      
    </div>
  );
}

export default ServiceListItem
