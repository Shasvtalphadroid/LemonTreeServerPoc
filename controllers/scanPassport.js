import { createRequire } from "module";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";
globalThis.fetch = fetch;
import { createWorker } from 'tesseract.js';
import { gptImage, scanGPTData } from "./openai.js";
import { geminiScanImageData } from "./gemini.js";
import dotenv from "dotenv";
import Passport from "../models/passport.js";
import { imageExtraction } from "./imageExtraction.js";
import ID from "../models/ID.js";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_GENERATIVE_AI_API_KEY);


const require = createRequire(import.meta.url);
const { ocrSpace } = require('ocr-space-api-wrapper');


async function parseData(input) {

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const msg = input;

      const inputmess = input;
      async function removeAdhaar(str) {
        // Replace the word "ADHAAR" with an empty string
        var result = str.replace(/ADHAAR/g, '');
        return result;
      }

      async function removebacktics(str) {
        // Replace the word "ADHAAR" with an empty string
        var result = str.replace(/```/g, '');
        return result;
      }

      var outputString =await removeAdhaar(inputmess);
      // console.log(outputString)
      const prompt = "Given a string extract the releavent information(name,dob,address,gender,validity)from it and convert to a json object.";
      const ans = outputString;
      const result = await model.generateContent([prompt, ans]);
      const response = await result.response;
      const finalrespose = await removebacktics(response.text());
      // const text = response.text();
      // console.log(finalrespose);
      return finalrespose;
}



// Function to check if a value matches a given pattern
const checkPattern = (userData) => {

// Regular expression patterns for each property format
const namePattern = /^[A-Za-z\s]+$/;
const dobPattern = /^\d{2}\/\d{2}\/\d{4}$/;
const genderPattern = /^(Male|Female|Other)$/i; 
const expiryDatePattern = /^\d{2}\/\d{2}\/\d{4}$/;
// Function to check if a value matches a given pattern
function isFormatValid(value, pattern) {
    return pattern.test(value);
}

if (
    isFormatValid(userData.name, namePattern) &&
    isFormatValid(userData.dob, dobPattern) &&
    isFormatValid(userData.gender, genderPattern) &&
    isFormatValid(userData.nationality,namePattern) &&
    isFormatValid(userData.dateOfExpiry,expiryDatePattern) && 
    isFormatValid(userData.dateOfIssue,expiryDatePattern)
) {
    return true;
} else {
    return false;
}

}
const scanTesseract = async (imageUrl) => {
  try{
    const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(imageUrl);
      await worker.terminate();
      if(text===undefined){
        return "";
      }
      // console.log(text);
      return text;
  }catch(error){
    console.log(error);
  }
}

export const scanPassport = async (req, res, next) =>{
  // console.log(req.body);
  const { idImage,guestId,contactNumber } = req.body;
  try {
    if(idImage===undefined || idImage===null || idImage===""){
      res.status(404).send("Please try again")
    }
    const url = 'data:image/jpeg;base64,'+idImage;
    // const profilephoto = await imageExtraction(idImage);

    // const ocrdata = await ocrSpace(url,{ apiKey: 'K89692836588957'});
    // const text = ocrdata.ParsedResults[0].ParsedText;
      const text = await scanTesseract(url);
      // const text = await gptImage(url);
      // const data = geminiScanImageData(url);
      console.log(text);
    //   const str = await scanGPTData(text);
      // const str = geminiScanImageData(text);
      const prompt = `Analyze the given string and logicaly Extract the releavent information (name,dob,address,gender,dateOfExpiry,dateOfIssue,country) from the given string and return it as a js object. The string is as follows :`;
      const str = await scanGPTData({userData:text,prompt:prompt});
      console.log(str);
      const startIndex = str.indexOf('{');
      const endIndex = str.lastIndexOf('}') + 1;
      // Extract the object substring
      const objectStr = str.substring(startIndex, endIndex);
      if (objectStr === undefined || objectStr === null || objectStr === "") {
        res.status(404).send("Please try again")
      }
      else{
      // Parse the extracted object into a JavaScript object
      const data = eval('(' + objectStr + ')');
      console.log(data);
      if(!data){
        res.status(400).send("Please try again")
      }
      var userData = {
        name : data.name ? data.name : null,
        dob: data.dob? data.dob : null,
        dateOfExpiry: data.dateOfExpiry ? data.dateOfExpiry : null,
        dateOfIssue: data.dateOfIssue ? data.dateOfIssue : null,
        address: data.address ? data.address : null,
        nationality: data.country ? data.country : null,
        gender : data.gender? (data.gender === ('F' || 'FEMALE') ? 'Female' : 'Male') : null
        // photo: profilephoto ? 'data:image/jpeg;base64'+profilephoto : "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",

      }

      if(userData.dob === null|| userData.nationality === null || userData.gender === null || userData.name ===null  || userData.dateOfExpiry === null || userData.dateOfIssue === null || data.address === null){
        res.status(400).send("Please try again")

      }
      else if(!checkPattern(userData)){
        res.status(400).send("Please try again")

      }
      else{
        const nameParts = userData.name.split(' ');
        const lastName = nameParts.length > 1 ? nameParts.pop(): '';
        const firstName = nameParts.join(' ');
        console.log(userData);
        userData = {
          ...userData,
          firstName: firstName,
          lastName: lastName,
          idType: "Passport",
          idImage: url,
          idUploaded: true,
        }
        console.log(userData);
        const id = await ID.findOne({ primaryBookerContactNumber: contactNumber});
        // console.log(id);
        var guests = id.guestList;
        // console.log(guests[0]._id.toString());
        const index = guests.findIndex(obj => obj._id.toString() === guestId);
        // console.log(index);
        if (index !== -1) {
          guests[index] = { ...userData, ...guests[index] };
        }
        // console.log(guests);
        var updatedguest = await ID.findOneAndUpdate({ primaryBookerContactNumber: contactNumber }, { guestList: guests }, { new: true });
        console.log(updatedguest);
        res.status(200).json(updatedguest);
      }
    }
    }catch (error) {
      console.error(error);
      res.status(400).json(error)
    }

  }

