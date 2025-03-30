const form = document.getElementById('cadastroForm');
const lista = document.getElementById('listaEstabelecimentos');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const res = await fetch('/api/estabelecimentos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert('Cadastro realizado com sucesso!');
    form.reset();
    carregarEstabelecimentos();
  } else {
    alert(await res.text());
  }
});

async function carregarEstabelecimentos() {
  const res = await fetch('/api/estabelecimentos');
  const estabelecimentos = await res.json();

  lista.innerHTML = '';
  estabelecimentos.forEach(est => {
    const li = document.createElement('li');
    li.textContent = `${est.nome} - [${est.location.coordinates[1]}, ${est.location.coordinates[0]}]`;
    lista.appendChild(li);
  });
}

carregarEstabelecimentos();
