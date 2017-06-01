import LatestSearchModel from "../models/latestSearchModel";

export function seacrhEntryHandler(query) {
  LatestSearchModel.findOne({query: query}, (err, dataOne) => {
    let nowDate = new Date()
    if (err) {
      throw err;
    }
    if (dataOne) {
      LatestSearchModel.update({query: query}, {processedAt: Date.now()}, (err, raw) => {
        if (err) {
          throw err;
        }
      })
    } else {
      let sq = new LatestSearchModel({
        query: query
      });
      sq.save();
    }
  })
  return;
}

export function latestSearhHandler(req, res) {
  LatestSearchModel.find({}, {}, {sort: {'processedAt': -1}, limit: 10}, (err, data) => {
    if (err) {
      throw err;
    }
    if (data) {
      data = data.map((d) => {
        return {
          query: d.query,
          at: d.processedAt
        }
      })
      res.json(data)
    } else {
      res.json({err: 'something went wrong'})
    }
  })
  return;
}
