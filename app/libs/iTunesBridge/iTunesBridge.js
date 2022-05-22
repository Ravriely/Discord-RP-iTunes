/* jshint esversion : 8 */

const { execSync, exec } = require("child_process");
const os = require("os");

class iTunes {
  constructor() {
    this.data = {};
    this.currentSong = {};

    this.setup();
  }


  setup() {
    try {
      if (os.platform() == "win32") {
        this.currentSong = execSync("cscript //Nologo ./app/libs/iTunesBridge/iTunesBridgeWS.js currentTrack", { encoding: "utf8" });
      }
    } catch (e) {
      this.currentSong = {
        "state": "loading/not playing"
      };
    }
  }

  exec(option) {
    if (os.platform() == "win32") {
      return execSync("cscript //Nologo ./app/libs/iTunesBridge/iTunesBridgeWS.js " + option, { encoding: "utf8" });
    }
  }

  getCurrentSong() {
    if (os.platform() == "win32") {
	  this.currentSong = execSync("cscript //Nologo ./app/libs/iTunesBridge/iTunesBridgeWS.js currentTrack", { encoding: "utf8" });
    }
    return this.currentSong;
  }
}

module.exports = iTunes;