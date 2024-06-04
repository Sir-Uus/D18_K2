const express = require("express");
const app = express();
const cors = require("cors");
const dbService = require("./dbService");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// create
app.post("/insertproduk", (request, response) => {
  const { namaproduk, stock, hargasatuan } = request.body;
  const db = dbService.getDbServiceInstance();
  const result = db.insertNewProduk(namaproduk, stock, hargasatuan);
  result
    .then((data) => {
      response.redirect("/produk");
    })
    .catch((err) => {
      console.log(err);
      response.status(500).send(err);
    });
});
app.post("/inserttransaksi", (request, response) => {
  const { idproduk, quantity, tanggal,hargatotal } = request.body;
  const db = dbService.getDbServiceInstance();
  const result = db.insertNewTransaksi(idproduk, quantity, tanggal,hargatotal);
  result
    .then((data) => {
      response.redirect("/transaksi");
    })
    .catch((err) => {
      console.log(err);
      response.status(500).send(err);
    });
});
app.post("/insertinvestor", (request, response) => {
  const { nama, jumlah } = request.body;
  const db = dbService.getDbServiceInstance();
  const result = db.insertNewInvestor(nama, jumlah);
  result
    .then((data) => {
      response.redirect("/investor");
    })
    .catch((err) => {
      console.log(err);
      response.status(500).send(err);
    });
});
app.post("/insertkaryawan", (request, response) => {
  const { namakaryawan, tgllahir, jeniskelamin, alamat, noTlp } = request.body;
  const db = dbService.getDbServiceInstance();

  const result = db.insertNewKaryawan(namakaryawan, tgllahir, jeniskelamin, alamat, noTlp);

  result
    .then((data) => {
      response.redirect("/karyawan");
    })
    .catch((err) => {
      console.log(err);
      response.status(500).send(err);
    });
});

// read
app.get("/getAllProduk", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getAllDataProduk();
  result.then((data) => response.json({ success: true, data: data })).catch((err) => console.log(err));
});
app.get("/getAllTransaksi", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getAllDataTransaksi();
  result.then((data) => response.json({ success: true, data: data })).catch((err) => console.log(err));
});
app.get("/getAllKaryawan", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getAllDataKaryawan();
  result.then((data) => response.json({ success: true, data: data })).catch((err) => console.log(err));
});
app.get("/getAllInvestor", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getAllDataInvestor();
  result.then((data) => response.json({ success: true, data: data })).catch((err) => console.log(err));
});



// update
app.patch("/update", (request, response) => {
  const { id, name } = request.body;
  const db = dbService.getDbServiceInstance();
  const result = db.updateNameById(id, name);
  result.then((data) => response.json({ success: true })).catch((err) => console.log(err));
});
app.patch("/updateTransaksi/:id", (request, response) => {
  const { id } = request.params;
  const { idproduk, quantity, tanggal, hargatotal } = request.body;
  const db = dbService.getDbServiceInstance();
  const result = db.updateTransaksiById(id, idproduk, quantity, tanggal, hargatotal);
  result.then((data) => response.json({ success: true })).catch((err) => console.log(err));
});

// delete
app.delete("/delete/:id", (request, response) => {
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();
  const result = db.deleteRowById(id);
  result.then((data) => response.json({ success: true })).catch((err) => console.log(err));
});
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();
  const result = db.deleteRowById(id);
  result
    .then(data => res.json({ success: data }))
    .catch(err => console.log(err));
});




// search
app.get("/search/:name", (request, response) => {
  const { name } = request.params;
  const db = dbService.getDbServiceInstance();
  const result = db.searchByName(name);
  result.then((data) => response.json({ success: true, data: data })).catch((err) => console.log(err));
});










//tampilan
app.use(express.static("../client"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});
app.get("/produk", (req, res) => {
  res.sendFile(__dirname + "/client/produk/index.html");
});
app.get("/karyawan", (req, res) => {
  res.sendFile(__dirname + "/client/karyawan/index.html");
});
app.get("/transaksi", (req, res) => {
  res.sendFile(__dirname + "/client/transaki/index.html");
});
app.get("/investor", (req, res) => {
  res.sendFile(__dirname + "/client/investor/index.html");
});

app.listen(2222, () => console.log("app is running"));
