var mongodb = require('mongodb');

var seedData = [
  {
    decade: '1970s',
    artist: 'Debby Boone',
    song: 'You Light Up My Life',
    weeksAtOne: 10
  },
  {
    decade: '1980s',
    artist: 'Olivia Newton-John',
    song: 'Physical',
    weeksAtOne: 10
  },
  {
    decade: '1990s',
    artist: 'Mariah Carey',
    song: 'One Sweet Day',
    weeksAtOne: 16
  }
];

var userData = [
    {
        username: 'tiennx1',
        password: 'tiepsieudeptrai'
    },
    {
        username: 'tungns4',
        password: 'tungns4'
    },
    {
        username: 'anhnq7',
        password: 'anhnq7'
    },
    {
        username: 'quyendd',
        password: 'quyendd'
    },
    {
        username: 'trunglv',
        password: 'trunglv'
    },
    {
        username: 'linhdkn',
        password: 'linhdkn'
    },
    {
        username: 'tranglm',
        password: 'tranglm'
    },
    {
        username: 'giangptt1',
        password: 'giangptt1'
    },
    {
        username: 'quandh6',
        password: 'quandh6'
    },
    {
        username: 'chinhdq',
        password: 'chinhdq'
    },
    {
        username: 'phuongnth',
        password: 'phuongnth'
    },
    {
        username: 'namdh6',
        password: 'namdh6'
    }
]

var uri = 'mongodb://tientm:tientm@ds119618.mlab.com:19618/tientmmongo';

function addSeedData() {
    mongodb.MongoClient.connect(uri, function(err, db) {
        if (err) throw err;

        var songs = db.collection('songs');

        songs.insert(seedData, function(err, result) {
            if (err) {
                throw err;
            } else {
                console.log("inserted seed data");
            }
        });

        var user = db.collection('user');

        user.insert(userData, function(err, result) {
            if (err) {
                throw err;
            } else {
                console.log("inserted seed data");
            }
        });
    });
}



module.exports = addSeedData;