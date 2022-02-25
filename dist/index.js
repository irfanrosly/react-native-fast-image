import _extends from '@babel/runtime/helpers/extends';
import React, { forwardRef, memo } from 'react';
import { Platform, NativeModules, StyleSheet, requireNativeComponent, Image, View } from 'react-native';
import PropTypes from 'prop-types';

const isAndroid = Platform.OS === 'android';
const FastImageViewNativeModule = NativeModules.FastImageView;
const resizeMode = {
  contain: 'contain',
  cover: 'cover',
  stretch: 'stretch',
  center: 'center'
};
const priority = {
  low: 'low',
  normal: 'normal',
  high: 'high'
};
const cacheControl = {
  // Ignore headers, use uri as cache key, fetch only if not in cache.
  immutable: 'immutable',
  // Respect http headers, no aggressive caching.
  web: 'web',
  // Only load from cache.
  cacheOnly: 'cacheOnly'
};

function FastImageBase({
  source,
  defaultSource,
  tintColor,
  onLoadStart,
  onProgress,
  onLoad,
  onError,
  onLoadEnd,
  style,
  fallback,
  children,
  // eslint-disable-next-line no-shadow
  resizeMode = 'cover',
  forwardedRef,
  ...props
}) {
  if (fallback) {
    const cleanedSource = { ...source
    };
    delete cleanedSource.cache; // the TS is not up to date. resolveAssetSource returns a nullable.

    let resolvedSource = Image.resolveAssetSource(cleanedSource);

    if (resolvedSource !== null && typeof resolvedSource === 'object' && !('uri' in resolvedSource) && !('testUri' in resolvedSource)) {
      resolvedSource = null;
    }

    return /*#__PURE__*/React.createElement(View, {
      style: [styles.imageContainer, style],
      ref: forwardedRef
    }, /*#__PURE__*/React.createElement(Image, _extends({}, props, {
      style: StyleSheet.absoluteFill,
      source: resolvedSource,
      defaultSource: defaultSource,
      onLoadStart: onLoadStart,
      onProgress: onProgress,
      onLoad: onLoad,
      onError: onError,
      onLoadEnd: onLoadEnd,
      resizeMode: resizeMode
    })), children);
  }

  const resolvedSource = Image.resolveAssetSource(source);
  let resolvedDefaultSource;

  if (!defaultSource) {
    resolvedDefaultSource = null;
  } else {
    if (isAndroid) {
      // Android receives a URI string, and resolves into a Drawable using RN's methods
      const resolved = Image.resolveAssetSource(defaultSource);

      if (resolved) {
        resolvedDefaultSource = resolved.uri;
      } else {
        resolvedDefaultSource = null;
      }
    }
    /* iOS or other number mapped assets */
    else {
      // In iOS the number is passed, and bridged automatically into a UIImage
      resolvedDefaultSource = defaultSource;
    }
  }

  if ((tintColor === null || tintColor === undefined) && style) {
    tintColor = StyleSheet.flatten(style).tintColor;
  }

  return /*#__PURE__*/React.createElement(View, {
    style: [styles.imageContainer, style],
    ref: forwardedRef
  }, /*#__PURE__*/React.createElement(FastImageView, _extends({}, props, {
    tintColor: tintColor,
    style: StyleSheet.absoluteFill,
    source: resolvedSource,
    defaultSource: resolvedDefaultSource,
    onFastImageLoadStart: onLoadStart,
    onFastImageProgress: onProgress,
    onFastImageLoad: onLoad,
    onFastImageError: onError,
    onFastImageLoadEnd: onLoadEnd,
    resizeMode: resizeMode
  })), children);
}

const FastImageMemo = /*#__PURE__*/memo(FastImageBase);
const FastImageComponent = /*#__PURE__*/forwardRef((props, ref) => /*#__PURE__*/React.createElement(FastImageMemo, _extends({
  forwardedRef: ref
}, props)));
FastImageComponent.displayName = 'FastImage';
const FastImage = FastImageComponent;
FastImage.resizeMode = resizeMode;
FastImage.cacheControl = cacheControl;
FastImage.priority = priority;

FastImage.preload = sources => FastImageViewNativeModule.preload(sources);

FastImage.clearMemoryCache = () => FastImageViewNativeModule.clearMemoryCache();

FastImage.clearDiskCache = () => FastImageViewNativeModule.clearDiskCache();

const styles = StyleSheet.create({
  imageContainer: {
    overflow: 'hidden'
  }
}); // Types of requireNativeComponent are not correct.

const FastImageView = requireNativeComponent('FastImageView', FastImage, {
  nativeOnly: {
    onFastImageLoadStart: true,
    onFastImageProgress: true,
    onFastImageLoad: true,
    onFastImageError: true,
    onFastImageLoadEnd: true
  }
});

const CacheeImage = props => {
  var _source, _source2;

  let {
    source
  } = props;
  const {
    resizeMode,
    style,
    priority,
    headers,
    thumbnailSource
  } = props;

  if (!((_source = source) !== null && _source !== void 0 && _source.priority) && source.uri) {
    source = { ...source,
      ...(headers && {
        headers: headers
      }),
      ...(priority && {
        priority: 'high'
      })
    };
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, (_source2 = source) !== null && _source2 !== void 0 && _source2.uri ? /*#__PURE__*/React.createElement(FastImage, _extends({
    style: { ...style
    },
    source: source
  }, props, {
    resizeMode: resizeMode
  })) : /*#__PURE__*/React.createElement(Image, {
    source: thumbnailSource || source,
    resizeMode: resizeMode,
    style: { ...style
    },
    blurRadius: 10
  }));
};
CacheeImage.propTypes = {
  source: PropTypes.any.isRequired,
  name: PropTypes.string,
  key: PropTypes.string,
  priority: PropTypes.oneOf(['low', 'normal', 'high']),
  headers: PropTypes.any,
  resizeMode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'center']),
  thumbnailSource: PropTypes.string
};
CacheeImage.defaultProps = {
  priority: 'high'
};

export { CacheeImage, FastImage };
