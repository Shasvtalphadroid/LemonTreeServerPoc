import { createRequire } from "module";
import UserData from "../models/adhaar.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";
globalThis.fetch = fetch;
import { createWorker } from 'tesseract.js';
import {
  gptImage,
  scanGPTDataAdhaarFront,
  scanGPTDataAdhaarBack,
  extractAddressFromText,
} from "./openai.js"
import { geminiScanImageData } from "./gemini.js"
import dotenv from "dotenv"
import Adhaar from "../models/adhaar.js"
import ScanData from "../models/scan.js"
import { imageExtraction } from "./imageExtraction.js"

import ID from "../models/ID.js"
import { error, log } from "console"
import { ObjectId } from "mongodb"
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_GENERATIVE_AI_API_KEY)

const require = createRequire(import.meta.url)
const { ocrSpace } = require("ocr-space-api-wrapper")

function extractNumbersFromString(inputString) {
  const numbersArray = inputString.match(/\d+/g)
  if (numbersArray) {
    const resultString = numbersArray.join("")
    return resultString
  } else {
    return "No numbers found in the string."
  }
}

async function parseData(input) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })
  const msg = input

  const inputmess = input
  async function removeAdhaar(str) {
    // Replace the word "ADHAAR" with an empty string
    var result = str.replace(/ADHAAR/g, "")
    return result
  }

  async function removebacktics(str) {
    // Replace the word "ADHAAR" with an empty string
    var result = str.replace(/```/g, "")
    return result
  }

  var outputString = await removeAdhaar(inputmess)
  // console.log(outputString)
  const prompt =
    "you will be given a string extract the four useful details name,dob,gender and idNumber only from it,dont give validity and address and convert to a object and return it remove. remember the typof the value must me object. Example of output object is as follows : {name : response from chatgpt, dob : response from chatgpt, gender : response from chatgpt, idnumber: response from chatgpt}"
  const ans = outputString
  const result = await model.generateContent([prompt, ans])
  const response = await result.response
  const finalrespose = await removebacktics(response.text())
  // const text = response.text();
  // console.log(finalrespose);
  return finalrespose
}

// Function to check if a value matches a given pattern
const checkPattern = (userData) => {
  // Regular expression patterns for each property format
  const namePattern = /^[A-Za-z\s]+$/
  const dobPattern1 = /^\d{2}\/\d{2}\/\d{4}$/
  const genderPattern = /^(Male|Female|Other)$/i // Case-insensitive match
  const adhaarNumberPattern1 = /^\d{4}\s\d{4}\s\d{4}$/
  const adhaarNumberPattern2 = /^\d{12}$/
  const dobPattern2 = /^\d{2}-\d{2}-\d{4}$/

  // Function to check if a value matches a given pattern
  function isFormatValid(value, pattern) {
    return pattern.test(value)
  }
  if (
    isFormatValid(userData.name, namePattern) &&
    (isFormatValid(userData.dob, dobPattern1) ||
      isFormatValid(userData.dob, dobPattern2)) &&
    isFormatValid(userData.gender, genderPattern) &&
    (isFormatValid(userData.adhaarNumber, adhaarNumberPattern1) ||
      isFormatValid(userData.adhaarNumber, adhaarNumberPattern2))
  ) {
    return true
  } else {
    return false
  }
}
const scanTesseract = async (imageUrl) => {
  try {
    const worker = await createWorker()
    await worker.loadLanguage("eng")
    await worker.initialize("eng")
    const {
      data: { text },
    } = await worker.recognize(imageUrl)
    await worker.terminate()
    if (text === undefined) {
      res.status(404)
    }
    // console.log(text);
    return text
  } catch (error) {
    console.log(error)
  }
}
export const scanAdhaarFront = async (req, res) => {
  const { idImage } = req.body
  try {
    if (idImage === undefined || idImage === null || idImage === "") {
      console.log("Please try again. ID Image is not given in payload")
      res.status(404).json("Please try again. ID Image is not given in payload")
    } else {
      const url = idImage

      const text = await scanTesseract(url)
      console.log("scanTesseract text : ", text)
      // const ocrdata = await ocrSpace(url,{ apiKey: 'K89692836588957'});
      // const text = ocrdata.ParsedResults[0].ParsedText;
      // console.log(text);
      const str = await scanGPTDataAdhaarFront(text)
      console.log("scanGPTDataAdhaarFront str : ", str)
      const startIndex = str.indexOf("{")
      const endIndex = str.lastIndexOf("}") + 1
      // Extract the object substring
      const objectStr = str?.substring(startIndex, endIndex)
      console.log("objectStr : ", objectStr)
      // Parse the extracted object into a JavaScript object

      if (objectStr === undefined || objectStr === null || objectStr === "") {
        res.status(404).send("Please try again. Scan string is empty")
      } else {
        const data = eval("(" + objectStr + ")")
        if (!data) {
          res
            .status(404)
            .send("Please try again. object string eval is invalid")
        } else {
          const userData = {
            name: data.name ? data.name : null,
            dob: data.dob ? data.dob : null,
            gender: data.gender ? data.gender : null,
            adhaarNumber: data.idNumber ? data.idNumber : null,
            // idImage: url,
            // photo: profilephoto ? 'data:image/jpeg;base64' + profilephoto : "https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg",
          }
          console.log("userData : ")
          console.log(userData)
          if (
            userData.name === null ||
            userData.dob === null ||
            userData.adhaarNumber === null ||
            userData.gender === null
          ) {
            res.status(404).json("Please try again. some user data is empty")
          } else if (!checkPattern(userData)) {
            res.status(404).json("Please try again. Pattern doesn't match")
          } else {
            console.log(userData)
            // const newUserData = new Adhaar(userData);
            // await newUserData.save();
            // res.status(200).json(newUserData);
            await ScanData.create({
              data: userData,
            })
            res.status(200).json(userData)
          }
        }
      }
    }
  } catch (error) {
    res.status(404).json(error)
    console.error(error)
  }
}

/**
 * Scans the back side of the Adhaar card and updates the guest information
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
export const scanAdhaarBack = async (req, res) => {
  try {
    // Log the request body
    console.log("Request body:", req.body)
    const { idImage, frontSideData, guestId, contactNumber } = req.body
    // Log the guest ID
    console.log("Guest ID:", guestId)

    // Check if ID image is missing or empty
    if (!idImage) {
      console.log("ID image is missing or empty")
      res.status(404).send("Please try again")
      return
    }

    const url = idImage
    // Log the image URL being scanned
    console.log("Scanning image at URL:", url)

    // Use Tesseract to scan text from the image
    const text = await scanTesseract(url)
    // Log the text from the image
    console.log("Text from image:", text)

    // Use GPT to scan data from the text
    const str = await extractAddressFromText(text)
    // Log the scanned GPT data
    console.log("Scanned GPT data:", str)

    // Extract the object string from the scanned data
    const startIndex = str.indexOf("{")
    const endIndex = str.lastIndexOf("}") + 1
    const objectStr = str.substring(startIndex, endIndex)

    // Check if the scanned string is empty
    if (!objectStr) {
      console.log("Scanned string is empty")
      res.status(404).send("Please try again. Scan string is empty")
      return
    }

    // Evaluate the object string
    const data = eval("(" + objectStr + ")")
    // Log the evaluated data
    console.log("Evaluated data:", data)

    // Check if the evaluated data is valid
    if (!data) {
      console.log("Invalid evaluated data")
      res.status(404).send("Please try again. object string eval is invalid")
      return
    }

    const address = data
    console.log({ address },frontSideData)

    // Check if some user data is empty
    if (address === null && !checkPattern(frontSideData)) {
      console.log("Some user data is from adhar front is empty or invalid")
      res.status(404).json({
        error: "ome user data is from adhar front is empty or invalid",
        data: data,
      })
      return
    }
    // Split the name into first and last name
    const nameParts = frontSideData.name.split(" ")
    const lastName = nameParts.length > 1 ? nameParts.pop() : ""
    const firstName = nameParts.join(" ")
    const newUserData = {
      address: JSON.stringify(address),
      firstName: firstName,
      lastName: lastName,
      name: frontSideData.name,
      idType: "Adhaar",
      dob: frontSideData.dob,
      nationality: "INDIA",
      guestPicture: frontSideData.photo,
      dateOfIssue: null,
      dateOfExpiry: null,
      idUploaded: true,
    }
    console.log({ newUserData })

    // Find the ID document by primary booker contact number
    const id = await ID.findOne({
      primaryBookerContactNumber: contactNumber,
    })
    var guests = id.guestList
    // Find the index of the guest in the guest list
    const index = guests.findIndex((obj) => obj._id.toString() === guestId)
    // Update the guest information if found
    if (index !== -1) {
      guests[index] = { ...newUserData, ...guests[index] }
    }
    // Update the guest list in the ID document
    var updatedguest = await ID.findOneAndUpdate(
      { primaryBookerContactNumber: contactNumber },
      { guestList: guests },
      { new: true }
    )
    // Create a new scan data entry
    await ScanData.create({
      data: newUserData,
    })
    res.status(200).json(updatedguest)
  } catch (error) {
    // Log and handle any errors
    console.log("Error occurred:", error)
    res.status(404).json(error)
    console.error(error)
  }
}

