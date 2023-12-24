import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TwitterProfileWithTabsScreenNavigationProps } from '../../navigation';

const TwitterProfileWithTabs: React.FC<TwitterProfileWithTabsScreenNavigationProps> = () => {
  return (
    <View style={styles.container}>
      <Text>Hello, World</Text>
    </View>
  );
};

export default TwitterProfileWithTabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
