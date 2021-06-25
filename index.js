const views = require("koa-views");
const serve = require("koa-static");
const router = require("@koa/router")();
const koa = require("koa");
const http2 = require("http2");
const https = require("https");
const fs = require("fs");


const app = new koa();

const render = views(__dirname + "/views", {
  map: {
    html: "swig",
  },
});

app.use(render);

router.get("/", async function (ctx) {
  await ctx.render("index");
});

app.use(router.routes());

app.use(serve("./static"));

const key = fs.readFileSync("./certs/key.pem", "UTF8");
const cert = fs.readFileSync("./certs/cert.pem", "UTF8");

https.createServer({ key, cert }, app.callback()).listen(3000, () => console.log('https on port 3000'));
http2.createSecureServer({ key, cert }, app.callback()).listen(3001, () => console.log('http2 on port 3001'));
