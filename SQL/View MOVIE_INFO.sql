/*
select * --imdbid, imdb_rating 
from Movieinfo_tmdb m
where m.imdbid = 'tt3915174'
--select * from Movieinfo_omdb
--select * from Movieinfo_tmdb
--select * from MOVIE_INFO
*/


drop view if exists MOVIE_INFO ; 
Create view MOVIE_INFO AS
SELECT
o.imdbID ,
o.Title ,
o.Year ,
o.Rated ,
o.BoxOffice ,
o.Country ,
o.Genre ,
o.Language ,
o.imdbVotes as imdb_votes,
t.vote_count as tmdb_votes,
(o.imdbVotes+ t.vote_count)/2 AS VOTES_AVERAGE,
o.IMDB_Rating as imdb_rating,
t.vote_average as tmdb_rating,
o.Metascore_Rating,
ROUND(((o.IMDB_Rating+t.vote_average+ o.Metascore_Rating )/3),3)  AS RATING_AVERAGE,
o.Runtime AS Runtime_in_minutes
FROM Movieinfo_omdb o
LEFT JOIN Movieinfo_tmdb t ON o.imdbid = t.imdbid;

Select * from MOVIE_INFO