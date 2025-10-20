export default function Loading() {
  return (
    <main className="min-h-screen bg-background-500 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
        <p className="text-secondary-500">جاري التحميل...</p>
      </div>
    </main>
  )
}
