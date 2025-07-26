"use strict";
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
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const transport_1 = __importDefault(require("./routes/transport"));
const db_1 = __importDefault(require("./db"));
const app = (0, express_1.default)();
const PORT = 5000;
// Middlewares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Default route for /
app.get('/', (req, res) => {
    res.send('🚚 Transport API is running!');
});
// Use transport routes under /transport
app.use('/transport', transport_1.default);
// Test DB connection
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('SELECT NOW()');
        console.log('✅ Connected to Neon DB. Server time:', result.rows[0].now);
    }
    catch (err) {
        console.error('❌ Failed to connect to Neon DB:', err);
    }
}))();
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
