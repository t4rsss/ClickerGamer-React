document.addEventListener("DOMContentLoaded", () => {
    const menuDiv = document.querySelector(".menu-container");
    const gameDiv = document.querySelector(".game-container");
    const novoJogoBtn = document.getElementById("novo-jogo-btn");
    const continuarJogoBtn = document.getElementById("continuar-jogo-btn");
    const upgradeMenu = document.getElementById("upgrade-menu");
    const openUpgradeBtn = document.getElementById("open-upgrade-menu");
    const closeUpgradeBtn = document.getElementById("close-upgrade-btn");
    const upgradeList = document.getElementById("upgrade-list");
    const btcDisplay = document.getElementById("btc");
    const hackearBtn = document.getElementById("hackear");
    const lojaBtn = document.getElementById("loja-btn");

    console.log(menuDiv);  // Verifique se os elementos estão sendo corretamente selecionados
    console.log(gameDiv);
    console.log(novoJogoBtn);
    console.log(continuarJogoBtn);
    console.log(upgradeMenu);
    console.log(openUpgradeBtn);
    console.log(closeUpgradeBtn);
    console.log(upgradeList);
    console.log(btcDisplay);
    console.log(hackearBtn);
    console.log(lojaBtn);

    // Função para exibir o jogo
    function mostrarJogo() {
        menuDiv.style.display = "none";
        gameDiv.classList.remove("hidden");
        document.body.style.backgroundImage = "url('../assets/Porao.gif')";
    }

    // Função para exibir o menu
    function mostrarMenu() {
        menuDiv.style.display = "block";
        gameDiv.classList.add("hidden");
    }

    // Função para salvar progresso
    function salvarProgresso(btc, btcPorClique, btcPorSegundo) {
        localStorage.setItem('btc', btc);
        localStorage.setItem('btcPorClique', btcPorClique);
        localStorage.setItem('btcPorSegundo', btcPorSegundo);
    }

    // Função para carregar progresso
    function carregarProgresso() {
        return {
            btc: parseFloat(localStorage.getItem('btc')) || 0,
            btcPorClique: parseInt(localStorage.getItem('btcPorClique')) || 1,
            btcPorSegundo: parseInt(localStorage.getItem('btcPorSegundo')) || 0
        };
    }

    // Função para inicializar o jogo
    function inicializarJogo() {
        let { btc, btcPorClique, btcPorSegundo } = carregarProgresso();

        let upgrades = [
            { nome: "Melhor CPU", preco: 10, efeito: () => btcPorClique += 1 },
            { nome: "Hack Automático", preco: 50, efeito: () => btcPorSegundo += 1 },
            { nome: "Proxy Rápido", preco: 100, efeito: () => btcPorClique += 2 }
        ];

        // Eventos para abrir e fechar a loja de upgrades
        openUpgradeBtn.addEventListener("click", () => {
            upgradeMenu.classList.remove("hidden");
            hackearBtn.style.display = "none";
            openUpgradeBtn.style.display = "none";
            atualizarLoja();
        });

        closeUpgradeBtn.addEventListener("click", () => {
            upgradeMenu.classList.add("hidden");
            hackearBtn.style.display = "block";
            openUpgradeBtn.style.display = "block";
        });

        // Atualizar o display de BTC
        function atualizarDisplay() {
            btcDisplay.innerText = `BTC: ${btc.toFixed(2)}`;
        }

        // Atualizar a loja de upgrades
        function atualizarLoja() {
            upgradeList.innerHTML = "";
            upgrades.forEach((upgrade, index) => {
                const item = document.createElement("li");
                item.innerHTML = `${upgrade.nome} - ${upgrade.preco} BTC 
                    <button class="upgrade-btn" data-index="${index}">Comprar</button>`;
                upgradeList.appendChild(item);
            });

            // Evento de compra de upgrade
            document.querySelectorAll('.upgrade-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    if (btc >= upgrades[index].preco) {
                        btc -= upgrades[index].preco;
                        upgrades[index].efeito();
                        upgrades[index].preco = Math.ceil(upgrades[index].preco * 1.8);
                        atualizarLoja();
                        atualizarDisplay();
                        salvarProgresso(btc, btcPorClique, btcPorSegundo);
                    }
                });
            });
        }

        // Evento de hackear BTC
        hackearBtn.addEventListener("click", () => {
            btc += btcPorClique;
            atualizarDisplay();
            salvarProgresso(btc, btcPorClique, btcPorSegundo);
        });

        // Incrementar BTC por segundo
        setInterval(() => {
            btc += btcPorSegundo;
            atualizarDisplay();
            salvarProgresso(btc, btcPorClique, btcPorSegundo);
        }, 1000);

        // Inicializar a loja e o display
        openUpgradeBtn.addEventListener("click", () => {
            upgradeMenu.classList.remove("hidden");
            atualizarLoja();
        });

        closeUpgradeBtn.addEventListener("click", () => {
            upgradeMenu.classList.add("hidden");
        });

        upgradeMenu.classList.add("hidden");
        atualizarDisplay();
        atualizarLoja();
    }

    // Evento para novo jogo
    novoJogoBtn.addEventListener("click", () => {
        localStorage.clear();
        mostrarJogo();
        inicializarJogo();
    });

    // Evento para continuar o jogo
    continuarJogoBtn.addEventListener("click", () => {
        mostrarJogo();
        inicializarJogo();
    });

    mostrarMenu();
});
