import React from 'react'

export default function GenreList(props) {
    const { movieGenres, tvGenres, setGenreSearch, setGenreSearchID, setGenreListShowing,setMediaType } = props

    function genreClickHandler(genreID, media) {
        setMediaType(media)
        setGenreListShowing(false)
        setGenreSearch(true)
        setGenreSearchID(genreID)
    }

    return (
        <>
            <div className="mt-5">
                <p class="genre-header">Movie Genres</p>
                <div className="row">
                    {movieGenres.map(genre => {
                        return <div key={genre.id} onClick={() => genreClickHandler(genre.id, 'movie')} className="btn mx-5 my-3 btn-danger col-3">{genre.name}</div>
                    })}
                </div>
                <br></br>
                <p class="genre-header">TV Genres</p>
                <div className="row mb-5">
                    {tvGenres.map(genre => {
                        return <div key={genre.id} onClick={() => genreClickHandler(genre.id, 'tv')} className="btn mx-5 my-3 btn-danger col-3">{genre.name}</div>
                    })}
                </div>
            </div>
        </>
    )
}
