const { createWriteStream } = require("fs");
const { resolve } = require("path");
const {
  SitemapAndIndexStream,
  SitemapStream,
} = require("sitemap");

function generateURLs() {
  const final = [];

  const units = ["minutes", "hours"];
  const adjectives = ["before", "after"];

  const upperLimit = 500;
  for (let i = 1; i < upperLimit; i++) {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute++) {
        for (let unit of units) {
          for (let adjective of adjectives) {
            if (hour === 0 || minute === 0) {
              continue;
            }
            const adjustedUnit = i === 1 ? unit.slice(0, -1) : unit;
            const adjustedHour = hour > 12 ? hour - 12 : hour;
            const adjustedMinute = minute < 10 ? `0${minute}` : minute;
            const amOrPM = hour < 12 ? "am" : "pm";
            const time = `${adjustedHour}:${adjustedMinute}`;
            const url = `/${i}/${adjustedUnit}/${adjective}/${time}/${amOrPM}`;
            final.push({ url, changefreq: "never" });
          }
        }
      }
    }
  }
  return final;
}

const sms = new SitemapAndIndexStream({
  limit: 50000,
  // SitemapAndIndexStream will call this user provided function every time
  // it needs to create a new sitemap file. You merely need to return a stream
  // for it to write the sitemap urls to and the expected url where that sitemap will be hosted
  getSitemapStream: (i) => {
    const sitemapStream = new SitemapStream({
      hostname: "https://theTimeWill.be",
    });
    // if your server automatically serves sitemap.xml.gz when requesting sitemap.xml leave this line be
    // otherwise you will need to add .gz here and remove it a couple lines below so that both the index
    // and the actual file have a .gz extension
    const path = `./public/sitemap-${i}.xml`;

    const ws = sitemapStream
      // .pipe(createGzip()) // compress the output of the sitemap
      .pipe(createWriteStream(resolve(path))); // write it to sitemap-NUMBER.xml

    return [
      new URL(path, "https://theTimeWill.be").toString(),
      sitemapStream,
      ws,
    ];
  },
});

sms.pipe(createWriteStream(resolve("./public/sitemap-index.xml")));

const arrayOfSitemapItems = generateURLs();

arrayOfSitemapItems.forEach((item) => sms.write(item));
sms.end(); // necessary to let it know you've got nothing else to write
