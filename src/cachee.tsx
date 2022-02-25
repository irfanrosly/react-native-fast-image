import React from 'react'
import { Animated } from 'react-native'
import FastImage from './FastImage'
import PropTypes from 'prop-types'

export const CacheeImage = (props: any) => {
    const thumbnailOpacity = new Animated.Value(0)
    const imageOpacity = new Animated.Value(0.8)
    let { source } = props
    const { resizeMode, style, priority, headers, thumbnailSource } = props
    const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)
    if (!source?.priority && source.uri) {
        source = {
            ...source,
            ...(headers && { headers: headers }),
            ...(priority && { priority: 'high' }),
        }
    }

    const onLoadThumbnail = () => {
        Animated.timing(thumbnailOpacity, {
            toValue: 1,
            useNativeDriver: true,
        }).start()
    }

    const onLoadImage = () => {
        Animated.timing(imageOpacity, {
            toValue: 1,
            useNativeDriver: true,
        }).start()
    }

    return (
        <>
            {source?.uri ? (
                <AnimatedFastImage
                    style={{ ...style, opacity: imageOpacity }}
                    source={source}
                    {...props}
                    resizeMode={resizeMode}
                    onLoad={onLoadImage}
                />
            ) : (
                <Animated.Image
                    source={thumbnailSource || source}
                    resizeMode={resizeMode}
                    style={{ ...style, opacity: imageOpacity }}
                    blurRadius={10}
                    onLoad={onLoadThumbnail}
                />
            )}
        </>
    )
}

CacheeImage.propTypes = {
    source: PropTypes.any.isRequired,
    name: PropTypes.string,
    key: PropTypes.string,
    priority: PropTypes.oneOf(['low', 'normal', 'high']),
    headers: PropTypes.any,
    resizeMode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'center']),
    thumbnailSource: PropTypes.object,
}

CacheeImage.defaultProps = {
    priority: 'high',
}
