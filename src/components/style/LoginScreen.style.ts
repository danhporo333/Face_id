import { StyleSheet } from "react-native";

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
  },
  form: {
    width: "90%",
    maxWidth: 350,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    marginBottom: 28,
    textAlign: "center",
    fontWeight: "bold",
    color: "#1976d2",
    letterSpacing: 1,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#90caf9",
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: "#f6fbff",
    color: "#222",
  },
  button: {
    backgroundColor: "#1976d2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  forgot: {
    marginTop: 16,
    color: "#1976d2",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});

export default loginStyles;
