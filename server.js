var http = require("http");
var path = require("path");
var url = require("url");
var fs = require("fs");

//添加MIME类型
var MIME_TYPE = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml",
    "swf": "application/x-shockwave-flash"
};

var server = http.createServer(function (req, res){
    var req_path = url.parse(req.url).path;
    var filepath = __dirname + req_path;

    filepath = filepath.split("?");
    filepath = filepath[0];

    fs.exists(filepath, function (exists){
        if (exists){
            fs.stat(filepath, function (err, stats){
                if (err){
                    res.writeHead(500, {"Content-Type" : "text/html;charset=utf8"});
                    res.end("<div styel=\"color:black;font-size:22px;\">server error</div>");
                } else {
                    if (stats.isFile()){
                        var file = fs.createReadStream(filepath);

                        var ext = path.extname(filepath);
                        ext = ext ? ext.slice(1) : "unknown";

                        var contentType = MIME_TYPE[ext] || "text/plain";
                        contentType += ";charset=utf8";

                        res.writeHead(200, {"Content-Type" : contentType});
                        file.pipe(res);
                    } else {
                        fs.readdir(filepath, function (err, files){
                            var str = "";
                            for (var i in files){
                                str += files[i] + "<br/>";
                            }
                            res.writeHead(200, {"Content-Type" : "text/html;charset=utf8"});
                            res.write(str);
                        });
                    }
                }
            });
        } else {
            res.writeHead(404, {"Content-Type" : "text/html;charset=utf8"});
            res.end("<div styel=\"color:black;font-size:22px;\">404 not found</div>");
        }
    });
});

server.listen("9090", "127.0.0.1", function () {
    console.log("nodejs server is running...");
});
