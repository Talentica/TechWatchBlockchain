import React from "react";
import ReactDOM from "react-dom";
import ContractReviewsList from "./cards-list";

// var userPrivateKeyStore = {
//   premb: "5KkMYNvSxfs6UtibVCtEoc7zka1zHq8nGaanV36EKxTPwxKeA2P", //"EOS7VZ3puepLTHfeDnvMgk4MvsBJuVMFSBkxWzxr6uCCPUiNRFywP",  == preminjungle
//   maryj: "5KD7p1TrdyzsmZYE3diMGvf3cSXd6i9tbyhmMCrM9DFS3fqhTiG", //"EOS7GfywukASMN9M3jR8Fr27ksboprds1onkJ9Pm94MpQoXdyUvBb",  == maryinjungle
//   harryp: "5JnRE6FQehtDpTPQxbhUyXQM1fyyR2ur6kFoQ9rFFYnEQSMb21r", //"EOS8AveeUn1AHupWxSNWcxd3rmb8ucodd8XZdSpePw4bLLdLapCSf", == harryinjungl
//   amitk: "5JQAUUhdcoyLcG1Ft7VGcq1NfJxQ67qxuV5SRbYgQ5ETYWaqtCo", //"EOS7tmBXXBYyemtEfNSzJv7hgnEsouSRz1TPHCHrDxwub52hrsf2h",  == amitinjungle
//   jackn: "5JYV6HPNDx3oDsCDoYp2oM8RnZNdW4UWuihLXZgxRs9zmNrtQiF" //"EOS8k5nsypxbjiZdQfko8zvsjmVm9898WsFJswiKDX78AkBnQCa7b"    == jackinjungle
// };
var userPrivateKeyStore = {
  preminjungle: "5KkMYNvSxfs6UtibVCtEoc7zka1zHq8nGaanV36EKxTPwxKeA2P", //"EOS7VZ3puepLTHfeDnvMgk4MvsBJuVMFSBkxWzxr6uCCPUiNRFywP",  == preminjungle
  maryinjungle: "5KD7p1TrdyzsmZYE3diMGvf3cSXd6i9tbyhmMCrM9DFS3fqhTiG", //"EOS7GfywukASMN9M3jR8Fr27ksboprds1onkJ9Pm94MpQoXdyUvBb",  == maryinjungle
  harryinjungl: "5JnRE6FQehtDpTPQxbhUyXQM1fyyR2ur6kFoQ9rFFYnEQSMb21r", //"EOS8AveeUn1AHupWxSNWcxd3rmb8ucodd8XZdSpePw4bLLdLapCSf", == harryinjungl
  amitinjungle: "5JQAUUhdcoyLcG1Ft7VGcq1NfJxQ67qxuV5SRbYgQ5ETYWaqtCo", //"EOS7tmBXXBYyemtEfNSzJv7hgnEsouSRz1TPHCHrDxwub52hrsf2h",  == amitinjungle
  jackinjungle: "5JYV6HPNDx3oDsCDoYp2oM8RnZNdW4UWuihLXZgxRs9zmNrtQiF" //"EOS8k5nsypxbjiZdQfko8zvsjmVm9898WsFJswiKDX78AkBnQCa7b"    == jackinjungle
};
const loggedInUser = "maryinjungle";
//eosio endpoint
//const eosEndpoint = "http://localhost:8888";

const eosEndpoint = "https://api.jungle.alohaeos.com:443";

ReactDOM.render(
  <ContractReviewsList
    user={loggedInUser}
    endpoint={eosEndpoint}
    store={userPrivateKeyStore}
  />,
  document.querySelector("#Contracts")
);
