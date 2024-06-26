document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:2222/getAllProduk")
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data.data));

  document.querySelector("table tbody").addEventListener("click", function (event) {
    if (event.target.className === "delete-row-btn") {
      deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
      handleEditRow(event.target.dataset.id);
    }
  });
  });

  const updateBtn = document.querySelector("#update-row-btn");

  updateBtn.onclick = function () {
    const updateNameInput = document.querySelector("#update-name-input");

  fetch("http://localhost:2222/update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: updateBtn.dataset.id,
      name: updateNameInput.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
}
    });
};

document.querySelector("#form-produk").addEventListener("submit", function (event) {
  event.preventDefault();

  // Ambil nilai dari input form kecuali `id_produk`
  const namaProduk = document.querySelector("#nama_produk").value;
  const stok = document.querySelector("#stok").value;
  const hargaSatuan = document.querySelector("#harga_satuan").value;

  fetch("http://localhost:2222/insertproduk", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      nama_produk: namaProduk,
      stok: stok,
      harga_satuan: hargaSatuan,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      insertRowIntoTable(data.data);
    })
    .then((data) => {
      window.location.href = "/produk";
    });

  // Bersihkan form setelah submit
  document.querySelector("#nama_produk").value = "";
  document.querySelector("#stok").value = "";
  document.querySelector("#harga_satuan").value = "";
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
  data.forEach(function ({ id, namaproduk, stock, hargasatuan }) {
    tableHtml += "<tr>";
    tableHtml += `<td>${id}</td>`;
    tableHtml += `<td>${namaproduk}</td>`;
    tableHtml += `<td>${stock}</td>`;
    tableHtml += `<td>${hargasatuan}</td>`;
    tableHtml += `<td><button class="btn btn-primary" data-id=${id}>Edit</button>
                  <button class="btn btn-danger" data-id=${id}>Delete</button></td>`;
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
                  <button class="btn btn-danger" data-id=${data.id}>Delete</button></td>`;
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
