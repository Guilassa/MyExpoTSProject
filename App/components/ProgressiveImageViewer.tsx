import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';

interface Props {
  thumbnailSource: {uri: string};
  source: {uri: string};
  style: {width: number; height: number};
  resizeMode: string;
}

interface State {}

export default class ProgressiveImageViewer extends React.Component<
  Props,
  State
> {
  thumbnailAnimated: any;
  handleThumbnailLoad: any;
  imageAnimated: any;
  onImageLoad: any;
  render() {
    const {thumbnailSource, source, style, ...props} = this.props;
    return (
      <View style={styles.container}>
        <Animated.Image
          {...props}
          source={thumbnailSource}
          style={[style, {opacity: this.thumbnailAnimated}]}
          onLoad={this.handleThumbnailLoad}
          blurRadius={1}
        />
        <Animated.Image
          {...props}
          source={source}
          style={[styles.imageOverlay, {opacity: this.imageAnimated}, style]}
          onLoad={this.onImageLoad}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    backgroundColor: '#e1e4e8',
  },
});
