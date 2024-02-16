export const avatarSpeakScreen = async (req, res) => {
    const screenId = req?.query?.screenId;
    const type = req?.query?.type;
    let message = "";
    if (screenId === "frame1" && type === "welcome") {
        message = "Hello & Welcome. I am your assistant mark. How may I help you today?" 
    } else if (screenId === "frame2" && type === "name") {
        message = "Please enter the First Name and Last Name. In case of Company Booking First Name will be Company’s Name"
    } else if (screenId === "frame2" && type === "confirm") {
        message = "Please enter the details"
    } else if (screenId === "frame2" && type === "incorrect") {
        message = "Incorrect details, please enter the details again"
    } else if (screenId === "frame2" && type === "earlycheckin") {
        message = "Arrived tad bit early? No problem. Please contact our reception. They will help you"
    } else if (screenId === "frame3" && type === "contact") {
        message = "Please enter the Contact Number"
    } else if (screenId === "frame4" && type === "bookingfound") {
        const name = req?.query?.name;
        const room = req?.query?.room;
        const type = req?.query?.type;
        const indate = req?.query?.indate;
        const outdate = req?.query?.outdate;
        message = `Yay! Booking Found. The booking is under ${name}. You have booked ${room}. Your booking is for ${type}. The Check-In and Check-Out dates are from ${indate} to ${outdate}`
    } else if (screenId === "frame5" && type === "idproof") {
        message = "Please show the ID proof on camera. If you are an Indian citizen, you can show Adhaar Card or Driving License or Voter Id card or Passport. If you are Foreign national its mandate to show Visa, Passport and Arrival Stamp."
    } else if (screenId === "frame6" && type === "scan") {
        message = "To scan IDs click on scan Id"
    } else if (screenId === "frame6a" && type === "front") {
        message = "Please show the front side of your ID on camera"
    } else if (screenId === "frame6a" && type === "frontsuccess") {
        message = "Frontside captured successfully, now show the backside of ID on camera"
    } else if (screenId === "frame6a" && type === "frontfail") {
        message = "Please show the Front side of ID again"
    } else if (screenId === "frame6a" && type === "frontmismatch") {
        message = "Invalid ID. Please show a valid ID"
    } else if (screenId === "frame6a" && type === "backsidesuccess") {
        message = "Backside captured successfully. Both sides of ID are captured"
    } else if (screenId === "frame6a" && type === "backsidemismatch") {
        message = "Invalid ID. Please show a valid ID"
    } else if (screenId === "frame6a" && type === "backsidefail") {
        message = "Please show the Back side of ID again"
    } else if (screenId === "frame118" && type === "thankyou") {
        message = "All Guest ID taken. Thank you for your patience"
    }  else if (screenId === "frame6a" && type === "scanfailure") {
        message = "Please show the Front/Back of ID (Whichever side was not captured)”  “Please show the frontside and Backside of IDs again”, If both sides were not captured properly";
    } else if (screenId === "frame6latency" && type === "retry") {
        message = "Please show the Front Side of the ID on camera and click upload button";
    } else if (screenId === "frame6latency" && type === "frontsidecaptured") {
        message = "Frontside captured.";
    } else if (screenId === "frame6latency" && type === "backsideshow") {
        message = "Please show the Back Side of the ID on camera and click upload button";
    } else if (screenId === "frame6latency" && type === "backsidecaptured") {
        message = "Backside captured.";
    } else if (screenId === "frame6latency" && type === "scanfailure") {
        message = "Please show the Front/Back of ID (Whichever side was not captured)”  “Please show the frontside and Backside of IDs again”, If both sides were not captured properly";
    } else if (screenId === "frame6latency" && type === "twoattemptsfail") {
        message = "Sorry, ID scan is not successful please contact reception";
    } else if (screenId === "frame6a" && type === "twoattemptsfail") {
        message = "Sorry, ID scan is not successful please contact reception";
    } else if (screenId === "frame6latency" && type === "finishscanpending") {
        message = "Please wait IDs are being verified";
    } else if (screenId === "frame6latency" && type === "finishunsuccessful") {
        message = "You can’t proceed, please re-upload the failed IDs";
    } else if (screenId === "frame122" && type === "paymentscomplete") {
        message = "All your payments are complete";
    } else if (screenId === "frame123" && type === "paymentpending") {
        message = "Your booking amount is pending. Please select your mode of payment";
    } else if (screenId === "frame123" && type === "later") {
        message = "Your details have been registered. Please contact reception to proceed further";
    } else if (screenId === "frame06a" && type === "qrcodescan") {
        message = "Please scan this QR code and make payment";
    } else if (screenId === "frame06a" && type === "delay") {
        message = "Please scan the QR for payment, else you can go back to previous page and select another payment method.";
    } else if (screenId === "frame140" && type === "paymentsuccess") {
        message = "Your Payment is successful";
    } else if (screenId === "frame120" && type === "checkincomplete") {
        message = "Check in process completed. Please contact reception for key collection or any other help.";
    } else if (screenId === "frame126" && type === "ratingexperience") {
        message = "Please rate your Check-In experience";
    }
    res.status(200).json({
        message
    })
}