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
				const query =
					"INSERT INTO dataproduk (namaproduk, stock, hargasatuan) VALUES (?,?,?);";
				connection.query(
					query,
					[namaproduk, stock, hargasatuan],
					(err, result) => {
						if (err) {
							reject(new Error(err.message));
						} else {
							resolve(result.insertId);
						}
					}
				);
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
	//INSET,DELETE,UPDATE============================================================================================================================
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
				const query =
					"INSERT INTO datatransaksi (idproduk, quantity, tanggal, hargatotal) VALUES (?, ?, ?, ?);";
				connection.query(
					query,
					[idproduk, quantity, tanggal, hargatotal],
					(err, result) => {
						if (err) {
							reject(new Error(err.message));
						} else {
							resolve(result.insertId);
						}
					}
				);
			});
			return {
				id: insertId,
				idproduk: idproduk,
				quantity: quantity,
				tanggal: tanggal,
				hargatotal: hargatotal,
			};
		} catch (error) {
			console.log(error);
			return null;
		}
	}
	async updateTransaksiById(id, id_produk, quantity, tanggal) {
		try {
			const hargaSatuan = await new Promise((resolve, reject) => {
				const query = "SELECT hargasatuan FROM dataproduk WHERE id = ?;";
				connection.query(query, [id_produk], (err, result) => {
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
			const response = await new Promise((resolve, reject) => {
				const query =
					"UPDATE datatransaksi SET idproduk = ?, quantity = ?, tanggal = ?, hargatotal = ? WHERE id = ?;";
				connection.query(
					query,
					[id_produk, quantity, tanggal, hargatotal, id],
					(err, result) => {
						if (err) {
							reject(new Error(err.message));
						} else {
							resolve(result ? result.affectedRows : 0);
						}
					}
				);
			});
			return response === 1;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
	async deleteRowById(id) {
		try {
			id = parseInt(id, 10);
			const response = await new Promise((resolve, reject) => {
				const deleteQuery = "DELETE FROM datatransaksi WHERE id = ?;";
				connection.query(deleteQuery, [id], (err, result) => {
					if (err) reject(new Error(err.message));
					resolve(result ? result.affectedRows : 0);
				});
			});
			if (response === 1) {
				const remainingIds = await new Promise((resolve, reject) => {
					const selectQuery = "SELECT id FROM datatransaksi;";
					connection.query(selectQuery, (err, rows) => {
						if (err) reject(new Error(err.message));
						resolve(rows.map((row) => row.id));
					});
				});
				if (remainingIds.length > 0) {
					const maxId = Math.max(...remainingIds);
					await new Promise((resolve, reject) => {
						const resetQuery = `ALTER TABLE datatransaksi AUTO_INCREMENT = ${
							maxId + 1
						};`;
						connection.query(resetQuery, (err, result) => {
							if (err) reject(new Error(err.message));
							resolve(result);
						});
					});
				}
			}
			return response === 1;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
	//================INVESTOR===============================================================

	async insertNewInvestor(id, nama, jumlah) {
		try {
			const insertId = await new Promise((resolve, reject) => {
				const query =
					"INSERT INTO data_investor (nama, jumlah) VALUES ( ?, ?);";
				connection.query(
					query,
					[id, nama, jumlah],
					(err, result) => {
						if (err) {
							reject(new Error(err.message));
						} else {
							resolve(result.insertId);
						}
					}
				);
			});
			return {
				id: insertId,
				nama: nama,
				jumlah: jumlah
			};
		} catch (error) {
			console.log(error);
			return null;
		}
	}

  async updateInvestorById(id, nama, jumlah) {
		try {
			const response = await new Promise((resolve, reject) => {
				const query =
					"UPDATE data_investor SET nama = ?, jumlah = ? WHERE id = ?;";
				connection.query(
					query,
					[nama, jumlah, id],
					(err, result) => {
						if (err) {
							reject(new Error(err.message));
						} else {
							resolve(result ? result.affectedRows : 0);
						}
					}
				);
			});
			return response === 1;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

  async deleteRowById(id) {
		try {
			id = parseInt(id, 10);
			const response = await new Promise((resolve, reject) => {
				const deleteQuery = "DELETE FROM data_investor WHERE id = ?;";
				connection.query(deleteQuery, [id], (err, result) => {
					if (err) reject(new Error(err.message));
					resolve(result ? result.affectedRows : 0);
				});
			});
			if (response === 1) {
				const remainingIds = await new Promise((resolve, reject) => {
					const selectQuery = "SELECT id FROM data_investor;";
					connection.query(selectQuery, (err, rows) => {
						if (err) reject(new Error(err.message));
						resolve(rows.map((row) => row.id));
					});
				});
				if (remainingIds.length > 0) {
					const maxId = Math.max(...remainingIds);
					await new Promise((resolve, reject) => {
						const resetQuery = `ALTER TABLE data_investor AUTO_INCREMENT = ${
							maxId + 1
						};`;
						connection.query(resetQuery, (err, result) => {
							if (err) reject(new Error(err.message));
							resolve(result);
						});
					});
				}
			}
			return response === 1;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	//=========================================================================================
	async insertNewKaryawan(
		namakaryawan,
		tgllahir,
		jeniskelamin,
		alamat,
		noTlp
	) {
		// console.log( namakaryawan, tgllahir, jeniskelamin, alamat, noTlp)
		try {
			const insertId = await new Promise((resolve, reject) => {
				const query =
					"INSERT INTO data_karyawan (nama_karyawan, tgl_lahir, jenis_kelamin, alamat, noTlp) VALUES (?, ?, ?, ?, ?);";
				connection.query(
					query,
					[namakaryawan, tgllahir, jeniskelamin, alamat, noTlp],
					(err, result) => {
						if (err) {
							reject(new Error(err.message));
						} else {
							resolve(result.insertId);
						}
					}
				);
			});
			return {
				id: insertId,
				namakaryawan: namakaryawan,
				tgllahir: tgllahir,
				jeniskelamin: jeniskelamin,
				alamat: alamat,
				noTlp: noTlp,
			};
		} catch (error) {
			console.log(error);
			return null;
		}
	}

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
    return false;
    }
  }
}

module.exports = DbService;
