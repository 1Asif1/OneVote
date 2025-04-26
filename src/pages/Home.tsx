import  { Link } from 'react-router-dom';
import { Check, ShieldCheck, Users, Vote } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-600/80 z-10"></div>
        <div className="h-[600px] w-full">
          <img 
            src="https://images.unsplash.com/photo-1569426489641-24e9e4028fa3" 
            alt="Democracy protest" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Secure Elections for a Just Society
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Our platform supports SDG 16 by providing transparent, secure voting 
                that prevents fraud and double-voting through advanced verification.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn btn-primary text-center text-lg py-3 px-6">
                  Register to Vote
                </Link>
                <Link to="/login" className="btn btn-secondary bg-white/90 text-center text-lg py-3 px-6">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Promoting Peace, Justice and Strong Institutions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our secure voting system helps achieve SDG 16 by strengthening democratic processes 
              and ensuring electoral integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card flex flex-col items-center text-center">
              <div className="bg-primary-100 p-4 rounded-full mb-6">
                <ShieldCheck className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Verification</h3>
              <p className="text-gray-600">
                Multi-factor authentication and biometric verification prevent identity fraud and double voting.
              </p>
            </div>

            <div className="card flex flex-col items-center text-center">
              <div className="bg-primary-100 p-4 rounded-full mb-6">
                <Vote className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparent Voting</h3>
              <p className="text-gray-600">
                Open and transparent processes with real-time monitoring to ensure fair elections.
              </p>
            </div>

            <div className="card flex flex-col items-center text-center">
              <div className="bg-primary-100 p-4 rounded-full mb-6">
                <Users className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Inclusive Participation</h3>
              <p className="text-gray-600">
                Accessible platform that encourages wider participation in democratic processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How SecureVote Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform uses advanced technology to ensure secure, reliable elections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1604420022249-87e637722439" 
                alt="Voting process" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-primary-600 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Register with Verified ID</h3>
                    <p className="text-gray-600">Secure registration using government-issued identification and unique voter ID.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-primary-600 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Biometric Verification</h3>
                    <p className="text-gray-600">Use biometric data to confirm your identity before accessing the ballot.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-primary-600 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cast Your Secure Vote</h3>
                    <p className="text-gray-600">Vote securely with end-to-end encryption that protects your ballot.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-primary-600 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Verification & Results</h3>
                    <p className="text-gray-600">Receive confirmation of your vote and view transparent election results.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make Your Voice Heard?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our secure voting platform today and contribute to building stronger democratic institutions.
          </p>
          <Link to="/register" className="btn bg-white text-primary-800 hover:bg-gray-100 text-lg py-3 px-8 inline-block">
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
 