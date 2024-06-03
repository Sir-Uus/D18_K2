document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:2222/getAllKaryawan")
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

document.querySelector("#form-karyawan").addEventListener("submit", function (event) {
  event.preventDefault();

  // Ambil nilai dari input form kecuali `id_produk`
  const namakaryawan = document.querySelector("#namakaryawan").value;
  const tgllahir = document.querySelector("#tgllahir").value;
  const jeniskelamin = document.querySelector("#jeniskelamin").value;
  const alamat = document.querySelector("#alamat").value;
  const noTlp = document.querySelector("#noTlp").value;

  fetch("http://localhost:2222/insertkaryawan", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      namakaryawan: namakaryawan,
      tgllahir: tgllahir,
      jeniskelamin: jeniskelamin,
      alamat: alamat,
      noTlp: noTlp,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      insertRowIntoTable(data.data);
    })
    .then((data) => {
      window.location.href = "/karyawan";
    });

  // Bersihkan form setelah submit
  document.querySelector("#namakaryawan").value = "";
  document.querySelector("#tgllahir").value = "";
  document.querySelector("#jeniskelamin").value = "";
  document.querySelector("#alamat").value = "";
  document.querySelector("#noTlp").value = "";
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
  data.forEach(function ({ id, nama_karyawan, tgl_lahir, jenis_kelamin, alamat, noTlp }) {
    tableHtml += "<tr>";
    tableHtml += `<td>${id}</td>`;
    tableHtml += `<td>${nama_karyawan}</td>`;
    tableHtml += `<td>${tgl_lahir}</td>`;
    tableHtml += `<td>${jenis_kelamin}</td>`;
    tableHtml += `<td>${alamat}</td>`;
    tableHtml += `<td>${noTlp}</td>`;
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
      if (key === "dateAdded") {
        data[key] = new Date(data[key]).toLocaleString();
      }
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
