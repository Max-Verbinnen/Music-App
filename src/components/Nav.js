import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMusic} from "@fortawesome/free-solid-svg-icons";


function Nav({libraryStatus, setLibraryStatus}) {

  const toggleLibrary = () => {
    setLibraryStatus(!libraryStatus);
  }

  return (
    <nav>
      <h1>Waves</h1>
      <button onClick={toggleLibrary}>
        <FontAwesomeIcon icon={faMusic} className='library-icon' />
        &nbsp;
        Library
      </button>
    </nav>
  );
}


export default Nav;