function carregarChamados() {
    const dbChamados = JSON.parse(localStorage.getItem('db_chamados')) || { chamados: [] };
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; 

    dbChamados.chamados.forEach(chamado => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${chamado.id}</td>
            <td>${chamado.tproblema}</td>
            <td>${chamado.motivoabertura}</td>
            <td>${chamado.solicitante}</td>
            <td>ABERTO</td>
            <td>Agente Responsável</td>
            <td>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</td>
            <td>Média</td>
            <td>—</td>
        `;

        tbody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', carregarChamados);