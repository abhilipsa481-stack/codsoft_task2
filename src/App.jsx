import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, Search, Library, Heart, ListMusic, Disc, Mic, Plus, 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, 
  VolumeX, SlidersHorizontal, MoreHorizontal, Bell, Sparkles, ChevronLeft, ChevronRight, X 
} from 'lucide-react';

const initialSongs = [
  { id: 1, title: "Dusk Till Dawn", artist: "Aiden Vale", duration: "3:45", cover: "https://themoodguide.com/wp-content/uploads/2023/09/brown-coffe-phone-wallpaper.jpg", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Perfect", artist: "Aiden Vale", duration: "4:12", cover: "https://m.media-amazon.com/images/I/61CmHp1+CEL._AC_UF894,1000_QL80_.jpg", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "Better With You", artist: "Aiden Vale", duration: "3:28", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5rT0fqgxBh0eILA3E6uchkmhHd5DawV0ZI97jIFbyTdBtWiWUEbo9lcO7&s=10", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: 4, title: "Golden Hour", artist: "Hollow Caves", duration: "3:36", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr5jRSBk-iYf_6VwIjkz1dV80P2gIX3ZePorxmlSig4H_Ahq-b_EvqV6oN&s=10", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
];

const initialPlaylists = [
  { title: "Late Night Drive", desc: "Chill songs for city nights", cover: "https://media.craiyon.com/2025-08-01/NI8tYhdWRZeZyNFNc8LP-Q.webp" },
  { title: "Falling in Love", desc: "Songs that hit different", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtJBoA-HT77nYRTGv9flSvjOvk7eUxGvWEhEtpvgC6Ljnx8v4X-fezqLXW&s=10" },
  { title: "Acoustic Mornings", desc: "Soft, calm & beautiful", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRszyYzgPgQSV7zkB3SaEULvmRYnsvX5YowKdPjlNEyydLikbDKpIF8uqIf&s=10" }
];

export default function MusicPlayerApp() {
  
  const [songsData, setSongsData] = useState(() => {
    const saved = localStorage.getItem('midnight_songs');
    return saved ? JSON.parse(saved) : initialSongs;
  });

  const [playlistsData, setPlaylistsData] = useState(() => {
    const saved = localStorage.getItem('midnight_playlists');
    return saved ? JSON.parse(saved) : initialPlaylists;
  });
  
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [favorites, setFavorites] = useState([2]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const audioRef = useRef(null);
  const currentSong = songsData[currentSongIndex] || songsData[0];

  
  useEffect(() => {
    localStorage.setItem('midnight_songs', JSON.stringify(songsData));
  }, [songsData]);

  useEffect(() => {
    localStorage.setItem('midnight_playlists', JSON.stringify(playlistsData));
  }, [playlistsData]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((e) => console.log("Playback error:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(0.8);
      if (audioRef.current) audioRef.current.volume = 0.8;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const handleNext = () => {
    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * songsData.length);
      setCurrentSongIndex(randomIdx);
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % songsData.length);
    }
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songsData.length) % songsData.length);
    setIsPlaying(true);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  
  const handleAddContent = (e) => {
    e.preventDefault();
    if (!newTitle || !newImageUrl) return;

    const newSongItem = {
      id: Date.now(),
      title: newTitle,
      artist: newArtist || "Unknown Artist",
      duration: "3:30",
      cover: newImageUrl,
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    };

    const newPlaylistCard = {
      title: newTitle,
      desc: `By ${newArtist || "Custom Artist"}`,
      cover: newImageUrl
    };

    setSongsData([newSongItem, ...songsData]);
    setPlaylistsData([newPlaylistCard, ...playlistsData]);

    
    setNewTitle("");
    setNewArtist("");
    setNewImageUrl("");
    setIsModalOpen(false);
  };

  
  const filteredSongs = songsData.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#0b0b0e] text-zinc-300 font-sans overflow-hidden select-none relative">
      
      
      <audio
        ref={audioRef}
        src={currentSong.audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (isRepeat) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            handleNext();
          }
        }}
        onLoadedMetadata={() => {
          setDuration(audioRef.current.duration);
          if (isPlaying) audioRef.current.play();
        }}
      />

     
      <aside className="w-64 bg-[#070709] border-r border-zinc-900 flex flex-col justify-between hidden md:flex p-6">
        <div>
          
          <div className="flex items-center gap-2 text-white font-bold tracking-widest text-lg mb-8">
            <span className="text-amber-500 text-xl">✦</span> MIDNIGHT
          </div>

          
          <nav className="space-y-4 text-sm font-medium">
            <a href="#home" className="flex items-center gap-4 text-amber-500 bg-amber-500/10 px-4 py-3 rounded-xl">
              <Home size={18} /> Home
            </a>
            <a href="#search" className="flex items-center gap-4 hover:text-white px-4 py-3 transition">
              <Search size={18} /> Search
            </a>
            <a href="#library" className="flex items-center gap-4 hover:text-white px-4 py-3 transition">
              <Library size={18} /> Your Library
            </a>
            <a href="#liked" className="flex items-center gap-4 hover:text-white px-4 py-3 transition">
              <Heart size={18} /> Liked Songs
            </a>
          </nav>

          <div className="mt-8">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              <span>Your Playlists</span>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center hover:bg-amber-500 hover:text-black transition"
                title="Add Custom Photo/Song"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-2 text-sm text-zinc-400 max-h-40 overflow-y-auto pr-2">
              {playlistsData.map((pl, idx) => (
                <p key={idx} className="hover:text-white cursor-pointer truncate text-xs">{pl.title}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60" 
              alt="User Profile" 
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="text-xs">
              <h4 className="text-white font-medium">madebyadah</h4>
              <p className="text-zinc-500">Free Account</p>
            </div>
          </div>
          <MoreHorizontal size={18} className="text-zinc-500 cursor-pointer hover:text-white" />
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-y-auto pb-28">
        
        <header className="flex items-center justify-between px-8 py-5 sticky top-0 bg-[#0b0b0e]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition">
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition">
              <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="relative w-96 hidden lg:block">
            <Search size={16} className="absolute left-3 top-3 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search songs, artists, playlists..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-500 text-black text-xs font-semibold px-4 py-2 rounded-full hover:bg-amber-400 transition flex items-center gap-1.5 shadow-lg"
            >
              <Plus size={14} /> Add Custom Photo
            </button>
            <Bell size={18} className="text-zinc-400 cursor-pointer hover:text-white" />
          </div>
        </header>

        <div className="px-8 space-y-8">
          
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#181216] to-[#0f111a] p-8 flex flex-col md:flex-row justify-between items-center shadow-2xl border border-zinc-900">
            <div className="absolute inset-0 bg-cover bg-center opacity-10 filter blur-xl" style={{ backgroundImage: `url(${currentSong.cover})` }}></div>
            
            <div className="relative z-10 max-w-lg space-y-4">
              <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">Now Playing</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{currentSong.title}</h1>
              <p className="text-xl text-zinc-400 font-medium">{currentSong.artist}</p>
              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <span className="text-amber-400 font-semibold">Custom Upload</span>
                <span>•</span>
                <span>Interactive Player</span>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button 
                  onClick={togglePlay}
                  className="bg-white text-black font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-zinc-200 transition shadow-lg"
                >
                  <Play size={18} fill="black" /> {isPlaying ? "Pause" : "Play"}
                </button>
                <button 
                  onClick={() => toggleFavorite(currentSong.id)}
                  className="w-11 h-11 rounded-full border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition"
                >
                  <Heart size={18} className={favorites.includes(currentSong.id) ? "text-red-500 fill-red-500" : "text-zinc-300"} />
                </button>
              </div>
            </div>

            <div className="relative z-10 mt-6 md:mt-0 flex items-center justify-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-black border-4 border-zinc-800 shadow-2xl flex items-center justify-center animate-spin-slow">
                <div className="absolute inset-4 rounded-full border border-zinc-800/60"></div>
                <div className="absolute inset-10 rounded-full border border-zinc-800/40"></div>
                <img src={currentSong.cover} alt="Album Art" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-inner" />
              </div>
            </div>
          </div>

         
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Made for you & Custom Playlists</h2>
              <span className="text-xs text-zinc-500 cursor-pointer hover:text-white" onClick={() => setIsModalOpen(true)}>Add New +</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {playlistsData.map((item, index) => (
                <div key={index} className="bg-zinc-900/40 p-3 rounded-2xl border border-zinc-900 hover:bg-zinc-900 transition group cursor-pointer">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <button className="absolute bottom-3 right-3 w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-black shadow-lg opacity-0 group-hover:opacity-100 transition duration-300 translate-y-2 group-hover:translate-y-0">
                      <Play size={16} fill="black" />
                    </button>
                  </div>
                  <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
                  <p className="text-xs text-zinc-500 truncate">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pb-12">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Available Tracks</h2>
              {searchQuery && (
                <span className="text-xs text-amber-500">
                  Found {filteredSongs.length} result(s) for "{searchQuery}"
                </span>
              )}
            </div>

            {filteredSongs.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4">No matching songs found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredSongs.map((song, idx) => (
                  <div 
                    key={song.id}
                    onClick={() => { 
                      const realIndex = songsData.findIndex(s => s.id === song.id);
                      setCurrentSongIndex(realIndex); 
                      setIsPlaying(true); 
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/30 border border-zinc-900 hover:bg-zinc-900 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-semibold text-white group-hover:text-amber-400 transition">{song.title}</h4>
                        <p className="text-[10px] text-zinc-500">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-zinc-500 font-mono">{song.duration}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
                        className="text-zinc-500 hover:text-red-500 transition"
                      >
                        <Heart size={16} className={favorites.includes(song.id) ? "text-red-500 fill-red-500" : ""} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 h-24 bg-[#070709] border-t border-zinc-900 px-6 flex items-center justify-between z-30">
        
        <div className="flex items-center gap-4 w-1/4">
          <img src={currentSong.cover} alt={currentSong.title} className="w-12 h-12 rounded-xl object-cover shadow" />
          <div className="truncate">
            <h4 className="text-xs font-bold text-white truncate">{currentSong.title}</h4>
            <p className="text-[10px] text-zinc-500 truncate">{currentSong.artist}</p>
          </div>
          <button onClick={() => toggleFavorite(currentSong.id)} className="text-zinc-500 hover:text-red-500 transition ml-2">
            <Heart size={16} className={favorites.includes(currentSong.id) ? "text-red-500 fill-red-500" : ""} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-2 w-2/4 max-w-md">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsShuffle(!isShuffle)} 
              className={`transition ${isShuffle ? 'text-amber-500' : 'text-zinc-500 hover:text-white'}`}
            >
              <Shuffle size={16} />
            </button>
            <button onClick={handlePrev} className="text-zinc-400 hover:text-white transition">
              <SkipBack size={18} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:bg-zinc-200 transition shadow-md"
            >
              {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
            </button>
            <button onClick={handleNext} className="text-zinc-400 hover:text-white transition">
              <SkipForward size={18} />
            </button>
            <button 
              onClick={() => setIsRepeat(!isRepeat)} 
              className={`transition ${isRepeat ? 'text-amber-500' : 'text-zinc-500 hover:text-white'}`}
            >
              <Repeat size={16} />
            </button>
          </div>

          {/* Progress Seek Bar */}
          <div className="flex items-center gap-3 w-full text-[10px] text-zinc-500 font-mono">
            <span>{formatTime(currentTime)}</span>
            <input 
              type="range" 
              min="0" 
              max={duration || 100} 
              value={currentTime} 
              onChange={handleSeek}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 w-1/4">
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition">
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={isMuted ? 0 : volume} 
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hidden sm:block"
            />
          </div>
        </div>

      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-zinc-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-white mb-2">Add Custom Track & Photo</h2>
            <p className="text-xs text-zinc-400 mb-6">Enter a song title, artist, and paste an image URL to add it to your player.</p>

            <form onSubmit={handleAddContent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Song / Playlist Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Midnight Drive" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Artist Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Aiden Vale" 
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Image URL (Album Art)</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/photo-..." 
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-zinc-500 mt-1">Tip: You can copy any image address from Unsplash or Google and paste it here.</p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-amber-500 text-black px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-400 transition shadow-lg"
                >
                  Add to Player
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}