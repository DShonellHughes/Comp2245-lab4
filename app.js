const form = document.querySelector('form');
const subjectSelect = document.querySelector('#subject');
const checkbox = form.querySelector('input[name="available"]');
const button = form.querySelector('button');
const statusEl = document.querySelector('#status');
const table = document.querySelector('#results');
const tbody = table.querySelector('tbody');

// Filling the Subject list
async function loadSubjects() {
  try {
    const response = await fetch('subjects.php');
    if (!response.ok) {
      throw new Error('Request failed: ' + response.status);
    }
    const subjects = await response.json();
    for (const subject of subjects) {
      const option = document.createElement('option');
      option.value = subject.id;
      option.textContent = subject.name;
      subjectSelect.append(option);
    }
  } catch (error) {
    console.error(error);
  }
}

// Fetching and showing the books
async function searchBooks() {
  button.disabled = true;
  statusEl.textContent = 'Searching…';

  try {
    const params = new URLSearchParams(new FormData(form));
    const response = await fetch(`books.php?${params}`);
    if (!response.ok) {
      throw new Error('Request failed: ' + response.status);
    }
    const books = await response.json();

    tbody.replaceChildren();
    for (const book of books) {
      const row = document.createElement('tr');

      const values = [
        book.title,
        book.author,
        book.year,
        book.subject,
        `${book.available} of ${book.copies}`,
      ];
      for (const value of values) {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.append(cell);
      }

      if (book.available === 0) {
        row.lastElementChild.classList.add('out');
      }
      tbody.append(row);
    }

    if (books.length === 0) {
      statusEl.textContent = 'No books match your search.';
    } else if (books.length === 1) {
      statusEl.textContent = '1 book found.';
    } else {
      statusEl.textContent = `${books.length} books found.`;
    }
  } catch (error) {
    console.error(error);
    tbody.replaceChildren();
    statusEl.textContent = "Couldn't load the books. Please try again.";
  } finally {
    button.disabled = false;
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  searchBooks();
});
subjectSelect.addEventListener('change', searchBooks);
checkbox.addEventListener('change', searchBooks);

loadSubjects();
searchBooks();
