import LibrarySong from './LibrarySong';


function Library({songs, setCurrentSong, setSongs, libraryStatus, currentSong}) {
  return (
    <div className={`library ${libraryStatus ? "active-library" : ""}`}>
      <h2>Library</h2>
      <div className="library-songs">
        {songs.map((song) => (
          <LibrarySong
            key={song.id}
            song={song}
            songs={songs}
            setSongs={setSongs}
            setCurrentSong={setCurrentSong}
            currentSong={currentSong}
          />
        ))}
      </div>
    </div>
  );
}


export default Library;