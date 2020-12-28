import { useEffect, useState, useCallback,useRef } from 'react'
import axios from 'axios'
import ResultCard from './ResultCard'

export default function ResultList(props) {

    const { tvGenres, movieGenres, mediaType, searchString, pageNumber, setPageNumber, genreSearch, genreSearchID, loading, setLoading } = props

    const keyTMDB = process.env.TMDB_APIKEY


    const [error, setError] = useState(false)
    const [results, setResults] = useState([])
    const [hasMore, setHasMore] = useState(false)

    const [canOpenPreview, setCanOpenPreview] = useState(true)

    const observer = useRef()
    const lastResultElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
            setPageNumber(prevPageNumber => prevPageNumber + 1)
        }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore, setPageNumber])

    useEffect(() => {
        setResults([])
    }, [searchString, mediaType]);

    useEffect(() => {
        console.log(mediaType, searchString, pageNumber, setPageNumber)
        setLoading(true)
        setError(false)
        setCanOpenPreview(true)

        let cancel
        axios({
            method: 'GET',
            url: genreSearch ? 
                `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${keyTMDB}&with_genres=${genreSearchID}&page=${pageNumber}`
                : (searchString.length > 0 ? 
                    `https://api.themoviedb.org/3/search/${mediaType}?api_key=${keyTMDB}&query=${searchString}&page=${pageNumber}`
                    : `https://api.themoviedb.org/3/${mediaType}/popular?api_key=${keyTMDB}&page=${pageNumber}`) ,
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setResults(prevResults => {
                return [...prevResults, ...res.data.results.map(b => b)]
            })
            setHasMore(res.data.page <= res.data.total_pages)
            setLoading(false)
        }).catch(e => {
            console.log('error: ', e)
            if (axios.isCancel(e)) return
            setError(true)
        })

        return () => cancel()
    },[mediaType, pageNumber, searchString])

    return (
        
        <>
        {console.log('res: ', results)}
        <div className="row justify-content-center video-row">
            {results.map((result, index) => {
                console.log('mapping: ', result.title)
                if(results.length === index + 1){
                return (
                    <div ref={lastResultElementRef}> 
                        <ResultCard canOpenPreview={canOpenPreview} setCanOpenPreview={setCanOpenPreview} movieGenres={movieGenres} tvGenres={tvGenres} mediaType={mediaType} key={result.id} result={result} />
                    </div>)
                } else {
                    return <ResultCard canOpenPreview={canOpenPreview} setCanOpenPreview={setCanOpenPreview} movieGenres={movieGenres} tvGenres={tvGenres} mediaType={mediaType} key={result.id} result={result} />
                }
            })}
        </div>  
        </>
    )

}
