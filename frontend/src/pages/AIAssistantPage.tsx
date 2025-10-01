import { useState } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente virtual de AutoMatch. Estoy aquí para ayudarte a encontrar el vehículo perfecto para ti. Puedes preguntarme sobre:\n\n• Recomendaciones según tu presupuesto\n• Comparaciones entre modelos\n• Características específicas que buscas\n• Mejores opciones por tipo de uso\n\n¿En qué puedo ayudarte hoy?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const response = generateMockResponse(userMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsLoading(false)
    }, 1500)
  }

  const generateMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('presupuesto') || lowerQuery.includes('precio')) {
      return 'Entiendo que el presupuesto es importante. ¿Cuál es tu rango de precio ideal? Con esa información puedo recomendarte los mejores vehículos que se ajusten a tu presupuesto.'
    }
    
    if (lowerQuery.includes('familiar') || lowerQuery.includes('familia')) {
      return 'Para una familia, te recomendaría considerar:\n\n• **SUVs**: Como la Mazda CX-5 o Honda CR-V (5-7 asientos)\n• **Minivans**: Toyota Sienna para máxima capacidad\n• **Sedans amplios**: Toyota Camry o Honda Accord\n\n¿Cuántos miembros tiene tu familia? Así puedo ser más específico.'
    }
    
    if (lowerQuery.includes('económico') || lowerQuery.includes('eficiente')) {
      return 'Los vehículos más eficientes en combustible incluyen:\n\n• **Híbridos**: Toyota Prius (25+ km/l)\n• **Compactos**: Nissan Versa (18-20 km/l)\n• **Sedans eficientes**: Honda Civic (16-18 km/l)\n\n¿Prefieres un híbrido o un vehículo tradicional de gasolina?'
    }
    
    return 'Basándome en tu consulta, puedo ayudarte mejor si me das más detalles sobre:\n\n• Tu presupuesto aproximado\n• El uso principal (ciudad, carretera, trabajo)\n• Número de pasajeros habituales\n• Características importantes para ti\n\n¿Cuál de estos aspectos es más prioritario para ti?'
  }

  const suggestedQuestions = [
    '¿Qué SUV recomiendas por menos de $700,000?',
    'Necesito un auto familiar para 7 personas',
    '¿Cuál es el sedan más eficiente en combustible?',
    'Compara Toyota Camry vs Honda Accord'
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4 shadow-2xl">
              <Bot className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Asistente IA de AutoMatch</h1>
            <p className="text-gray-600">Tu experto personal en vehículos, disponible 24/7</p>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100">
            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[70%] ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}
                  >
                    <div
                      className={`inline-block p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="px-6 pb-4">
                <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  Preguntas sugeridas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInput(question)
                        handleSendMessage()
                      }}
                      className="text-sm px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 transform"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t-2 border-gray-100 p-4 bg-gray-50">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe tu pregunta aquí..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600 shadow-sm hover:shadow-md transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 transform">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">IA Inteligente</h3>
              </div>
              <p className="text-sm text-gray-600">
                Nuestro asistente aprende de tus preferencias para darte mejores recomendaciones
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 transform">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-100 text-black rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">Respuestas Rápidas</h3>
              </div>
              <p className="text-sm text-gray-600">
                Obtén información instantánea sobre cualquier vehículo en nuestro catálogo
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 transform">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-100 text-black rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">Personalizado</h3>
              </div>
              <p className="text-sm text-gray-600">
                Recomendaciones adaptadas a tu presupuesto y necesidades específicas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}