const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg card-hover ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;