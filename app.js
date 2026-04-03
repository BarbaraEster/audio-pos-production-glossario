let lista = [];
let fuse;

const resultsDiv = document.getElementById("results");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");

// carregar JSON
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    lista = data;

    // categorias únicas
    const categorias = [...new Set(lista.map(item => item.categoria))];

    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      filterSelect.appendChild(option);
    });

    // configurar busca
    fuse = new Fuse(lista, {
      keys: ["termo", "descricao"],
      threshold: 0.3
    });

    render(lista);
  });

// função para destacar busca
function highlight(text, search) {
  if (!search) return text;

  const regex = new RegExp(`(${search})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

// renderizar
function render(items) {
  resultsDiv.innerHTML = "";

  const termoBusca = searchInput.value;

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "col-md-6 col-lg-4";

    div.innerHTML = `
      <div class="card card-custom p-3 h-100">
        <div class="termo mb-1">
          ${highlight(item.termo, termoBusca)}
        </div>

        <span class="badge bg-secondary mb-2">
          ${item.categoria}
        </span>

        <div>
          ${highlight(item.descricao, termoBusca)}
        </div>
      </div>
    `;

    resultsDiv.appendChild(div);
  });
}

// atualizar busca + filtro
function atualizar() {
  let valorBusca = searchInput.value;
  let categoria = filterSelect.value;

  let resultado = valorBusca
    ? fuse.search(valorBusca).map(r => r.item)
    : lista;

  if (categoria) {
    resultado = resultado.filter(item => item.categoria === categoria);
  }

  render(resultado);
}

// eventos
searchInput.addEventListener("input", atualizar);
filterSelect.addEventListener("change", atualizar);