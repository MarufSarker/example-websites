import ShortenedURL from "../models/shortenedURIModel";

function linkRedirector(req, res) {
  let addr = req.url;
  addr = addr.slice(13); // for /srt/ = 5, /api/srt/red/ = 13
  ShortenedURL.findOne({shortUrlID: addr}, (err, dataSr) => {
    if (err) {
      throw err;
    }
    if (dataSr) {
      addr = dataSr.originalUrl;
      let finalURL = '';
      if (addr.slice(0, 7) === 'http://') {
        finalURL = addr;
      } else if (addr.slice(0, 8) === 'https://') {
        finalURL = addr;
      } else {
        finalURL = 'http://' + addr;
      }
      res.redirect(finalURL);
    } else {
      res.json({err: 'invalid link'});
    }
  });
}

export default linkRedirector;
