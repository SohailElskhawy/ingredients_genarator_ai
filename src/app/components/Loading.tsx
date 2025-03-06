import React from 'react'
import './Loading.css'
function Loading() {

    return (
        <div className="loading_bg">
            <div className="loading_content">
                <div className="loading_dots">
                    <div className="loading_dot"></div>
                    <div className="loading_dot"></div>
                    <div className="loading_dot"></div>
                </div>
            </div>
        </div>
    )
}

export default Loading