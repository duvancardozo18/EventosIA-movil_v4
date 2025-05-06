import React from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

const ChatBotScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://cdn.botpress.cloud/webchat/v2.4/shareable.html?configUrl=https://files.bpcontent.cloud/2025/04/29/17/20250429171130-M9YUWV4B.json' }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        // onError={(e) => console.warn('WebView error:', e.nativeEvent)}
        // onLoadEnd={() => console.log('WebView carga finalizada')}
        injectedJavaScript={`
          window.ReactNativeWebView.postMessage(document.documentElement.innerHTML);
          true;
        `}
        // onMessage={(event) => {
        //   console.log('Contenido:', event.nativeEvent.data);
        // }}
      />
    </SafeAreaView>
  );
};

export default ChatBotScreen;
