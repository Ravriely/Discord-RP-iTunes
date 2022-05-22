/* jshint esversion: 8 */

const iTunes = require('./libs/iTunesBridge/iTunesBridge');
const iTunesApp = new iTunes();
var lastSong = '';
var startDate = new Date();
var count = 0;
var count_super = false;

var intervalId = setInterval(function(){
	if (count_super == true) {
		count += 1;
		if (count > 0) {
			count = 0;
			count_super = false;
		}
	} else {
		count += 1;
		if (count > 0) {
			count = 0;
			count_super = true;
		}
	}
	setActivity(count_super);
  }, 5000);


const clientId = '972072604703805470';
const DiscordRPC = require('discord-rpc');
const RPC = new DiscordRPC.Client({ transport: 'ipc' });

DiscordRPC.register(clientId);

async function setActivity(count) {
	if (!RPC) return;

	var currentSong = JSON.parse(iTunesApp.getCurrentSong());
	var state = currentSong.state;
	
	console.log(currentSong);

	var fullTitle = String(currentSong.artist + '-' + currentSong.name);

	if (state == 'Playing') {
		startDate = new Date();
		lastSong = String(currentSong.artist + '-' + currentSong.name);
		startDate.setSeconds(new Date().getSeconds() - parseInt(currentSong.elapsed));
	}

	if (count == true) {
		if (state == 'Playing') {
			RPCstate = String('by ' + currentSong.artist);
		} else {
			RPCstate = 'Love on You 💖';
		}
	} else {
		if (state == 'Playing') {
			RPCstate = String('From ' + currentSong.album + ' (' + currentSong.year + ')');
		} else {
			RPCstate = 'Made by Ravriel';
		}
	}

	if (state == 'Playing') {
		RPC.setActivity({
			state: RPCstate,
			details: currentSong.name,
			startTimestamp: startDate.getTime(),
			endTimestamp: startDate.getTime() + parseInt(currentSong.duration*1000),
			largeImageKey: 'itunes',
			smallImageKey: 'play',
			smallImageText: currentSong.state,
			largeImageText: 'iTunes',
			// buttons: [{label : "Link to the playlist", url : "https://music.apple.com/fr/playlist/2020-08/pl.u-06oxpqNCY8mW00o"}],
			instance: false,
		});
	} else {
		RPC.setActivity({
			state: RPCstate,
			details: 'Music Paused',
			largeImageKey: 'itunes',
			smallImageKey: 'pause',
			smallImageText: state,
			largeImageText: 'iTunes',
			instance: false,
		});
	}
}

RPC.on('ready', async () => {
	setActivity(true);
});

RPC.login({ clientId }).catch(err => console.error(err));