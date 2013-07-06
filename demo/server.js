var formidable = require("formidable"),
    http = require("http"),
    paperboy = require("paperboy"),
    path = require("path");

http.createServer(function(req, res) {
  if (req.url == "/upload" && req.method.toUpperCase() == "POST") {
    var form = new formidable.IncomingForm(),
        files = [],
        comment = null;
    form.on("field", function(name, value) {
      console.log(name + ": " + value);
      if (name == "comment") {
        comment = value;
      }
    });
    form.on("file", function(name, file) {
      console.log(file);
      files.push(file);
    });
    form.on("end", function() {
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify({files: files, comment: comment}));
    });
    form.parse(req);
  } else if (req.url == "/jquery.iframe-transport.js") {
    paperboy.deliver(path.dirname(__dirname), req, res)
  } else {
    paperboy.deliver(__dirname, req, res)
  }
}).listen(8080, "127.0.0.1");

console.log("Server ready at http://localhost:8080/");
