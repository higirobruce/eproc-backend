
var config = {
  "CompanyDB": "Z_TEST_IREMBO_DB",
  "UserName": "manager",
  "Password": "K1g@li@123"
}
export var SESSION_ID:any;
export var COOKIE:any;

export function sapLogin() {
  fetch('https://192.168.20.181:50000/b1s/v1/Login', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(config)
  })
    .then(async res => {
      let resJson = await res.json();
      SESSION_ID = resJson?.SessionId;
      COOKIE = res.headers.get('set-cookie')
      console.log(resJson)
      console.log('Logged in', SESSION_ID, COOKIE)

      
    }).catch(err => {
      console.log(err)
    })
}

