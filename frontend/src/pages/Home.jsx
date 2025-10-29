import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const navigate = useNavigate();

  // Confetti animation code
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    
    let W = window.innerWidth;
    let H = window.innerHeight;
    const maxConfettis = 150;
    const particles = [];

    const possibleColors = [
      "DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", 
      "LightBlue", "Gold", "Violet", "PaleGreen", "SteelBlue", 
      "SandyBrown", "Chocolate", "Crimson"
    ];

    function randomFromTo(from, to) {
      return Math.floor(Math.random() * (to - from + 1) + from);
    }

    function ConfettiParticle() {
      this.x = Math.random() * W;
      this.y = Math.random() * H - H;
      this.r = randomFromTo(11, 33);
      this.d = Math.random() * maxConfettis + 11;
      this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
      this.tilt = Math.floor(Math.random() * 33) - 11;
      this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
      this.tiltAngle = 0;

      this.draw = function() {
        context.beginPath();
        context.lineWidth = this.r / 2;
        context.strokeStyle = this.color;
        context.moveTo(this.x + this.tilt + this.r / 3, this.y);
        context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
        return context.stroke();
      };
    }

    function draw() {
      context.clearRect(0, 0, W, window.innerHeight);
      for (let i = 0; i < maxConfettis; i++) {
        particles[i].draw();
      }

      let particle = {};
      for (let i = 0; i < maxConfettis; i++) {
        particle = particles[i];
        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
        particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

        if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
          particle.x = Math.random() * W;
          particle.y = -30;
          particle.tilt = Math.floor(Math.random() * 10) - 20;
        }
      }
      animationRef.current = requestAnimationFrame(draw);
    }

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };

    // Initialize particles
    for (let i = 0; i < maxConfettis; i++) {
      particles.push(new ConfettiParticle());
    }

    // Set canvas dimensions
    canvas.width = W;
    canvas.height = H;
    
    // Start animation
    animationRef.current = requestAnimationFrame(draw);
    
    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Navigation handlers
  const handleMemoriesClick = () => {
    navigate('/memories');
  };

  const handleWishesClick = () => {
    navigate('/wishes');
  };

  const handleSurpriseClick = () => {
    navigate('/surprise');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-red-800 to-black/90">
      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        {/* Birthday Title */}
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 opacity-90 drop-shadow-2xl">
          Happy Birthday!
        </h1>
        
        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-white opacity-80 mb-12 font-light">
          To the most cutest and the only cutuuuuu in the world! 💖
        </p>
        
        {/* Love Message */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-2xl border border-white/30 mb-12">
          <p className="text-white text-lg md:text-xl leading-relaxed">
           i hope u get all the happiness u desire and all ur dreams come true, im always rooting for u 
          </p>
        </div>

        {/* Animated Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <AnimatedButton
            title="Our Memories"
            subtitle="Relive our beautiful moments"
            icon="📸"
            onClick={handleMemoriesClick}
            animationType="photo"
          />
          
          <AnimatedButton
            title="Birthday Wishes"
            subtitle="See all the love and wishes"
            icon="💝"
            onClick={handleWishesClick}
            animationType="heart"
          />
          
          <AnimatedButton
            title="Special Surprise"
            subtitle="Something amazing awaits"
            icon="🎁"
            onClick={handleSurpriseClick}
            animationType="gift"
          />
        </div>

        {/* Floating Hearts */}
        <div className="mt-12 text-4xl animate-bounce">
          💖🎂🎉✨
        </div>
      </div>
    </div>
  );
};

// Animated Button Component
const AnimatedButton = ({ title, subtitle, icon, onClick, animationType }) => {
  return (
    <button
      onClick={onClick}
      className="group relative bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-6 w-full 
                 transition-all duration-500 hover:scale-105 hover:bg-white/20 hover:border-white/40 
                 overflow-hidden transform hover:-translate-y-2 cursor-pointer"
    >
      {/* Animated Background */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                      ${animationType === 'photo' ? 'bg-gradient-to-br from-blue-400/20 to-purple-500/20' : 
                        animationType === 'heart' ? 'bg-gradient-to-br from-pink-400/20 to-red-500/20' : 
                        'bg-gradient-to-br from-yellow-400/20 to-orange-500/20'}`} />
      
      {/* Sprite Animation Container */}
      <div className="relative z-10">
        {/* Icon with animation */}
        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        
        {/* Subtitle */}
        <p className="text-white/80 text-sm">{subtitle}</p>
      </div>

      {/* Sprite Animation Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {/* Floating particles animation */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full opacity-0 group-hover:opacity-100
                        ${animationType === 'photo' ? 'bg-blue-300' : 
                          animationType === 'heart' ? 'bg-pink-300' : 
                          'bg-yellow-300'}
                        animate-float`}
            style={{
              left: `${20 + (i * 10)}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + (i * 0.5)}s`
            }}
          />
        ))}
        
        {/* Sparkle animation */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-ping"
              style={{
                top: `${30 + (i * 10)}%`,
                left: `${15 + (i * 15)}%`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Border glow effect */}
      <div className={`absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 
                      transition-all duration-500 group-hover:animate-pulse
                      ${animationType === 'photo' ? 'border-blue-300' : 
                        animationType === 'heart' ? 'border-pink-300' : 
                        'border-yellow-300'}`} />
    </button>
  );
};

export default Home;