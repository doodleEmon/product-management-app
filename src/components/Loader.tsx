// import React from 'react'
// import { CgSpinner } from 'react-icons/cg'

// export default function Loader() {
//     return (
//         <div className="text-lg animate-spin">
//             <CgSpinner size={32} />
//         </div>
//     )
// }


export default function Loader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-[#4E6E5D] border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
}