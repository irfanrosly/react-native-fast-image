import React from 'react'

import FastImage from './index' //install from MBB fork with D++ features ;)
import PropTypes from 'prop-types'

//i need to allow any props existing comes
export const CustomFastImage = (props: any) => {
    let {
        source, // already
    } = props

    const {
        resizeMode, //already
        style, //already
        // name, //already ???
        // key, //already ???
        priority, // new
        headers, // new
    } = props

    if (!source?.priority && source.uri) {
        source = {
            ...source,
            ...(headers && { headers: headers }),
            ...(priority && { priority: 'high' }),
        }
    }

    // facade pattern

    return (
        <FastImage
            // key={key}
            // name={name}
            style={{ ...style }}
            source={source}
            {...props}
            resizeMode={resizeMode}
            //   onLoad={onImageLoad}
            // onError={onError}
        />
    )
}

CustomFastImage.propTypes = {
    source: PropTypes.any.isRequired,
    name: PropTypes.string,
    key: PropTypes.string,

    priority: PropTypes.oneOf(['low', 'normal', 'high']),
    headers: PropTypes.any,

    resizeMode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'center']),
}

CustomFastImage.defaultProps = {
    priority: 'high',
}
