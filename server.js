const koa = require('koa');
const mount = require('koa-mount');
const logger = require('koa-logger');
const serve = require('koa-static');
const parse = require('co-busboy');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = koa();

app.use(logger());
app.use(serve(path.join(__dirname, 'public')));
app.use(mount('/upload', function *(next) {

    if ('POST' !== this.method) {
        return yield next;
    }

    var parts = parse(this);
    var part;

    while (part = yield parts) {
        const ext = path.extname(part.filename) || '.png';
        const filename = path.join(__dirname, 'public/upload', new Date().getTime() + ext);
        const stream = fs.createWriteStream(filename);
        part.pipe(stream);
        console.log('uploading %s -> %s', part.filename, stream.path);
    }

    this.set('Access-Control-Allow-Origin', '*');
    this.body = {
        ret: 0,
        msg: 'ok'
    };
}));

app.listen(3000, () => {
    console.log('listening on port 3000');
});