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
    host: "mail.shapeherd.rw",
    port: 465,
    auth: {
        user: "bhigiro@shapeherd.rw",
        pass: "Blessings_19891",
    },
    from: "bhigiro@shapeherd.rw"
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
const invitation = (tender) => {
    var _a;
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
                  This is to notify you that you have been invited to the awarding process of the tender ${tender === null || tender === void 0 ? void 0 : tender.number} - ${(_a = tender === null || tender === void 0 ? void 0 : tender.purchaseRequest) === null || _a === void 0 ? void 0 : _a.title}<br>
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
function send(from, to, subject, text, html, type) {
    return __awaiter(this, void 0, void 0, function* () {
        if (type === "newTender")
            return yield transporter.sendMail({
                from: from,
                to: to,
                subject: 'New Tender Published',
                text: text,
                html: mjml(newTender).html,
            });
        else if (type === "invitation")
            return yield transporter.sendMail({
                from: from,
                to: to,
                subject: 'Tender Award Invitation',
                text: text,
                html: mjml(invitation(JSON.parse(text))).html,
            });
    });
}
exports.send = send;
