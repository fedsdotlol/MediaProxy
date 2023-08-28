# MediaProxy
Forwards hosted media from a URL to the client to prevent the origin server from tracking the user.

## Why?
As we do not host any content on our own servers, we allow users to provide links to content hosted by others in order to add customised features like profile pictures, backgrounds, etc. Because of this, users can host the content on their own servers, therefore allowing them to log details about requests from clients that visit their feds.lol profile. To avoid this, we have created this media proxy that acts as an intermediate in order to prevent the origin server from having any interaction with the client. This means that the ability to log requests is made entirely pointless, as all requests will simply be made from our forwarder.