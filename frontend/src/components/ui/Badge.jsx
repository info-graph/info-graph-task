const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary bg-opacity-10 text-primary',
    success: 'bg-accent bg-opacity-10 text-accent',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-danger bg-opacity-10 text-danger',
  };
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 transform hover:scale-105 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;