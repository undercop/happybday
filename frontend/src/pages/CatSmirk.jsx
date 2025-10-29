import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const CatSmirk = () => {
  const navigate = useNavigate();
  const [currentGif, setCurrentGif] = useState(0);

  // Array of cat smirk GIF embeds - you can add more here
  const gifEmbeds = [
    {
      id: 1,
      embed: `<div class="tenor-gif-embed" data-postid="15429355503144496620" data-share-method="host" data-aspect-ratio="0.654619" data-width="100%"><a href="https://tenor.com/view/loh-lohzinha-loloh-calcificados-gato-gif-15429355503144496620">Loh Lohzinha GIF</a>from <a href="https://tenor.com/search/loh-gifs">Loh GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>`
    },
    // Add more GIFs here in the same format:
    // {
    //   id: 2,
    //   embed: `YOUR_SECOND_GIF_EMBED_CODE`
    // },
    // {
    //   id: 3,
    //   embed: `YOUR_THIRD_GIF_EMBED_CODE`
    // }
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const randomizeGif = () => {
    const randomIndex = Math.floor(Math.random() * gifEmbeds.length);
    setCurrentGif(randomIndex);
  };

  // Auto-randomize every 5 seconds
  useEffect(() => {
    if (gifEmbeds.length > 1) {
      const interval = setInterval(() => {
        randomizeGif();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [gifEmbeds.length]);

  // Load the Tenor embed script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://tenor.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [currentGif]);

  return (
    <div className="cat-smirk-container dark-theme">
      <button className="back-button dark-back" onClick={handleBack}>
        ← Back
      </button>
      
      <div className="content">
        <h1 className="glowing-text">Cat Smirk 😼</h1>
        
        <div className="gif-container dark-frame">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: gifEmbeds[currentGif]?.embed || gifEmbeds[0].embed 
            }} 
          />
        </div>

        {gifEmbeds.length > 1 && (
          <>
            <button className="randomize-button dark-red" onClick={randomizeGif}>
              Randomize Smirk 🔄
            </button>
            
            <div className="gif-counter">
              <span className="counter-text">
                Smirk {currentGif + 1} of {gifEmbeds.length}
              </span>
            </div>
          </>
        )}
        
        <div className="mysterious-text">
          <p>Something mysterious awaits...</p>
        </div>
      </div>
    </div>
  );
};

export default CatSmirk;