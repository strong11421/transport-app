import { Router } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transport_records ORDER BY id DESC');
    res.json(result.rows);
  } catch (err: any) {
    console.error('❌ Error fetching transport records:', err);
    res.status(500).json({ error: 'Failed to fetch transport records' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM transport_records WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('❌ Error fetching transport record by ID:', err);
    res.status(500).json({ error: 'Failed to fetch transport record' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM transport_records WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Record deleted successfully' });
  } catch (err: any) {
    console.error('❌ Error deleting record:', err);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
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
    } = req.body;

    const result = await pool.query(
      `UPDATE transport_records SET
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
      RETURNING *`,
      [
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
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('❌ Error updating transport record:', err);
    res.status(500).json({ error: 'Failed to update transport record' });
  }
});

// POST /transport
router.post('/', async (req, res) => {
  try {
    const {
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
    } = req.body;

    const result = await pool.query(
      `INSERT INTO transport_records (
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
      ) RETURNING *`,
      [
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
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('❌ Error inserting transport record:', err);
    res.status(500).json({ error: 'Failed to add transport record' });
  }
});

export default router;
