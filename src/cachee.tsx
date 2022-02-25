import React from 'react'
import { Image } from 'react-native'
import FastImage from './FastImage'
import PropTypes from 'prop-types'

export const CacheeImage = (props: any) => {
    let { source } = props

    const { resizeMode, style, priority, headers, thumbnailSource } = props

    if (!source?.priority && source.uri) {
        source = {
            ...source,
            ...(headers && { headers: headers }),
            ...(priority && { priority: 'high' }),
        }
    }

    return (
        <>
            {source?.uri ? (
                <FastImage
                    style={{ ...style }}
                    source={source}
                    {...props}
                    resizeMode={resizeMode}
                />
            ) : (
                <Image
                    source={thumbnailSource || source}
                    resizeMode={resizeMode}
                    style={{ ...style }}
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
    thumbnailSource: PropTypes.string,
}

CacheeImage.defaultProps = {
    priority: 'high',
}
