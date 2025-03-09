let usersData = []; // Store fetched users globally

// Fetch user data from API
async function fetchUsers() {
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/buildingu/Mock_Admin_Panel_Data/main/api/v1/users/users.json`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }
    const data = await res.json();
    usersData = data; // Save fetched data globally
    displayUsers(usersData.slice(0, 10));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// Display the table body with user data
function displayUsers(users) {
    const userTable = document.getElementById("user-list");
    userTable.innerHTML = ""; // Clear the table before re-rendering

    users.forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.favourites}</td>
            <td>${formatDate(user.last_login)}</td>
            <td>${formatDate(user.created_at)}</td>
            <td>
                <button class="edit-btn" onclick="openModal('edit', ${index})">Edit</button>
                <button class="delete-btn" onclick="openDeleteModal(${index})">🗑️</button>
            </td>
        `;
        userTable.appendChild(row);
    });
}
// Formats the ISO dates
function formatDate(isoString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(isoString).toLocaleDateString(undefined, options);
}

// // Delete user
// function deleteUser(index) {
//   if (confirm("Are you sure you want to delete this user?")) {
//     usersData.splice(index, 1); // Remove the user from the array
//     displayUsers(usersData); // Re-render the table
//   }
// }

// // Edit user
// function editUser(index) {
//   const user = usersData[index];

//   const updatedUser = {
//     username: prompt("Edit Username:", user.username),
//     name: prompt("Edit Name:", user.name),
//     email: prompt("Edit Email:", user.email),
//     role: prompt("Edit Role:", user.role),
//     favourites: prompt("Edit Favourites:", user.favourites),
//     last_login: user.last_login,
//     created_at: user.created_at,
//   };

//   if (updatedUser.username && updatedUser.name && updatedUser.email) {
//     usersData[index] = updatedUser; // Update user in the array
//     displayUsers(usersData); // Re-render the table
//   } else {
//     alert("All fields are required to edit the user!");
//   }
// }

/// Sort-Select ///
let columnHeaders = document.querySelectorAll("th")

// Loop through each header and add event listener
for(let i = 0; i < columnHeaders.length-1; i++) {
  columnHeaders[i].addEventListener('click', headerClick);
}

function headerClick() {
  const column = this;
  let order = this.dataset.order;
  console.log(column.textContent); //logs the header title
  console.log('click to', order);

  // switch asc/desc
  if(order == "desc"){
    this.dataset.order = "asc";
  }else{
    this.dataset.order = "desc";
  }
  
  const arrow = column.querySelector('.icon-arrow');
  arrow.classList.toggle('down');

  sortColumn(column, column.dataset.order);
}

function sortColumn(column, order){
  const rows = Array.from(document.querySelectorAll("tbody tr"));
  const columnIndex = Array.from(column.parentElement.children).indexOf(column);

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent; 
    const cellB = rowB.cells[columnIndex].textContent; 
    
    const a = isNaN(cellA) ? cellA : parseFloat(cellA);
    const b = isNaN(cellB) ? cellB : parseFloat(cellB);

    const isDate = !isNaN(Date.parse(cellA)) && !isNaN(Date.parse(cellB)); // check if column holds a date value

    // sorting dates
    if (isDate){
      const dateA = new Date(cellA);
      const dateB = new Date(cellB);
      if(order == 'asc'){
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    }
    //sorting text/numbers
    if (order == 'asc') {
      return a > b ? 1 : (a < b ? -1 : 0);
    } else {
      return a < b ? 1 : (a > b ? -1 : 0); 
    }
  });

   // rebuild the table with the sorted rows
   const tbody = document.getElementById("user-list");

   // append rows in sorted order
   for(let i = 0; i < rows.length; i++) {
    tbody.appendChild(rows[i]);
} 
}

// Open the modal (Add/Edit User)
function openModal(mode, index = null) {
    const modal = document.getElementById("modal");
    const overlay = document.getElementById("modal-overlay");

    const title = document.getElementById("modal-title");
    const username = document.getElementById("modal-username");
    const name = document.getElementById("modal-name");
    const email = document.getElementById("modal-email");
    const role = document.getElementById("modal-role");
    const favourites = document.getElementById("modal-favourites");

    if (mode === "edit") {
        editingIndex = index;
        const user = usersData[index];

        title.textContent = "Edit User";
        username.value = user.username;
        name.value = user.name;
        email.value = user.email;
        role.value = user.role;
        favourites.value = user.favourites;
    } else {
        editingIndex = null;
        title.textContent = "Add User";
        username.value = "";
        name.value = "";
        email.value = "";
        role.value = "";
        favourites.value = "";
    }

    modal.style.display = "block";
    overlay.style.display = "block";
}

// Open Delete Confirmation Modal
function openDeleteModal(index) {
    deleteIndex = index;
    const deleteModal = document.getElementById("delete-modal");
    const overlay = document.getElementById("modal-overlay");

    deleteModal.style.display = "block";
    overlay.style.display = "block";
}

// Close any modal
function closeModal() {
    document.querySelectorAll(".modal").forEach((modal) => {
        modal.style.display = "none";
    });
    document.getElementById("modal-overlay").style.display = "none";
}

// Save user (Add/Edit)
document.getElementById("save-btn").addEventListener("click", () => {
    const username = document.getElementById("modal-username").value.trim();
    const name = document.getElementById("modal-name").value.trim();
    const email = document.getElementById("modal-email").value.trim();
    const role = document.getElementById("modal-role").value.trim();
    const favourites = document.getElementById("modal-favourites").value.trim();
    
    const invalidEmail = document.getElementById("invalidEmail");
    const userInput = document.getElementById("userInput");
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");

    // if (!username || !name || !email) {
    //     reqInput.style.display = "block";
    //     console.log("missing");
    //     //return;
    // }
    
    ((!username) ? userInput.style.display = "block" :  userInput.style.display = "none");
    ((!name) ? nameInput.style.display = "block" :  nameInput.style.display = "none");
    ((!email) ? emailInput.style.display = "block" :  emailInput.style.display = "none");

    function valid(email){
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(email);
    }

    if(email){
      if (!valid(email)) {
        invalidEmail.style.display = "block"; 
      } else {
        invalidEmail.style.display = "none"; 
      }
    }

    if (!valid(email)) {
      return; 
    }


    const newUser = {
        username,
        name,
        email,
        role,
        favourites,
        last_login: new Date().toISOString(),
        created_at: new Date().toISOString(),
    };

    if (editingIndex !== null) {
        usersData[editingIndex] = newUser;
    } else {
        usersData.unshift(newUser);
    }

    closeModal();
    displayUsers(usersData);
});

// Confirm Delete User
document.getElementById("confirm-delete-btn").addEventListener("click", () => {
    if (deleteIndex !== null) {
        usersData.splice(deleteIndex, 1);
        displayUsers(usersData);
    }
    closeModal();
});

// Cancel Delete User
document.getElementById("cancel-delete-btn").addEventListener("click", closeModal);

// Search functionality
document.getElementById("search").addEventListener("input", () => {
    const query = document.getElementById("search").value.toLowerCase();
    const filteredUsers = usersData.filter((user) =>
        user.username.toLowerCase().includes(query)
    );
    displayUsers(filteredUsers);
});

// Add new user button
document.getElementById("add-user-btn").addEventListener("click", () => openModal("add"));

// Close modal button
document.getElementById("cancel-btn").addEventListener("click", closeModal);

// Fetch initial user data
fetchUsers();

/// filter select
function filterSelect() {
  const checkboxes = document.querySelectorAll(".filter");

  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', function () {
      const columnIndex = index + 1; 
      
      const columnHeaders = document.querySelectorAll("th");
      const rows = document.querySelectorAll("tbody tr");

      // select the column header and corresponding data cells
      const columnHeader = columnHeaders[columnIndex - 1]; // adjust to 0-based index
      const dataCells = document.querySelectorAll(`td:nth-child(${columnIndex})`);

      // hide column based on checkbox state
      if (checkbox.checked) {
        columnHeader.style.display = 'none'; // hide header
        dataCells.forEach(cell => {
          cell.style.display = 'none'; // hide data cells
        });
      } else {
        columnHeader.style.display = ''; // show header
        dataCells.forEach(cell => {
          cell.style.display = ''; // Show data cells
        });
      }
    });
  });
}

filterSelect();

/// pagination 
function pagination(){
  let numRows = document.getElementById("pagination");

  numRows.addEventListener("click", function(){
    console.log(numRows.value);

    let perPage = parseInt(numRows.value); 
     
    const paginatedUsers = usersData.slice(0, perPage);
    displayUsers(paginatedUsers);// update display 
  })
}
pagination();

