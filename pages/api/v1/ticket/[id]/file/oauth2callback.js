import youtube from "youtube-api";

import fs from "fs";
import open from 'open'


export const oAuth = youtube.authenticate({
    type: 'oauth',
    client_id: '451352924057-ca2m6d0ioeku2i153qndkkqmlf3mu58i.apps.googleusercontent.com',
    client_secret: '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',
    redirect_url: 'http://localhost:3000/api/v1/ticket/1/file/oauth2callback'
})

export default async function oauth2callback (req,res) {
    // res.redirect('https://jlpeb.csb.app/success')
    const {filename, title, description, ticketid} = JSON.parse(req.query.state)
    // let filename='test2.mp4'
    // let title='new educational video'
    // let description= 'test video'
console.log('from oauth2callback', filename, title, description);

// await open(oAuth.generateAuthUrl({
//     access_type: 'online',
//     scope: 'https://www.googleapis.com/auth/youtube.upload',
//     state: JSON.stringify({
//         filename, title, description
//     })
// }))

   await oAuth.getToken(req.query.code, (err, tokens) => {
        console.log(tokens);
        if(err) {
            console.log(err)
            return;
        }

        oAuth.setCredentials(tokens);
        
        console.log(filename);
        
        youtube.videos.insert({
            resource: {
                snippet: {title, description},
                status: {privacyStatus: 'private'}
            },
            part: 'snippet,status',
            media: {
                body: fs.createReadStream(`./public/storage/tickets/${ticketid}/${filename}`)
            }
        }, (err,data) => {
            console.log("upload Done")
            return res
            .status(200)
            .json({ message: "File Uploaded to youtube", success: true });
            // process.exit();
        })
    
    })
}

