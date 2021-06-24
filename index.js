const koa = require("koa");
const views = require("koa-views");
const serve = require("koa-static");
const router = require("@koa/router")();
const http2 = require("http2");
const https = require("https");
const fs = require("fs");

const key = fs.readFileSync("./certs/key.pem", "UTF8");
const cert = fs.readFileSync("./certs/cert.pem", "UTF8");

const app = new koa();

const render = views(__dirname + "/views", {
  map: {
    html: "swig",
  },
});

app.use(render);

router.get("/", async function (ctx) {
  const grid = [];

  for (let i = 0; i < 9; i++) {
    const row = [];
    for (let j = 1; j <= 13; j++) {
      const root = "/images";
      const path = `${root}/${i * 13 + j}.jpg`;
      row.push(path);
    }

    grid.push(row);
  }

  await ctx.render("index", {
    images: grid,
  });
});

app.use(router.routes());

app.use(serve("./static"));

https.createServer({ key, cert }, app.callback()).listen(3000);
http2.createSecureServer({ key, cert }, app.callback()).listen(3001);
