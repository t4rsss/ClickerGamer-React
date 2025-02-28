import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, ImageBackground ,Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');  // Obtendo a largura e altura da tela

const ClickerGame = () => {
  const [btc, setBtc] = useState(0);
  const [btcPorClique, setBtcPorClique] = useState(1);
  const [btcPorSegundo, setBtcPorSegundo] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [jogoIniciado, setJogoIniciado] = useState(false); // Controle da tela
  const [backgroundImage, setBackgroundImage] = useState(require('./assets/Porao.gif')); // Atualize para o require do arquivo local
  const [upgrades, setUpgrades] = useState({
    clique: [
      { nome: "Divulgar anúncios Falsos", preco: 10, efeito: () => setBtcPorClique(prev => prev + 1) },
      { nome: "Proxy Rápido", preco: 100, efeito: () => setBtcPorClique(prev => prev + 2) },
      { nome: "Melhorar Placa Mãe", preco: 400, efeito: () => setBtcPorClique(prev => prev + 50) },
      { nome: "Melhorar Memória RAM", preco: 300, efeito: () => setBtcPorClique(prev => prev + 20) },
      { nome: "Contratar Hacker", preco: 1000, efeito: () => setBtcPorClique(prev => prev + 150) },
      { nome: "Treinar Equipe", preco: 600, efeito: () => setBtcPorClique(prev => prev + 60) },
      { nome: "Melhorar Ferramentas", preco: 400, efeito: () => setBtcPorClique(prev => prev + 30) },
    ],
    producao: [
      { nome: "Hack Automático", preco: 50, efeito: () => setBtcPorSegundo(prev => prev + 1) },
      { nome: "Melhorar Placa de Vídeo", preco: 500, efeito: () => setBtcPorSegundo(prev => prev + 50) },
      { nome: "Melhorar Processador", preco: 700, efeito: () => setBtcPorSegundo(prev => prev + 100) },
    ],
    ambiente: [
      { nome: "Comprar Apartamento", preco: 400000, efeito: () => setBackgroundImage(require('./assets/apartamento.gif'))},
    ]
  });

  const [secaoAtiva, setSecaoAtiva] = useState('clique');

  useEffect(() => {
    const interval = setInterval(() => {
      setBtc(prev => prev + btcPorSegundo);
    }, 1000); // A cada 1 segundo
    return () => clearInterval(interval);
  }, [btcPorSegundo]); // Atualiza sempre que o BTC por segundo mudar

  const atualizarLoja = (index, categoria) => {
    // Atualizando corretamente o estado de upgrades com base no índice e categoria
    setUpgrades(prevUpgrades => {
      const updatedUpgrades = { ...prevUpgrades };
      updatedUpgrades[categoria] = updatedUpgrades[categoria].map((upgrade, i) => 
        i === index ? { ...upgrade, preco: Math.ceil(upgrade.preco * 2.5) } : upgrade
      );
      return updatedUpgrades;
    });
  };

  const iniciarJogo = () => {
    // Reiniciar o progresso
    setBtc(0);
    setBtcPorClique(1);
    setBtcPorSegundo(0);
    setJogoIniciado(true); // Inicia o jogo
  };

  const mostrarMenu = () => {
    setJogoIniciado(false); // Exibe o menu novamente
  };

  const comprarUpgrade = (index, categoria) => {
    if (btc >= upgrades[categoria][index].preco) {
      setBtc(prev => prev - upgrades[categoria][index].preco);
      upgrades[categoria][index].efeito();
      atualizarLoja(index, categoria);
      // Remove o upgrade "Comprar Apartamento" após a compra
      if (upgrades[categoria][index].nome === "Comprar Apartamento") {
        setUpgrades(prevUpgrades => {
          const newUpgrades = { ...prevUpgrades };
          newUpgrades[categoria] = newUpgrades[categoria].filter((_, i) => i !== index);
          return newUpgrades;
        });
      }
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Menu Inicial */}
      {!jogoIniciado && (
        <ImageBackground source={require('./assets/hck1.gif')} style={styles.backgroundImage}>
          <View style={styles.menuContainer}>
            <Text style={styles.headerText}>Hacker Clicker</Text>
            <TouchableOpacity style={styles.button} onPress={iniciarJogo}>
              <Text style={styles.btnText}>Novo Jogo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={iniciarJogo}>
              <Text style={styles.btnText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}

      {/* Tela do Jogo */}
      {jogoIniciado && (
        <ImageBackground
          source={backgroundImage} // Agora o fundo é atualizado pelo estado
          style={[styles.backgroundImage, { width, height }]}
          resizeMode="contain">
          <View style={styles.gameContainer}>
            <Text style={styles.btcText}>BTC: {btc.toFixed(2)}</Text>
            <TouchableOpacity style={styles.lojaBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.btnText}>Abrir Loja</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hackearBtn} onPress={() => setBtc(prev => prev + btcPorClique)}>
              <Text style={styles.btnText}>Hackear</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}

      <Modal visible={modalVisible} animationType="slide">
        <ImageBackground source={require('./assets/lojinha.gif')} style={[styles.backgroundImage, { width, height }]} resizeMode="contain">
          <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeBtnText}>X</Text>
          </TouchableOpacity>

          <Text style={styles.btcText2}>BTC: {btc.toFixed(2)}</Text>

          {/* Botões das seções */}
          <View style={styles.secaoButtons}>
            <TouchableOpacity style={styles.secaoBtn} onPress={() => setSecaoAtiva('clique')}>
              <Text style={styles.btnText}>Clique</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secaoBtn} onPress={() => setSecaoAtiva('producao')}>
              <Text style={styles.btnText}>Produção</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secaoBtn} onPress={() => setSecaoAtiva('ambiente')}>
              <Text style={styles.btnText}>Ambiente</Text>
            </TouchableOpacity>
          </View>

          {/* Exibição de upgrades de acordo com a seção ativa */}
          <View style={styles.upgradeMenu}>
            <View style={styles.upgradeContent}>
              <Text style={styles.headerText}>{secaoAtiva === 'clique' ? 'Upgrades de Clique' : secaoAtiva === 'producao' ? 'Upgrades de Produção' : 'Upgrades de Ambiente'}</Text>
              <FlatList
                data={upgrades[secaoAtiva]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity style={styles.upgradeBtn} onPress={() => comprarUpgrade(index, secaoAtiva)}>
                    <Text style={styles.btnText}>{item.nome} - {item.preco} BTC</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </ImageBackground>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({

  secaoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  secaoBtn: {
    top:'160%',
    backgroundColor: 'rgba(56, 116, 80, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 3,
    borderColor: '#6fa341',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,  // Sombra para dispositivos Android
  },

  container: {
    flex: 1,
    backgroundColor: '#16161c',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    backgroundColor: '#16161c',
    position:'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 30,
    borderColor: '#6fa341',
    borderWidth: 2,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.6)',
    width: '70%',
    height: 300,
  },
  headerText: {
    color: '#a3c255',
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    fontFamily: 'MinhaFonte',
    backgroundColor: 'rgba(56, 116, 80, 0.5)',
    color: '#a3c255',
    padding: 10,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#6fa341',    
    cursor: 'pointer',
    fontSize: 18,
    width: '100%',
    transition: 'background-color 0.3s ease',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },
  
  gameContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  btcText: {
    top : '-100%',
    fontSize: 20,
    marginBottom: 20,
    color: '#a3c255',
  },

  btcText2: {
    top : '9%',
    fontSize: 25,
    marginBottom: 20,
    color: 'black',
  },

  hackearBtn: {
    top : '80%',
    backgroundColor: 'rgba(56, 116, 80, 0.5)',
    color: '#a3c255',
    padding: 10,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#6fa341',
    cursor: 'pointer',
    fontSize: 18,
    width: '80%',
    transition: 'background-color 0.3s ease',
  },
  lojaBtn: {
    top : '-100%',
    backgroundColor: 'rgba(56, 116, 80, 0.5)',
    color: '#a3c255',
    padding: 10,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#6fa341',
    cursor: 'pointer',
    fontSize: 18,
    width: '80%',
    transition: 'background-color 0.3s ease',
  },
  upgradeMenu: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '90%',
    height: '70%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeContent: {
    padding: 20,
    color: 'white',
    textAlign: 'center',
    width: '100%',
    height: '80%',
    borderRadius: 10,
  },
  upgradeBtn: {
    backgroundColor: 'rgba(56, 116, 80, 0.5)',
    color: '#a3c255',
    padding: 10,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#6fa341',
    cursor: 'pointer',
    fontSize: 18,
    transition: 'background-color 0.3s ease',
  },
  closeBtn: {
    color: '#a3c255',
    right:'6%',
    top:'15.5%',
    height:50,
    width:50,
    position: 'absolute',
    backgroundColor: 'rgba(252, 0, 0, 0.0)',
    color: '#a3c255',
    borderWidth: 3,
    borderColor: 'rgba(252, 0, 0, 0.0)',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },

  closeBtnText:{
    color: '#16161c',
    fontSize: 35,
  }

});

export default ClickerGame;
