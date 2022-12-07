import React from "react"
import Spinner from 'react-spinner-material'

export default function Loader() {
    return <div className="loading">
                    <Spinner stroke="10" color="#293264" radius="100" />
            </div>
}