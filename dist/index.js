"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const sharp_1 = __importDefault(require("sharp"));
const dotenv = __importStar(require("dotenv"));
const bufferUtils_1 = require("./bufferUtils");
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.query || !req.query.url)
        return res.status(400).send("Missing media URL");
    const { url } = req.query;
    if (!/^https?:\/\//.test(`${url}`))
        return res.status(400).send("Invalid media URL");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = yield axios_1.default.get(`${url}`, { responseType: "arraybuffer" }).catch(() => {
        return res.status(400).send("Invalid media URL");
    });
    if (Number(data.status) < 200 || Number(data.status) >= 300)
        return res.status(400).send("Invalid media URL");
    const contentType = String(data.headers["content-type"]);
    res.set("X-Original-URL", data.request.res.responseUrl);
    if (contentType.startsWith("image/")) {
        (0, sharp_1.default)(data.data).metadata().then((metadata) => {
            (0, sharp_1.default)(data.data, { pages: -1 })
                .resize({
                withoutEnlargement: true,
                width: 1920,
                height: (1920 / metadata.width) * metadata.height
            })
                .toFormat('webp', { compression: 'webp' })
                .toBuffer()
                .then((buf) => {
                res.set("Content-Type", "image/jpeg");
                (0, bufferUtils_1.getStreamFromBuffer)(buf).pipe(res);
            }).catch((err) => console.error(err));
        }).catch((err) => { console.error(err); });
    }
    else if (contentType.startsWith("video/") || contentType.startsWith("audio/")) {
        res.set("Content-Type", contentType);
        return (0, bufferUtils_1.getStreamFromBuffer)(data.data).pipe(res);
    }
    else {
        return res.status(400).send("Invalid media URL");
    }
}));
app.all('*', (req, res) => res.status(404).send("Invalid route"));
app.listen(PORT, () => { console.log(`Image forwarder is running on port ${PORT}.`); });
exports.default = app;
