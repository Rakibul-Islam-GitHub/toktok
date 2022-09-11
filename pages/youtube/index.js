import React, { useEffect } from 'react';

const index = () => {


    const postvideo = async () => {
        await fetch(`/api/v1/ticket/1/file/oauth2callback`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          
        })
          .then((res) => res.json())
          .then((res) => {
            console.log('done req');
          });
      };

    useEffect(() => {
        console.log('requent sending..');
        postvideo()
    })
    return (
        <div>
 <h1>Your video is uploading....</h1>
        </div>
    );
};

export default index;