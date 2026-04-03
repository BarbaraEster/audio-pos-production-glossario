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

function toggleDesc(btn) {
  const desc = btn.nextElementSibling;
  desc.classList.toggle("d-none");
  btn.textContent = desc.classList.contains("d-none") ? "Ver mais" : "Ver menos";
}
