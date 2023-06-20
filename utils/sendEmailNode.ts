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

const newTender = (newTender: any) => `<mjml>
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

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/tenders/${newTender?._id}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;

const invitation = (tender: any) => {
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
        evaluating the bids submitted in response to ${tender?.number}.<br/>
        For details on these bids, please proceed to the e-procurement application by clicking the button below.<br/>
            
      </mj-text>

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/tenders/${tender?._id}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>
`;
};

const bidSelectionConfirmation = (tender: any) => {
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
          Subsequent to the bids evaluation activities, please be informed that a bid has now been selected for ${tender?.number}<br/>
          As part of the bid selection team for this tender, you are requested to review and approve the now available tender award recommendations. 
          Once all relevant stakeholders approve of these recommendations, the selected vendor will be informed of the tender award decision<br>
        </mj-text>
  
        <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/tenders/${tender?._id}>Go to application</mj-button>
      </mj-column>
    </mj-section>
  
    <!-- Social icons -->
    <mj-section background-color=""></mj-section>
  
  </mj-body>
  </mjml>`;
};

const prApproval = (pr: any) => `<mjml>
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

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/requests/${pr?._id}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;

const paymentRequestApproval = (pr: any) => `<mjml>
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
        I am reaching out to inform you that a new purchase request (Req Number ${pr?.number}) has been submitted for your approval.<br/><br/>
        To review the request, please proceed to the e-procurement portal application by clicking the button below.<br>
      </mj-text>

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/payment-requests/${pr?._id}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;

const prRejection = (pr: any) => `<mjml>
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

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/requests/${pr?._id}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;

const newUserAccount = (cred: any) => {
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
        Username: ${cred?.email}<br/>
        Password: <i>${cred?.password}</i> <br/><br/>
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

const passwordReset = (cred: any) => {
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
        
        Your new Password is <i>${cred?.password}</i> <br/><br/>

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

const passwordRecovery = (emailObj: any) => {
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
          Hi there, ${emailObj?.user?.firstName} <br /><br />
          Someone has requested a link to change your password in Irembo Procure. You can do this through the link below.<br /><br />

        </mj-text>

        <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/auth/reset-password?userId=${emailObj?.user?._id}&token=${emailObj?.token}>Reset password</mj-button>

        <mj-text color="#525252">
          If you didn't request this, please ignore this email. <br /><br />
          Your password won't change until you access the link above and create a new one.

        </mj-text>

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
};

const preGoLive = (emailObj: any) => {
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
          Hi, ${emailObj?.user?.firstName} <br /><br />
          Following up from our prior announcement, we are happy to announce that the new e-Procurement platform is now live.<br /><br />

          To ease your transition onto the new application, we have already created your account. To access the application, simply reset your password by following these steps:<br />
          <ul>
            <li>Click the button below</li>
            <li>Supply the new password (at least 8 characters) and press "Recover password"</li>
            <li>Finally login with your email and the new password.</li>
          </ul><br /><br />

        </mj-text>

        <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/auth/reset-password?userId=${emailObj?.user?._id}&token=${emailObj?.token}>Reset password</mj-button>

        <mj-text color="#525252">

          Hope you enjoy the new application!<br /><br />
          Kindly contact us by replying to this email, if you have any questions or concerns.<br />


        </mj-text>

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
};

const externalSignature = (emailObj: any, subject: any) => {
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

        Username: ${emailObj?.email}<br/>
        Password: <i>${emailObj?.password}</i> <br/><br/>
      </mj-text>

      <mj-button background-color="#0063CF" href=${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/${emailObj.docType}/${emailObj.docId}>Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;
};

const internalSignature = (emailObj: any) => {
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

const contractReview = (emailObj: any) => {
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

const externalSignaturePO = (cred: any) => {
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

        Username: ${cred?.email}<br/>
        Password: <i>${cred?.password}</i> <br/><br/>
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
export async function send(
  from: string,
  to: string | undefined | string[] | String,
  subject: string,
  text: string,
  html: string,
  type: string
) {
  // console.log("sent");
  try {
    if (type === "newTender")
      return await transporter.sendMail({
        from: process.env.IRMB_SENDER_EMAIL,
        bcc: to,
        subject,
        text,
        html: mjml(newTender(JSON.parse(text))).html,
      });
    else if (type === "bidEvaluationInvite")
      return await transporter.sendMail({
        from: process.env.IRMB_SENDER_EMAIL,
        bcc: to,
        subject,
        text,
        html: mjml(invitation(JSON.parse(text))).html,
      });
    else if (type === "bidSelectionConfirmation")
      return await transporter.sendMail({
        from: process.env.IRMB_SENDER_EMAIL,
        to,
        subject,
        text,
        html: mjml(bidSelectionConfirmation(JSON.parse(text))).html,
      });
    else if (type === "approval")
      return await transporter.sendMail({
        from: process.env.IRMB_SENDER_EMAIL,
        to,
        subject,
        text,
        html: mjml(prApproval(JSON.parse(text))).html,
      });
      else if (type === "payment-request-approval")
      return await transporter.sendMail({
        from: process.env.IRMB_SENDER_EMAIL,
        to,
        subject,
        text,
        html: mjml(prApproval(JSON.parse(text))).html,
      });
    else if (type === "rejection")
      return await transporter.sendMail({
        from: process.env.IRMB_SENDER_EMAIL,
        to,
        subject,
        text,
        html: mjml(prRejection(JSON.parse(text))).html,
      });
    else if (type === "newUserAccount")
      return await transporter.sendMail({
        from: process.env.IRMB_SENDER_EMAIL,
        to,
        subject,
        text,
        html: mjml(newUserAccount(JSON.parse(text))).html,
      });
    else if (type === "passwordReset")
      return await transporter.sendMail({
        from: process.env.IRMB_SENDER_EMAIL,
        to,
        subject,
        text,
        html: mjml(passwordReset(JSON.parse(text))).html,
      });
    else if (type === "passwordRecover")
      return await transporter.sendMail({
        from: process.env.IRMB_SENDER_EMAIL,
        to,
        subject,
        text,
        html: mjml(passwordRecovery(JSON.parse(text))).html,
      });

      else if (type === "preGoLive")
      return await transporter.sendMail({
        from: process.env.IRMB_SENDER_EMAIL,
        bcc:to,
        subject,
        text,
        html: mjml(preGoLive(JSON.parse(text))).html,
      });
    else if (type === "externalSignature")
      return await transporter.sendMail({
        from: process.env.IRMB_SENDER_EMAIL,
        to,
        subject,
        text,
        html: mjml(externalSignature(JSON.parse(text), subject)).html,
      });
    else if (type === "internalSignature")
      return await transporter.sendMail({
        from: process.env.IRMB_SENDER_EMAIL,
        to,
        subject,
        text,
        html: mjml(internalSignature(JSON.parse(text))).html,
      });
      else if (type === "contractReview")
      return await transporter.sendMail({
        from: process.env.IRMB_SENDER_EMAIL,
        to,
        subject,
        text,
        html: mjml(contractReview(JSON.parse(text))).html,
      });
  } catch (err) {
    console.log(err)
  }
}

//test email
export async function trySend() {
  return await transporter.sendMail({
    from: "e-procurement@irembo.com", //process.env.IRMB_SENDER_EMAIL,
    to: "higirobru@gmail.com",
    subject: "Test",
    text: "It is a test",
    // html: mjml().html,
  });
}
