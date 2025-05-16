import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useRoute } from "@react-navigation/native";
import { useMyContextController } from "../store";
import DatePicker from "react-native-date-picker";

const ServiceDetail = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  const dSERVICE = firestore().collection("SERVICES");
  const APPOIMENTS = firestore().collection("APPOINTMENTS");
  const route = useRoute();
  const { id } = route.params;

  const [service, setService] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [datetime, setDatetime] = useState(new Date());
  const [open, setOpen] = useState(false);

  const handleAddNewApppoiment = () => {
    APPOIMENTS.add({
      customerId: userLogin.fullname,
      serviceId: id,
      datetime,
      state: "new",
      complete: false,
      email: userLogin.email,
    }).then((response) =>
      APPOIMENTS.doc(response.id).update({ id: response.id })
    );
    navigation.goBack();
  };

  const confirmDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắn chắn muốn xóa không!",
      [
        {
          text: "CANCEL",
          onPress: () => console.log("Hủy xóa"),
          style: "cancel",
        },
        {
          text: "DELETE",
          onPress: handleDelete,
        },
      ],
      { cancelable: false }
    );
  };

  const handleDelete = () => {
    dSERVICE
      .doc(id)
      .delete()
      .then(() => {
        Alert.alert("Delete success");
        navigation.goBack();
      })
      .catch((e) => Alert.alert("Delete failed", e.message));
  };

  useEffect(() => {
    if (!userLogin) {
      navigation.navigate("Login");
      return;
    }

    setIsAdmin(userLogin.role === "admin");

    // Show delete button for admin
    if (userLogin.role === "admin") {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            icon="delete"
            onPress={confirmDelete}
            iconColor="#fff"
          />
        ),
      });
    }

    // Subscribe to service data
    const unsubscribe = dSERVICE.doc(id).onSnapshot((doc) => {
      if (doc.exists) {
        setService(doc.data());
      } else {
        setService(null);
      }
    });

    return () => unsubscribe();
  }, [id, userLogin]);

  const handleButtonPress = () => {
    if (isAdmin) {
      navigation.navigate("UpdateService", { id: service.id });
    } else {
      handleAddNewApppoiment();
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {service ? (
        <>
          {/* Ảnh */}
          {service.image && (
            <View style={{ marginBottom: 10 }}>
              <Image source={{ uri: service.image }} style={{ height: 300 }} />
            </View>
          )}

          {/* Tên dịch vụ */}
          <View style={styles.row}>
            <Text style={styles.txtName}>Service name: </Text>
            <Text style={styles.txtTitle}>{service.serviceName}</Text>
          </View>

          {/* Giá */}
          <View style={styles.row}>
            <Text style={styles.txtName}>Price: </Text>
            <Text style={styles.txtTitle}>{service.price}</Text>
          </View>

          {/* Chỉ admin thấy creator, createAt, updatedAt */}
          {isAdmin && (
            <>
              <View style={styles.row}>
                <Text style={styles.txtName}>Create by: </Text>
                <Text style={styles.txtTitle}>{service.createBy}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.txtName}>Created at: </Text>
                <Text style={styles.txtTitle}>
                  {service.createAt?.toDate().toLocaleString() ?? "N/A"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.txtName}>Last updated: </Text>
                <Text style={styles.txtTitle}>
                  {service.updatedAt?.toDate().toLocaleString() ?? "N/A"}
                </Text>
              </View>
            </>
          )}

          {/* Người dùng chọn thời gian hẹn */}
          {!isAdmin && (
            <View style={{ marginBottom: 10 }}>
              <TouchableOpacity onPress={() => setOpen(true)}>
                <Text>
                  Choose date time:{" "}
                  {datetime.toLocaleDateString() + " " + datetime.toLocaleTimeString()}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <DatePicker
            modal
            open={open}
            date={datetime}
            onConfirm={(date) => {
              setOpen(false);
              setDatetime(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />

          {/* Nút Update hoặc Đặt lịch */}
          <Button
            mode="contained"
            onPress={handleButtonPress}
            style={styles.btn}
          >
            {isAdmin ? "Update" : "Payment"}
          </Button>
        </>
      ) : (
        <Text style={styles.txtTitle}>Service not found or deleted</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  txtName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  txtTitle: {
    fontSize: 18,
  },
  btn: {
    borderRadius: 5,
    backgroundColor: "#ff1493",
    marginTop: 10,
  },
});

export default ServiceDetail;
