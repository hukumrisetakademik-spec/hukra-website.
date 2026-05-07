import { Suspense } from 'react'
import DashboardContent from './DashboardContent'

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div style={{width:32,height:32,borderRadius:'50%',border:'3px solid #E9ECEF',borderTopColor:'#1B3A6B',animation:'spin 1s linear infinite'}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>}>
      <DashboardContent />
    </Suspense>
  )
}
