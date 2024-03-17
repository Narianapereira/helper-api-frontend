let currentPage = 1;
let totalPages = 1;

function makeRequest() {
  const ano = document.getElementById('ano').value;
  const modelo = document.getElementById('modelo').value;
  const vehiclesType = document.getElementById('vehiclesType').value; // Obter o valor selecionado do select
  const url = `http://localhost:3000/api/Fipe/${ano}/${modelo}?vehiclesType=${vehiclesType}&page=${currentPage}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      totalPages = Math.ceil(data.length / 20); // Assumindo que cada página terá 20 resultados
      displayResult(data);
      displayPagination();
    })
    .catch(error => {
      displayResult([{ error: `Erro: ${error.message}` }]);
    });
}

function displayResult(data) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `<h2></h2>`;

  const startIndex = (currentPage - 1) * 20;
  const endIndex = startIndex + 20;
  const carsToShow = data.slice(startIndex, endIndex);

  if (Array.isArray(carsToShow) && carsToShow.length > 0) {
    carsToShow.forEach(car => {
      const card = document.createElement('div');
      card.classList.add('card');

      const vehicleInfo = `
        <p>Tipo de Veículo: ${car.vehicleType}</p>
        <p>Preço: ${car.price}</p>
        <p>Marca: ${car.brand}</p>
        <p>Modelo: ${car.model}</p>
        <p>Ano do Modelo: ${car.modelYear}</p>
        <p>Combustível: ${car.fuel}</p>
        <p>Código FIPE: ${car.codeFipe}</p>
        <p>Mês de Referência: ${car.referenceMonth}</p>
        <p>Acrônimo do Combustível: ${car.fuelAcronym}</p>
      `;
      card.innerHTML = vehicleInfo;

      resultDiv.appendChild(card);
    });
  } else {
    resultDiv.innerHTML += `<p>Dados não encontrados.</p>`;
  }
}

function displayPagination() {
  const paginationDiv = document.getElementById('pagination');
  paginationDiv.innerHTML = '';

  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.onclick = () => {
        currentPage = i;
        makeRequest();
      };
      paginationDiv.appendChild(button);
    }
  }
}
