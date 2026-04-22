import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { launchImageLibrary } from "react-native-image-picker";
import {
  OCRWebView,
  createReactNativeOCR,
} from "@luciaocr/react-native";

const templates = [
  { value: "general", label: "General" },
  { value: "idCard", label: "ID Card" },
  { value: "bankCard", label: "Bank Card" },
  { value: "driverLicense", label: "Driver License" },
];

export default function App() {
  const ocr = useMemo(
    () =>
      createReactNativeOCR({
        onProgress: () => {},
      }),
    []
  );
  const webViewRef = useRef(null);
  const [template, setTemplate] = useState("general");
  const [imageUri, setImageUri] = useState("");
  const [status, setStatus] = useState("idle");
  const [statusText, setStatusText] = useState("Waiting to initialize");
  const [result, setResult] = useState(null);
  const [errorText, setErrorText] = useState("");

  async function initializeOCR() {
    setStatus("initializing");
    setStatusText("Initializing OCR engine...");
    setErrorText("");

    try {
      ocr.onProgress = (message) => {
        setStatusText(message || "Initializing OCR engine...");
      };

      await ocr.init();
      setStatus("ready");
      setStatusText("OCR engine ready");
    } catch (error) {
      setStatus("error");
      setStatusText("Initialization failed");
      setErrorText(error?.message || "Initialization failed");
    }
  }

  async function chooseImage() {
    const response = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 1,
      includeBase64: false,
    });

    if (response.didCancel) {
      return;
    }

    if (response.errorMessage) {
      setErrorText(response.errorMessage);
      return;
    }

    const asset = response.assets?.[0];
    if (!asset?.uri) {
      setErrorText("No image selected");
      return;
    }

    setImageUri(asset.uri);
    setResult(null);
    setErrorText("");
  }

  async function startRecognition() {
    if (!imageUri) {
      Alert.alert("Select an image first");
      return;
    }

    setStatus("recognizing");
    setStatusText("Recognizing...");
    setErrorText("");
    setResult(null);

    try {
      const nextResult = await ocr.recognize({ uri: imageUri }, template);
      setResult(nextResult);
      setStatus("success");
      setStatusText("Recognition complete");
    } catch (error) {
      setStatus("error");
      setStatusText("Recognition failed");
      setErrorText(error?.message || "Recognition failed");
    }
  }

  async function copyResult() {
    if (!result) {
      return;
    }

    const content = JSON.stringify(result, null, 2);
    await Clipboard.setString(content);
    setStatusText("Result copied");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <OCRWebView
        ref={webViewRef}
        controller={ocr}
        style={styles.hiddenWebView}
        webViewProps={{
          onLoadEnd: initializeOCR,
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>luciaocr Demo Native</Text>
        <Text style={styles.subtitle}>
          Hidden WebView bridge with bundled OCR runtime assets
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Engine</Text>
            <Text style={styles.value}>{statusText}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Template</Text>
          <View style={styles.templateRow}>
            {templates.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.templateChip,
                  item.value === template && styles.templateChipActive,
                ]}
                onPress={() => setTemplate(item.value)}
              >
                <Text
                  style={[
                    styles.templateText,
                    item.value === template && styles.templateTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Image</Text>
          <TouchableOpacity style={styles.pickButton} onPress={chooseImage}>
            <Text style={styles.pickButtonText}>
              {imageUri ? "Replace image" : "Choose image"}
            </Text>
          </TouchableOpacity>

          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <Text style={styles.emptyText}>No image selected yet</Text>
          )}

          <TouchableOpacity style={styles.primaryButton} onPress={startRecognition}>
            <Text style={styles.primaryButtonText}>Recognize</Text>
          </TouchableOpacity>
        </View>

        {errorText ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Error</Text>
            <Text style={styles.errorText}>{errorText}</Text>
          </View>
        ) : null}

        {result ? (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.sectionTitle}>Result</Text>
              <Text style={styles.metaText}>{result.duration || 0} ms</Text>
            </View>

            <Text style={styles.resultText}>
              {JSON.stringify(result, null, 2)}
            </Text>

            <TouchableOpacity style={styles.secondaryButton} onPress={copyResult}>
              <Text style={styles.secondaryButtonText}>Copy result</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  container: {
    padding: 24,
    gap: 16,
  },
  hiddenWebView: {
    width: 1,
    height: 1,
    opacity: 0,
  },
  title: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 6,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#111827",
    borderColor: "#1f2937",
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    gap: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    color: "#94a3b8",
    fontSize: 14,
  },
  value: {
    color: "#e2e8f0",
    fontSize: 14,
    flex: 1,
    textAlign: "right",
  },
  sectionTitle: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "600",
  },
  templateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  templateChip: {
    backgroundColor: "#0f172a",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  templateChipActive: {
    borderColor: "#38bdf8",
    backgroundColor: "rgba(56, 189, 248, 0.12)",
  },
  templateText: {
    color: "#cbd5e1",
    fontSize: 13,
  },
  templateTextActive: {
    color: "#38bdf8",
  },
  pickButton: {
    backgroundColor: "#334155",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  pickButtonText: {
    color: "#f8fafc",
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    backgroundColor: "#020617",
  },
  emptyText: {
    color: "#64748b",
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: "#38bdf8",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#082f49",
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#e2e8f0",
    fontWeight: "600",
  },
  resultText: {
    color: "#cbd5e1",
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 20,
  },
  errorText: {
    color: "#fca5a5",
    lineHeight: 20,
  },
  metaText: {
    color: "#38bdf8",
  },
});
