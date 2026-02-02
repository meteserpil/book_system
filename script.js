// 1. STATE: The Array is now our "Single Source of Truth"
let books = JSON.parse(localStorage.getItem("myBooks")) || [];

const button = document.getElementById("addBookBtn");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const isbnInput = document.getElementById("isbn");
const tableBody = document.getElementById("bookList");

function showToast(message, color) {
  const toast = document.createElement("div");

  toast.id = "toast";
  toast.textContent = message;
  toast.style.backgroundColor = color;
  document.body.appendChild(toast);

  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}

function saveToLocalStorage() {
  localStorage.setItem("myBooks", JSON.stringify(books));
}

function renderTable() {
  tableBody.innerHTML = "";

  books.forEach((book, index) => {
    const newRow = document.createElement("tr");

    // Create Data Cells
    [book.title, book.author, book.isbn].forEach((text) => {
      const cell = document.createElement("td");
      cell.textContent = text;
      newRow.appendChild(cell);
    });

    // Create Delete Button
    const deleteCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "deleteBtn";

    // C. Delete Logic: Remove from ARRAY, then re-render
    deleteBtn.addEventListener("click", function () {
      deleteBook(index);
    });

    deleteCell.appendChild(deleteBtn);
    newRow.appendChild(deleteCell);
    tableBody.appendChild(newRow);
  });
}

function deleteBook(index) {
  // Remove 1 item at the specific index
  books.splice(index, 1);
  saveToLocalStorage();
  showToast("Book deleted successfully", "red");
  // Re-draw the table to reflect the change
  renderTable();
}

function addBook(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const isbn = isbnInput.value.trim();
  console.log(title, author, isbn);

  if (title === "" || author === "" || isbn === "") {
    alert("Please fill in all fields!");
    return;
  }

  // 4. ADD LOGIC: Update the Array, not the DOM directly
  const newBook = {
    id: crypto.randomUUID(),
    title: title,
    author: author,
    isbn: isbn,
  };

  console.log(newBook);

  books.push(newBook); // Add to data
  saveToLocalStorage();
  showToast("Book added successfully", "green");
  renderTable(); // Update UI

  // Clear Inputs
  titleInput.value = "";
  authorInput.value = "";
  isbnInput.value = "";
}

button.addEventListener("click", addBook);
renderTable();
// script.js dosyasındaki ilgili kısımları şu şekilde güncelle:

const searchInput = document.getElementById("searchInput"); // Arama kutusunu seç

// renderTable fonksiyonuna parametre ekleyelim (varsayılan olarak ana books dizisini kullansın)
function renderTable(dataToRender = books) {
  tableBody.innerHTML = "";

  dataToRender.forEach((book, index) => {
    const newRow = document.createElement("tr");

    // Data Hücrelerini Oluştur
    [book.title, book.author, book.isbn].forEach((text) => {
      const cell = document.createElement("td");
      cell.textContent = text;
      newRow.appendChild(cell);
    });

    // Silme Butonu
    const deleteCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "deleteBtn";

    deleteBtn.addEventListener("click", function () {
      deleteBook(index);
    });

    deleteCell.appendChild(deleteBtn);
    newRow.appendChild(deleteCell);
    tableBody.appendChild(newRow);
  });
}

// Arama Mantığı (Event Listener)
searchInput.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase(); // Küçük harfe çevir

  // Kitap adına göre filtrele
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm),
  );

  // Sadece filtrelenmiş kitapları tabloya çizdir
  renderTable(filteredBooks);
});
