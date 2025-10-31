import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen w-full  flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 p-4 opacity-30">
        <div className="absolute top-20 left-20 w-11 h-11 md:w-72 md:h-72 bg-purple-900 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-11 h-11 md:w-96 md:h-96 bg-red-500 rounded-full blur-3xl"></div>
      
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        {/* Chat Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <MessageCircle className="w-20 h-20 text-black animate-pulse" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-700 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full"></div>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl  md:text-6xl lg:text-7xl font-bold text-black -tracking-normal leading-tight font-display">
          Chat with{' '}
          <span className="bg-clip-text text-transparent   font-inter bg-gradient-to-r from-red-600 via-black to-purple-900 animate-gradient-x">
            Friends
          </span>{' '}
          Instantly
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-900 max-w-2xl mx-auto">
          Connect, message, and stay in touch with your friends in real-time. Simple, fast, and secure.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
          <Link to="/login">
            <button className="group bg-black text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <Link to="/register">
            <button className="bg-transparent border-2 font-display border-gray-400 text-black font-normal  px-8 py-4 rounded-xl hover:bg-white hover:text-black transition-all duration-200">
              Create Account
            </button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex justify-center gap-8 mt-16 text-black text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <span className='tracking-wide'>End-to-end encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <span className='tracking-wide'>Real-time sync</span>
          </div>
        </div>
      </div>

      {/* Floating chat bubbles (decorative) */}
      <div className="absolute top-12 md:top-32 left-10 animate-bounce delay-100">
        <div className="bg-gray-900 text-white px-4 py-2 rounded-2xl rounded-tl-sm text-sm shadow-lg">
          Hey! 👋
        </div>
      </div>
      <div className="absolute bottom-12 md:bottom-40 right-14 animate-bounce delay-300">
        <div className="bg-gray-200 text-black px-4 py-2 rounded-2xl rounded-br-sm text-sm shadow-lg">
          Let's catch up!
        </div>
      </div>
    </div>
  );
};

export default Home;