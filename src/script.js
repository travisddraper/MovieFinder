const checkStatus = (response) => {
    if(response.ok) {
        //.ok returns true if response status is 200-299
        return response;
    }
    throw new Error('Request was either a 404 or 500');
}
//an abstracted function to check the response status of our Fetch request

const json = (response) => response.json();
//an abstracted function to convert our successful fetch reqeuest to json.

const Movie = (props) => {
    const { Title, Year, imdbID, Type, Poster } = props.movie;

    return (
        <div className="row">
            <div className="col-4 col-md-3 mb-3">
                <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
                    <img src={Poster} className="img-fluid" />
                </a>
            </div>
            <div className="col-8 col-md-9 mb-3">
                <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
                    <h4>{Title}</h4>
                    <p>{Type} | {Year}</p>
                </a>
            </div>
        </div>
    )
}

class MovieFinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            results: [],
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ searchTerm: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        let { searchTerm } = this.state; //destructuring
        searchTerm = searchTerm.trim(); //clean the string

        if (!searchTerm) {
            //ensuring the value isn't an empty string
            return; //early return
        }

        //make the AJAX request to OMDBAPI to get a list of results
        fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=f0c5b707`)
        .then(checkStatus)
        .then(json)
        .then( data => {
            if (data.Response === 'False') {
                throw new Error(data.Error);
            }
            //Checks to see if the Response property in the returned JSON object "data" is true or false. Necessary check bc of bad OMDBAPI practices.

            if (data.Response === "True" && data.Search) {
                this.setState({ results: data.Search, error: '' })
                // the array of movie objects are located under the Search property
                //store that array of movie objects in the component state
            }
            //adding this additional check for safety.

            
        })
        .catch( error => {
            this.setState({ error: error.message })
            //added a component state property for the error message
            console.log(error);
        })
    }

    render() {
        const { searchTerm, results, error } = this.state
        

        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <form onSubmit={this.handleSubmit} className="form-inline my-4">
                            <input 
                                type="text"
                                className="form-control mr-sm-2"
                                placeholder="frozen"
                                value={searchTerm}
                                onChange={this.handleChange}
                            />
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                        {(() => {
                            if(error) {
                                return error
                            }
                            return results.map((movie) => {
                                return <Movie key={movie.imdbID} movie={movie} />
                            })
                        })()}
                    </div>
                </div>
            </div>
        )
    }
}
//We included an immediately invoked expression above wrapping the map method. This initially checks for error, if no error it proceeds to the map method.
ReactDOM.render(
    <MovieFinder />,
    document.getElementById('root')
);