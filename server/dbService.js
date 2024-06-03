const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

let instance = null;

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("db " + connection.state);
  }
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }
  async getAllDataProduk() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM dataproduk;";
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getAllDataTransaksi() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM datatransaksi;";
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getAllDataKaryawan() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM data_karyawan;";
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getAllDataInvestor() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM data_investor;";
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async insertNewProduk(namaproduk, stock, hargasatuan) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO dataproduk (namaproduk, stock, hargasatuan) VALUES (?,?,?);";
        connection.query(query, [namaproduk, stock, hargasatuan], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result.insertId);
          }
        });
      });
      return {
        id: insertId,
        namaproduk: namaproduk,
        stock: stock,
        hargasatuan: hargasatuan,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  //INSERT UPDATE DELETE TRANSAKSI===================================================================================================
  async insertNewTransaksi(idproduk, quantity, tanggal) {
    try {
      const hargaSatuan = await new Promise((resolve, reject) => {
        const query = "SELECT hargasatuan FROM dataproduk WHERE id = ?;";
        connection.query(query, [idproduk], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            if (result.length > 0) {
              resolve(result[0].hargasatuan);
            } else {
              reject(new Error("Produk tidak ditemukan"));
            }
          }
        });
      });
      const hargatotal = hargaSatuan * quantity;
      const insertId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO datatransaksi (idproduk, quantity, tanggal, hargatotal) VALUES (?, ?, ?, ?);";
        connection.query(query, [idproduk, quantity, tanggal, hargatotal], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result.insertId);
          }
        });
      });

      return {
        id: insertId,
        idproduk: idproduk,
        quantity: quantity,
        tanggal: tanggal,
        hargatotal: hargatotal
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async deleteRowById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM datatransaksi WHERE id = ?;";
        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result ? result.affectedRows : 0);
        });
      });
      return response === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async updateTransaksiById(id, id_produk, quantity, tanggal) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE datatransaksi SET idproduk = ?, quantity = ?, tanggal = ? WHERE id = ?;";
        connection.query(query, [id_produk, quantity, tanggal, id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result ? result.affectedRows : 0);
        });
      });
      return response === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
//======================================================================================================================================================













  async searchByName(name) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM names WHERE name LIKE ?;";
        connection.query(query, [`%${name}%`], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

module.exports = DbService;
