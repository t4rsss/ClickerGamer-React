import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, ImageBackground ,Dimensions } from 'react-native';
import HUD from "./HUD";
const { width, height } = Dimensions.get('window');  

const ClickerGame = () => {
  const [btc, setBtc] = useState(0);
  const [btcPorClique, setBtcPorClique] = useState(1);
  const [btcPorSegundo, setBtcPorSegundo] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [jogoIniciado, setJogoIniciado] = useState(false); 
  const [backgroundImage, setBackgroundImage] = useState(require('./assets/Porao.gif')); 
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
    }, 1000); 
    return () => clearInterval(interval);
  }, [btcPorSegundo]); 

  const atualizarLoja = (index, categoria) => {
    setUpgrades(prevUpgrades => {
      const updatedUpgrades = { ...prevUpgrades };
      updatedUpgrades[categoria] = updatedUpgrades[categoria].map((upgrade, i) => 
        i === index ? { ...upgrade, preco: Math.ceil(upgrade.preco * 2.5) } : upgrade
      );
      return updatedUpgrades;
    });
  };

  const iniciarJogo = () => {
    setBtc(0);
    setBtcPorClique(1);
    setBtcPorSegundo(0);
    setJogoIniciado(true); 
  };

  const mostrarMenu = () => {
    setJogoIniciado(false); 
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

{jogoIniciado && (
  
  <ImageBackground source={require('./assets/fundo.gif')} style={styles.imagemFundo1}>
  
  <ImageBackground
    source={backgroundImage}
    style={[styles.backgroundImage1, { width, height }]}
    resizeMode="contain"
  >
    


    {/* HUD */}
    <HUD btc={btc} score={btcPorClique} time={btcPorSegundo}/>


    {/* Container do jogo */}
    <View style={styles.gameContainer}>
      
      {/* Botão da Loja */}
      <TouchableOpacity style={styles.lojaBtn} onPress={() => setModalVisible(true)}>
      <ImageBackground source={require('./assets/btnloja.png')} style={styles.backgroundImage}>
        <Text style={styles.btnText}></Text>
      </ImageBackground>  
      </TouchableOpacity>



      {/* Botão de Hackear */}
      <TouchableOpacity style={styles.hackearBtn} onPress={() => setBtc(prev => prev + btcPorClique)}>
      <ImageBackground source={require('./assets/teclado.png')} style={styles.buttonBackground} resizeMode="contain">
      </ImageBackground>  
      </TouchableOpacity>
    </View>
  </ImageBackground>
  </ImageBackground>
)}


      <Modal visible={modalVisible} animationType="slide">
      <ImageBackground source={require('./assets/fundo.gif')} style={styles.imagemFundo1}></ImageBackground>
        <ImageBackground source={require('./assets/lojinha.gif')} style={[styles.backgroundImage, { width, height }]} resizeMode="contain">
          
          {/* HUD */}
         <HUD btc={btc} score={btcPorClique} time={btcPorSegundo} />
          
          <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeBtnText}>X</Text>
          </TouchableOpacity>

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
  imagemFundo1: {
    flex: 1, // A primeira imagem ocupa toda a área do botão
    justifyContent: 'center', // Centraliza o conteúdo
    alignItems: 'center', // Centraliza o conteúdo
  },
  secaoButtons: {
    top: height * 0.22, // 80% da altura da tela (ajuste conforme necessário)
    left: width * 0.5 - 170, // Centraliza o botão (ajuste o valor 50 se necessário)
    position: "absolute",
    flexDirection: 'row',
    justifyContent: "space-between",
    marginVertical: 20,
  },
  secaoBtn: {
    backgroundColor: 'rgba(56, 116, 80, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 3,
    borderColor: '#6fa341', 
  },

  container: {
    flex: 1,
    backgroundColor: '#16161c',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position:'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBackground: {
    width: '100%', // Faz a imagem ocupar toda a largura do botão
    height: '100%', // Faz a imagem ocupar toda a altura do botão
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
    position: 'absolute',
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
  btnText2: {
    fontSize: 25,
    color: '#fff',
  },
  hackearBtn: {
    position: "absolute", 
    top: height * 0.2, 
    backgroundColor: '#1e2029',
    borderWidth: 3,
    borderColor: '#6fa341',
    height:112,
    width:336, 
    alignItems: "center",
    justifyContent:'center',
    textAlign: 'center',
    borderRadius:10,
    overflow: 'hidden'
  },

  lojaBtn: {
    position: "absolute", 
    top: height * -0.36, 
    left: width * 0.03, 
    borderWidth: 3,
    borderColor: '#6fa341',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width:'60',
    height:'60',
  },
  upgradeMenu: {
    position: 'fixed',
    top: 30,
    left: 0,
    width: '90%',
    height: '60%',
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
