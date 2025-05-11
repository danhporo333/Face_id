import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import loginStyles from "../components/style/LoginScreen.style";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { loginApi } from "../services/authService";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Login">>();

  const handleLogin = async () => {
    try {
      const data = await loginApi(username, password);
      navigation.reset({
        index: 0,
        routes: [{ name: "Home", params: { token: data.data.token } }],
      });
    } catch (error) {
      console.log("Login error:", error);
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <KeyboardAvoidingView
      style={loginStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={loginStyles.form}>
        <Text style={loginStyles.title}>Đăng nhập</Text>
        <TextInput
          style={loginStyles.input}
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={loginStyles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={loginStyles.button} onPress={handleLogin}>
          <Text style={loginStyles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
        <Text style={loginStyles.forgot}>Quên mật khẩu?</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
