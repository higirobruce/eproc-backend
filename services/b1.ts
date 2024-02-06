import { Router } from "express";
import { LocalStorage } from "node-localstorage";
import { sapLogin, sapLogout } from "../utils/sapB1Connection";
import { JournalEntryLine } from "../types/types";

import fetch from "cross-fetch";
let localstorage = new LocalStorage("./dist");

let b1Router = Router();

b1Router.get("/vatGroups", async (req, response) => {
  await getVatGroups().then((res) => {
    response.send(res);
  });
});

b1Router.get("/fixedAssets", async (req, response) => {
  await getFixedAssets().then((res) => {
    response.send(res);
  });
});

b1Router.get("/accounts", async (req, response) => {
  await getAccounts().then((res) => {
    response.send(res);
  });
});

b1Router.get("/distributionRules", async (req, response) => {
  await getDistributionRules().then((res) => {
    response.send(res);
  });
});

b1Router.get("/businessPartner/:name", async (req, response) => {
  await getBusinessPartnerByName(req.params.name).then((res) => {
    response.send(res.value);
  });
});

b1Router.put("/businessPartner/:id", async (req, response) => {
  await getBusinessPartnerByName(req.params.id).then((res) => {
    response.send(res.value);
  });
});

export function getVatGroups() {
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
      )
        .then((res) => res.json())
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      return err;
      console.log(err);
    });
}

export function getFixedAssets() {
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
            Prefer: "odata.maxpagesize=1000",
          },
        }
      )
        .then((res) => res.json())
        .catch((err) => {
          console.log(err);
          return err;
        });
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

export function getAccounts() {
  return sapLogin()
    .then(async (res) => {
      let resJson = await res.json();
      let COOKIE = res.headers.get("set-cookie");
      localstorage.setItem("cookie", `${COOKIE}`);
      return fetch(
        `${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/ChartOfAccounts?$filter= AccountLevel eq 5, ActiveAccount eq 'tYES'&$select=Name,Code,AccountLevel,AcctCurrency`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `${localstorage.getItem("cookie")}`,
            Prefer: "odata.maxpagesize=1000",
          },
        }
      )
        .then((res) => res.json())
        .catch((err) => {
          return err;
        });
    })
    .catch((err) => {
      // console.log(err);
      return err;
    });
}

export function getDistributionRules() {
  return sapLogin()
    .then(async (res) => {
      let resJson = await res.json();
      let COOKIE = res.headers.get("set-cookie");
      localstorage.setItem("cookie", `${COOKIE}`);
      return fetch(
        `${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/DistributionRules?$select= FactorCode, FactorDescription&$filter= Active eq 'tYES'`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `${localstorage.getItem("cookie")}`,
            Prefer: "odata.maxpagesize=1000",
          },
        }
      )
        .then((res) => res.json())
        .catch((err) => {
          return err;
        });
    })
    .catch((err) => {
      // console.log(err);
      return err;
    });
}

export function getBusinessPartnerByName(
  CardName: String | string | undefined
) {
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
      )
        .then((res) => {
          console.log(res.status);
          if (res.status !== 200) {
            return {
              error: true,
              message: "Could not fetch! Please check the bp name",
            };
          } else {
            return res.json();
          }
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

export function getBusinessPartnerById(CardCode: String | string | undefined) {
  return sapLogin()
    .then(async (res) => {
      let resJson = await res.json();
      let COOKIE = res.headers.get("set-cookie");
      localstorage.setItem("cookie", `${COOKIE}`);
      return fetch(
        `${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/BusinessPartners?$select=CardName,CardCode&$filter=CardCode eq '${CardCode}'`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `${localstorage.getItem("cookie")}`,
          },
        }
      )
        .then((res) => {
          console.log(res.status);
          if (res.status !== 200) {
            return {
              error: true,
              message: "Could not fetch! Please check the bp code",
            };
          } else {
            return res.json();
          }
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

export function updateBusinessPartnerById(
  CardCode: String | string | undefined,
  update: any
) {

  console.log(CardCode)
  return sapLogin()
    .then(async (res) => {
      let resJson = await res.json();
      let COOKIE = res.headers.get("set-cookie");
      localstorage.setItem("cookie", `${COOKIE}`);
      return fetch(
        `${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/BusinessPartners('${CardCode}')`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `${localstorage.getItem("cookie")}`,
          },
          body: JSON.stringify(update)
        }
      )
        .then((res) => {
          
          if (res.status !== 204) {
            return {
              error: true,
              message: "Could not fetch! Please check the bp code",
            };
          } else {
            return res.json();
          }
        })
        .catch((err) => {
          
          return err;
        });
    })
    .catch((err) => {
      
      return err;
    });
}
export async function saveJournalEntry(
  Memo: String,
  ReferenceDate: Date,
  JournalEntryLines: JournalEntryLine[]
) {
  return sapLogin().then(async (res) => {
    let COOKIE = res.headers.get("set-cookie");
    localstorage.setItem("cookie", `${COOKIE}`);

    return fetch(
      `${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/JournalEntries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${localstorage.getItem("cookie")}`,
        },
        body: JSON.stringify({
          Memo,
          ReferenceDate,
          JournalEntryLines,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log({ error: true, message: err?.message });
        return { error: true, message: err?.message };
      });
  });
}

export default b1Router;
