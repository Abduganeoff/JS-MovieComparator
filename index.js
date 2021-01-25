const autoCompleteCongfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}" />
            ${movie.Title}
            `;
    },

    inputValue(movie) {
        return movie.Title;
    },

    async fetchData(searchMovie) {
        const response = await axios.get('https://www.omdbapi.com/', {
            params: {
                apikey: 'c2474e1c',
                s: `${searchMovie}`
            }
        });

        if (response.data.Error) {
            return [];
        }

        return response.data.Search;
    }
};


createAutoComplete({
    ...autoCompleteCongfig,

    root: document.querySelector('#left-autocomplete'),

    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
});

createAutoComplete({
    ...autoCompleteCongfig,

    root: document.querySelector('#right-autocomplete'),

    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
});

let rightMovies;
let leftMovies;
const onMovieSelect = async (movie, placeToRender, side) => {
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: 'c2474e1c',
            i: `${movie.imdbID}`
        }
    });

    placeToRender.innerHTML = movieTemplet(response.data);

    if (side === 'right'){
        rightMovies = response.data;   
    } else {
        leftMovies = response.data;
    }

    if (rightMovies && leftMovies){
        runComparision();
    }
}


const runComparision = ()=>{
    const leftStats = document.querySelectorAll('#left-summary .notification');
    const rightStats = document.querySelectorAll('#right-summary .notification');

    leftStats.forEach((leftStat, index) => {
        const rightStat = rightStats[index];
        
        const leftValue = parseInt(leftStat.dataset.value);
        const rightValue = parseInt(rightStat.dataset.value);
        
        if (rightValue > leftValue){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    
    });

}


const movieTemplet = (movieDetails) => {
    const awards = movieDetails.Awards.split(' ').reduce((sum, curr) => {
        const word = parseInt(curr);
        if(isNaN(word)){
            return sum;
        } else {
            return sum + word;
        }

    }, 0);

    const metascore = parseInt(movieDetails.Metascore);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const votes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));

    return `
        <article class="media"> 
            <figure class="media-left"> 
                <p class="image">
                    <img src="${movieDetails.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1> ${movieDetails.Title}</h1>
                    <h4> ${movieDetails.Genre}</h4>
                    <p> ${movieDetails.Plot} </p>
                </div>
            </div> 
        </article>
        <article data-value=${awards} class="notification is-primary"> 
            <p class="title"> ${movieDetails.Awards}</p>
            <p class="subtitle"> Awards </p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title"> ${movieDetails.Metascore}</p>
            <p class="subtitle"> Metascore </p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title"> ${movieDetails.imdbRating}</p>
            <p class="subtitle"> IMDB Rating </p>
        </article>
        <article data-value=${votes} class="notification is-primary">
            <p class="title"> ${movieDetails.imdbVotes}</p>
            <p class="subtitle"> Votes </p>
        </article>

    `;
}
