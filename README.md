# MediaProxy
Forwards hosted media from a URL to the client to prevent the origin server from tracking the user.

## Why?
As we do not host any content on our own servers, we allow users to provide links to content hosted by others in order to add customised features like profile pictures, backgrounds, etc. Because of this, users can host the content on their own servers, therefore allowing them to log details about requests from clients that visit their Feds.lol profile. To avoid this, we have created this media proxy that acts as an intermediate in order to prevent the origin server from having any interaction with the client. This means that the ability to log requests is made entirely pointless, as all requests will simply be made from our forwarder.

## Image Optimisation
This media proxy utilises the [sharp](https://npmjs.com/package/sharp) npm package in order to compress and optimise images when requested. This only applies to content that has a `Content-Type` header with a MIME type that starts with "image/". The current settings for the optimisation are to resize the image to a width of 1920 pixels, with a height that matches the original aspect ratio. This only applies if the original image exceeds a width of 1920 pixels. Afterwards, the image is compressed using WEBP compression, before being sent back to the client.

## Is this used in production?
This repository was used in old versions of our website, however we have now migrated to a modified version written with Next.js, in order to integrate better with our Next.js based website. Similar compression techniques are still used in the new version.

## Can I use this for my own projects?
Sure! This repo is designed to allow clients to safely download media assets from a server, so we've not put any restrictions on who can use it.
