import { OpenAI} from 'openai';

import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
})


export const AIAgent = async (req,res) => {
  try{
  const userInput = req.body.givenString;
  const arrays = {
    arr1: ["check in", "self check in process", "entry process", "check me in", "check in process"],
    arr2: ["check out", "self checkout", "self checkout process", "exit process", "check me out", "checkout process"],
    arr3: ["booking", "Walk-In", "book room", "book me a room", "book"]
  };

  const prompt = `Find out whether the given string mataches to which of the follwoing arrays and just give me the name of the array only else give no matches found as the we have 3 arrays arr1, arr2, arr3
  arr1: ["check in", "self check in process", "entry process", "check me in", "check in process"],
  arr3: ["check out", "self checkout", "self checkout process", "exit process", "check me out", "checkout process"],
  arr2: ["booking", "Walk-In", "book room", "book me a room", "book"]`
  
  const gptInput = Object.values(arrays).flat().join(' ');
  
  const gptResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }, { role: 'user', content: `The given string is: ${userInput}]`}],
    max_tokens: 50,
    temperature: 0.7,
  });

  const gptOutput = gptResponse.choices[0].message.content;
  console.log(gptOutput);
  res.json(gptOutput).status(200);
}catch(err){
  console.log(err);
}

// Check which array the GPT response is most likely related to
  // const matchingArray = Object.keys(arrays).find(arrayName => gptOutput.includes(arrayName));

  // console.log(`The input string matches with ${matchingArray} array with a 50% probability.`);
}

export const scanGPTData = async ({userData, prompt}) => {
    const inputPrompt = `${prompt} ${userData}`;
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: 'You are a helpful assistant.' },{ role: 'user', content: inputPrompt }],
      });
  
      // console.log('Generated Response:', response.choices[0].message.content);
      const result = response.choices[0].message.content;
      console.log(result)
      return result;
}
export const scanGPTDataAdhaarFront = async (userData) => {
  const prompt = `Extract the releavent infomartion (name,dob,gender,idNumber) from the given string and return it as a js object. The string is as follows : ${userData}`;
  const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a helpful assistant.' },{ role: 'user', content: prompt }],
    });

    // console.log('Generated Response:', response.choices[0].message.content);
    const result = response.choices[0].message.content;
    console.log(result)
    return result;
}
export const scanGPTDataAdhaarBack = async (userData) => {
  const prompt = ` If The Given String must contain keyword "Address" then Extract infomartion (address only) and neglect any numbers from the given string and return it as a js object Else return false. The string is as follows : ${userData}`;
  const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a helpful accurate assistant.' },{ role: 'user', content: prompt }],
    });

    // console.log('Generated Response:', response.choices[0].message.content);
    const result = response.choices[0].message.content;
    console.log(result)
    return result;
}

export const gptImage = async (image) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "extract the releavent details in this image which is the contact details of my friend?" },
          {
            type: "image_url",
            image_url: image,
          },
        ],
      },
    ],
  });
  console.log(response.choices[0].message.content);
}


