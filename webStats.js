class WebStats {
  constructor(params) {
    this.http = params.http;
    this.apiURL = params.apiURL;
  }

  getWebStats() {
    const http = this.http;
    const api = this.apiURL;

    return new Promise((resolve, reject) => {
      http
        .get(api, (res) => {
          let raw = "";

          res.on("data", (chunk) => {
            raw += chunk;
          });

          res.on("end", () => {
            resolve(JSON.parse(raw));
          });
        })
        .on("error", (e) => {
          reject(JSON.parse(e));
        });
    });
  }

  accumulateStats() {
    let result = [];
    let isWebsiteIdExist = false;

    accStats.forEach((item) => {
      let accumulatedChats = item.chats;
      let accumulatedMissedChats = item.missedChats;

      if (item.websiteId == newValue.websiteId) {
        isWebsiteIdExist = true;

        accumulatedChats += newValue.chats;
        accumulatedMissedChats += newValue.missedChats;
      }

      result.push({
        websiteId: item.websiteId,
        chats: accumulatedChats,
        missedChats: accumulatedMissedChats,
      });
    });

    if (!isWebsiteIdExist) {
      result.push({
        websiteId: newValue.websiteId,
        chats: newValue.chats,
        missedChats: newValue.missedChats,
      });
    }

    return result;
  }

  filterWebstats(webStats, start, end) {
    let result = [];
    let isAccumulateAll = start === undefined || end === undefined;

    result = webStats.reduce((accumulated, currentVal) => {
      var currentDate = new Date(currentVal.date);

      if (Object.keys(accumulated).length === 0) {
        accumulated = [];
      }

      if (
        isAccumulateAll ||
        (currentDate >= new Date(start) && currentDate <= new Date(end))
      ) {
        accumulated = this.accumulateStats(accumulated, currentVal);
      }

      return accumulated;
    }, Object.create(null));

    return result;
  }

  processStatistics(start, end) {
    console.log(start, end);
    return new Promise((resolve, reject) => {
      try {
        // fetching data from the url

        const webStats = this.getWebStats()
          .then((res) => res)
          .catch((err) => err);

        // Checking if the object is empty
        if (Object.keys(webStats).length === 0) {
          resolve([]);
        }

        resolve(this.filterWebstats(webStats, start, end));
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = WebStats;
