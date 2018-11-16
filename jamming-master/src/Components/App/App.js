import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    if(!this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id)){
      let copy = this.state.playlistTracks.slice();
      copy.push(track);
      this.setState({playlistTracks: copy});
    }
  }

  removeTrack(track){
    let copy = this.state.playlistTracks.slice();
    for(let i = copy.length -1; i>=0; --i){
      if(copy[i].id === track.id){
        copy.splice(i, 1);
      }
    }
    this.setState({playlistTracks: copy});
  }



  updatePlaylistName(name){
    this.setState({playListName: name})
  }

  savePlaylist(){
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    });
  }

  search(term){
    Spotify.search(term).then(tracks => {
      this.setState({searchResults: tracks})
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd = {this.addTrack} />
            <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} playlistName = {this.state.playlistName} playlistTracks = {this.state.playlistTracks} onRemove={this.removeTrack}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
