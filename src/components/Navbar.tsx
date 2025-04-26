import  { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Vote, User, Menu, X, Shield, LogOut, AlertTriangle } from 'lucide-react';
import { useVote } from '../context/VoteContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { duplicateVotes } = useVote();
  
  const isLoggedIn = pathname.includes('dashboard') || pathname.includes('vote') || pathname.includes('verify') || pathname.includes('duplicate');

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary-600" />
            <span className="font-bold text-2xl text-primary-800">SecureVote</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={`font-medium ${pathname === '/' ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className={`font-medium ${pathname === '/dashboard' ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>
                  Dashboard
                </Link>
                <Link to="/vote" className={`font-medium ${pathname === '/vote' ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>
                  Cast Vote
                </Link>
                <Link to="/results" className={`font-medium ${pathname === '/results' ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>
                  Results
                </Link>
                <Link 
                  to="/duplicate-monitor" 
                  className={`font-medium flex items-center gap-1 ${
                    pathname === '/duplicate-monitor' ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Fraud Monitor</span>
                  {duplicateVotes.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {duplicateVotes.length}
                    </span>
                  )}
                </Link>
                <Link to="/" className="btn btn-secondary flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-primary flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <Link to="/" className="font-medium py-2" onClick={toggleMenu}>
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="font-medium py-2" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <Link to="/vote" className="font-medium py-2" onClick={toggleMenu}>
                  Cast Vote
                </Link>
                <Link to="/results" className="font-medium py-2" onClick={toggleMenu}>
                  Results
                </Link>
                <Link 
                  to="/duplicate-monitor" 
                  className="font-medium py-2 flex items-center gap-1" 
                  onClick={toggleMenu}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Fraud Monitor</span>
                  {duplicateVotes.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {duplicateVotes.length}
                    </span>
                  )}
                </Link>
                <Link to="/" className="btn btn-secondary flex items-center gap-2 justify-center" onClick={toggleMenu}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary w-full text-center" onClick={toggleMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary w-full text-center flex items-center gap-2 justify-center" onClick={toggleMenu}>
                  <User className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
 