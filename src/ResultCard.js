import React, { useState, useEffect } from 'react'
import styles from './index.css'

export default function ResultCard(props) {

    const keyTMDB = process.env.TMDB_APIKEY

    const { canOpenPreview, setCanOpenPreview, tvGenres, movieGenres, mediaType } = props

    const {
        genre_ids,
        poster_path,
        title,
        name,
        release_date,
        first_air_date,
        overview,
        id,
        vote_count,
        vote_average
    } = props.result

    const amazonKey = title ? title.replace(' ', '+') : name.replace(' ', '+')

    function getGenres() {
        let genreIds = []
        genre_ids.map(id => genreIds.push(id))
        let genreList = []
        if(mediaType === 'movie'){
            movieGenres.forEach(genre => {
                if(genreIds.includes(genre.id)){
                    genreList.push(genre.name)
                }
            } )
        }
        if(mediaType === 'tv'){
            tvGenres.forEach(genre => {
                if(genreIds.includes(genre.id)){
                    genreList.push(genre.name)
                }
            } )
        }

        return genreList.join(' ')
    }

    const genres = getGenres()

    const [ trailerKey, setTrailerKey ] = useState('')

    const getTrailer = async trailers => {
        try{
            const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${keyTMDB}`)
            const response = await res.json()
            setTrailerKey(response.results[0].key)
        }catch(err){
            console.log(err)
        }
    }

    const [detailsCardShowing, setDetailsCardShowing] = useState(false)
    const [largeView, setLargeView] = useState(false)

    function onScroll() {
        if(!canOpenPreview){
            setDetailsCardShowing(false)    
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
      },[]);

    function openDetails(e) {
        if(window.innerWidth < 901){
            return
        }

        if(!largeView && canOpenPreview){
            getTrailer()
            e.preventDefault();
            setDetailsCardShowing(true)
        }
    }

    function closeDetails(e) {
        if(!largeView && canOpenPreview){
            e.preventDefault();
            setDetailsCardShowing(false)
        }
    }

    function handleOpen() {
        setLargeView(true)
        setCanOpenPreview(false)
    }

    function handleClose() {
        setLargeView(false)
        setDetailsCardShowing(false)
        setCanOpenPreview(true)
    }

    const overviewShortened = overview.length > 170 ? `${overview.slice(0, 169)}...` : overview
    const overviewFull = overview.length > 600 ? `${overview.slice(0, 599)}...` : overview

    const image_path = `https://image.tmdb.org/t/p/w500${poster_path}`


    if (poster_path != null){ return (
        <div class="col-6 col-md-4 col-lg-3 col-xl-2 m-3 p-3">
            {largeView && <div className="blur"></div>}
            <div onMouseLeave={closeDetails} className={`float-left m-0 p-0 ${largeView ? "details-card-large" : `details-card ${detailsCardShowing ? "" : "hidden"}` } `}>
                
                <div className="row">
                    {detailsCardShowing && <iframe class={largeView ? "col-12 justify-content" : "col-8 mx-0"} id="ytplayer" height={largeView ? "350" : "200"} src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&amp;controls=0&amp;enablejsapi=1&amp;mute=0`} allow="autoplay"></iframe>}
                    {largeView && <div className="col-12 text-center title">
                            {title || name} ({release_date ? release_date.slice(0, 4) : (first_air_date ? first_air_date.slice(0, 4) : '???')})
                    </div>}
                    {largeView ? <div className="col-10 m-5 mt-3 text-left">{overviewFull}</div> : <div className="col-4 overview">{overviewShortened}</div>}
                    {largeView && <div className="col-12 text-center ">
                        Genres: <br></br>{genres}
                    </div>}
                    {largeView && <div className="col-12 my-5 text-center ">
                        Rating ({vote_count} Votes): <br></br>{vote_average}/10
                    </div>}
                </div>
                {largeView || <div className="row py-1 px-4 title">
                        {title || name} ({release_date ? release_date.slice(0, 4) : (first_air_date ? first_air_date.slice(0, 4) : '???')})
                </div>}
                <div className="row pb-2">
                    <div className={largeView ? "row justify-content-center text-right" : "col-6"}>
                        <a className={largeView ? "col-4 col-md-3" : "mx-2"} target="blank" href={`https://www.amazon.com/s?tag=beastemperor-20&k=${amazonKey}`}>
                            <button className="btn btn-danger">Buy now</button>
                        </a>
                        {largeView || <button onClick={handleOpen} className="mx-2 btn btn-danger">Details</button>}

                        {largeView && <a className="col-4 col-md-3" target="blank" href={`https://www.themoviedb.org/${mediaType}/${id}`}>
                            <button className="mx-2 btn btn-danger">TMDB</button>
                        </a>}
                        {largeView && <div onClick={handleClose} className="col-4 col-md-3 btn btn-secondary">Close</div>}
                    </div>
                    {largeView || <div className="col-5">
                        {genres}
                    </div>}
                </div>
                
            </div>
            <img onMouseEnter={openDetails} onClick={handleOpen} className="thumbnail-image" src={image_path} alt=""></img>
           
        </div>
        
    )}else{
        return null
    }
}
