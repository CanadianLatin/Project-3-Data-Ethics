from flask import Flask, jsonify, render_template

import psycopg2


app = Flask(__name__)

@app.route('/')
def home():
   return render_template('home.html')

@app.route('/data')
def index():
   conn = psycopg2.connect("dbname=movies_db user=postgres password=postgres")
   
   cur = conn.cursor()

   cur.execute("SELECT * FROM MOVIE_INFO")

   records = cur.fetchall()
   
   movie_dict = {}
   movie_dict['imdbids'] = []
   movie_dict['years'] = []
   movie_dict['genres'] = []
   movie_dict['languages'] = []
   movie_dict['movie_data'] = []

   for record in records:
      movie_dict['imdbids'].append(record[0])
      if record[2] not in movie_dict['years']:
         movie_dict['years'].append(record[2])
      
      split_genres_list = record[6].split(', ')
      for genre in split_genres_list:
         if genre not in movie_dict['genres']:
            movie_dict['genres'].append(genre)

      split_languages_list = record[7].split(', ')
      for language in split_languages_list:
         if language not in movie_dict['languages']:
            movie_dict['languages'].append(language)

      movie_data_dict = {}
      movie_data_dict['imdbids'] = record[0]
      movie_data_dict['title'] = record[1]
      movie_data_dict['year'] = record[2]
      movie_data_dict['rated'] = record[3]
      movie_data_dict['boxoffice'] = record[4]
      movie_data_dict['country'] = record[5]
      movie_data_dict['genre'] = split_genres_list
      movie_data_dict['language'] = split_languages_list
      movie_data_dict['imdb_votes'] = record[8]
      movie_data_dict['tmdb_votes'] = record[9]
      movie_data_dict['votes_average'] = record[10]
      movie_data_dict['imdb_rating'] = record[11]
      movie_data_dict['tmdb_rating'] = record[12]
      movie_data_dict['metascore_rating'] = record[13]
      movie_data_dict['rating_average'] = record[14]
      movie_data_dict['runtime_in_minutes'] = record[15]
      movie_dict['movie_data'].append(movie_data_dict)

   return jsonify(movie_dict)

if __name__ == '__main__':
    app.run(debug=True)