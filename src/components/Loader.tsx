import React from 'react'
import { CgSpinner } from 'react-icons/cg'

export default function Loader() {
    return (
        <div className="text-lg animate-spin">
            <CgSpinner size={32} />
        </div>
    )
}
