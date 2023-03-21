"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = void 0;
const nodemailer = require("nodemailer");
const mjml = require("mjml");
// create transporter object with smtp server details
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.IRMB_SENDER_EMAIL,
        pass: process.env.IRMB_SENDER_PASSWORD,
    },
    from: process.env.IRMB_SENDER_EMAIL,
});
const newTender = `<mjml>
<mj-body>
  <!-- Company Header -->
  <mj-section>
    <mj-column>
    <mj-image src="https://firebasestorage.googleapis.com/v0/b/movies-85a7a.appspot.com/o/blue%20icon.png?alt=media&token=12cc6ce4-4c78-4b12-9197-57b8be52d09e" alt="irembolgo" width="100px" padding="10px 25px"></mj-image><mj-text align='center' font-style="" font-size="20px" color="#626262">
        Irembo Procure
      </mj-text>
    </mj-column>
  </mj-section>

  <!-- Image Header -->
  <mj-section>
    <mj-column width="600px">
      <mj-text align="center" color="#626262" font-size="26px" font-family="Helvetica Neue">A new Tender is published</mj-text>
    </mj-column>
  </mj-section>


  <!-- Intro text -->
  <mj-section background-color="">
    <mj-column width="500px">

      <mj-text color="#525252">
        Greetings, <br />
        We trust that you are keeping well. <br/>
        We would like to inform you that a new tender has been published. <br/>
        For more information on this tender and the related bid submission requirements, 
        please proceed to the e-procurement application by clicking the button below.<br>
      </mj-text>

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER || "http://http://192.168.20.181"}:${process.env.IRMB_APP_PORT || 3000}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;
const invitation = (tender) => {
    return `<mjml>
<mj-body>
  <!-- Company Header -->
  <mj-section>
    <mj-column>
    <mj-image src="https://firebasestorage.googleapis.com/v0/b/movies-85a7a.appspot.com/o/blue%20icon.png?alt=media&token=12cc6ce4-4c78-4b12-9197-57b8be52d09e" alt="irembolgo" width="100px" padding="10px 25px"></mj-image><mj-text align='center' font-style="" font-size="20px" color="#626262">
      <mj-text>
        Irembo Procure
      </mj-text>
    </mj-column>
  </mj-section>

  <!-- Image Header -->
  <mj-section>
    <mj-column width="600px">
      <mj-text align="center" color="#626262" font-size="26px" font-family="Helvetica Neue">Bid evaluation invite</mj-text>
    </mj-column>
  </mj-section>


  <!-- Intro text -->
  <mj-section background-color="">
    <mj-column width="500px">

      <mj-text color="#525252">
        Hi there, <br/><br/>
        Please be informed that you have been selected to be part of the team that will be 
        evaluating the bids submitted in response to ${tender === null || tender === void 0 ? void 0 : tender.number}.<br/>
        For details on these bids, please proceed to the e-procurement application by clicking the button below.<br/>
            
      </mj-text>

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER || "http://http://192.168.20.181"}:${process.env.IRMB_APP_PORT || 3000}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>
`;
};
const bidSelectionConfirmation = (tender) => {
    return `<mjml>
  <mj-body>
    <!-- Company Header -->
    <mj-section>
      <mj-column>
      <mj-image src="https://firebasestorage.googleapis.com/v0/b/movies-85a7a.appspot.com/o/blue%20icon.png?alt=media&token=12cc6ce4-4c78-4b12-9197-57b8be52d09e" alt="irembolgo" width="100px" padding="10px 25px"></mj-image><mj-text align='center' font-style="" font-size="20px" color="#626262">
          Irembo Procure
        </mj-text>
      </mj-column>
    </mj-section>
  
    <!-- Image Header -->
    <mj-section>
      <mj-column width="600px">
        <mj-text align="center" color="#626262" font-size="26px" font-family="Helvetica Neue">Bid selection confirmation</mj-text>
      </mj-column>
    </mj-section>
  
  
    <!-- Intro text -->
    <mj-section background-color="">
      <mj-column width="500px">
  
        <mj-text color="#525252">
          Greetings, <br />
          Subsequent to the bids evaluation activities, please be informed that a bid has now been selected for ${tender === null || tender === void 0 ? void 0 : tender.number}<br/>
          As part of the bid selection team for this tender, you are requested to review and approve the now available tender award recommendations. 
          Once all relevant stakeholders approve of these recommendations, the selected vendor will be informed of the tender award decision<br>
        </mj-text>
  
        <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER || "http://http://192.168.20.181"}:${process.env.IRMB_APP_PORT || 3000}>Go to application</mj-button>
      </mj-column>
    </mj-section>
  
    <!-- Social icons -->
    <mj-section background-color=""></mj-section>
  
  </mj-body>
  </mjml>`;
};
const approval = `<mjml>
<mj-body>
  <!-- Company Header -->
  <mj-section>
    <mj-column>
    <mj-image src="https://firebasestorage.googleapis.com/v0/b/movies-85a7a.appspot.com/o/blue%20icon.png?alt=media&token=12cc6ce4-4c78-4b12-9197-57b8be52d09e" alt="irembolgo" width="100px" padding="10px 25px"></mj-image><mj-text align='center' font-style="" font-size="20px" color="#626262">
      <mj-text>
        Irembo Procure
      </mj-text>
    </mj-column>
  </mj-section>

  <!-- Image Header -->
  <mj-section>
    <mj-column width="600px">
      <mj-text align="center" color="#626262" font-size="26px" font-family="Helvetica Neue">Your Approval is needed</mj-text>
    </mj-column>
  </mj-section>


  <!-- Intro text -->
  <mj-section background-color="">
    <mj-column width="500px">

      <mj-text color="#525252">
        Hi there, <br />
        I hope that you are well. <br/>
        I am reaching out to inform you that a new purchase request has been submitted for your approval.<br/>
        To review the request, please proceed to the e-procurement portal application by clicking the button below.<br>
      </mj-text>

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER || "http://http://192.168.20.181"}:${process.env.IRMB_APP_PORT || 3000}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;
const rejection = `<mjml>
<mj-body>
  <!-- Company Header -->
  <mj-section>
    <mj-column>
    <mj-image src="https://firebasestorage.googleapis.com/v0/b/movies-85a7a.appspot.com/o/blue%20icon.png?alt=media&token=12cc6ce4-4c78-4b12-9197-57b8be52d09e" alt="irembolgo" width="100px" padding="10px 25px"></mj-image><mj-text align='center' font-style="" font-size="20px" color="#626262">
      <mj-text>
        Irembo Procure
      </mj-text>
    </mj-column>
  </mj-section>

  <!-- Image Header -->
  <mj-section>
    <mj-column width="600px">
      <mj-text align="center" color="#626262" font-size="26px" font-family="Helvetica Neue">Your Approval is needed</mj-text>
    </mj-column>
  </mj-section>


  <!-- Intro text -->
  <mj-section background-color="">
    <mj-column width="500px">

      <mj-text color="#525252">
        Hi there, <br />
        I hope that you are well. <br/>
        I regret to inform you that your previously submitted request has been declined.<br/>
        For more information on this decision, please proceed to the e-procurement application by clicking the button below.<br>
      </mj-text>

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER || "http://http://192.168.20.181"}:${process.env.IRMB_APP_PORT || 3000}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;
const newUserAccount = (cred) => {
    return `<mjml>
<mj-body>
  <!-- Company Header -->
  <mj-section>
    <mj-column>
    <mj-image src="https://firebasestorage.googleapis.com/v0/b/movies-85a7a.appspot.com/o/blue%20icon.png?alt=media&token=12cc6ce4-4c78-4b12-9197-57b8be52d09e" alt="irembolgo" width="100px" padding="10px 25px"></mj-image><mj-text align='center' font-style="" font-size="20px" color="#626262">
      <mj-text>
        Irembo Procure
      </mj-text>
    </mj-column>
  </mj-section>

  <!-- Image Header -->
  <mj-section>
    <mj-column width="600px">
      <mj-text align="center" color="#626262" font-size="26px" font-family="Helvetica Neue">Your account is created</mj-text>
    </mj-column>
  </mj-section>


  <!-- Intro text -->
  <mj-section background-color="">
    <mj-column width="500px">

      <mj-text color="#525252">
        Hi there, <br />
        I hope that you are well. <br/>
        I would like to inform you that your account has been created in Irembo Procure.<br/><br/>
        Here are your credentials:<br/>
        Username: ${cred === null || cred === void 0 ? void 0 : cred.email}<br/>
        Password: <i>${cred === null || cred === void 0 ? void 0 : cred.password}</i> <br/><br/>
        Please proceed to the e-procurement application by clicking the button below.<br>
      </mj-text>

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER || "http://http://192.168.20.181"}:${process.env.IRMB_APP_PORT || 3000}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;
};
const externalSignature = (cred) => {
    return `<mjml>
<mj-body>
  <!-- Company Header -->
  <mj-section>
    <mj-column>
    <mj-image src="https://firebasestorage.googleapis.com/v0/b/movies-85a7a.appspot.com/o/blue%20icon.png?alt=media&token=12cc6ce4-4c78-4b12-9197-57b8be52d09e" alt="irembolgo" width="100px" padding="10px 25px"></mj-image><mj-text align='center' font-style="" font-size="20px" color="#626262">
      <mj-text>
        Irembo Procure
      </mj-text>
    </mj-column>
  </mj-section>

  <!-- Image Header -->
  <mj-section>
    <mj-column width="600px">
      <mj-text align="center" color="#626262" font-size="26px" font-family="Helvetica Neue">Your contract has been signed</mj-text>
    </mj-column>
  </mj-section>


  <!-- Intro text -->
  <mj-section background-color="">
    <mj-column width="500px">

      <mj-text color="#525252">
        Hi there, <br />
        We hope that you are well. <br/>
        We would like to let you know that your contract has been signed.
        Please proceed to the e-procurement application by clicking the button below and provide below credentials<br><br>

        Username: ${cred === null || cred === void 0 ? void 0 : cred.email}<br/>
        Password: <i>${cred === null || cred === void 0 ? void 0 : cred.password}</i> <br/><br/>
      </mj-text>

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER || "http://http://192.168.20.181"}:${process.env.IRMB_APP_PORT || 3000}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;
};
const externalSignaturePO = (cred) => {
    return `<mjml>
<mj-body>
  <!-- Company Header -->
  <mj-section>
    <mj-column>
    <mj-image src="https://firebasestorage.googleapis.com/v0/b/movies-85a7a.appspot.com/o/blue%20icon.png?alt=media&token=12cc6ce4-4c78-4b12-9197-57b8be52d09e" alt="irembolgo" width="100px" padding="10px 25px"></mj-image><mj-text align='center' font-style="" font-size="20px" color="#626262">
      <mj-text>
        Irembo Procure
      </mj-text>
    </mj-column>
  </mj-section>

  <!-- Image Header -->
  <mj-section>
    <mj-column width="600px">
      <mj-text align="center" color="#626262" font-size="26px" font-family="Helvetica Neue">Your Purchase Order has been signed</mj-text>
    </mj-column>
  </mj-section>


  <!-- Intro text -->
  <mj-section background-color="">
    <mj-column width="500px">

      <mj-text color="#525252">
        Hi there, <br />
        We hope that you are well. <br/>
        We would like to let you know that your Purchase Order has been signed.
        Please proceed to the e-procurement application by clicking the button below and provide below credentials to sign<br><br>

        Username: ${cred === null || cred === void 0 ? void 0 : cred.email}<br/>
        Password: <i>${cred === null || cred === void 0 ? void 0 : cred.password}</i> <br/><br/>
      </mj-text>

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER || "http://http://192.168.20.181"}:${process.env.IRMB_APP_PORT || 3000}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;
};
// send email
function send(from, to, subject, text, html, type) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log("sent");
        if (type === "newTender")
            return yield transporter.sendMail({
                from: process.env.IRMB_SENDER_EMAIL,
                to: to,
                subject,
                text,
                html: mjml(newTender).html,
            });
        else if (type === "bidEvaluationInvite")
            return yield transporter.sendMail({
                from: process.env.IRMB_SENDER_EMAIL,
                to,
                subject,
                text,
                html: mjml(invitation(JSON.parse(text))).html,
            });
        else if (type === "bidSelectionConfirmation")
            return yield transporter.sendMail({
                from: process.env.IRMB_SENDER_EMAIL,
                to,
                subject,
                text,
                html: mjml(bidSelectionConfirmation(JSON.parse(text))).html,
            });
        else if (type === "approval")
            return yield transporter.sendMail({
                from: process.env.IRMB_SENDER_EMAIL,
                to,
                subject,
                text,
                html: mjml(approval).html,
            });
        else if (type === "rejection")
            return yield transporter.sendMail({
                from: process.env.IRMB_SENDER_EMAIL,
                to,
                subject,
                text,
                html: mjml(rejection).html,
            });
        else if (type === "newUserAccount")
            return yield transporter.sendMail({
                from: process.env.IRMB_SENDER_EMAIL,
                to,
                subject,
                text,
                html: mjml(newUserAccount(JSON.parse(text))).html,
            });
        else if (type === "externalSignature")
            return yield transporter.sendMail({
                from: process.env.IRMB_SENDER_EMAIL,
                to,
                subject,
                text,
                html: mjml(externalSignature(JSON.parse(text))).html,
            });
        else if (type === "externalSignaturePO")
            return yield transporter.sendMail({
                from: process.env.IRMB_SENDER_EMAIL,
                to,
                subject,
                text,
                html: mjml(externalSignature(JSON.parse(text))).html,
            });
    });
}
exports.send = send;
