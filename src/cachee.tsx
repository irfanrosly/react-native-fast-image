import React from 'react'
import FastImage from './FastImage'
import PropTypes from 'prop-types'

export const CacheeImage = (props: any) => {
    let { source, thumbnailSource } = props
    const { resizeMode, style, priority, headers } = props
    if (!source?.priority && source.uri) {
        source = {
            ...source,
            ...(headers && { headers: headers }),
            ...(priority && { priority: 'high' }),
        }
    }

    const renderSource = () => {
        if (source?.uri.includes('http')) {
            return source
        } else if (!source?.uri.includes('http') && thumbnailSource) {
            return thumbnailSource
        } else {
            return source
        }
    }

    console.log(renderSource())
    return (
        <>
            <FastImage
                style={{ ...style }}
                source={renderSource()}
                // {...props}
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
