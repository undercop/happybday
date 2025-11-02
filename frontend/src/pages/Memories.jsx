import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Memories = () => {
  const [memories, setMemories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [newMemory, setNewMemory] = useState({
    image: null,
    caption: '',
    date: ''
  });
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const slideIntervalRef = useRef(null);
  const fileInputRef = useRef(null);
  const successTimerRef = useRef(null);

  const API_BASE = 'https://happybdaybk.vercel.app';

  // Fetch memories from MongoDB
  const fetchMemories = async () => {
    try {
      console.log('🔄 Fetching memories from:', `${API_BASE}/memories`);
      const response = await axios.get(`${API_BASE}/memories`);
      console.log('✅ Memories fetched:', response.data);
      setMemories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching memories:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  // Auto slideshow
  useEffect(() => {
    if (memories.length > 0 && isPlaying) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === memories.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
    }

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [memories.length, isPlaying]);

  const nextSlide = () => {
    setCurrentIndex(currentIndex === memories.length - 1 ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? memories.length - 1 : currentIndex - 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.log('Audio play failed:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleBack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    navigate('/');
  };

  // Reset modal state when opening
  const openUploadModal = () => {
    setNewMemory({ image: null, caption: '', date: '' });
    setUploadError('');
    setUploadSuccess(false);
    setShowUploadModal(true);
  };

  // Close modal and reset everything
  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploading(false);
    setUploadError('');
    setUploadSuccess(false);
    setNewMemory({ image: null, caption: '', date: '' });
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
    }
  };

  // Upload functionality
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('📄 File selected:', file.name, file.type, file.size);
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size too large. Please select an image under 5MB.');
        return;
      }
      setUploadError('');
      setNewMemory(prev => ({ ...prev, image: file }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess(false);

    if (!newMemory.image) {
      setUploadError('Please select an image file');
      return;
    }
    if (!newMemory.caption.trim()) {
      setUploadError('Please add a caption for your memory');
      return;
    }
    if (!newMemory.date) {
      setUploadError('Please select a date for this memory');
      return;
    }

    setUploading(true);
    console.log('🔄 Starting upload process...');

    try {
      // First upload the image
      const formData = new FormData();
      formData.append('image', newMemory.image);

      console.log('📤 Uploading image to:', `${API_BASE}/upload`);
      const uploadResponse = await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000
      });

      console.log('✅ Upload response:', uploadResponse.data);

      // Then create the memory with the image URL
      const memoryData = {
        imageUrl: uploadResponse.data.imageUrl,
        caption: newMemory.caption,
        date: newMemory.date,
        cloudinaryId: uploadResponse.data.cloudinaryId
      };

      console.log('📝 Creating memory with data:', memoryData);
      const memoryResponse = await axios.post(`${API_BASE}/memories`, memoryData);
      
      console.log('✅ Memory created:', memoryResponse.data);

      // Set success state
      setUploadSuccess(true);
      setUploading(false);

      // Refresh memories after a short delay
      setTimeout(() => {
        fetchMemories();
      }, 1000);

      // Auto-close modal after 3 seconds
      successTimerRef.current = setTimeout(() => {
        closeUploadModal();
      }, 3000);
      
    } catch (error) {
      console.error('❌ Upload error details:', error);
      setUploading(false);
      
      if (error.response) {
        setUploadError(`Server error: ${error.response.data.error || 'Upload failed'}`);
      } else if (error.request) {
        setUploadError('Network error: Could not connect to server. Make sure backend is running on port 5000.');
      } else {
        setUploadError(`Upload failed: ${error.message}`);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#270f34] flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading beautiful memories... 💖</div>
      </div>
    );
  }

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
      <div className="absolute inset-0 bg-black/30 z-0"></div>
      
      {/* Background Music */}
      <audio 
        ref={audioRef} 
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/audio/lover.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

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

      {/* Upload Button */}
      <button
        onClick={openUploadModal}
        className="absolute top-6 right-6 z-50 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full 
                   hover:bg-white/30 transition-all duration-300 border border-white/30 hover:scale-105 
                   flex items-center space-x-2"
      >
        <span>📤</span>
        <span>Add Memory</span>
      </button>

      {/* Music Control */}
      <button
        onClick={toggleMusic}
        className="absolute top-6 right-40 z-50 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full 
                   hover:bg-white/30 transition-all duration-300 border border-white/30 hover:scale-105 
                   flex items-center space-x-2"
      >
        <span>{isPlaying ? '🔊' : '🔇'}</span>
        <span>{isPlaying ? 'Pause Music' : 'Play Music'}</span>
      </button>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            Our Beautiful Memories 📸
          </h1>
          <p className="text-white/90 text-xl max-w-2xl mx-auto">
            {memories.length > 0 
              ? `Cherishing ${memories.length} special moments together...`
              : 'No memories yet. Add your first memory!'
            }
          </p>
        </div>

        {/* Slideshow Container */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            
            {/* Main Slideshow */}
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8 bg-black">
              {memories.length > 0 ? (
                <>
                  {/* Current Slide */}
                  <div
                    className="absolute inset-0 transition-all duration-500 ease-in-out transform"
                    key={currentIndex}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-black">
                      <img
                        src={memories[currentIndex].imageUrl}
                        alt={memories[currentIndex].caption}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2NjY2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPkltYWdlIG5vdCBmb3VuZDwvdGV4dD4KPC9zdmc+';
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
                        {memories[currentIndex].caption}
                      </h3>
                      <p className="text-white/80">
                        {new Date(memories[currentIndex].date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm 
                               text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 
                               border border-white/30 hover:scale-110 z-10"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm 
                               text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 
                               border border-white/30 hover:scale-110 z-10"
                  >
                    →
                  </button>

                  {/* Slide Indicator */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {memories.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-white scale-125' 
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white text-2xl bg-black/50 rounded-2xl">
                  <div className="text-6xl mb-4">📸</div>
                  <p>No memories yet</p>
                  <button
                    onClick={openUploadModal}
                    className="mt-4 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full transition-all duration-300"
                  >
                    Add Your First Memory
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {memories.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {memories.map((memory, index) => (
                  <button
                    key={memory._id}
                    onClick={() => goToSlide(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 
                               ${index === currentIndex 
                                 ? 'border-white scale-105' 
                                 : 'border-white/30 hover:border-white/50 hover:scale-105'
                               }`}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <img
                        src={memory.imageUrl}
                        alt={memory.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300" />
                  </button>
                ))}
              </div>
            )}

            {/* Slideshow Controls */}
            {memories.length > 0 && (
              <div className="flex justify-center mt-6 space-x-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full 
                             hover:bg-white/30 transition-all duration-300 border border-white/30 
                             hover:scale-105 flex items-center space-x-2"
                >
                  <span>{isPlaying ? '⏸️' : '▶️'}</span>
                  <span>{isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Memory Counter */}
        {memories.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-white/90 text-lg">
              Memory {currentIndex + 1} of {memories.length} • 
              <span className="ml-2">
                {isPlaying ? 'Auto-playing every 3 seconds' : 'Click to navigate'}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            
            {/* Success Confirmation */}
            {uploadSuccess ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h2 className="text-3xl font-bold text-green-600 mb-4">Success!</h2>
                <p className="text-gray-700 text-lg mb-2">
                  Your memory has been uploaded successfully!
                </p>
                <p className="text-gray-600 text-sm mb-6">
                  The popup will close automatically in a few seconds...
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            ) : (
              /* Upload Form */
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Memory 💖</h2>
                
                {/* Error Display */}
                {uploadError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {uploadError}
                  </div>
                )}
                
                <form onSubmit={handleUpload} className="space-y-4">
                  {/* File Upload */}
                  <div>
                    <label className="block text-gray-700 mb-2">Select Photo (Max 5MB)</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                    />
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      disabled={uploading}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {newMemory.image ? (
                        <div className="text-green-600">
                          <div className="text-2xl">✅</div>
                          <div className="text-sm truncate">{newMemory.image.name}</div>
                          <div className="text-xs text-gray-500">
                            {(newMemory.image.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <div className="text-2xl">📸</div>
                          <div>Click to select a photo</div>
                          <div className="text-xs">JPEG, PNG, GIF (Max 5MB)</div>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="block text-gray-700 mb-2">Memory Description</label>
                    <input
                      type="text"
                      value={newMemory.caption}
                      onChange={(e) => setNewMemory(prev => ({ ...prev, caption: e.target.value }))}
                      placeholder="Describe this beautiful moment..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent disabled:opacity-50"
                      required
                      disabled={uploading}
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={newMemory.date}
                      onChange={(e) => setNewMemory(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent disabled:opacity-50"
                      required
                      disabled={uploading}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={closeUploadModal}
                      className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        'Add Memory 💖'
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Elements */}
      <div className="relative z-10 absolute bottom-8 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce">
        💖📸✨
      </div>
    </div>
  );
};

export default Memories;