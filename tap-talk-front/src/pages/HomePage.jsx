import { Link } from "react-router-dom"
import { MessageSquare } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <MessageSquare className="h-6 w-6" />
            <span>TapTalk</span>
          </Link>
          <nav className="flex gap-4 sm:gap-6">
            <a href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Acerca de
            </a>
            <a href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Términos
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-6 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Chatea con extraños</h1>
          <p className="mx-auto max-w-[600px] text-zinc-500 md:text-xl lg:text-base xl:text-xl">
            Conecta con personas aleatorias de todo el mundo a través de mensajes de texto anónimos.
          </p>
        </div>
        <div className="space-y-4">
          <Link to="/chat">
            <button className="h-12 px-8 rounded-md bg-black text-white font-medium hover:bg-black/90 transition-colors">
              Iniciar Chat
            </button>
          </Link>
          <p className="text-xs text-zinc-500 mt-6">
            Al hacer clic en "Iniciar Chat", aceptas nuestros términos de servicio.
          </p>
        </div>
      </main>
      <footer className="border-t py-6 px-4 lg:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-zinc-500">© 2025 TapTalk. Todos los derechos reservados.</p>
          <nav className="flex gap-4 sm:gap-6">
            <a href="#" className="text-xs hover:underline underline-offset-4">
              Privacidad
            </a>
            <a href="#" className="text-xs hover:underline underline-offset-4">
              Términos
            </a>
            <a href="#" className="text-xs hover:underline underline-offset-4">
              Contacto
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
