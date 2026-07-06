require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;
const db = require("./config/database");
const response = require("./utils/response");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  response(200, null, "API v1 Ready!", "SUCCESS", res);
});

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM sm_client_access";
  db.query(sql, (error, fields) => {
    if (error) {
      console.error(error);
      return response(500, null, "Internal Server Error", res);
    }
    console.log(fields); // <-- Ini akan memunculkan JSON di terminal
    response(200, null, fields, "SUCCESS", res);
  });
});

app.get("/users/:code", (req, res) => {
  const sql = `SELECT owner_name,car_id, car_unit_name, plate_number, incoming_date, contract_delivery_date FROM sm_client_access WHERE access_code = ?`;
  db.query(sql, [req.params.code], (error, result) => {
    if (error) {
      console.error(error);
      return response(500, null, "Internal Error", res);
    }
    if (result.length === 0) {
      return response(404, "ERROR 404!", "User not found", res);
    }
    // Ambil nama pemilik dari baris pertama (asumsi semua baris miliknya)
    const nama_owner = result[0].owner_name;

    // Looping semua baris (mobil) yang ditemukan
    const carsData = result.map((row) => {
      return {
        car_id: row.car_id,
        car_unit_name: row.car_unit_name,
        plate_number: row.plate_number,
        incoming_date: row.incoming_date,
        contract_delivery_date: row.contract_delivery_date,
      };
    });

    console.log("Data mobil:", carsData);
    response(200, nama_owner, carsData, "DATA SUCCESSFULLY ACCESSED!", res);
  });
});

app.post("/users", (req, res) => {
  const {
    access_code,
    car_id,
    owner_name,
    car_unit_name,
    plate_number,
    incoming_date,
    contract_delivery_date,
  } = req.body;

  const sql = `INSERT INTO sm_client_access (access_code, car_id, owner_name, car_unit_name, plate_number, incoming_date, contract_delivery_date) VALUES
   ('${access_code}', '${car_id}', '${owner_name}', '${car_unit_name}', '${plate_number}', '${incoming_date}', '${contract_delivery_date}')`;

  db.query(sql, (err, fields) => {

    if (fields?.affectedRows) {
      // isSuccess: fields.affectedRows,
      // id: fields.insertId
      response(200, null, "DATA SUCCESSFULLY ADDED!", "SUCCESS", res);
    } else {
      response(500, null, "Invalid", "Error", res)
      console.log("Tidak Valid")
    } 
  });

});

app.delete("/users", (req, res) => {
  
}) 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
