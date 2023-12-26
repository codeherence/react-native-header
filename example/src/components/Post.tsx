import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import TwitterVerifiedSvg from '../../assets/twitter-verified.svg';
import { Avatar } from './Avatar';
import type { IPost } from '../domain';

const { height: dHeight } = Dimensions.get('window');
const MIN_POST_HEIGHT = dHeight * 0.3;
const DISABLED_COLOR = 'rgba(255, 255, 255, 0.6)';

interface PostBodyProps {
  body: IPost['body'];
}

const PostBody: React.FC<PostBodyProps> = ({ body }) => {
  return (
    <Text>
      {body.map((bodyPart) => {
        if (bodyPart.type === 'text') {
          return <Text style={styles.text}>{bodyPart.text}</Text>;
        }
        return null;
      })}
    </Text>
  );
};

interface PostProps {
  post: IPost;
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <View style={styles.container}>
      {/* Retweet container */}
      {/* <View /> */}

      <View style={styles.post}>
        <View style={styles.profileImgContainer}>
          <Avatar size="sm" source={{ uri: post.author.profileURL }} />
        </View>

        <View style={styles.postContent}>
          <View style={styles.postHeader}>
            <Feather
              name="more-horizontal"
              size={16}
              color={DISABLED_COLOR}
              style={styles.moreButton}
            />
            <View style={styles.postHeaderAuthor}>
              <Text style={styles.displayName}>{post.author.displayName}</Text>
              {post.author.verified && <TwitterVerifiedSvg height={18} width={18} />}
              <Text style={styles.disabledText}>@{post.author.handle}</Text>
              <View style={styles.dot} />
              <Text style={styles.disabledText}>4h</Text>
            </View>
          </View>
          <View style={styles.postBody}>
            <PostBody body={post.body} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
    minHeight: MIN_POST_HEIGHT,
  },
  post: {
    width: '100%',
    flexDirection: 'row',
  },
  profileImgContainer: {
    paddingHorizontal: 12,
  },
  postContent: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  postHeaderAuthor: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  displayName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
  postBody: {
    paddingTop: 12,
  },
  disabledText: {
    color: DISABLED_COLOR,
  },
  moreButton: {
    paddingRight: 12,
  },
  dot: {
    backgroundColor: DISABLED_COLOR,
    width: 2,
    height: 2,
    borderRadius: 1,
  },
});
