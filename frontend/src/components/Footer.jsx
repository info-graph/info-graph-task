const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 transition-all duration-300 hover:scale-105">
            <p className="text-sm">&copy; {new Date().getFullYear()} Restaurant Management System</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-300 hover:text-primary transition-colors duration-300 hover:-translate-y-1 transform text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-primary transition-colors duration-300 hover:-translate-y-1 transform text-sm">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-primary transition-colors duration-300 hover:-translate-y-1 transform text-sm">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;