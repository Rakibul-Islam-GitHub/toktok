const { prisma } = require("../../../../../../prisma/prisma");

import { getSession } from "next-auth/react";
import { IncomingForm } from "formidable";
import fs from "fs";
import open from 'open'
import { createNecessaryDirectoriesSync } from "filesac";
import { oAuth } from "./oauth2callback";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function UploadFile(req, res) {
  //   const session = await getSession({ req });

  const { id } = req.query;
// console.log('from upload',id);
  const  uploadPath = `./public/storage/tickets/${id}`;
  await createNecessaryDirectoriesSync(`${uploadPath}/x`);

  try {
     const form =await new IncomingForm({
      uploadDir: `./storage`,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      // console.log(files.file);
      const f = files.file;

      const u = `${uploadPath}/${f.originalFilename}`;

      fs.rename(`./storage/${f.newFilename}`, u, async function (err) {
        if (err) throw err;
        console.log("Successfully renamed - AKA moved!");

// console.log(files.file);

const filename = f.originalFilename
        let title= fields.title
        let description= fields.details+ ' And the ticket ID was: '+ id
        let ticketid= id

let mimetype= f.mimetype.split('/')[0]
if (mimetype !=='image') {
  
  await open(oAuth.generateAuthUrl({
       access_type: 'offline',
       scope: 'https://www.googleapis.com/auth/youtube.upload',
       state: JSON.stringify({
           filename, title, description, ticketid
       })
   }))
}
       


       




      //  await oAuth.getToken(req.query.code, (err, tokens) => {
      //     if(err) {
      //         console.log(err)
      //         return;
      //     }
  
      //     oAuth.setCredentials(tokens);
          
          
          
      //     youtube.video.insert({
      //         resource: {
      //             snippet: {title, description},
      //             status: {privacyStatus: 'private'}
      //         },
      //         part: 'snippet,status',
      //         media: {
      //             body: fs.createReadStream(`./storage/tickets/3/test2.mp4`)
      //         }
      //     }, (err,data) => {
      //         console.log("upload Done")
      //         process.exit();
      //     })
      
      // })




      
        try {
          await prisma.ticketFile
            .create({
              data: {
                filename: f.originalFilename,
                ticketId: Number(id),
                path: u,
              },
            })
            .then((err) => console.log(err));
          return res
            .status(200)
            .json({ message: "File Uploaded", success: true });
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: error, success: false });
        }
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
