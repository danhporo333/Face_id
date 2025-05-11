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
const FAKE_USER = { username: "admin", password: "123456" };

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === FAKE_USER.username && password === FAKE_USER.password) {
      alert("Đăng nhập thành công!");
    } else {
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
