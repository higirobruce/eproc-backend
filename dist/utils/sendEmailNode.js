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
exports.trySend = exports.send = void 0;
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
const newTender = (newTender) => `<mjml>
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
    <mj-column>
      <mj-text align="center" color="#626262" font-size="26px" font-family="Helvetica Neue">A new Tender is published</mj-text>
    </mj-column>
  </mj-section>


  <!-- Intro text -->
  <mj-section background-color="">
    <mj-column >

      <mj-text color="#525252">
        Greetings, <br />
        We trust that you are keeping well. <br/><br/>
        We would like to inform you that a new tender has been published. <br/><br/><br/>
        For more information on this tender and the related bid submission requirements, 
        please proceed to the e-procurement application by clicking the button below.<br/>
      </mj-text>

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/tenders/${newTender === null || newTender === void 0 ? void 0 : newTender._id}>Go to application</mj-button>
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

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/tenders/${tender === null || tender === void 0 ? void 0 : tender._id}>Go to application</mj-button>
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
  
        <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/tenders/${tender === null || tender === void 0 ? void 0 : tender._id}>Go to application</mj-button>
      </mj-column>
    </mj-section>
  
    <!-- Social icons -->
    <mj-section background-color=""></mj-section>
  
  </mj-body>
  </mjml>`;
};
const prApproval = (pr) => `<mjml>
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

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/requests/${pr === null || pr === void 0 ? void 0 : pr._id}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;
const paymentRequestApproval = (pr) => `<mjml>
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
        I hope that you are well. <br/><br/>
        I am reaching out to inform you that a new payment request (Req Number ${pr === null || pr === void 0 ? void 0 : pr.number}) has been submitted for your approval.<br/><br/>
        To review the request, please proceed to the e-procurement application by clicking the button below.<br>
      </mj-text>

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/payment-requests/${pr === null || pr === void 0 ? void 0 : pr._id}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;
const prRejection = (pr) => `<mjml>
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
      <mj-text align="center" color="#626262" font-size="26px" font-family="Helvetica Neue">Your Request has been declined</mj-text>
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

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/requests/${pr === null || pr === void 0 ? void 0 : pr._id}>Go to application</mj-button>
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

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;
};
const passwordReset = (cred) => {
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
      <mj-text align="center" color="#626262" font-size="26px" font-family="Helvetica Neue">Password Reset</mj-text>
    </mj-column>
  </mj-section>


  <!-- Intro text -->
  <mj-section background-color="">
    <mj-column width="500px">

      <mj-text color="#525252">
        Hi there, <br />
        I hope that you are well. <br/>
        I would like to inform you that your password to access Irembo Procure has been reset.<br/><br/>
        
        Your new Password is <i>${cred === null || cred === void 0 ? void 0 : cred.password}</i> <br/><br/>

        Please proceed to the e-procurement application by clicking the button below, and remember to go to your profile to set your own password.<br>
      </mj-text>

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;
};
const passwordRecovery = (emailObj) => {
    var _a, _b;
    return `<mjml>
  <mj-body>
    <!-- Company Header -->
    <mj-section>
      <mj-column>
        <mj-image src="https://firebasestorage.googleapis.com/v0/b/movies-85a7a.appspot.com/o/blue%20icon.png?alt=media&token=12cc6ce4-4c78-4b12-9197-57b8be52d09e" alt="irembolgo" width="100px" padding="10px 25px"></mj-image>
        <mj-text align='center' font-style="" font-size="20px" color="#626262">
          <mj-text>
            Irembo Procure
          </mj-text>
        </mj-text>

      </mj-column>
    </mj-section>

    <!-- Image Header -->

    <!-- Intro text -->
    <mj-section>
      <mj-column width="500px">

        <mj-text color="#525252">
          Hi there, ${(_a = emailObj === null || emailObj === void 0 ? void 0 : emailObj.user) === null || _a === void 0 ? void 0 : _a.firstName} <br /><br />
          Someone has requested a link to change your password in Irembo Procure. You can do this through the link below.<br /><br />

        </mj-text>

        <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/auth/reset-password?userId=${(_b = emailObj === null || emailObj === void 0 ? void 0 : emailObj.user) === null || _b === void 0 ? void 0 : _b._id}&token=${emailObj === null || emailObj === void 0 ? void 0 : emailObj.token}>Reset password</mj-button>

        <mj-text color="#525252">
          If you didn't request this, please ignore this email. <br /><br />
          Your password won't change until you access the link above and create a new one.

        </mj-text>

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
};
const preGoLive = (emailObj) => {
    var _a, _b;
    return `<mjml>
  <mj-body>
    <!-- Company Header -->
    <mj-section>
      <mj-column>
        <mj-image src="https://firebasestorage.googleapis.com/v0/b/movies-85a7a.appspot.com/o/blue%20icon.png?alt=media&token=12cc6ce4-4c78-4b12-9197-57b8be52d09e" alt="irembolgo" width="100px" padding="10px 25px"></mj-image>
        <mj-text align='center' font-style="" font-size="20px" color="#626262">
          <mj-text>
            Irembo Procure
          </mj-text>
        </mj-text>

      </mj-column>
    </mj-section>

    <!-- Image Header -->

    <!-- Intro text -->
    <mj-section>
      <mj-column width="500px">

        <mj-text color="#525252">
          Hi, ${(_a = emailObj === null || emailObj === void 0 ? void 0 : emailObj.user) === null || _a === void 0 ? void 0 : _a.firstName} <br /><br />
          Following up from our prior announcement, we are happy to announce that the new e-Procurement platform is now live.<br /><br />

          To ease your transition onto the new application, we have already created your account. To access the application, simply reset your password by following these steps:<br />
          <ul>
            <li>Click the button below</li>
            <li>Supply the new password (at least 8 characters) and press "Recover password"</li>
            <li>Finally login with your email and the new password.</li>
          </ul><br /><br />

        </mj-text>

        <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/auth/reset-password?userId=${(_b = emailObj === null || emailObj === void 0 ? void 0 : emailObj.user) === null || _b === void 0 ? void 0 : _b._id}&token=${emailObj === null || emailObj === void 0 ? void 0 : emailObj.token}>Reset password</mj-button>

        <mj-text color="#525252">

          Hope you enjoy the new application!<br /><br />
          Kindly contact us by replying to this email, if you have any questions or concerns.<br />


        </mj-text>

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
};
const externalSignature = (emailObj, subject) => {
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
      <mj-text align="center" color="#626262" font-size="26px" font-family="Helvetica Neue">${subject}.</mj-text>
    </mj-column>
  </mj-section>


  <!-- Intro text -->
  <mj-section background-color="">
    <mj-column width="500px">

      <mj-text color="#525252">
        Hi there, <br />
        We hope that you are well. <br/>
        We would like to let you know that your contract has been signed by Irembo.
        For you to sign the contract, please proceed to the e-procurement application by clicking the button below and provide below credentials<br><br>

        Username: ${emailObj === null || emailObj === void 0 ? void 0 : emailObj.email}<br/>
        Password: <i>${emailObj === null || emailObj === void 0 ? void 0 : emailObj.password}</i> <br/><br/>
      </mj-text>

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/${emailObj.docType}/${emailObj.docId}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;
};
const internalSignature = (emailObj) => {
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
        <mj-text align="center" color="#626262" font-size="26px" font-family="Helvetica Neue">Your signature is needed</mj-text>
      </mj-column>
    </mj-section>
  
  
    <!-- Intro text -->
    <mj-section background-color="">
      <mj-column width="500px">
  
        <mj-text color="#525252">
          Hi there, <br />
          We hope that you are well. <br/>
          We would like to let you know that a document has reached at your level, waiting for you to sign it.<br/> <br/>
          Please proceed to the e-procurement application by clicking the button below.<br/><br/>
  
        </mj-text>
  
        <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/${emailObj.docType}/${emailObj.docId}>Go to application</mj-button>
      </mj-column>
    </mj-section>
  
    <!-- Social icons -->
    <mj-section background-color=""></mj-section>
  
  </mj-body>
  </mjml>`;
};
const contractReview = (emailObj) => {
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
        <mj-text align="center" color="#626262" font-size="26px" font-family="Helvetica Neue">Your signature is needed</mj-text>
      </mj-column>
    </mj-section>
  
  
    <!-- Intro text -->
    <mj-section background-color="">
      <mj-column width="500px">
  
        <mj-text color="#525252">
          Hi there, <br />
          We hope that you are well. <br/>
          We would like to let you know that a contract awaits your review.<br/> <br/>
          Please proceed to the e-procurement application by clicking the button below.<br/><br/>
  
        </mj-text>
  
        <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/${emailObj.docType}/${emailObj.docId}>Go to application</mj-button>
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

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}>Go to application</mj-button>
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
        console.log("sending...");
        try {
            if (type === "newTender")
                return yield transporter.sendMail({
                    from: process.env.IRMB_SENDER_EMAIL,
                    bcc: to,
                    subject,
                    text,
                    html: mjml(newTender(JSON.parse(text))).html,
                });
            else if (type === "bidEvaluationInvite")
                return yield transporter.sendMail({
                    from: process.env.IRMB_SENDER_EMAIL,
                    bcc: to,
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
                    html: mjml(prApproval(JSON.parse(text))).html,
                });
            else if (type === "payment-request-approval")
                return yield transporter.sendMail({
                    from: process.env.IRMB_SENDER_EMAIL,
                    to,
                    subject,
                    text,
                    html: mjml(paymentRequestApproval(JSON.parse(text))).html,
                });
            else if (type === "rejection")
                return yield transporter.sendMail({
                    from: process.env.IRMB_SENDER_EMAIL,
                    to,
                    subject,
                    text,
                    html: mjml(prRejection(JSON.parse(text))).html,
                });
            else if (type === "newUserAccount")
                return yield transporter.sendMail({
                    from: process.env.IRMB_SENDER_EMAIL,
                    to,
                    subject,
                    text,
                    html: mjml(newUserAccount(JSON.parse(text))).html,
                });
            else if (type === "passwordReset")
                return yield transporter.sendMail({
                    from: process.env.IRMB_SENDER_EMAIL,
                    to,
                    subject,
                    text,
                    html: mjml(passwordReset(JSON.parse(text))).html,
                });
            else if (type === "passwordRecover")
                return yield transporter.sendMail({
                    from: process.env.IRMB_SENDER_EMAIL,
                    to,
                    subject,
                    text,
                    html: mjml(passwordRecovery(JSON.parse(text))).html,
                });
            else if (type === "preGoLive")
                return yield transporter.sendMail({
                    from: process.env.IRMB_SENDER_EMAIL,
                    bcc: to,
                    subject,
                    text,
                    html: mjml(preGoLive(JSON.parse(text))).html,
                });
            else if (type === "externalSignature")
                return yield transporter.sendMail({
                    from: process.env.IRMB_SENDER_EMAIL,
                    to,
                    subject,
                    text,
                    html: mjml(externalSignature(JSON.parse(text), subject)).html,
                });
            else if (type === "internalSignature")
                return yield transporter.sendMail({
                    from: process.env.IRMB_SENDER_EMAIL,
                    to,
                    subject,
                    text,
                    html: mjml(internalSignature(JSON.parse(text))).html,
                });
            else if (type === "contractReview")
                return yield transporter.sendMail({
                    from: process.env.IRMB_SENDER_EMAIL,
                    to,
                    subject,
                    text,
                    html: mjml(contractReview(JSON.parse(text))).html,
                });
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.send = send;
//test email
function trySend() {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer.createTransport({
            host: 'imparage.aos.rw',
            port: 465,
            secure: true,
            auth: {
                user: "manifesto2429@manifesto24-29.rw",
                pass: "niccyh-qUhtah-nefqy4", //process.env.IRMB_SENDER_PASSWORD,
            },
            from: "manifesto2429@manifesto24-29.rw", // process.env.IRMB_SENDER_EMAIL,
        });
        return yield transporter.sendMail({
            from: "manifesto2429@manifesto24-29.rw",
            to: "higirobru@gmail.com",
            subject: "Test",
            text: "It is a test",
            // html: mjml().html,
        });
    });
}
exports.trySend = trySend;
