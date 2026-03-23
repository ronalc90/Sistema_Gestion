import { Link } from 'react-router-dom'

interface Breadcrumb {
  label: string
  path?: string
}

interface PageHeaderProps {
  title: string
  breadcrumbs: Breadcrumb[]
}

export default function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <nav className="text-sm text-gray-500 flex items-center gap-1">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="mx-1">/</span>}
            {crumb.path ? (
              <Link to={crumb.path} className="hover:text-gray-700 transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  )
}
