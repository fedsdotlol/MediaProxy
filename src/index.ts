import express from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { getStreamFromBuffer } from './bufferUtils';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    if (!req.query || !req.query.url) return res.status(400).send("Missing image URL");

    const { url } = req.query;

    if (!/^https?:\/\//.test(`${url}`)) return res.status(400).send("Invalid image URL");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await axios.get(`${url}`, { responseType: "arraybuffer" }).catch(() => {
        return res.status(400).send("Invalid image URL");
    });

    if (Number(data.status) < 200 || Number(data.status) >= 300) return res.status(400).send("Invalid image URL");
    if (!data.headers["content-type"].startsWith("image/")) return res.status(400).send("Invalid image URL");

    const stream = getStreamFromBuffer(data.data);

    res.setHeader("Content-Type", data.headers["content-type"]);
    return stream.pipe(res);
});

app.all('*', (req, res) => res.status(404).send("Invalid route"));

app.listen(PORT, () => { console.log(`Image forwarder is running on port ${PORT}.`); });

export default app;