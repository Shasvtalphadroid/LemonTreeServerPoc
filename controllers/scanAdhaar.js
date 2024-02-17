import { createRequire } from "module";
import UserData from "../models/adhaar.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";
globalThis.fetch = fetch;
import { createWorker } from 'tesseract.js';
import { gptImage, scanGPTDataAdhaarFront, scanGPTDataAdhaarBack } from "./openai.js";
import { geminiScanImageData } from "./gemini.js";
import dotenv from "dotenv";
import Adhaar from "../models/adhaar.js";
import { imageExtraction } from "./imageExtraction.js";


import ID from "../models/ID.js";
import { error } from "console";
import { ObjectId } from "mongodb";
dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_GENERATIVE_AI_API_KEY);


const require = createRequire(import.meta.url);
const { ocrSpace } = require('ocr-space-api-wrapper');



function extractNumbersFromString(inputString) {
  const numbersArray = inputString.match(/\d+/g);
  if (numbersArray) {
    const resultString = numbersArray.join("");
    return resultString;
  } else {
    return "No numbers found in the string.";
  }
}

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

  var outputString = await removeAdhaar(inputmess);
  // console.log(outputString)
  const prompt = "you will be given a string extract the four useful details name,dob,gender and idNumber only from it,dont give validity and address and convert to a object and return it remove. remember the typof the value must me object. Example of output object is as follows : {name : response from chatgpt, dob : response from chatgpt, gender : response from chatgpt, idnumber: response from chatgpt}";
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
  const dobPattern1 = /^\d{2}\/\d{2}\/\d{4}$/;
  const genderPattern = /^(Male|Female|Other)$/i; // Case-insensitive match
  const adhaarNumberPattern1 = /^\d{4}\s\d{4}\s\d{4}$/;
  const adhaarNumberPattern2 = /^\d{12}$/;
  const dobPattern2 = /^\d{2}-\d{2}-\d{4}$/;


  // Function to check if a value matches a given pattern
  function isFormatValid(value, pattern) {
    return pattern.test(value);
  }
  if (
    isFormatValid(userData.name, namePattern) &&
    (isFormatValid(userData.dob, dobPattern1) || isFormatValid(userData.dob, dobPattern2)) &&
    isFormatValid(userData.gender, genderPattern) && 
    (isFormatValid(userData.adhaarNumber, adhaarNumberPattern1) || isFormatValid(userData.adhaarNumber, adhaarNumberPattern2))
  ) {
    return true;
  } else {
    return false;
  }

}
const scanTesseract = async (imageUrl) => {
  try {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(imageUrl);
    await worker.terminate();
    if (text === undefined) {
      res.status(404)
    }
    // console.log(text);
    return text;
  } catch (error) {
    console.log(error);
  }
}
export const scanAdhaarFront = async (req, res) => {
  const { idImage } = req.body;
  try {
    if (idImage === undefined || idImage === null || idImage === "") {
      res.status(404).json("Please try again");
    }
    else {
      const url = 'data:image/jpg;base64,' + idImage;
      const text = await scanTesseract(url);
      // const ocrdata = await ocrSpace(url,{ apiKey: 'K89692836588957'});
      // const text = ocrdata.ParsedResults[0].ParsedText;
      // console.log(text);
      const str = await scanGPTDataAdhaarFront(text);
      const startIndex = str.indexOf('{');
      const endIndex = str.lastIndexOf('}') + 1;
      // Extract the object substring
      const objectStr = str?.substring(startIndex, endIndex);
      // Parse the extracted object into a JavaScript object

      if (objectStr === undefined || objectStr === null || objectStr==="") {
        res.status(404).send("Please try again")
      }
      else {
          const data = eval('(' + objectStr + ')');
          if (!data) {
            res.status(404).send("Please try again")
          }
          else {
            const userData = {
              name: data.name ? data.name : null,
              dob: data.dob ? data.dob : null,
              gender: data.gender ? data.gender : null,
              adhaarNumber: data.idNumber ? data.idNumber : null,
              // idImage: url,
              // photo: profilephoto ? 'data:image/jpeg;base64' + profilephoto : "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",
            }
            if (userData.name === null || userData.dob === null || userData.adhaarNumber === null || userData.gender === null) {
              res.status(404).json("Please try again")
            }
            else if(!checkPattern(userData)) {
              res.status(404).json("Please try again");
            }
            else {
              // console.log(userData);
              // const newUserData = new Adhaar(userData);
              // await newUserData.save();
              // res.status(200).json(newUserData);
              res.status(200).json(userData);
            }
          }
      }
    }
  } catch (error) {
    res.status(404).json(error);
    console.error(error);
  }
}



export const scanAdhaarBack = async (req, res) => {
  const { idImage, frontSideData, guestId, contactNumber } = req.body;
  console.log(guestId);
  try {
    if (idImage === undefined || idImage === null || idImage === "") {
      res.status(404).send("Please try again")
    }
    else {
      const url = 'data:image/jpeg;base64,' + idImage;
      // const ocrdata = await ocrSpace(url,{ apiKey: 'K89692836588957'});
      // const text = ocrdata.ParsedResults[0].ParsedText;
      const text = await scanTesseract(url);
      const str = await scanGPTDataAdhaarBack(text);
      // console.log(str);
      const startIndex = str.indexOf('{');
      const endIndex = str.lastIndexOf('}') + 1;
      // Extract the object substring
      const objectStr = str.substring(startIndex, endIndex);
      if (objectStr === undefined || objectStr === null || objectStr === "") {
        res.status(404).send("Please try again")
      }
      else {
        // Parse the extracted object into a JavaScript object
        const data = eval('(' + objectStr + ')');
        if (!data) {
          res.status(404).json("Please try again")
        }
        else {
          // const data = JSON.parse(data);
          if (data.address === null || !checkPattern(frontSideData)) {
            res.status(404).json("Please try again");
          }
          else {
            const nameParts = frontSideData.name.split(' ');
            const lastName = nameParts.length > 1 ? nameParts.pop() : '';
            const firstName = nameParts.join(' ');
            const newUserData = {
              address: data.address,
              firstName: firstName,
              lastName: lastName,
              name: frontSideData.name,
              idType: "Adhaar",
              // idImage: frontSideData.idImage,
              dob: frontSideData.dob,
              nationality: "INDIA",
              guestPicture: frontSideData.photo,
              dateOfIssue: null,
              dateOfExpiry: null,
              idUploaded: true,
            }

            const id = await ID.findOne({ primaryBookerContactNumber: contactNumber });
            var guests = id.guestList;
            const index = guests.findIndex(obj => obj._id.toString() === guestId);
            if (index !== -1) {
              guests[index] = { ...newUserData, ...guests[index] };
            }
            var updatedguest = await ID.findOneAndUpdate({ primaryBookerContactNumber: contactNumber }, { guestList: guests }, { new: true });
            res.status(200).json(updatedguest);
          }
        }
      }
    }
  } catch (error) {
    res.status(404).json(error);
    console.error(error);
  }
}

