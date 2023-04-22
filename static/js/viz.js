console.log("Viz.js");
const url = "http://127.0.0.1:5000/data";

var dropdown = d3.select('#selDataset');
genre_array = [];

d3.json(url).then(function (data) {
    // Console log to check if data is loaded
    genre_array = data.genres
    console.log(genre_array);
    genre_array.sort()

    dropdown
        .append("option")
        .property("value", "")
        .text("Select Genre");

    genre_array.map((genre) => {
        dropdown
            .append("option")
            .property("value", genre)
            .text(genre);
    });


})

function optionChanged(genre) {
    console.log(genre);

    d3.json(url).then(function (data) {

        let movie_data_list = data.movie_data;

        let selection = movie_data_list.filter((movie) => movie.genre.includes(genre));

        console.log(selection);

        titles_and_ratings = [[],[]];
    
        for (let i=0; i < selection.length; i++) {
            titles_and_ratings[[i],[i]] = [[selection[i]['rating_average']],[selection[i]['title']]];
        };

        titles_and_ratings.sort((a,b)=>a[0]-b[0]).reverse();

        let titles= [];
        let ratings = [];

        for(let i=0; i < 10; i++) {
            titles[i] = titles_and_ratings[i][0][0];
            ratings[i] = titles_and_ratings[i][1][0]; 
        };

        console.log(titles_and_ratings);

        console.log(titles);
        console.log(ratings);

        let trace1 = {
            x: titles.reverse(),
            // x: [0, 1, 2, 3, 4, 5, 6, 7,8 ,9],
            y: ratings.reverse(),
            text: selection.title,
            type: "bar",
            orientation: "h"
        };

        let traceData = [trace1];

        let layout = {
            title: `Top 10 Rated Movies in ${genre} Genre`,
            margin: {
                l: 350,
                r: 50,
                t: 100,
                b: 100
            }
            
        };

        Plotly.newPlot("bar", traceData, layout);
    }
    );

};