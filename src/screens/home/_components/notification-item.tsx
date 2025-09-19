import { StyleSheet, Text, View } from 'react-native';

const NotificationItem = ({ text }: { text: string }) => (
  <View style={styles.notificationItem}>
    <View style={styles.notificationDot} />
    <Text style={styles.notificationText}>{text}</Text>
  </View>
);

export default NotificationItem;

const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  notificationDot: {
    width: 8,
    height: 8,
    backgroundColor: '#ff69b4',
    borderRadius: 4,
    marginTop: 6,
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
