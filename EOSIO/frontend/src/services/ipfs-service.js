//use the infura.io node, else run a daemon on your own computer/server.
const ipfsClient = require("ipfs-http-client");
// const ipfs = ipfsClient({
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "https"
// });
//run with local daemon
//const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001')
//const ipfs = ipfsClient({ host: '1.1.1.1', port: '80', 'api-path': '/ipfs/api/v0' })
const ipfs = ipfsClient({
  host: "localhost",
  port: "5001",
  protocol: "http"
});

//const parkingsTableIPFSHash = "QmPhW4NaEFxykUC7ozrxx54dxAjpWAw4JDujj6L2ZdQCGh";
const parkingsTableIPFSHash = "QmS74JheXXhxJRcGaCXt2MTz4bWRPvtrh27NPnjsbrwKuk";

const IPFSService = {
  getAvailableParkingSpaces: function(cb) {
    ipfs.cat(parkingsTableIPFSHash, (err, res) => {
      if (err) throw err;
      var data = res.toString("utf8");
      console.log("data received: ", data);
      cb(data);
    });
  },

  saveParkingSpaces: function(ownerdata, cb) {
    let dataBuffer = Buffer.from(JSON.stringify(ownerdata));
    ipfs.add([dataBuffer], (err, res) => {
      if (err || !res) {
        console.log(err);
      } else {
        console.log(res[0].hash);
        cb(res[0].hash);
      }
    });
  }
};

export default IPFSService;
