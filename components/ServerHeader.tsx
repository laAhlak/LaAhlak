import Link from 'next/link'

interface ServerHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  backHref?: string
}

export default function ServerHeader({ 
  title, 
  subtitle, 
  showBackButton = false, 
  backHref = '/dashboard' 
}: ServerHeaderProps) {
  return (
    <div className="bg-primary-500 px-6 py-4">
      <div className="flex items-center justify-between">
        {showBackButton ? (
          <Link href={backHref} className="text-white text-xl">
            ← العودة
          </Link>
        ) : (
          <div className="w-8"></div>
        )}
        
        <div className="text-center">
          <h1 className="text-white text-lg font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-secondary-300 text-sm">{subtitle}</p>
          )}
        </div>
        
        <div className="w-8"></div>
      </div>
    </div>
  )
}
