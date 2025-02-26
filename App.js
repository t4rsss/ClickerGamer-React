import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, ImageBackground ,Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');  // Obtendo a largura e altura da tela

const ClickerGame = () => {
  const [btc, setBtc] = useState(0);
  const [btcPorClique, setBtcPorClique] = useState(1);
  const [btcPorSegundo, setBtcPorSegundo] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [jogoIniciado, setJogoIniciado] = useState(false); // Controle da tela
  const [upgrades, setUpgrades] = useState([
    { nome: "Melhor CPU", preco: 10, efeito: () => setBtcPorClique(prev => prev + 1) },
    { nome: "Hack Automático", preco: 50, efeito: () => setBtcPorSegundo(prev => prev + 1) },
    { nome: "Proxy Rápido", preco: 100, efeito: () => setBtcPorClique(prev => prev + 2) }
  ]);

  useEffect(() => {
    carregarProgresso();
    const interval = setInterval(() => {
      setBtc(prev => {
        const novoBtc = prev + btcPorSegundo;
        salvarProgresso(novoBtc, btcPorClique, btcPorSegundo);
        return novoBtc;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [btcPorSegundo]);

  const salvarProgresso = async (btc, btcPorClique, btcPorSegundo) => {
    await AsyncStorage.setItem('btc', btc.toString());
    await AsyncStorage.setItem('btcPorClique', btcPorClique.toString());
    await AsyncStorage.setItem('btcPorSegundo', btcPorSegundo.toString());
  };

  const carregarProgresso = async () => {
    const btcSalvo = parseFloat(await AsyncStorage.getItem('btc')) || 0;
    const cliqueSalvo = parseInt(await AsyncStorage.getItem('btcPorClique')) || 1;
    const segundoSalvo = parseInt(await AsyncStorage.getItem('btcPorSegundo')) || 0;
    setBtc(btcSalvo);
    setBtcPorClique(cliqueSalvo);
    setBtcPorSegundo(segundoSalvo);
  };

  const atualizarLoja = (index) => {
    setUpgrades(prevUpgrades => 
      prevUpgrades.map((upgrade, i) => 
        i === index 
          ? { ...upgrade, preco: Math.ceil(upgrade.preco * 1.8) } // Aumenta o preço somente do upgrade comprado
          : upgrade // Mantém os outros upgrades com o mesmo preço
      )
    );
  };
  

  const iniciarJogo = () => {
    // Reiniciar o progresso
    setBtc(0);
    setBtcPorClique(1);
    setBtcPorSegundo(0);
    setJogoIniciado(true); // Inicia o jogo
    salvarProgresso(0, 1, 0); // Salva o progresso inicial
  };

  const mostrarMenu = () => {
    setJogoIniciado(false); // Exibe o menu novamente
  };

  const comprarUpgrade = (index) => {
    if (btc >= upgrades[index].preco) {
      // Decrementa o BTC com base no preço do upgrade
      setBtc(prev => {
        const novoBtc = prev - upgrades[index].preco;
        return novoBtc;
      });
      // Aplica o efeito do upgrade
      upgrades[index].efeito();
      // Atualiza os preços da loja após a compra
      atualizarLoja(index);
      // Salva o progresso com os valores atuais de BTC, btcPorClique e btcPorSegundo
      salvarProgresso(btc - upgrades[index].preco, btcPorClique, btcPorSegundo);
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
        source={require('./assets/Porao.gif')}
        style={[styles.backgroundImage, { width, height }]} 
        resizeMode="contain" >
           
           <View style={styles.gameContainer}>
            
            <Text style={styles.btcText}>BTC: {btc.toFixed(2)}</Text>
            
            <TouchableOpacity style={styles.lojaBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.btnText}>Abrir Loja</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.hackearBtn} onPress={() => {
              setBtc(prev => {
                const novoBtc = prev + btcPorClique;
                salvarProgresso(novoBtc, btcPorClique, btcPorSegundo);
                return novoBtc;
              });
            }}>
              <Text style={styles.btnText}>Hackear</Text>
            </TouchableOpacity>

          </View>
        </ImageBackground>
      )}

      {/* Modal de Upgrades */}
      <Modal visible={modalVisible} animationType="slide">
      <ImageBackground
        source={require('./assets/lojinha.gif')}
        style={[styles.backgroundImage, { width, height }]} 
        resizeMode="contain" >
                <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtnText}>X</Text>
            </TouchableOpacity>
        <View style={styles.upgradeMenu}>


          {/* Apenas o container de upgrades tem a imagem de fundo */}
            <View style={styles.upgradeContent}>    
              <Text style={styles.headerText}>Upgrades</Text>
              <FlatList
                data={upgrades}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  
                  <TouchableOpacity style={styles.upgradeBtn} onPress={() => comprarUpgrade(index)}>
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
