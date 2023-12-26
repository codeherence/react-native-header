// The domain defines the type of data that will be used in the application.

interface IUser {
  id: string;
  handle: string;
  displayName: string;
  profileURL: string;
  verified: boolean;
}

type IBodyString = { type: 'text'; text: string };
type IBodyLink = { type: 'link'; text: string; url: string };
type IBodyHandle = { type: 'handle'; userHandle: string };
type IBodyHashTags = { type: 'hashtag'; text: string };
type IPostBodyPart = IBodyString | IBodyLink | IBodyHandle | IBodyHashTags;

interface IPostAttachment {
  id: string;
  type: 'image';
  url: string;
}

export type IPost = {
  id: string;
  author: IUser;
  body: IPostBodyPart[];
  attachments: IPostAttachment[];
  date: string;
  replies: number;
  retweets: number;
  likes: number;
  views: number;
  bookmarks: number;
} & (
  | {
      retweeted: false;
    }
  | {
      retweeted: true;
      retweetedBy: IUser;
    }
);

export { POSTS } from './data';
