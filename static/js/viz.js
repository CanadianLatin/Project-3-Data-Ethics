console.log("viz.js 23/04/2023  19:23");
const url = "http://127.0.0.1:5000/data";

let dropdown = d3.select('#selDataset');
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

let chart;

function optionChanged(selectedGenre) {
    console.log(selectedGenre);

    d3.json(url).then(function (data) {

        let movie_data_list = data.movie_data;

        let selection = movie_data_list.filter((movie) => movie.genre.includes(selectedGenre));

        document.getElementById("demo").innerHTML = ""
            document.getElementById("demo").innerHTML = selectedGenre + " Movie List";
        
            const tbody = d3.select("tbody");
            tbody.html("");
        
            const tbl_header = tbody.append("tr");
            let header = tbl_header.append("th");
            header.text("Title");
            header = tbl_header.append("th");
            header.text("Genre");
            header = tbl_header.append("th");
            header.text("Rated");
            header = tbl_header.append("th");
            header.text("IMDB_rating");
            header = tbl_header.append("th");
            header.text("TMDB_rating");
            header = tbl_header.append("th");
            header.text("Country");
            header = tbl_header.append("th");
            header.text("Language");
        
            selection.forEach((row) => {
                // Create tr for each row of the table
                const tbl_data = tbody.append("tr");
        
                let cell = tbl_data.append("td");
                cell.text(row.title);
                cell = tbl_data.append("td");
                cell.text(row.genre);
                cell = tbl_data.append("td");
                cell.text(row.rated);
                cell = tbl_data.append("td");
                cell.text(row.imdb_rating);
                cell = tbl_data.append("td");
                cell.text(row.tmdb_rating);
                cell = tbl_data.append("td");
                cell.text(row.country);
                cell = tbl_data.append("td");
                cell.text(row.language);
        
            });

        // Update or create the Taucharts scatterplot
        if (chart) {
            // If the chart already exists, update its data and render it again
            chart.setData(selection);
            chart.refresh();
        } else {
            // If the chart doesn't exist, create a new one
            let chart = new Taucharts.Chart({
                data: selection,
                type: 'scatterplot',
                x: 'imdb_votes',
                y: 'boxoffice',
                // settings: {
                //     // Specify the fields used in the chart
                //     // and add annotations to those fields
                //     'x': {label: 'IMDB Votes'},
                //     'y': {label: 'Box Office'}
                // }
            });
            chart.setData(selection);
            chart.refresh();
        }
        
        chart.renderTo('#scatter');

        titles_and_ratings = [[],[]];
    
        for (let i=0; i < selection.length; i++) {
            titles_and_ratings[[i],[i]] = [[selection[i]['rating_average']],[selection[i]['title']]];
        };

        titles_and_ratings.sort((a,b)=>a[0]-b[0]).reverse();

        let titles= [];
        let ratings = [];

        if (titles_and_ratings.length < 10) {
            for(let i=0; i < titles_and_ratings.length; i++) {
                titles[i] = titles_and_ratings[i][0][0];
                ratings[i] = titles_and_ratings[i][1][0]; 
            };
            
        } else {
            for(let i=0; i < 10; i++) {
                titles[i] = titles_and_ratings[i][0][0];
                ratings[i] = titles_and_ratings[i][1][0]; 
            };
        }

        let runtimes = [];

        for (let i=0; i < selection.length; i++) {
            runtimes[i] = parseFloat(selection[i]['runtime_in_minutes']);
        };

        runtimes.sort(function(a, b) {
            return b - a;
          });

        let runtime_60to90 = 0;
        let runtime_90to120 = 0;
        let runtime_120to150 = 0;
        let runtime_150to210 = 0;

        for (let i=0; i < runtimes.length; i++) {
            if (runtimes[i] >= 60 && runtimes[i] < 90) {
                runtime_60to90++;
              } else if (runtimes[i] >= 90 && runtimes[i] < 120) {
                runtime_90to120++;
              } else if (runtimes[i] >= 120 && runtimes[i] < 150) {
                runtime_120to150++;
              } else if(runtimes[i] >= 150 && runtimes[i] < 210) {
                runtime_150to210++;
              }
        };

        let piedata = [{
            values: [runtime_60to90, runtime_90to120, runtime_120to150, runtime_150to210],
            labels: ['1hrs-1.5hrs', '1.5hrs-2hrs', '2hrs-2.5hrs', '2.5hrs-3.5hrs'],
            type: 'pie'
        }];
        
        let pie_layout = {
            paper_bgcolor : '#FFCCFF',
            height: 400,
            width: 500,
            title: {
                text: `Percentage of ${selectedGenre} Movies Grouped by Runtime`
            },
            legend: {
                title: {
                text: 'Movie length'
                }
            }
        };

        Plotly.newPlot('PieChart', piedata, pie_layout);

        let trace1 = {
            x: titles.reverse(),
            y: ratings.reverse(),
            text: selection.title,
            type: "bar",
            orientation: "h"
        };

        let traceData = [trace1];

        let layout = {
            paper_bgcolor : '#FFCCFF',
            plot_bgcolor:'#FFCCFF',
            title: `Top ${titles.length} Rated Movies in ${selectedGenre} Genre`,
            margin: {
                l: 350,
                r: 50,
                t: 100,
                b: 100
            },
            xaxis: {
                title: 'Rating(IMDB, TMDB and Metacritic Average)'
            },
            
            
        };

        Plotly.newPlot("bar", traceData, layout);

    }
    );

};

function init() {

    d3.json(url).then(function (data) {

        let movie_data_list = data.movie_data;

        let selection = movie_data_list

        document.getElementById("demo").innerHTML = ""
            document.getElementById("demo").innerHTML = "All Genres" + " Movie List";
        
            const tbody = d3.select("tbody");
            tbody.html("");
        
            const tbl_header = tbody.append("tr");
            let header = tbl_header.append("th");
            header.text("Title");
            header = tbl_header.append("th");
            header.text("Genre");
            header = tbl_header.append("th");
            header.text("Rated");
            header = tbl_header.append("th");
            header.text("IMDB_rating");
            header = tbl_header.append("th");
            header.text("TMDB_rating");
            header = tbl_header.append("th");
            header.text("Country");
            header = tbl_header.append("th");
            header.text("Language");
        
            selection.forEach((row) => {
                // Create tr for each row of the table
                const tbl_data = tbody.append("tr");
        
                let cell = tbl_data.append("td");
                cell.text(row.title);
                cell = tbl_data.append("td");
                cell.text(row.genre);
                cell = tbl_data.append("td");
                cell.text(row.rated);
                cell = tbl_data.append("td");
                cell.text(row.imdb_rating);
                cell = tbl_data.append("td");
                cell.text(row.tmdb_rating);
                cell = tbl_data.append("td");
                cell.text(row.country);
                cell = tbl_data.append("td");
                cell.text(row.language);
        
            });
        
        // Update or create the Taucharts scatterplot
        if (chart) {
            // If the chart already exists, update its data and render it again
            chart.setData(selection);
            chart.refresh();
        } else {
            // If the chart doesn't exist, create a new one
            chart = new Taucharts.Chart({
                data: selection,
                type: 'scatterplot',
                x: 'imdb_votes',
                y: 'boxoffice',
                
                // settings: {
                //     // Specify the fields used in the chart
                //     // and add annotations to those fields
                //     'x': {label: 'IMDB Votes'},
                //     'y': {label: 'Box Office'}
                // }
            });
        }
        chart.renderTo('#scatter');

        titles_and_ratings = [[],[]];
    
        for (let i=0; i < selection.length; i++) {
            titles_and_ratings[[i],[i]] = [[selection[i]['rating_average']],[selection[i]['title']]];
        };

        titles_and_ratings.sort((a,b)=>a[0]-b[0]).reverse();

        let titles= [];
        let ratings = [];

        if (titles_and_ratings.length < 10) {
            for(let i=0; i < titles_and_ratings.length; i++) {
                titles[i] = titles_and_ratings[i][0][0];
                ratings[i] = titles_and_ratings[i][1][0]; 
            };
            
        } else {
            for(let i=0; i < 10; i++) {
                titles[i] = titles_and_ratings[i][0][0];
                ratings[i] = titles_and_ratings[i][1][0]; 
            };
        }

        let runtimes = [];

        for (let i=0; i < selection.length; i++) {
            runtimes[i] = parseFloat(selection[i]['runtime_in_minutes']);
        };

        runtimes.sort(function(a, b) {
            return b - a;
          });

        let runtime_60to90 = 0;
        let runtime_90to120 = 0;
        let runtime_120to150 = 0;
        let runtime_150to210 = 0;

        for (let i=0; i < runtimes.length; i++) {
            if (runtimes[i] >= 60 && runtimes[i] < 90) {
                runtime_60to90++;
              } else if (runtimes[i] >= 90 && runtimes[i] < 120) {
                runtime_90to120++;
              } else if (runtimes[i] >= 120 && runtimes[i] < 150) {
                runtime_120to150++;
              } else if(runtimes[i] >= 150 && runtimes[i] < 210) {
                runtime_150to210++;
              }
        };

        let piedata = [{
            values: [runtime_60to90, runtime_90to120, runtime_120to150, runtime_150to210],
            labels: ['1hrs-1.5hrs', '1.5hrs-2hrs', '2hrs-2.5hrs', '2.5hrs-3.5hrs'],
            type: 'pie'
        }];
        
        let pie_layout = {
            paper_bgcolor : '#FFCCFF',
            height: 400,
            width: 500,
            title: {
                text: `Percentage of All Movies Grouped by Runtime`
            },
            legend: {
                title: {
                text: 'Movie length'
                }
            }
        };

        Plotly.newPlot('PieChart', piedata, pie_layout);

        let trace1 = {
            x: titles.reverse(),
            y: ratings.reverse(),
            text: selection.title,
            type: "bar",
            orientation: "h"
        };

        let traceData = [trace1];

        let layout = {
            paper_bgcolor : '#FFCCFF',
            plot_bgcolor:'#FFCCFF',
            title: `Top ${titles.length} Rated Movies Including All Genres`,
            margin: {
                l: 350,
                r: 50,
                t: 100,
                b: 100
            },
            xaxis: {
                title: 'Rating(IMDB, TMDB and Metacritic Average)'
            },
            
            
        };

        Plotly.newPlot("bar", traceData, layout);

    }
    );

    let dropdown = d3.select('#selDataset');
    genre_array = [];
}

init();