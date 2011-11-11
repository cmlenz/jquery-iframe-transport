var formidable = require("formidable"),
    http = require("http"),
    paperboy = require("paperboy"),
    path = require("path");

http.createServer(function(req, res) {
  if (req.url == "/upload" && req.method.toUpperCase() == "POST") {
    var form = new formidable.IncomingForm(),
        files = [];
    form.on("file", function(field, file) {
      files.push(file);
    });
    form.on("end", function() {
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify({files: files}));
    });
    form.parse(req);
  } else if (req.url == "/jquery.iframe-transport.js") {
    paperboy.deliver(path.dirname(__dirname), req, res)
  } else {
    paperboy.deliver(__dirname, req, res)
  }
}).listen(8080, "127.0.0.1");

console.log("Server ready at http://localhost:8080/");