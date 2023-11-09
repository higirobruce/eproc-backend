import { Router } from "express";
import { LocalStorage } from "node-localstorage";
import { sapLogin, sapLogout } from "../utils/sapB1Connection";

let localstorage = new LocalStorage("./dist");

let b1Router = Router();

b1Router.get("/vatGroups", async (req, response) => {
  await getVatGroups().then(res=>{
    response.send(res)
  })
});

b1Router.get("/fixedAssets", async (req, response) => {
  await getFixedAssets().then(res=>{
    response.send(res)
  })
});

b1Router.get('/businessPartner/:name', async (req,response)=>{
  await getBusinessPartnerByName(req.params.name).then(res=>{
    response.send(res.value)
  })
})



export function getVatGroups(){
  return sapLogin()
    .then(async (res) => {
      let resJson = await res.json();
      let COOKIE = res.headers.get("set-cookie");
      localstorage.setItem("cookie", `${COOKIE}`);
      return fetch(
       `${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/VatGroups?$filter=Inactive eq 'tNO'&$select=Code,Name,Category`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `${localstorage.getItem("cookie")}`,
          },
        }
      ).then(res=>res.json())
    }).catch(err=>{
      return err
      console.log(err)
    })
   
}

export function getFixedAssets(){
  return sapLogin()
    .then(async (res) => {
      let resJson = await res.json();
      let COOKIE = res.headers.get("set-cookie");
      localstorage.setItem("cookie", `${COOKIE}`);
      return fetch(
       `${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/Items?$filter= ItemType eq 'itFixedAssets' and CapitalizationDate eq null &$select=ItemCode,ItemName`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `${localstorage.getItem("cookie")}`,
            Prefer: 'odata.maxpagesize=1000'
          },
        }
      ).then(res=>res.json())
    }).catch(err=>{
      return err
      console.log(err)
    })
   
}

export function getBusinessPartnerByName(CardName:String){
  return sapLogin()
    .then(async (res) => {
      let resJson = await res.json();
      let COOKIE = res.headers.get("set-cookie");
      localstorage.setItem("cookie", `${COOKIE}`);
      return fetch(
       `${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/BusinessPartners?$select=CardName,CardCode&$filter=CardName eq '${CardName}'`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `${localstorage.getItem("cookie")}`,
          },
        }
      ).then(res=>res.json())
    }).catch(err=>{
      return err
    })
}



export default b1Router;
