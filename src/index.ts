import express from 'express';
import axios from 'axios';
import sharp from 'sharp';
import * as dotenv from 'dotenv';
import { getStreamFromBuffer } from './bufferUtils';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");

app.get('/', async (req, res) => {
    if (!req.query || !req.query.url) return res.status(400).send("Missing media URL");

    const { url } = req.query;

    if (!/^https?:\/\//.test(`${url}`)) return res.status(400).send("Invalid media URL");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await axios.get(`${url}`, { responseType: "arraybuffer" }).catch(() => {
        return res.status(400).send("Invalid media URL");
    });

    if (Number(data.status) < 200 || Number(data.status) >= 300) return res.status(400).send("Invalid media URL");

    const contentType = String(data.headers["content-type"]);
    res.set("X-Original-URL", data.request.res.responseUrl);

    if (contentType.startsWith("image/")) {
        sharp(data.data).metadata().then((metadata) => {
            sharp(data.data, { pages: -1 })
                .resize({
                    withoutEnlargement: true,
                    width: 1920,
                    height: Math.round((1920 / metadata.width) * metadata.height)
                })
                .toFormat('webp', { compression: 'webp' })
                .toBuffer()
                .then((buf) => {
                    res.set("Content-Type", "image/jpeg");
                    getStreamFromBuffer(buf).pipe(res);
                }).catch((err) => console.error(err));
        }).catch((err) => { console.error(err); });

    } else if (contentType.startsWith("video/") || contentType.startsWith("audio/")) {
        res.set("Content-Type", contentType);
        return getStreamFromBuffer(data.data).pipe(res);
    } else {
        return res.status(400).send("Invalid media URL");
    }
});

app.all('*', (req, res) => res.status(404).send("Invalid route"));

app.listen(PORT, () => { console.log(`Image forwarder is running on port ${PORT}.`); });

export default app;