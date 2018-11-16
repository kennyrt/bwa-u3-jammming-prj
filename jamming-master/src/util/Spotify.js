let accessToken = "";
const clientID = "8bd14632c98f4e31914e4eefc6244fb0";
const redirectURI = "http://localhost:3000";

const Spotify = {

	getAccessToken(){
		if(accessToken) {
			return accessToken;
		}

		let urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
		let urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

		if(urlAccessToken && urlExpiresIn){
			accessToken = urlAccessToken;
			let expiresIn = urlExpiresIn;
			window.setTimeout(() => accessToken = '', expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
			window.location = "https://accounts.spotify.com/authorize?client_id=" + clientID + "&response_type=token&scope=playlist-modify-public&redirect_uri=" + redirectURI;
		}
	},

	search(term){
		let userAccessToken = this.getAccessToken()[1];
		return fetch('https://api.spotify.com/v1/search?type=track&q=' + term, {
			headers: {
				Authorization: 'Bearer ' + userAccessToken
			}
		}).then(response => {
			if(response.ok){
				return response.json();
			} else {
				console.log("API request failed");
			}
		}).then(jsonResponse => {
			if(jsonResponse){
				console.log(jsonResponse);
				return jsonResponse.tracks.items.map(track => {
					return{
						id: track.id,
						name: track.name,
						artist: track.artists[0].name,
						album: track.album.name,
						uri: track.uri
					}
				})
			} else {
				return [];
			}
		})
	},


	savePlaylist(playlistName, trackURIs){

		if(!playlistName || !trackURIs){
			return;
		}

		let userAccessToken = this.getAccessToken();
		let headers = {Authorization: 'Bearer ' + userAccessToken};
		let userID;

		return fetch('https://api.spotify.com/v1/me', {
			headers: headers
		}).then(response =>{
			if(response.ok){
				return response.json();
			} else {
				console.log("API request failed")
			}
		}).then(jsonResponse => {
			if(jsonResponse){
				userID = jsonResponse.id

				return fetch('https://api.spotify.com/v1/users/' + userID + '/playlists/', {
					headers: headers,
					method: 'POST',
					body: JSON.stringify({name: playlistName})
				}).then(response => {
					if(response.ok){
						return response.json();
					} else {
						console.log("API request failed");
					}
				}).then( jsonResponse => {
					let playlistID = jsonResponse.id;

					return fetch('https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks', {
						headers: headers,
						method: 'POST',
						body: JSON.stringify({uris: trackURIs})
					});
				})
			}
		})

	}




}

export default Spotify;













