import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useMyContextController } from "../store";
import firestore from "@react-native-firebase/firestore";

const Transaction = ({ navigation }) => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;
  const [appointmentList, setAppointmentList] = useState([]);

  const TRANSACTION = firestore().collection("APPOINTMENTS");
  const SERVICE_COLLECTION = firestore().collection("SERVICES");

  useEffect(() => {
    if (!userLogin) {
      navigation.navigate("Login");
      return;
    }

    const unsubscribe = TRANSACTION.onSnapshot(async (snapshot) => {
      try {
        const appointments = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const serviceId = data.serviceId || "";
            let serviceName = "Không rõ";

            try {
              const serviceDoc = await SERVICE_COLLECTION.doc(serviceId).get();
              if (serviceDoc.exists) {
                serviceName = serviceDoc.data().serviceName;
              }
            } catch (err) {
              console.warn(`Không lấy được service ${serviceId}`);
            }

            return {
              id: doc.id,
              ...data,
              service: serviceName,
            };
          })
        );

        setAppointmentList(appointments);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    });

    return () => unsubscribe();
  }, [userLogin]);

  const handleAccept = (id, complete) => {
    TRANSACTION.doc(id).update({ complete: !complete });
  };

  const renderItem = ({ item }) => (
    <View style={styles.borderItem}>
      <View style={{ flex: 1, padding: 5 }}>
        <Text style={styles.label}>
          User name: <Text style={styles.value}>{item.customerId}</Text>
        </Text>
        <Text style={styles.label}>
          Service name: <Text style={styles.value}>{item.service}</Text>
        </Text>
        <Text style={styles.label}>
          Date:{" "}
          <Text style={styles.value}>
            {item.datetime?.toDate?.().toLocaleString() || "Không rõ"}
          </Text>
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <IconButton
          icon={
            item.complete
              ? "check-circle"
              : "checkbox-blank-circle-outline"
          }
          color={item.complete ? "green" : "gray"}
          onPress={() => handleAccept(item.id, item.complete)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Danh sách dịch vụ đăng ký
      </Text>
      <FlatList
        data={appointmentList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Không có dữ liệu
          </Text>
        }
      />
    </View>
  );
};

export default Transaction;

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  title: {
    color: "#000",
    fontWeight: "bold",
    marginBottom: 10,
  },
  borderItem: {
    borderWidth: 1,
    borderColor: "grey",
    marginBottom: 10,
    borderRadius: 15,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontWeight: "normal",
  },
  iconContainer: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
