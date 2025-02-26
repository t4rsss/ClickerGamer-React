import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const atualizarDisplay = () => {
    // Atualiza a exibição do BTC na tela
  };

  const atualizarLoja = () => {
    setUpgrades(prevUpgrades => 
      prevUpgrades.map(upgrade => ({
        ...upgrade,
        preco: Math.ceil(upgrade.preco * 1.8)
      }))
    );
  };

  const iniciarJogo = () => {
    setJogoIniciado(true); // Inicia o jogo
  };

  const mostrarMenu = () => {
    setJogoIniciado(false); // Exibe o menu novamente
  };

  const comprarUpgrade = (index) => {
    if (btc >= upgrades[index].preco) {
      setBtc(prev => prev - upgrades[index].preco);
      upgrades[index].efeito();
      atualizarLoja();
      salvarProgresso(btc, btcPorClique, btcPorSegundo);
    }
  };

  return (
    <View style={styles.container}>
      {/* Menu Inicial */}
      {!jogoIniciado && (
        <View style={styles.menuContainer}>
          <Text style={styles.headerText}>Hacker Clicker</Text>
          <TouchableOpacity style={styles.button} onPress={iniciarJogo}>
            <Text style={styles.btnText}>Novo Jogo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={iniciarJogo}>
            <Text style={styles.btnText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tela do Jogo */}
      {jogoIniciado && (
        <View style={styles.gameContainer}>
          <Text style={styles.btcText}>BTC: {btc.toFixed(2)}</Text>
          <TouchableOpacity style={styles.hackearBtn} onPress={() => {
            setBtc(prev => {
              const novoBtc = prev + btcPorClique;
              salvarProgresso(novoBtc, btcPorClique, btcPorSegundo);
              return novoBtc;
            });
          }}>
            <Text style={styles.btnText}>Hackear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.hackearBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.btnText}>Abrir Loja</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de Upgrades */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.upgradeMenu}>
          <View style={styles.upgradeContent}>
            <Text style={styles.headerText}>Upgrades</Text>
            <FlatList
              data={upgrades}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity style={styles.hackearBtn} onPress={() => comprarUpgrade(index)}>
                  <Text style={styles.btnText}>{item.nome} - {item.preco} BTC</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  menuContainer: {
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 30,
    borderColor: '#6fa341',
    borderWidth: 2,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.6)',
    width: '70%',
    height: 500,
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
    textAlign:'center'
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
    fontSize: 20,
    marginBottom: 20,
    color: '#a3c255',
  },
  hackearBtn: {
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
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeContent: {
    padding: 20,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '90%',
    height: '80%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
  },
  upgradeBtn: {
    backgroundColor: 'rgba(56, 62, 116, 0.5)',
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
});

export default ClickerGame;
