import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import Customer from "../screens/Customer";
import Admin from "../screens/Admin";
import Register from "../screens/Register";
import ProfileAllUser  from "../screens/ProfileAllUser";
import EditProfile from "../screens/EditProfile";
import CustomerAdmin from "../screens/CustomerAdmin";
import EditProfileAllUser from "../screens/EditProfileAllUser";
import ChangePassword  from "../screens/ChangePassword";
import UpdateService from "../screens/UpdateService";
const Stack = createStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="Customer" component={Customer} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ProfileAllUser" component={ProfileAllUser} />
      <Stack.Screen name="CustomerAdmin" component={CustomerAdmin} />
      <Stack.Screen name="EditProfileAllUser" component={EditProfileAllUser} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="UpdateService" component={UpdateService} />

    </Stack.Navigator>
  );
};

export default Router;
