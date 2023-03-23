[<img src="https://user-images.githubusercontent.com/28550574/226236177-4d946b20-e4c2-4843-83d2-cb93ed74225d.png" width="100%" alt="React Native Header by Codeherence">](https://codeherence.com)

# React Native Header

React Native Header is a high-performance, cross-platform animated header component for React Native applications. It provides an easy-to-use interface for developers to quickly create beautiful and dynamic navigation headers.

| iOS | Android |
| ------------- | ------------- |
| <img src="https://user-images.githubusercontent.com/128341688/226800421-03a17bd1-aeb9-4ff3-89e6-c51634e40c75.gif" alt="iOS React Native Header Showcase" width="100%">  | <img src="https://user-images.githubusercontent.com/128341688/226800411-5130076d-613a-49c9-b690-41a306b6414e.gif" alt="Android React Native Header Showcase" width="100%"> |

## Features

- Maintains a similar experience between **iOS** and **Android**.
- Uses Reanimated for better animation performance
- Works with [ScrollView](https://reactnative.dev/docs/scrollview) and [FlatList](https://reactnative.dev/docs/flatlist)

## Prerequisites

Before you can use `react-native-header`, you need to have the following libraries set up in your React Native project:

- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)
- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)

If you haven't installed these libraries yet, please follow the installation instructions on their respective documentation pages.

## Installation

Once you have [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated) and [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context) set up in your project, you can install `react-native-header` using `yarn` or `npm`:

```sh
yarn add @codeherence/react-native-header
```

or:

```sh
npm install @codeherence/react-native-header
```

## Example

Let's implement a regular ScrollView with a large header:

<p align="center">
<img src="https://user-images.githubusercontent.com/128341688/226802772-31c970c9-7093-491f-abbc-db5337b7c904.gif" alt="Example Showcase" width="40%" />
</p>

First, we import the library:

```jsx
import {
  Header,
  LargeHeader,
  ScalingView,
  ScrollViewWithHeaders,
} from '@codeherence/react-native-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
```

Then we create our header component:

```jsx
const HeaderComponent = ({ showNavBar }) => (
  <Header
    showNavBar={showNavBar}
    headerCenter={<Text style={{ fontSize: 16, fontWeight: 'bold' }}>react-native-header</Text>}
  />
);
```

and our large header component:

```jsx
const LargeHeaderComponent = ({ scrollY }) => (
  <LargeHeader>
    <ScalingView scrollY={scrollY}>
      <Text style={{ fontSize: 14 }}>Welcome!</Text>
      <Text style={{ fontSize: 32, fontWeight: 'bold' }}>react-native-header</Text>
      <Text style={{ fontSize: 12, fontWeight: 'normal', color: '#8E8E93' }}>
        This project displays some header examples using the package.
      </Text>
    </ScalingView>
  </LargeHeader>
);
```

and finally, use them in a `ScrollViewWithHeaders` component like so:

```jsx
const Example = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
      contentContainerStyle={{ paddingBottom: bottom }}
    >
      <View style={{ padding: 16 }}>
        <Text>Some body text...</Text>
        <Text>Some body text...</Text>
      </View>
    </ScrollViewWithHeaders>
  );
};
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)