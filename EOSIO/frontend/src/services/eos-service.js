import { Api, JsonRpc, RpcError, JsSignatureProvider } from "eosjs"; // https://github.com/EOSIO/eosjs
import { TextDecoder, TextEncoder } from "text-encoding";

async function CallPADemoAction(
  endpoint,
  account,
  privKey,
  actionData,
  actionName
) {
  console.log(actionData);

  const rpc = new JsonRpc(endpoint);
  const contractAccount = "pademo";
  const signatureProvider = new JsSignatureProvider([privKey]);
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });
  try {
    const result = await api.transact(
      {
        actions: [
          {
            account: contractAccount,
            name: actionName,
            authorization: [
              {
                actor: account,
                permission: "active"
              }
            ],
            data: actionData
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    );
  } catch (e) {
    console.log("Caught exception: " + e);
    if (e instanceof RpcError) {
      console.log(JSON.stringify(e.json, null, 2));
    }
    return e.json();
  }
}
const EOSService = {
  requestParkingSpace: async function(endpoint, parkingdetails) {
    let {
      account,
      privateKey,
      owner,
      psname,
      intime,
      outtime
    } = parkingdetails;
    let actionName = "request";
    let actionData = {
      driver: account,
      owner: owner,
      parkingspace: psname,
      starttime: intime,
      endtime: outtime
    };

    await CallPADemoAction(
      endpoint,
      account,
      privateKey,
      actionData,
      actionName
    );

    // console.log(actionData);
    // const rpc = new JsonRpc(endpoint);
    // const signatureProvider = new JsSignatureProvider([privateKey]);
    // const api = new Api({
    //   rpc,
    //   signatureProvider,
    //   textDecoder: new TextDecoder(),
    //   textEncoder: new TextEncoder()
    // });
    // try {
    //   const result = await api.transact(
    //     {
    //       actions: [
    //         {
    //           account: "pademo",
    //           name: actionName,
    //           authorization: [
    //             {
    //               actor: account,
    //               permission: "active"
    //             }
    //           ],
    //           data: actionData
    //         }
    //       ]
    //     },
    //     {
    //       blocksBehind: 3,
    //       expireSeconds: 30
    //     }
    //   );
    // } catch (e) {
    //   console.log("Caught exception: " + e);
    //   if (e instanceof RpcError) {
    //     console.log(JSON.stringify(e.json, null, 2));
    //   }
    //   return e.json();
    // }
  },
  occupyParkingSpace: async function(endpoint, parkingdetails) {
    let { account, privateKey, owner, psname, intime } = parkingdetails;
    let actionName = "occupy";
    let actionData = {
      driver: account,
      owner: owner,
      parkingspace: psname,
      starttime: intime
    };

    await CallPADemoAction(
      endpoint,
      account,
      privateKey,
      actionData,
      actionName
    );
  },
  releaseParkingSpace: async function(endpoint, parkingdetails) {
    let { account, privateKey, owner, psname, intime } = parkingdetails;
    let actionName = "release";
    let actionData = {
      driver: account,
      owner: owner,
      parkingspace: psname,
      starttime: intime
    };

    await CallPADemoAction(
      endpoint,
      account,
      privateKey,
      actionData,
      actionName
    );
  },
  approveParkingSpaceRequest: async function(endpoint, parkingdetails) {
    let { account, privateKey, driver, psname, intime } = parkingdetails;
    let actionName = "approve";
    let actionData = {
      driver: driver,
      owner: account,
      parkingspace: psname,
      starttime: intime
    };

    await CallPADemoAction(
      endpoint,
      account,
      privateKey,
      actionData,
      actionName
    );
  },
  rejectParkingSpaceRequest: async function(endpoint, parkingdetails) {
    let { account, privateKey, driver, psname, intime } = parkingdetails;
    let actionName = "reject";
    let actionData = {
      driver: driver,
      owner: account,
      parkingspace: psname,
      starttime: intime
    };

    await CallPADemoAction(
      endpoint,
      account,
      privateKey,
      actionData,
      actionName
    );
  },
  getBookingsTable: function(endpoint) {
    const rpc = new JsonRpc(endpoint);
    return rpc.get_table_rows({
      json: true,
      code: "pademo", // contract who owns the table
      scope: "pademo", // scope of the table
      table: "pcontract", // name of the table as specified by the contract abi
      limit: 100
    });
  },
  getOwnersList: function() {},
  getParkingSpaces: function(owner) {},
  //old NoteChain APIs for reference
  saveUserNote: async function(endpoint, parkingdetails) {
    let { account, privateKey, note } = parkingdetails;
    let actionName = "update";
    let actionData = { user: account, note: note };

    // eosjs function call: connect to the blockchain
    const rpc = new JsonRpc(endpoint);
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const api = new Api({
      rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    });
    try {
      const result = await api.transact(
        {
          actions: [
            {
              account: "notechainacc",
              name: actionName,
              authorization: [
                {
                  actor: account,
                  permission: "active"
                }
              ],
              data: actionData
            }
          ]
        },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      );

      console.log(result.json());
      //getTable();
    } catch (e) {
      console.log("Caught exception: " + e);
      if (e instanceof RpcError) {
        console.log(JSON.stringify(e.json, null, 2));
      }
      return e.json();
    }
  },
  getTable: function(endpoint) {
    const rpc = new JsonRpc(endpoint);
    return rpc.get_table_rows({
      json: true,
      code: "notechainacc", // contract who owns the table
      scope: "notechainacc", // scope of the table
      table: "notestruct", // name of the table as specified by the contract abi
      limit: 100
    });
  }
};

export default EOSService;
