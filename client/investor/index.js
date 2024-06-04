document.addEventListener("DOMContentLoaded", function () {
  fetchData();
  document.querySelector("#form-investor").addEventListener("submit", function (event) {
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
  fetch("http://localhost:2222/getAllInvestor")
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data.data));
}
function submitForm() {
  const id = document.querySelector("#id").value;
  const nama = document.querySelector("#nama").value;
  const jumlah = document.querySelector("#jumlah").value;
  if (id) {
    updateRow(id, nama, jumlah);
  } else {
    insertRow(id, nama, jumlah);
  }
}
function handleEditRow(id) {
  const row = document.querySelector(`button[data-id='${id}']`).parentElement.parentElement;
  const cells = row.querySelectorAll("td");
  document.querySelector("#id").value = id;
  document.querySelector("#nama").value = cells[1].textContent;
  document.querySelector("#jumlah").value = cells[2].textContent;
}
function insertRow(id, nama, jumlah) {
  fetch("http://localhost:2222/insertInvestor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      nama: nama,
      jumlah: jumlah,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}
function updateRow(id, nama, jumlah) {
  fetch("http://localhost:2222/updateInvestor/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      nama: nama,
      jumlah: jumlah,
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
  data.forEach(function ({ id, nama, jumlah }) {
    tableHtml += "<tr>";
    tableHtml += `<td>${id}</td>`;
    tableHtml += `<td>${nama}</td>`;
    tableHtml += `<td>${jumlah}</td>`;
    tableHtml += `<td>
                  <button class="btn btn-primary edit-row-btn" data-id=${id}>Edit</button>
                  <button class="btn btn-danger delete-row-btn" data-id=${id}>Delete</button>
                  </td>`;
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;
}