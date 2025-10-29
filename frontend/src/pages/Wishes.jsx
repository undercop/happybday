
//lover versionn
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Wishes = () => {
//   const [wish, setWish] = useState(null);
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [fade, setFade] = useState(false);
//   const [memories, setMemories] = useState([]);
//   const navigate = useNavigate();

//   // Personalized birthday wishes for Cutuuu
//   const cutuuuWishes = [
//     "Happy Birthday my beautiful Cutuuu! 🎂 Every moment with you feels like a dream come true. You're the most amazing person I've ever known! 💖",
//     "To my darling Cutuuu, on your special day! 🌟 You light up my world in ways I never thought possible. May your birthday be as magical as you are! ✨",
//     "Happy Birthday to the girl who stole my heart! 💝 Cutuuu, you're my everything. I'm so grateful for every second I get to spend with you! 🥰",
//     "My dearest Cutuuu, on your birthday I want you to know how incredibly special you are! 🎉 You make every day brighter just by being in it! 🌈",
//     "Happy Birthday to the most wonderful Cutuuu in the world! 🎁 Your smile could light up the darkest room, and your heart could melt the coldest ice! 💫",
//     "To my Cutuuu, the love of my life! 🥳 On your birthday, I wish you endless happiness, laughter, and all the love you deserve! You're perfect! 💕",
//     "Cutuuu, my angel! 🎊 Happy Birthday to the girl who makes my heart skip a beat every single day. You're more amazing than you'll ever know! 🌠",
//     "Happy Birthday my sweet Cutuuu! 🍰 You're not just my girlfriend, you're my best friend, my partner, and my greatest blessing! 💘",
//     "To Cutuuu, the most beautiful soul I've ever met! 🌸 May your birthday be filled with all the joy and love you bring into my life every day! 💝",
//     "My precious Cutuuu, happy birthday! 🦄 You're like a shooting star - rare, beautiful, and magical. I'm so lucky to have you! 💖",
//     "Cutuuu, on your special day I want to remind you how incredibly loved you are! 🎈 You make my world complete in every way possible! 💞",
//     "Happy Birthday to my one and only Cutuuu! 🎇 You're the reason I believe in fairy tales and happy endings. You're my dream come true! 💫",
//     "To Cutuuu, the girl who makes every day feel like Valentine's! 💌 May your birthday be as sweet and wonderful as you are! 🍭",
//     "My dearest Cutuuu, happy birthday! 🎀 You're the missing piece I never knew I needed. Thank you for being you! 💕",
//     "Cutuuu, you're my sunshine on cloudy days! ☀️ Happy Birthday to the most radiant, amazing, and beautiful girl in the universe! 🌟"
//   ];

//   // Fetch memories to get Cloudinary images
//   const fetchMemories = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/memories');
//       setMemories(response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching memories:', error);
//       return [];
//     }
//   };

//   // Get random image from memories
//   const getRandomImage = (memoriesList) => {
//     if (memoriesList.length === 0) {
//       // Fallback images if no memories exist
//       const fallbackImages = [
//         "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600", // Balloons
//         "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600", // Cake
//         "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600", // Confetti
//       ];
//       return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
//     }
    
//     const randomMemory = memoriesList[Math.floor(Math.random() * memoriesList.length)];
//     return randomMemory.imageUrl;
//   };

//   // Get random wish
//   const getRandomWish = () => {
//     return cutuuuWishes[Math.floor(Math.random() * cutuuuWishes.length)];
//   };

//   // Generate new random wish and image
//   const generateNewWish = async () => {
//     setFade(true);
    
//     setTimeout(async () => {
//       setLoading(true);
      
//       let memoriesList = memories;
//       if (memoriesList.length === 0) {
//         memoriesList = await fetchMemories();
//       }
      
//       const newWish = getRandomWish();
//       const newImage = getRandomImage(memoriesList);
      
//       setWish(newWish);
//       setImage(newImage);
//       setLoading(false);
//       setFade(false);
//     }, 300);
//   };

//   // Load initial wish and image
//   useEffect(() => {
//     const initializeWish = async () => {
//       const memoriesList = await fetchMemories();
//       const initialWish = getRandomWish();
//       const initialImage = getRandomImage(memoriesList);
      
//       setWish(initialWish);
//       setImage(initialImage);
//       setLoading(false);
//     };

//     initializeWish();
//   }, []);

//   const handleBack = () => {
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 relative overflow-hidden">
      
//       {/* Back Button */}
//       <button
//         onClick={handleBack}
//         className="absolute top-6 left-6 z-50 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full 
//                    hover:bg-white/30 transition-all duration-300 border border-white/30 hover:scale-105 
//                    flex items-center space-x-2"
//       >
//         <span>←</span>
//         <span>Back to Home</span>
//       </button>

//       <div className="container mx-auto px-4 py-8 pt-20">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
//             For My Cutuuu 💝
//           </h1>
//           <p className="text-white/80 text-xl max-w-2xl mx-auto">
//             Special birthday wishes just for you, my love!
//           </p>
//         </div>

//         {/* Main Content */}
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            
//             {/* Wish Card */}
//             <div className={`bg-white rounded-2xl p-8 shadow-xl transition-all duration-500 transform ${fade ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              
//               {loading ? (
//                 // Loading State
//                 <div className="flex flex-col items-center justify-center py-16">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mb-4"></div>
//                   <p className="text-gray-600 text-lg">Creating your special wish...</p>
//                 </div>
//               ) : (
//                 // Content
//                 <div className="flex flex-col lg:flex-row items-center gap-8">
                  
//                   {/* Image Section */}
//                   <div className="flex-1">
//                     <div className="rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
//                       <img
//                         src={image}
//                         alt="Our beautiful memory"
//                         className="w-full h-64 lg:h-80 object-cover"
//                         onError={(e) => {
//                           // Fallback if image fails to load
//                           e.target.src = "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600";
//                         }}
//                       />
//                     </div>
//                     <p className="text-center text-gray-600 text-sm mt-2">
//                       {memories.length > 0 ? "One of our beautiful memories 💖" : "A beautiful memory waiting to be made ✨"}
//                     </p>
//                   </div>

//                   {/* Wish Text Section */}
//                   <div className="flex-1 text-center lg:text-left">
//                     <div className="mb-6">
//                       <div className="text-4xl mb-4 animate-bounce">💕</div>
//                       <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
//                         For My Cutuuu 🥰
//                       </h2>
//                       <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
//                         {wish}
//                       </p>
//                     </div>

//                     {/* Love Meter */}
//                     <div className="bg-pink-50 rounded-lg p-4 mb-4">
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="text-pink-700 font-semibold">My Love for Cutuuu:</span>
//                         <span className="text-pink-700 font-bold">∞ / 10</span>
//                       </div>
//                       <div className="w-full bg-pink-200 rounded-full h-2">
//                         <div 
//                           className="bg-pink-600 h-2 rounded-full animate-pulse" 
//                           style={{ width: '100%' }}
//                         ></div>
//                       </div>
//                     </div>

//                     {/* Decorative Elements */}
//                     <div className="flex justify-center lg:justify-start space-x-2">
//                       <span className="text-2xl animate-pulse">💖</span>
//                       <span className="text-2xl animate-pulse" style={{ animationDelay: '0.2s' }}>🎀</span>
//                       <span className="text-2xl animate-pulse" style={{ animationDelay: '0.4s' }}>🌸</span>
//                       <span className="text-2xl animate-pulse" style={{ animationDelay: '0.6s' }}>💫</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
//               <button
//                 onClick={generateNewWish}
//                 disabled={loading}
//                 className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 px-8 rounded-full 
//                            transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
//                            flex items-center justify-center space-x-2 shadow-lg"
//               >
//                 <span>💝</span>
//                 <span>New Wish for Cutuuu</span>
//               </button>

//               <button
//                 onClick={() => {
//                   if (wish) {
//                     navigator.clipboard.writeText(wish);
//                     alert('Wish copied to clipboard! 📋 Now you can share it with Cutuuu!');
//                   }
//                 }}
//                 disabled={loading || !wish}
//                 className="bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-full 
//                            transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
//                            flex items-center justify-center space-x-2 border border-white/30"
//               >
//                 <span>📋</span>
//                 <span>Copy Wish</span>
//               </button>
//             </div>
//           </div>

//           {/* Personal Message Section */}
//           <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
//             <div className="text-4xl mb-4">💌</div>
//             <h3 className="text-white text-2xl font-bold mb-4">A Special Note for Cutuuu</h3>
//             <p className="text-white/90 text-lg leading-relaxed">
//               Every wish here comes straight from my heart. You're the most amazing person I've ever known, 
//               and I feel incredibly lucky to celebrate your birthday with you. No matter how many wishes I write, 
//               they'll never fully capture how much you mean to me. I love you more than words can say! 💕
//             </p>
//             <div className="mt-4 flex justify-center space-x-2 text-2xl">
//               <span className="animate-bounce">💖</span>
//               <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🎂</span>
//               <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
//               <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🥰</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Floating Elements */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-2xl">
//         <div className="flex space-x-4 animate-bounce">
//           <span>💝</span>
//           <span>🎀</span>
//           <span>🌸</span>
//           <span>💕</span>
//         </div>
//       </div>

//       {/* Secret Love Message */}
//       <div className="absolute top-1/2 right-8 transform -translate-y-1/2 rotate-90 opacity-20 hidden lg:block">
//         <p className="text-white text-sm font-semibold">I 💖 Cutuuu</p>
//       </div>
//       <div className="absolute top-1/2 left-8 transform -translate-y-1/2 -rotate-90 opacity-20 hidden lg:block">
//         <p className="text-white text-sm font-semibold">Cutuuu 💖 Me</p>
//       </div>
//     </div>
//   );
// };

// export default Wishes;

// normal version
import 'css-doodle';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Wishes = () => {
  const [wish, setWish] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);
  const [memories, setMemories] = useState([]);
  const navigate = useNavigate();

  // Friendly birthday wishes for Cutuuu
  const cutuuuWishes = [
    "Happy Birthday Cutuuu! 🎂 Wishing you an absolutely amazing day filled with laughter, joy, and all your favorite things!",
    "Hey Cutuuu! Another trip around the sun! 🌟 Hope your birthday is as incredible and special as you are!",
    "Happy Birthday! 🎉 Today is all about you, Cutuuu! May your day be packed with fun, smiles, and wonderful moments!",
    "To Cutuuu - wishing you the happiest of birthdays! ✨ May this year bring you endless opportunities and amazing adventures!",
    "Happy Birthday Cutuuu! 🥳 Hope your special day is exactly what you want it to be and more! You deserve all the best!",
    "Birthday cheers to you, Cutuuu! 🎊 May your day be filled with good vibes, great company, and fantastic memories!",
    "Hey Cutuuu, happy birthday! 🎁 Wishing you a day that's as bright, fun, and wonderful as you are!",
    "Happy Birthday to one of the coolest people I know! 🎈 Hope your day is absolutely fantastic, Cutuuu!",
    "Cutuuu, it's your day! 🍰 Wishing you nothing but good times, laughter, and happiness today and always!",
    "Happy Birthday! 🌈 May your special day be filled with all the things that make you smile, Cutuuu!",
    "To Cutuuu - hope your birthday is as amazing as you are! 💫 Cheers to another year of awesome moments!",
    "Happy Birthday Cutuuu! 🎇 Wishing you a day that's just as special and unique as you are!",
    "Birthday wishes coming your way, Cutuuu! 🦄 Hope your day is absolutely magical and unforgettable!",
    "Hey Cutuuu, happy birthday! 🎀 May this year be your best one yet, filled with growth and happiness!",
    "Happy Birthday! 🎂 Hope your day is filled with good food, great laughs, and wonderful memories, Cutuuu!"
  ];

  // Fetch memories to get Cloudinary images
  const fetchMemories = async () => {
    try {
      const response = await axios.get('https://happybday-xi.vercel.app/api/memories');
      setMemories(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching memories:', error);
      return [];
    }
  };

  // Get random image from memories
  const getRandomImage = (memoriesList) => {
    if (memoriesList.length === 0) {
      // Fallback images if no memories exist
      const fallbackImages = [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600", // Balloons
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600", // Cake
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600", // Confetti
      ];
      return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    }
    
    const randomMemory = memoriesList[Math.floor(Math.random() * memoriesList.length)];
    return randomMemory.imageUrl;
  };

  // Get random wish
  const getRandomWish = () => {
    return cutuuuWishes[Math.floor(Math.random() * cutuuuWishes.length)];
  };

  // Generate new random wish and image
  const generateNewWish = async () => {
    setFade(true);
    
    setTimeout(async () => {
      setLoading(true);
      
      let memoriesList = memories;
      if (memoriesList.length === 0) {
        memoriesList = await fetchMemories();
      }
      
      const newWish = getRandomWish();
      const newImage = getRandomImage(memoriesList);
      
      setWish(newWish);
      setImage(newImage);
      setLoading(false);
      setFade(false);
    }, 300);
  };

  // Load initial wish and image
  useEffect(() => {
    const initializeWish = async () => {
      const memoriesList = await fetchMemories();
      const initialWish = getRandomWish();
      const initialImage = getRandomImage(memoriesList);
      
      setWish(initialWish);
      setImage(initialImage);
      setLoading(false);
    };

    initializeWish();
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#270f34]">
      {/* CSS Doodle Background */}
      <div 
        className="absolute inset-0 z-0"
        dangerouslySetInnerHTML={{
          __html: `
            <css-doodle>
              <style>
                --color: #51eaea, #fffde1, #ff9d76, #FB3569;

                @grid: 30x1 / 100vw 100vh / #270f34; 
                
                :container {
                  perspective: 30vmin;
                  --deg: @p(-180deg, 180deg);
                }
                
                :after, :before {
                  content: '';
                  background: @p(--color); 
                  @place: @r(100%) @r(100%);
                  @size: @r(6px);
                  @shape: heart;
                }

                @place: center;
                @size: 18vmin; 

                box-shadow: @m2(0 0 50px @p(--color));
                background: @m100(
                  radial-gradient(@p(--color) 50%, transparent 0) 
                  @r(-20%, 120%) @r(-20%, 100%) / 1px 1px
                  no-repeat
                );

                will-change: transform, opacity;
                animation: scale-up 12s linear infinite;
                animation-delay: calc(-12s / @I * @i);

                @keyframes scale-up {
                  0%, 95.01%, 100% {
                    transform: translateZ(0) rotate(0);
                    opacity: 0;
                  }
                  10% { 
                    opacity: 1; 
                  }
                  95% {
                    transform: 
                      translateZ(35vmin) rotateZ(var(--deg));
                  }
                }
              </style>
            </css-doodle>
          `
        }}
      />

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>
      
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 z-50 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full 
                   hover:bg-white/30 transition-all duration-300 border border-white/30 hover:scale-105 
                   flex items-center space-x-2"
      >
        <span>←</span>
        <span>Back to Home</span>
      </button>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            Birthday Wishes! 🎉
          </h1>
          <p className="text-white/90 text-xl max-w-2xl mx-auto">
            Celebrating you today, Cutuuu!
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            
            {/* Wish Card */}
            <div className={`bg-white rounded-2xl p-8 shadow-xl transition-all duration-500 transform ${fade ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              
              {loading ? (
                // Loading State
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
                  <p className="text-gray-600 text-lg">Getting your birthday wish ready...</p>
                </div>
              ) : (
                // Content
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  
                  {/* Image Section */}
                  <div className="flex-1">
                    <div className="rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                      <img
                        src={image}
                        alt="Birthday celebration"
                        className="w-full h-64 lg:h-80 object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.target.src = "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600";
                        }}
                      />
                    </div>
                    <p className="text-center text-gray-600 text-sm mt-2">
                      {memories.length > 0 ? "Celebrating good times! 🎊" : "Let's make some birthday memories! 📸"}
                    </p>
                  </div>

                  {/* Wish Text Section */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="mb-6">
                      <div className="text-4xl mb-4 animate-bounce">🎂</div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                        For Cutuuu! ✨
                      </h2>
                      <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                        {wish}
                      </p>
                    </div>

                    {/* Birthday Fun Meter */}
                    <div className="bg-purple-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-700 font-semibold">Today's Birthday Vibes:</span>
                        <span className="text-purple-700 font-bold">100%</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="flex justify-center lg:justify-start space-x-2">
                      <span className="text-2xl">🎉</span>
                      <span className="text-2xl">🥳</span>
                      <span className="text-2xl">🎊</span>
                      <span className="text-2xl">✨</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={generateNewWish}
                disabled={loading}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-8 rounded-full 
                           transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>🎲</span>
                <span>New Birthday Wish</span>
              </button>

              <button
                onClick={() => {
                  if (wish) {
                    navigator.clipboard.writeText(wish);
                    alert('Wish copied to clipboard! 📋 Ready to share!');
                  }
                }}
                disabled={loading || !wish}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-full 
                           transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center space-x-2 border border-white/30"
              >
                <span>📋</span>
                <span>Copy Wish</span>
              </button>
            </div>
          </div>

          {/* Birthday Celebration Tips */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
              <div className="text-3xl mb-2">🎁</div>
              <h3 className="text-white font-semibold mb-2">Perfect Day</h3>
              <p className="text-white/90 text-sm">Hope your birthday is exactly how you want it - fun, relaxing, and totally you!</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
              <div className="text-3xl mb-2">🌟</div>
              <h3 className="text-white font-semibold mb-2">Amazing Year</h3>
              <p className="text-white/90 text-sm">Wishing you 365 days of growth, laughter, and wonderful experiences!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="relative z-10 absolute bottom-8 left-1/2 transform -translate-x-1/2 text-2xl">
        <div className="flex space-x-4 animate-bounce">
          <span>🎉</span>
          <span>🎂</span>
          <span>✨</span>
          <span>🥳</span>
        </div>
      </div>
    </div>
  );
};

export default Wishes;