import React from 'react'
import FastImage from './FastImage'
import PropTypes from 'prop-types'

export const CacheeImage = (props: any) => {
    let { source, thumbnailSource } = props
    const { resizeMode, style, priority, headers, defaultSource } = props
    if (!source?.priority && source.uri) {
        source = {
            ...source,
            ...(headers && { headers: headers }),
            ...(priority && { priority: 'high' }),
        }
    }

    const renderSource = () => {
        if (!source?.uri?.includes('http') && thumbnailSource) {
            return thumbnailSource
        } else if (!thumbnailSource && !source && defaultSource) {
            return (source = { ...defaultSource })
        } else {
            return source
        }
    }

    return (
        <>
            <FastImage
                style={{ ...style }}
                source={renderSource()}
                resizeMode={resizeMode}
            />
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
