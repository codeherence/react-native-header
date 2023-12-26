import type { IPost } from '.';
import { range } from '../utils';

const generatePosts = (numPosts: number): IPost[] => {
  return range({ end: numPosts }).map((i) => ({
    id: String(i),
    author: {
      id: String(i),
      displayName: 'Elon Musk',
      handle: 'elon',
      profileURL: `https://i.pravatar.cc/128?img=${Math.floor(Math.random() * numPosts)}`,
      verified: Math.random() < 0.5,
    },
    body: [
      {
        type: 'text',
        text:
          'X is changing the world\n\n' +
          'SpaceX is changing the world\n\n' +
          'Tesla is changing the world\n\n' +
          'Neuralink will change the world\n\n' +
          'XAI will change our universe\n\n' +
          'The Boring Company will change the world\n\n' +
          'The quest continues...',
      },
    ],
    attachments: [],
    date: new Date().toISOString(),
    replies: 349,
    retweets: 378,
    likes: 2253,
    views: 93426,
    bookmarks: 47,
    retweeted: false,
  }));
};

export const POSTS = generatePosts(20);
