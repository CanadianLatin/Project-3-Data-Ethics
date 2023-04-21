console.log("Viz.js")
const url = "http://127.0.0.1:5000/data"

var dropdown = d3.select('#selDataset');
genre_array = []

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
    console.log(genre)

    results = baseballData.filter(row => row.Year == selected_yr);

}