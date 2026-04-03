const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const categoryFilter = document.getElementById("categoryFilter");

let data = [];

// 🔄 Carregar JSON
fetch("./data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    populateCategories(data);
    render(data);
  })
  .catch(err => {
    console.error("Erro ao carregar JSON:", err);
  });

// 🎯 Popular filtro de categorias
function populateCategories(items) {
  const categorias = [...new Set(items.map(item => item.categoria))];

  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// 🔍 Busca + filtro
searchInput.addEventListener("input", handleSearch);
categoryFilter.addEventListener("change", handleSearch);

function handleSearch() {
  const termoBusca = searchInput.value.toLowerCase();
  const categoriaSelecionada = categoryFilter.value;

  let filtrados = data.filter(item => {
    const matchBusca =
      item.termo.toLowerCase().includes(termoBusca) ||
      item.descricao.toLowerCase().includes(termoBusca) ||
      item.descricao_completa.toLowerCase().includes(termoBusca);

    const matchCategoria =
      categoriaSelecionada === "todas" ||
      item.categoria === categoriaSelecionada;

    return matchBusca && matchCategoria;
  });

  render(filtrados);
}

// 🧠 Highlight
function highlight(text, termo) {
  if (!termo) return text;

  const regex = new RegExp(`(${termo})`, "gi");
  return text.replace(regex, `<mark>$1</mark>`);
}

// 🎨 Render
function render(items) {
  resultsDiv.innerHTML = "";

  const termoBusca = searchInput.value;

  if (items.length === 0) {
    resultsDiv.innerHTML = `<p class="text-center mt-4">Nenhum resultado encontrado</p>`;
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "col-12 col-md-6 col-lg-4 mb-3";

    div.innerHTML = `
      <div class="card bg-dark text-light h-100 shadow-sm p-3">

        <div class="mb-2">
          <strong>${highlight(item.termo, termoBusca)}</strong>
        </div>

        <span class="badge bg-secondary mb-2">
          ${item.categoria}
        </span>

        <div class="mb-2">
          ${highlight(item.descricao, termoBusca)}
        </div>

        <button class="btn btn-sm btn-outline-light mb-2" onclick="toggleDesc(this)">
          Ver mais
        </button>

        <div class="descricao-completa d-none">
          ${highlight(item.descricao_completa, termoBusca)}
        </div>

      </div>
    `;

    resultsDiv.appendChild(div);
  });
}

// Toggle descrição completa
function toggleDesc(btn) {
  const desc = btn.nextElementSibling;

  desc.classList.toggle("d-none");

  btn.textContent = desc.classList.contains("d-none")
    ? "Ver mais"
    : "Ver menos";
}
