Drop Table if exists MovieInfo_tmdb;
create table MovieInfo_tmdb(
	imdbID VARCHAR NOT NULL,
    Vote_Average DECIMAL,
    Vote_Count INT,
    PRIMARY KEY (imdbID),
    FOREIGN KEY (imdbID) REFERENCES MovieInfo_omdb(imdbID)	
);

 