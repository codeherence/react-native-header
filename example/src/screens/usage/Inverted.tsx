import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { randParagraph, randUuid } from '@ngneat/falso';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  Header,
  ScrollHeaderProps,
  FlatListWithHeaders,
  SurfaceComponentProps,
} from '@codeherence/react-native-header';
import { Avatar, BackButton } from '../../components';
import { RANDOM_IMAGE_NUM } from '../../constants';
import { range } from '../../utils';
import type { InvertedUsageScreenNavigationProps } from '../../navigation';

const HeaderSurface: React.FC<SurfaceComponentProps> = () => {
  return <BlurView style={StyleSheet.absoluteFill} tint="systemChromeMaterialDark" />;
};

const HeaderComponent: React.FC<ScrollHeaderProps> = ({ showNavBar }) => {
  const navigation = useNavigation();
  const onPressProfile = () => navigation.navigate('Profile');

  return (
    <Header
      showNavBar={showNavBar}
      noBottomBorder
      headerCenterFadesIn={false}
      headerCenter={
        <Text style={styles.navBarTitle} numberOfLines={1}>
          Elon Musk
        </Text>
      }
      headerRight={
        <TouchableOpacity onPress={onPressProfile}>
          <Avatar size="sm" source={{ uri: `https://i.pravatar.cc/128?img=${RANDOM_IMAGE_NUM}` }} />
        </TouchableOpacity>
      }
      headerLeft={<BackButton color="white" />}
      SurfaceComponent={HeaderSurface}
    />
  );
};

interface ChatMessage {
  id: string;
  message: string;
  type: 'sent' | 'received';
}

const data: ChatMessage[] = range({ end: 100 }).map((i) => {
  const id = randUuid();
  const message = randParagraph();
  const type = i % 2 === 0 ? 'sent' : 'received';

  return { id, message, type };
});

const ChatMessage: React.FC<ChatMessage> = ({ message, type }) => {
  return (
    <View style={type === 'sent' ? styles.sentMessageContainer : styles.receivedMessageContainer}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const Inverted: React.FC<InvertedUsageScreenNavigationProps> = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="light" />
      <FlatListWithHeaders
        data={data}
        renderItem={({ item }) => <ChatMessage {...item} />}
        HeaderComponent={HeaderComponent}
        keyExtractor={(item) => item.id}
        inverted
        absoluteHeader
        containerStyle={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingTop: bottom }]}
        showsVerticalScrollIndicator
        indicatorStyle={'white'}
      />
    </>
  );
};

export default Inverted;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  contentContainer: {
    backgroundColor: 'black',
    paddingHorizontal: 12,
  },
  navBarTitle: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  messageText: {
    color: 'white',
  },
  sentMessageContainer: {
    backgroundColor: '#186BE7',
    alignSelf: 'flex-start',
    borderRadius: 12,
    maxWidth: '75%',
    padding: 12,
    marginVertical: 12,
  },
  receivedMessageContainer: {
    backgroundColor: '#1F2329',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    borderRadius: 12,
    maxWidth: '75%',
    padding: 12,
    marginVertical: 12,
  },
  separator: {
    height: 24,
  },
});
