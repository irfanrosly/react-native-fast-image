'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('@babel/runtime/helpers/extends');
var React = require('react');
var reactNative = require('react-native');
var PropTypes = require('prop-types');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _extends__default = /*#__PURE__*/_interopDefaultLegacy(_extends);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);

const isAndroid = reactNative.Platform.OS === 'android';
const FastImageViewNativeModule = reactNative.NativeModules.FastImageView;
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

    let resolvedSource = reactNative.Image.resolveAssetSource(cleanedSource);

    if (resolvedSource !== null && typeof resolvedSource === 'object' && !('uri' in resolvedSource) && !('testUri' in resolvedSource)) {
      resolvedSource = null;
    }

    return /*#__PURE__*/React__default['default'].createElement(reactNative.View, {
      style: [styles.imageContainer, style],
      ref: forwardedRef
    }, /*#__PURE__*/React__default['default'].createElement(reactNative.Image, _extends__default['default']({}, props, {
      style: reactNative.StyleSheet.absoluteFill,
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

  const resolvedSource = reactNative.Image.resolveAssetSource(source);
  let resolvedDefaultSource;

  if (!defaultSource) {
    resolvedDefaultSource = null;
  } else {
    if (isAndroid) {
      // Android receives a URI string, and resolves into a Drawable using RN's methods
      const resolved = reactNative.Image.resolveAssetSource(defaultSource);

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
    tintColor = reactNative.StyleSheet.flatten(style).tintColor;
  }

  return /*#__PURE__*/React__default['default'].createElement(reactNative.View, {
    style: [styles.imageContainer, style],
    ref: forwardedRef
  }, /*#__PURE__*/React__default['default'].createElement(FastImageView, _extends__default['default']({}, props, {
    tintColor: tintColor,
    style: reactNative.StyleSheet.absoluteFill,
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

const FastImageMemo = /*#__PURE__*/React.memo(FastImageBase);
const FastImageComponent = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React__default['default'].createElement(FastImageMemo, _extends__default['default']({
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

const styles = reactNative.StyleSheet.create({
  imageContainer: {
    overflow: 'hidden'
  }
}); // Types of requireNativeComponent are not correct.

const FastImageView = reactNative.requireNativeComponent('FastImageView', FastImage, {
  nativeOnly: {
    onFastImageLoadStart: true,
    onFastImageProgress: true,
    onFastImageLoad: true,
    onFastImageError: true,
    onFastImageLoadEnd: true
  }
});

const CustomFastImage = props => {
  var _source;

  let {
    source // already

  } = props;
  const {
    resizeMode,
    //already
    style,
    //already
    // name, //already ???
    // key, //already ???
    priority,
    // new
    headers // new

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
  } // facade pattern


  return /*#__PURE__*/React__default['default'].createElement(FastImage // key={key}
  // name={name}
  , _extends__default['default']({
    style: { ...style
    },
    source: source
  }, props, {
    resizeMode: resizeMode //   onLoad={onImageLoad}
    // onError={onError}

  }));
};
CustomFastImage.propTypes = {
  source: PropTypes__default['default'].any.isRequired,
  name: PropTypes__default['default'].string,
  key: PropTypes__default['default'].string,
  priority: PropTypes__default['default'].oneOf(['low', 'normal', 'high']),
  headers: PropTypes__default['default'].any,
  resizeMode: PropTypes__default['default'].oneOf(['contain', 'cover', 'stretch', 'center'])
};
CustomFastImage.defaultProps = {
  priority: 'high'
};

exports.CustomFastImage = CustomFastImage;
exports.FastImage = FastImage;
