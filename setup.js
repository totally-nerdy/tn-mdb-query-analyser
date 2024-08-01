const PRINT_EXECUTION_STAGES = true
const PRINT_INDEX_BOUNDS = true

// Single-stage query example
// const QUERY = db.tweets.find({ source: "web" }).sort({ created_at: -1 })
// const QUERY = db.tweets.find({ "entities.hashtags.text": { "$regex": "^love$" } })

// Multi-stage query example
const QUERY = db.tweets.aggregate([
  { '$match': { 'source': 'web' } },
  {
    '$match': {
      '$or': [{                   // Tip of the day: MDB only uses a dedicated index on this field if the other fields
        'user.screen_name': {     // of the $or have dedicated indexes as well
          '$in': [/^wildcard_7$/] // e.g. an index only user.screen_name only will not be used if there"s none on
        }                         // entities.hashtags.text
      }, {
        'entities.hashtags.text': {
          '$in': [/^love$/]
        }
      }]
    }
  },
  {
    '$project': {
      'hashtags': {
        '$filter': {
          'input': '$entities.hashtags',
          'as': 'hashtag',
          'cond': { '$or': [['$$hashtag.text', ['love']]] }
        }
      }, '_id': 0, 'created_at': 1, 'user': 1
    }
  },
  { '$match': { 'hashtags': { '$exists': true, '$ne': [] } } }
])

// rs.secondaryOk()
// ...
