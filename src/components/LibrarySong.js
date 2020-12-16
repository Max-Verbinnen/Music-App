function LibrarySong({song, songs, setSongs, currentSong, setCurrentSong}) {

  const handleSongSelect = () => {
    setCurrentSong(song);

    // Set Active State
    const newSongs = songs.map(indSong => {
      return {...indSong, active: indSong.id === song.id};
    });
    setSongs(newSongs);
  }

  return (
    <div onClick={handleSongSelect} className={`library-song ${song.id === currentSong.id ? 'selected' : ''}`}>
      <img src={song.cover} alt={song.name} />
      <div className="song-desc">
        <h3>{song.name}</h3>
        <h4>{song.artist}</h4>
      </div>
    </div>
  )
}


export default LibrarySong;