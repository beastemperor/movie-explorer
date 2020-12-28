import react, { useState, useEffect, useRef, useCallback } from 'react'
import ResultList from './ResultList'
import GenreList from './GenreList'
import styles from './index.css'


function App() {

  const keyTMDB = process.env.TMDB_APIKEY

  const [searchString, setSearchString] = useState('')
  const [mediaType, setMediaType] = useState('movie')
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)

  const [genreSearch, setGenreSearch] = useState(false)
  const [genreSearchID, setGenreSearchID] = useState('')

  const [movieGenres, setMovieGenres] = useState([])
  const [tvGenres, setTvGenres] = useState([])
  const [genreListShowing, setGenreListShowing] = useState(false)
  
  const getMovieGenres = async genres => {
    try{
      const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${keyTMDB}&language=en-US`)
      const response = await res.json()
      setMovieGenres(response.genres)
    }catch(err){
      console.log(err)
    }
  }

  const getTvGenres = async genres => {
    try{
      const res = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${keyTMDB}&language=en-US`)
      const response = await res.json()
      setTvGenres(response.genres)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    getTvGenres()
    getMovieGenres()
  }, [])

  // const { loading, results, hasMore, error } = ResultList(mediaType, searchString, pageNumber, setPageNumber)

   
  function handleSearch(e) {
    setPageNumber(1)
    setGenreListShowing(false)
    setGenreSearch(false)
    setSearchString(e.target.value)
  }

  function handleNavButtons(media) {
    setMediaType(media)
    setPageNumber(1)
    setGenreListShowing(false)
    setGenreSearch(false)
  }

  function showGenres() {
    setGenreListShowing(true)
    setSearchString('')
  }

  return (
    <>
      <nav className="row justify-content-center">
        <div className="col-12 col-sm-3 col-md-2 col-xl-1 nav-button mx-3 my-2 nav-item" onClick={() => handleNavButtons('movie') }>{mediaType === 'movie' && !genreListShowing ? <u>Movies</u> : 'Movies'}</div>
        <div className="col-12 col-sm-4 col-md-3 col-xl-2 nav-button mx-3 my-2 nav-item" onClick={() => handleNavButtons('tv')}>{mediaType === 'tv' && !genreListShowing ? <u>TV Shows</u> : 'TV Shows'}</div>
        <div className="col-12 col-sm-3 col-md-2 col-xl-1 nav-button mx-3 my-2 nav-item" onClick={showGenres}>{genreListShowing ? <u>Genres</u> : 'Genres'}</div>
        <div className="col-10 col-sm-6 col-md-3 col-xl-2">
          <input className="form-control nav-searchbar mx-md-5 my-2" value={searchString} onChange={handleSearch}></input>
        </div>
      </nav>
      <div className="container">
        {genreListShowing && <GenreList setMediaType={setMediaType} setGenreListShowing={setGenreListShowing} movieGenres={movieGenres} tvGenres={tvGenres} setGenreSearch={setGenreSearch} setGenreSearchID={setGenreSearchID} />}
        {genreListShowing || <ResultList loading={loading} setLoading={setLoading} genreSearch={genreSearch} genreSearchID={genreSearchID} movieGenres={movieGenres} tvGenres={tvGenres} mediaType={mediaType} searchString={searchString} pageNumber={pageNumber} setPageNumber={setPageNumber} />}
      </div>
      <div>{loading && 'loading...'}</div>
      {/* <div>{error}</div> */}
    </>
  );
}

export default App;
