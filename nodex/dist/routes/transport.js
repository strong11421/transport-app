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
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('SELECT * FROM transport_records ORDER BY id DESC');
        res.json(result.rows);
    }
    catch (err) {
        console.error('❌ Error fetching transport records:', err);
        res.status(500).json({ error: 'Failed to fetch transport records' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('SELECT * FROM transport_records WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error('❌ Error fetching transport record by ID:', err);
        res.status(500).json({ error: 'Failed to fetch transport record' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.default.query('DELETE FROM transport_records WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.json({ message: 'Record deleted successfully' });
    }
    catch (err) {
        console.error('❌ Error deleting record:', err);
        res.status(500).json({ error: 'Failed to delete record' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { date_of_transport, vehicle_no, dc_gp_no, starting_point, destination_point, quantity_qtls, no_of_bags, distance_km, rate_per_km, amount, outward_lf_no } = req.body;
        const result = yield db_1.default.query(`UPDATE transport_records SET
        date_of_transport = $1,
        vehicle_no = $2,
        dc_gp_no = $3,
        starting_point = $4,
        destination_point = $5,
        quantity_qtls = $6,
        no_of_bags = $7,
        distance_km = $8,
        rate_per_km = $9,
        amount = $10,
        outward_lf_no = $11
      WHERE id = $12
      RETURNING *`, [
            date_of_transport,
            vehicle_no,
            dc_gp_no,
            starting_point,
            destination_point,
            quantity_qtls,
            no_of_bags,
            distance_km,
            rate_per_km,
            amount,
            outward_lf_no,
            id
        ]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error('❌ Error updating transport record:', err);
        res.status(500).json({ error: 'Failed to update transport record' });
    }
}));
// POST /transport
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date_of_transport, vehicle_no, dc_gp_no, starting_point, destination_point, quantity_qtls, no_of_bags, distance_km, rate_per_km, amount, outward_lf_no } = req.body;
        const result = yield db_1.default.query(`INSERT INTO transport_records (
        date_of_transport,
        vehicle_no,
        dc_gp_no,
        starting_point,
        destination_point,
        quantity_qtls,
        no_of_bags,
        distance_km,
        rate_per_km,
        amount,
        outward_lf_no
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11
      ) RETURNING *`, [
            date_of_transport,
            vehicle_no,
            dc_gp_no,
            starting_point,
            destination_point,
            quantity_qtls,
            no_of_bags,
            distance_km,
            rate_per_km,
            amount,
            outward_lf_no
        ]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error('❌ Error inserting transport record:', err);
        res.status(500).json({ error: 'Failed to add transport record' });
    }
}));
exports.default = router;
