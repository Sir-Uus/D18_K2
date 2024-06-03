document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:2222/getAllTransaksi")
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data.data));

  document.querySelector("table tbody").addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-row-btn")) {
      deleteRowById(event.target.dataset.id);
    }
    if (event.target.classList.contains("edit-row-btn")) {
      handleEditRow(event.target.dataset.id);
    }
  });
});

const updateBtn = document.querySelector("#update-row-btn");

updateBtn.onclick = function () {
  const id = updateBtn.dataset.id;
  const idProduk = document.querySelector("#id_produk").value;
  const quantity = document.querySelector("#quantity").value;
  const tanggalTransaksi = document.querySelector("#tanggal_transaksi").value;

  fetch("http://localhost:2222/update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      id_produk: idProduk,
      quantity: quantity,
      tanggal: tanggalTransaksi,
    }),
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      location.reload();
    }
  });
};

const addBtn = document.querySelector("#add-name-btn");

addBtn.onclick = function () {
const nameInput = document.querySelector("#name-input");
const name = nameInput.value;
nameInput.value = "";

fetch("http://localhost:2222/insertinvestor", {
  headers: {
    "Content-type": "application/json",
  },
  method: "POST",
  body: JSON.stringify({ name: name }),
})
  .then((response) => response.json())
  .then((data) => insertRowIntoTable(data.data));
};
fetch("http://localhost:2222/getTransaksi/" + id)
    .then((response) => response.json())
    .then((data) => {
      document.querySelector("#id_transaksi").value = data.id;
      document.querySelector("#id_produk").value = data.idproduk;
      document.querySelector("#quantity").value = data.quantity;
      document.querySelector("#tanggal_transaksi").value = data.tanggal;
    });



function deleteRowById(id) {
fetch("http://localhost:2222/delete/" + id, {
  method: "DELETE",
})
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      location.reload();
    }
  });
}

function handleEditRow(id) {
const updateSection = document.querySelector("#update-row");
updateSection.hidden = false;
document.querySelector("#update-row-btn").dataset.id = id;
}

function loadHTMLTable(data) {
const table = document.querySelector("table tbody");

if (data.length === 0) {
  table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
  return;
}

let tableHtml = "";
data.forEach(function ({ id, idproduk, quantity, tanggal, hargatotal }) {
  tableHtml += "<tr>";
  tableHtml += `<td>${id}</td>`;
  tableHtml += `<td>${idproduk}</td>`;
  tableHtml += `<td>${quantity}</td>`;
  tableHtml += `<td>${tanggal}</td>`;
  tableHtml += `<td>${hargatotal}</td>`;
 
  tableHtml += `<td><button class="btn btn-primary" data-id=${id}>Edit</button>
                <button class="btn btn-danger delete-row-btn" data-id=${id}>Delete</button></td>`;
  tableHtml += "</tr>";
});

table.innerHTML = tableHtml;
}

function insertRowIntoTable(data) {
const table = document.querySelector("table tbody");
const isTableData = table.querySelector(".no-data");

let tableHtml = "<tr>";
for (var key in data) {
  if (data.hasOwnProperty(key)) {
    tableHtml += `<td>${data[key]}</td>`;
  }
}
tableHtml += `<td><button class="btn btn-primary" data-id=${data.id}>Edit</button>
                <button class="btn btn-danger delete-row-btn" data-id=${data.id}>Delete</button></td>`;
tableHtml += "</tr>";

if (isTableData) {
  table.innerHTML = tableHtml;
} else {
  const newRow = table.insertRow();
  newRow.innerHTML = tableHtml;
}
}

const searchBtn = document.querySelector("#search-btn");

searchBtn.onclick = function () {
const searchInput = document.querySelector("#search-input");
const searchValue = searchInput.value;

fetch("http://localhost:2222/search/" + searchValue)
  .then((response) => response.json())
  .then((data) => loadHTMLTable(data.data));
};
