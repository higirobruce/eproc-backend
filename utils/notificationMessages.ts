export const prSubmitedForApproval = (prId: String) => {
  return {
    subject: "Approval request: Purchase Requisition",
    body: `<mj-text color="#525252">
                Hi there,<br>
                I hope that you are well. <br>
                I am reaching out to inform you that a new purchase request ${prId} has been submitted for your approval.<br></br>
                To review the request, please proceed to the e-procurement portal application by clicking the button below.
            </mj-text>`,
  };
};

export const prRejected = (prId: String) => {
  return {
    subject: "Your purchase request has been rejected",
    body: `<mj-text color="#525252">
                Hi there,<br>
                I hope that you are well. <br>
                I regret to inform you that your previously submitted request ${prId} has been declined.<br></br>
                For more information on this decision, please proceed to the e-procurement application by clicking the button below.
            </mj-text>`,
  };
};

export const tenderPublished = (tenderId: String) => {
    return {
      subject: "New Tender Notice",
      body: `<mjml>
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
          Greetings,<br>
          We trust that you are keeping well.<br>
          We would like to inform you that a new tender ${tenderId} has been published.<br></br><br></br>
          For more information on this tender and the related bid submission requirements, please proceed to the e-procurement application by clicking the button below.
      </mj-text>
      
            <mj-button background-color="#0063CF" href="http://192.168.20.181:3000/mainPage">Go to application</mj-button>
          </mj-column>
        </mj-section>
      
        <!-- Social icons -->
        <mj-section background-color=""></mj-section>
      
      </mj-body>
      </mjml>`,
    };
  };
