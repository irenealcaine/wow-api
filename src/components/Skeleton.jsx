/* eslint-disable react/prop-types */
import './Skeleton.css'

function Skeleton({ className = '', style }) {
  return <div className={`skeleton ${className}`.trim()} style={style} aria-hidden="true" />
}

export default Skeleton
