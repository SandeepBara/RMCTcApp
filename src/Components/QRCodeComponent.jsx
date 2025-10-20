import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

function QRCodeComponent({
  value = "https://example.com",
  size = 200,
  bgColor = "#ffffff",
  fgColor = "#000000",
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <QRCode
        value="https://example.com"
        size={size}
        color={fgColor}
        backgroundColor={bgColor}
      />
    </View>
  );
}

export default QRCodeComponent
