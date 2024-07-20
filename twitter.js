const { TwitterApi } = require("twitter-api-v2");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const client = new TwitterApi({
  appKey: "3B1yLx2ZoROA3Ol628D7t8mVV",
  appSecret: "SjSw4bIzsPQkrRJB8Ify6uUJ8nrONxgVWskBk4AVdhLtk8sS8c",
  accessToken: "1218542813438251009-pFdma05coCTH9OX3cguYQmZsRPOjBo",
  accessSecret: "Z3ocWT1F68ZsdHj0IjjQJ7UwXkI0LaEu0TmQXvnJ7SdcF",
  bearerToken: "AAAAAAAAAAAAAAAAAAAAAHuAuQEAAAAAvVRwKNZvGH1jUVtg6IDYU5mvMP0%3Dq7QUhin8h4kICId7tmXOHPomfR5J3WiAywjJsiqb0mAkcqt3k0",
  // clientId: "Tm8xanEzZ0hIMkw0VlFkZ2k3OXg6MTpjaQ",
  // clientSecret: "ei5bRB7sDUK5nicRW6ZUXQbxob1qrNC_TUnCpbM7dRKPeaDWlb"
});

async function downloadImage(url, savePath) {
  try {
    // Make a GET request to the image URL
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });

    // Ensure the directory exists
    const dir = path.dirname(savePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create a write stream to save the image
    const writer = fs.createWriteStream(savePath);

    // Pipe the response data to the write stream
    response.data.pipe(writer);

    // Return a promise that resolves when the stream is finished
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading image: ${error}`);
    throw error;
  }
}

const textTweet = async (content, url = '') => {

  const rwClient = client.readWrite;

  if (url) {
    try {
      const imageName = uuidv4();
      await downloadImage(url, './image/' + imageName);

      const mediaId = await client.v1.uploadMedia("./image/" + imageName);
      await rwClient.v2.tweet({
        text: content,
        media: { media_ids: [mediaId] },
      });

      return;
    }
    catch (e) {
      console.log(e);
    }
  }

  try {
    await rwClient.v2.tweet(content);
    console.log("success");
  } catch (error) {
    console.error(error);
  }

};
module.exports = textTweet
// textTweet("Western Multinationals Fleeing Nigeria Are Being Replaced by Asian and Turkish Firms\n\nFind out more here: https://www.chartmill.com//news/LSE:DGE/bloomberg-2024-6-18-western-multinationals-fleeing-nigeria-are-being-replaced-by-asian-and-turkish-firms", "https://www.chartmill.com/image.php?imageurl=https%3A%2F%2Fassets.bwbx.io%2Fimages%2Fusers%2FiqjWHBFdfxIU%2FiY7mIDjyKVV4%2Fv1%2F1200x800.jpg")