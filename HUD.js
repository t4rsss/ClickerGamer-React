import React from "react";
import { View, Text, StyleSheet,Dimensions} from "react-native";

const { width, height } = Dimensions.get('window');
export default function HUD({ btc, score, time }) {
  return (
    <View style={styles.hud}>
      {/* BTC */}
      <View style={styles.item}>
        <Text style={styles.text}>BTC: {btc.toFixed(2)} </Text>
      </View>

      {/* Score */}
      <View style={styles.item}>
        <Text style={styles.text}>BTC/Click: {score}</Text>
      </View>

      {/* Tempo */}
      <View style={styles.item}>
        <Text style={styles.text}>BTC/s: {time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    position: "absolute",
    top: height * 0.05, 
    width:width,
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    backgroundColor: '#16161c',
    borderWidth: 3,
    borderColor: '#6fa341',
    color: '#a3c255',
    padding: 10,
    zIndex: 10,
    height: 60,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
