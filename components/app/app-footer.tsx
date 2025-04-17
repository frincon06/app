export function AppFooter() {
  return (
    <footer className="py-6 mt-auto bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Sagrapp. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
