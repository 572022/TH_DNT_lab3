import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { logout, useMyContextController } from "../store";
import ChangePassword from "./ChangePassword";
import Admin from "./Admin";
import Login from "./Login";
const Setting = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const handleLogout = () => {
    logout(dispatch);
  };
  useEffect(() => {
    if (userLogin == null) navigation.navigate("Login");
  }, [userLogin]);
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button
        style={styles.logoutBtn}
        mode="contained"
        onPress={() => navigation.navigate("ChangePassword")}
      >
        Đổi mât khẩu
      </Button>
      <Button style={styles.logoutBtn} mode="contained" onPress={handleLogout}>
        Đăng xuất
      </Button>
    </View>
  );
};
export default Setting;
const styles = StyleSheet.create({
  logoutBtn: {
    margin: 10,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#ff1493",
  },
});
