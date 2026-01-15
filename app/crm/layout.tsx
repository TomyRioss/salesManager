export default function CRMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 bg-gray-50 overflow-hidden">
      {children}
    </div>
  )
}
