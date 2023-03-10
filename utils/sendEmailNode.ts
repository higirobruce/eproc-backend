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
    <mj-column width="400px">

      <mj-text color="#525252">
        Greetings, <br />
        We trust that you are keeping well. <br/>
        We would like to inform you that a new tender has been published. <br/>
        For more information on this tender and the related bid submission requirements, 
        please proceed to the e-procurement application by clicking the button below.<br>
      </mj-text>

      <mj-button background-color="#0063CF" href="http://192.168.20.181:3000/mainPage">Go to application</mj-button>
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
    <mj-column width="400px">

      <mj-text color="#525252">
        Hi there, <br/><br/>
        Please be informed that you have been selected to be part of the team that will be 
        evaluating the bids submitted in response to ${tender?.number}.<br/>
        For details on these bids, please proceed to the e-procurement application by clicking the button below.<br/>
            
      </mj-text>

      <mj-button background-color="#0063CF" href="http://192.168.20.181:3000/mainPage">Go to application</mj-button>
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
      <mj-column width="400px">
  
        <mj-text color="#525252">
          Greetings, <br />
          Subsequent to the bids evaluation activities, please be informed that a bid has now been selected for ${tender?.number}<br/>
          As part of the bid selection team for this tender, you are requested to review the now available tender award recommendations. 
          Once all relevant stakeholders approve of these recommendations, the selected vendor will be informed of the tender award decision<br>
        </mj-text>
  
        <mj-button background-color="#0063CF" href="http://192.168.20.181:3000/mainPage">Go to application</mj-button>
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
    <mj-column width="400px">

      <mj-text color="#525252">
        Hi there, <br />
        I hope that you are well. <br/>
        I am reaching out to inform you that a new purchase request has been submitted for your approval.<br/>
        To review the request, please proceed to the e-procurement portal application by clicking the button below.<br>
      </mj-text>

      <mj-button background-color="#0063CF" href="http://192.168.20.181:3000/mainPage">Go to application</mj-button>
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
    <mj-column width="400px">

      <mj-text color="#525252">
        Hi there, <br />
        I hope that you are well. <br/>
        I regret to inform you that your previously submitted request has been declined.<br/>
        For more information on this decision, please proceed to the e-procurement application by clicking the button below.<br>
      </mj-text>

      <mj-button background-color="#0063CF" href="http://192.168.20.181:3000/mainPage">Go to application</mj-button>
    </mj-column>
  </mj-section>

  <!-- Social icons -->
  <mj-section background-color=""></mj-section>

</mj-body>
</mjml>`;

// send email
export async function send(
  from: string,
  to: string | undefined | string[],
  subject: string,
  text: string,
  html: string,
  type: string
) {
  // console.log("sent");
  if (type === "newTender")
    return await transporter.sendMail({
      from: process.env.IRMB_SENDER_EMAIL,
      to: to,
      subject,
      text,
      html: mjml(newTender).html,
    });
  else if (type === "bidEvaluationInvite")
    return await transporter.sendMail({
      from: process.env.IRMB_SENDER_EMAIL,
      to,
      subject,
      text,
      html: mjml(bidSelectionConfirmation(JSON.parse(text))).html,
    });
  else if (type === "bidSelectionConfirmation")
    return await transporter.sendMail({
      from: process.env.IRMB_SENDER_EMAIL,
      to,
      subject,
      text,
      html: mjml(invitation(JSON.parse(text))).html,
    });
  else if (type === "approval")
    return await transporter.sendMail({
      from: process.env.IRMB_SENDER_EMAIL,
      to,
      subject,
      text,
      html: mjml(approval).html,
    });
  else if (type === "rejection")
    return await transporter.sendMail({
      from: process.env.IRMB_SENDER_EMAIL,
      to,
      subject,
      text,
      html: mjml(rejection).html,
    });
}
