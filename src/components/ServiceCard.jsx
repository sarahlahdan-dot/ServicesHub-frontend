import { Link } from "react-router";



function serviceCard({service}) {
  return (
   <article className= "service-card">
    <h3>{service.title}</h3>
    <p>{service.description}</p>
    <p><strong>Category:</strong>{service.category}</p>
    <p><strong>Price</strong>${service.price}</p>
    <p><strong>Status:</strong>{''} {service.availabilty ? 'Available':'Unavailable'}</p>
    <Link to={`/services/${service._id}`}>Click to view more details!</Link>
    
   </article>
  );
}

export default serviceCard

