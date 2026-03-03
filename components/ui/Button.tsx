import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  // Added active:scale-95 and refined focus ring for better a11y and feel
  const baseClasses = 'px-6 py-3 rounded-md font-semibold text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 active:scale-95 ease-out-expo';

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 transform hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;