
let agendamentos = JSON.parse(localStorage.getItem("agendamentosQualycenter")) || [];
let acompanhamentos = JSON.parse(localStorage.getItem("acompanhamentosQualycenter")) || [];
let comissoes = JSON.parse(localStorage.getItem("comissoesQualycenter")) || [];

const formulario = document.getElementById("appointment-form");
const listaAgendamentos = document.getElementById("appointments-list");
const formularioAcompanhamento = document.getElementById("tracking-form");
const listaAcompanhamentos = document.getElementById("tracking-list");
const listaComissoes = document.getElementById("commissions-list");
const seletorAgendamento = document.getElementById("tracking-appointment");


document.querySelectorAll("nav a").forEach(function(link) {
  link.addEventListener("click", function() {
    document.querySelectorAll("nav a").forEach(item => item.classList.remove("active"));
    document.querySelectorAll(".page").forEach(item => item.classList.remove("active"));

    link.classList.add("active");
    document.getElementById(link.dataset.page).classList.add("active");
  });
});


function mostrarAgendamentos() {
  listaAgendamentos.innerHTML = "";
  seletorAgendamento.innerHTML = '<option value="">Selecione um agendamento</option>';

  if (agendamentos.length === 0) {
    listaAgendamentos.innerHTML = '<tr><td colspan="8" class="empty">Nenhum agendamento registrado.</td></tr>';
    return;
  }

  agendamentos.forEach(function(item, indice) {
    const nascimento = item.nascimento
      ? item.nascimento.split("-").reverse().join("/")
      : "-";

    listaAgendamentos.innerHTML += `
      <tr>
        <td>${item.nome}</td>
        <td>${nascimento}</td>
        <td>${item.telefone}</td>
        <td>${item.curso}</td>
        <td>${item.data}</td>
        <td>${item.horario}</td>
        <td>${item.laboratorio}</td>
        <td>${item.instrutor}</td>
      </tr>`;

    seletorAgendamento.innerHTML += `
      <option value="${indice}">
        ${item.nome} - ${item.curso} (${item.data})
      </option>`;
  });
}


formulario.addEventListener("submit", function(evento) {
  evento.preventDefault();

  const nome = document.getElementById("name").value.trim();
  const telefone = document.getElementById("phone").value.trim();
  const nascimento = document.getElementById("birthdate").value;

  
  const duplicado = agendamentos.some(item =>
    item.nome.trim().toLowerCase() === nome.toLowerCase() &&
    item.telefone.replace(/\D/g, "") === telefone.replace(/\D/g, "")
  );

  if (duplicado) {
    alert("Este interessado já possui um agendamento cadastrado!");
    return;
  }

  const agendamento = {
    nome: nome,
    nascimento: nascimento,
    telefone: telefone,
    curso: document.getElementById("course").value,
    data: document.getElementById("date").value,
    horario: document.getElementById("time").value,
    laboratorio: document.getElementById("lab").value,
    instrutor: document.getElementById("instructor").value
  };

  agendamentos.push(agendamento);

  localStorage.setItem("agendamentosQualycenter", JSON.stringify(agendamentos));

  formulario.reset();
  mostrarAgendamentos();

  alert("Agendamento salvo com sucesso!");
});


function mostrarAcompanhamentos() {
  listaAcompanhamentos.innerHTML = "";

  if (acompanhamentos.length === 0) {
    listaAcompanhamentos.innerHTML = '<tr><td colspan="6" class="empty">Nenhum acompanhamento registrado.</td></tr>';
    return;
  }

  acompanhamentos.forEach(function(item) {
    listaAcompanhamentos.innerHTML += `
      <tr>
        <td>${item.nome}</td>
        <td>${item.curso}</td>
        <td>${item.data}</td>
        <td>${item.instrutor}</td>
        <td>${item.situacao}</td>
        <td>${item.resultado}</td>
      </tr>`;
  });
}


formularioAcompanhamento.addEventListener("submit", function(evento) {
  evento.preventDefault();

  const indice = Number(seletorAgendamento.value);
  const agendamento = agendamentos[indice];
  const situacao = document.getElementById("class-status").value;
  const resultado = document.getElementById("class-result").value;

  if (!agendamento) {
    alert("Selecione um agendamento válido.");
    return;
  }


  acompanhamentos = acompanhamentos.filter(item => item.indice !== indice);

  acompanhamentos.push({
    indice: indice,
    nome: agendamento.nome,
    curso: agendamento.curso,
    data: agendamento.data,
    instrutor: agendamento.instrutor,
    situacao: situacao,
    resultado: resultado
  });


  const comissaoExistente = comissoes.some(item => item.indice === indice);

  if (
    situacao === "Realizada" &&
    resultado === "Matriculado" &&
    !comissaoExistente
  ) {
    comissoes.push({
      indice: indice,
      instrutor: agendamento.instrutor,
      aluno: agendamento.nome,
      curso: agendamento.curso,
      valor: 15,
      pagamento: "Pendente"
    });
  }

  localStorage.setItem("acompanhamentosQualycenter", JSON.stringify(acompanhamentos));
  localStorage.setItem("comissoesQualycenter", JSON.stringify(comissoes));

  formularioAcompanhamento.reset();

  mostrarAcompanhamentos();
  mostrarComissoes();

  alert("Acompanhamento salvo com sucesso!");
});


function mostrarComissoes() {
  listaComissoes.innerHTML = "";

  if (comissoes.length === 0) {
    listaComissoes.innerHTML = '<tr><td colspan="6" class="empty">Nenhuma comissão registrada.</td></tr>';
    return;
  }

  comissoes.forEach(function(item, indice) {
    listaComissoes.innerHTML += `
      <tr>
        <td>${item.instrutor}</td>
        <td>${item.aluno}</td>
        <td>${item.curso}</td>
        <td>R$ ${Number(item.valor).toFixed(2).replace(".", ",")}</td>
        <td>${item.pagamento}</td>
        <td>
          <button class="small-button" onclick="alterarPagamento(${indice})">
            ${item.pagamento === "Pendente" ? "Marcar como pago" : "Marcar como pendente"}
          </button>
        </td>
      </tr>`;
  });
}


function alterarPagamento(indice) {
  if (comissoes[indice].pagamento === "Pendente") {
    comissoes[indice].pagamento = "Pago";
  } else {
    comissoes[indice].pagamento = "Pendente";
  }

  localStorage.setItem("comissoesQualycenter", JSON.stringify(comissoes));

  mostrarComissoes();
}


mostrarAgendamentos();
mostrarAcompanhamentos();
mostrarComissoes();
