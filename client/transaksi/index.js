document.addEventListener("DOMContentLoaded", function () {
  fetchData();
  document.querySelector("#form-transaksi").addEventListener("submit", function (event) {
    event.preventDefault();
    submitForm();
  });
  document.querySelector("table tbody").addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-row-btn")) {
      handleEditRow(event.target.dataset.id);
    } else if (event.target.classList.contains("delete-row-btn")) {
      deleteRowById(event.target.dataset.id);
    }
  });
});
function fetchData() {
  fetch("http://localhost:2222/getAllTransaksi")
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data.data));
}
function submitForm() {
  const id = document.querySelector("#id_transaksi").value;
  const idProduk = document.querySelector("#id_produk").value;
  const quantity = document.querySelector("#quantity").value;
  const tanggalTransaksi = document.querySelector("#tanggal_transaksi").value;
  if (id) {
    updateRow(id, idProduk, quantity, tanggalTransaksi);
  } else {
    insertRow(idProduk, quantity, tanggalTransaksi);
  }
}
function handleEditRow(id) {
  const row = document.querySelector(`button[data-id='${id}']`).parentElement.parentElement;
  const cells = row.querySelectorAll("td");
  document.querySelector("#id_transaksi").value = id;
  document.querySelector("#id_produk").value = cells[1].textContent;
  document.querySelector("#quantity").value = cells[2].textContent;
  document.querySelector("#tanggal_transaksi").value = cells[3].textContent;
}
function insertRow(idProduk, quantity, tanggalTransaksi) {
  fetch("http://localhost:2222/insertTransaksi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idproduk: idProduk,
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
}
function updateRow(id, idProduk, quantity, tanggalTransaksi) {
  fetch("http://localhost:2222/updateTransaksi/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idproduk: idProduk,
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
}
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
    tableHtml += `<td>
                    <button class="btn btn-primary edit-row-btn" data-id=${id}>Edit</button>
                    <button class="btn btn-danger delete-row-btn" data-id=${id}>Delete</button>
                 </td>`;
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;
}
