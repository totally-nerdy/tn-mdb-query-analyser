const PRINT_EXECUTION_STAGES = true
const PRINT_INDEX_BOUNDS = true
let QUERY
// Async fetch
fetch('https://api.tyny.dev/demo/documents/6408eb29f785da4a941cbc05')
  .then(response => response.json())
  .then(json => QUERY = db.tweets.aggregate(json.pipeline))
