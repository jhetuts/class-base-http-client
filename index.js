const http = require("http");
const WebStats = require("./webStats");

const apiURL =
  "https://bitbucket.org/!api/2.0/snippets/tawkto/aA8zqE/4f62624a75da6d1b8dd7f70e53af8d36a1603910/files/webstats.json";

const requestListener = function (req, res) {
  res.writeHead(200);
  if (res) {
    const classApi = new WebStats({
      http: http,
      apiURL: apiURL,
    });

    classApi
      .processStatistics(new Date(), new Date())
      .then((data) => res.end(JSON.stringify(data)))
      .catch((err) => res.end(JSON.stringify(err)));
  }
};

const server = http.createServer(requestListener);
server.listen(8080);
