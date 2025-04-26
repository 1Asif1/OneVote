import  { Shield, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-primary-400" />
              <span className="font-bold text-2xl text-white">SecureVote</span>
            </div>
            <p className="text-gray-400 mb-4">
              A secure voting system built for SDG 16: Peace, Justice, and Strong Institutions.
              Preventing fraud and ensuring democratic integrity.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/login" className="hover:text-white">Login</Link></li>
              <li><Link to="/register" className="hover:text-white">Register</Link></li>
              <li><Link to="/results" className="hover:text-white">Election Results</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">About SDG 16</h3>
            <p className="text-gray-400">
              SDG 16 aims to promote peaceful and inclusive societies for sustainable development, 
              provide access to justice for all and build effective, accountable and inclusive institutions 
              at all levels.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
          <p>© {new Date().getFullYear()} SecureVote. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
 