const nodemailer = require("nodemailer");
const mjml = require("mjml");

// create transporter object with smtp server details
const transporter = nodemailer.createTransport({
  host: "mail.shapeherd.rw",
  port: 465,
  auth: {
    user: "bhigiro@shapeherd.rw",
    pass: "Blessings_19891",
  },
  from:"bhigiro@shapeherd.rw"
});

const newTender = `<mjml>
<mj-body>
    <!-- Company Header -->
    <mj-section background-color="#f0f0f0">
    <mj-column>
        <mj-text align='center'  font-style=""
                font-size="20px"
                color="#626262">
        Irembo Procure
        </mj-text>
    </mj-column>
    </mj-section>

    <!-- Image Header -->
    <mj-section>
    <mj-column width="600px">
            <mj-text  align="center"
                color="#626262"
                font-size="30px"
                font-family="Helvetica Neue">A new Tender is published</mj-text>
    </mj-column>
    </mj-section>
    

    <!-- Intro text -->
    <mj-section background-color="#fafafa">
        <mj-column width="400px">
            
            <mj-text color="#525252">
                Good day, <br/><br/>
                This is to notify you that a new tender has been published. We believe you are among those that can do the work. Please have a look by clicking on the below button.<br>
            </mj-text>
            

             

            <mj-button background-color="#053566"  href="http://${process.env.NODE_LOCAL_HOST}:3000/reset">Go to application</mj-button>
    </mj-column>
    </mj-section>

    <!-- Social icons -->
    <mj-section background-color="#f0f0f0"></mj-section>

</mj-body>
</mjml>`;

const invitation = (tender:any) => {
  return `<mjml>
  <mj-body>
      <!-- Company Header -->
      <mj-section background-color="#f0f0f0">
      <mj-column>
          <mj-text align='center'  font-style=""
                  font-size="20px"
                  color="#626262">
          Irembo Procure
          </mj-text>
      </mj-column>
      </mj-section>
  
      <!-- Image Header -->
      <mj-section>
      <mj-column width="600px">
              <mj-text  align="center"
                  color="#626262"
                  font-size="30px"
                  font-family="Helvetica Neue">You have been invited to a tender award process.</mj-text>
      </mj-column>
      </mj-section>
      
  
      <!-- Intro text -->
      <mj-section background-color="#fafafa">
          <mj-column width="400px">
              
              <mj-text color="#525252">
                  Good day, <br/><br/>
                  This is to notify you that you have been invited to the awarding process of the tender ${tender?.number} - ${tender?.purchaseRequest?.title}<br>
              </mj-text>
              
               
  
              <mj-button background-color="#053566"  href="http://${process.env.NODE_LOCAL_HOST}:3000/reset">Go to application</mj-button>
      </mj-column>
      </mj-section>
  
      <!-- Social icons -->
      <mj-section background-color="#f0f0f0"></mj-section>
  
  </mj-body>
  </mjml>`;
};

// send email
export async function send(
  from: string,
  to: string,
  subject: string,
  text: string,
  html: string,
  type: string
) {
  if (type === "newTender")
    return await transporter.sendMail({
      from: from,
      to: to,
      subject: 'New Tender Published',
      text: text,
      html: mjml(newTender).html,
    });
  else if (type === "invitation")
    return await transporter.sendMail({
      from: from,
      to: to,
      subject: 'Tender Award Invitation',
      text: text,
      html: mjml(invitation(JSON.parse(text))).html,
    });
}
