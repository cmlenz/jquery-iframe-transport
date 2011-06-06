var formidable = require("formidable"),
    http = require("http"),
    paperboy = require("paperboy"),
    path = require("path");

http.createServer(function(req, res) {
  if (req.url == "/upload" && req.method.toUpperCase() == "POST") {
    var form = new formidable.IncomingForm();
    var files = [];
    form.on("file", function(field, file) {
      console.log("Received file", file.name);
      files.push(file);
    });
    form.on("end", function() {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end("<textarea data-type='application/json'>" +
        JSON.stringify({files: files}) +
      "</textarea>");
    });
    form.parse(req);
  } else if (req.url == "/jquery.iframe-transport.js") {
    paperboy.deliver(path.dirname(__dirname), req, res)
  } else {
    paperboy.deliver(__dirname, req, res)
  }
}).listen(8080, "127.0.0.1");

console.log("Server ready at http://localhost:8080/");