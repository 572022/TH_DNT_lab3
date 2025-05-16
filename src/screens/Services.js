import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import { useMyContextController } from "../store";
import firestore from "@react-native-firebase/firestore";

const Services = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const [serviceLst, setServiceLst] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");
  const [serviceData, setServiceData] = useState([]);
  const cSERVICES = firestore().collection("SERVICES");

  useEffect(() => {
    if (!userLogin) {
      navigation.navigate("Login");
    } else {
      setIsAdmin(userLogin.role === "admin");
    }

    const unsubscribe = cSERVICES.onSnapshot((snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({ id: doc.id, ...data }); 
      });
      setServiceLst(list);
      setServiceData(list);
    });

    return () => unsubscribe();
  }, [navigation, userLogin]);

  useEffect(() => {
    const filtered = serviceLst.filter((s) =>
      s.serviceName.toLowerCase().includes(name.toLowerCase())
    );
    setServiceData(filtered);
  }, [name, serviceLst]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ServiceDetail", { id: item.id })}
    >
      <View style={styles.borderFlatlst}>
        <View style={styles.serviceItem}>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
          <Text style={styles.servicePrice}>{item.price} VND</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {userLogin?.fullName?.toUpperCase() ?? ""}
        </Text>
        <IconButton
          icon="account-circle"
          size={40}
          iconColor="#fff"
          onPress={() => navigation.navigate("Profile")}
        />
      </View>

      <View style={styles.innerContainer}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <TextInput
          label="Search name"
          value={name}
          onChangeText={setName}
          underlineColor="transparent"
          style={styles.searchInput}
        />

        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>Danh sách dịch vụ</Text>
          {isAdmin && (
            <IconButton
              icon="plus-circle"
              size={40}
              iconColor="#ff1493"
              onPress={() => navigation.navigate("AddNewService")}
            />
          )}
        </View>

        <FlatList
          data={serviceData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default Services;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#ff1493",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 20,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    margin: 20,
    padding: 10,
    alignSelf: "center",
    height: 100,
    width: 200,
  },
  searchInput: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "grey",
  },
  listHeader: {
    height: 50,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  listHeaderText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
  },
  borderFlatlst: {
    borderWidth: 1,
    borderColor: "grey",
    marginBottom: 10,
    margin: 10,
    borderRadius: 20,
    paddingVertical: 20,
  },
  serviceItem: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  serviceName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  servicePrice: {
    fontSize: 18,
  },
});
