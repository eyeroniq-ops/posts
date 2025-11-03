import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { generateImage } from './services/geminiService';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [language, setLanguage] = useState<string>('Spanish');
  const [style, setStyle] = useState<string>('match');
  const [colorSource, setColorSource] = useState<'logo' | 'reference'>('logo');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setEditedImageUrl(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReferenceImageUpload = (file: File) => {
    setReferenceImage(file);
    setEditedImageUrl(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setReferenceImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = useCallback(async () => {
    if (!originalImage || !prompt) {
      setError('Por favor, sube un logo y describe la publicación.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setEditedImageUrl(null);

    let styleInstruction = '';
    switch (style) {
        case 'modern':
            styleInstruction = 'Crea un diseño moderno, dinámico y profesional. Utiliza técnicas como elementos superpuestos, formas geométricas (círculos, líneas) y una fuerte jerarquía visual para que la publicación sea llamativa.';
            break;
        case 'elegant':
            styleInstruction = 'Diseña un diseño elegante y minimalista. Utiliza líneas limpias, amplio espacio en blanco y tipografía sofisticada. La sensación general debe ser de alta gama y refinada.';
            break;
        case 'playful':
            styleInstruction = 'Crea un diseño lúdico y divertido. Utiliza colores vivos (inspirados en el logo o en la referencia), fuentes caprichosas y formas dinámicas y enérgicas. El ambiente debe ser alegre y atractivo.';
            break;
        case 'corporate':
            styleInstruction = 'Diseña un diseño corporativo y profesional. Utiliza una cuadrícula estructurada, tipografía limpia y una paleta de colores conservadora. El aspecto debe ser fiable y serio.';
            break;
        case 'match':
        default:
            styleInstruction = "El estilo de diseño de la publicación (por ejemplo, moderno, minimalista, lúdico) DEBE coincidir con la estética general del logo proporcionado. El diseño y la composición deben sentirse como una extensión natural de la marca.";
            break;
    }

    const colorInstruction = (colorSource === 'reference' && referenceImage)
        ? "El diseño de la publicación DEBE estar fuertemente inspirado en la paleta de colores de la IMAGEN DE REFERENCIA proporcionada. Utiliza colores de la imagen de referencia para los fondos, el texto y los elementos gráficos."
        : "El diseño de la publicación DEBE estar fuertemente inspirado en la paleta de colores del logo. Utiliza los colores del logo para los fondos, el texto y los elementos gráficos.";
    
    const referenceImageInstruction = referenceImage
        ? "Además, utiliza la imagen de referencia proporcionada como inspiración de estilo y composición."
        : "";

    const systemInstruction = `Eres un diseñador gráfico experto en redes sociales especializado en activos de marca fotorrealistas de alta calidad. Tu tarea es crear una impresionante publicación para redes sociales basada en el logo de un usuario, un texto y sus preferencias de estilo.
Instrucciones:
1. Analiza las Entradas: Se te proporcionará un logo, una imagen de referencia opcional y un texto.
2. Calidad de Salida: La imagen final generada DEBE ser de alta calidad y tener un estilo fotorrealista de 'imagen', adecuada para el feed de redes sociales de una marca profesional. Debe parecer una fotografía real o un diseño gráfico de alta gama. Evita absolutamente los estilos de dibujos animados, ilustrados o dibujados a mano.
3. Diseña la Publicación: Crea un gráfico completo para redes sociales que sea visualmente atractivo y efectivo para el marketing.
4. Paleta de Colores: ${colorInstruction}
5. Idioma: El texto en la publicación debe estar en ${language}.
6. Diseño y Composición: ${styleInstruction} ${referenceImageInstruction}
7. Integra el Logo: Coloca el logo proporcionado en la publicación en una posición natural y prominente, como lo haría una marca. La primera imagen proporcionada es siempre el logo.
8. Solicitud del Usuario: El tema central, el texto y las imágenes de la publicación deben basarse en la siguiente solicitud del usuario:`;

    const fullPrompt = `${systemInstruction} "${prompt}"`;

    try {
      const base64Image = await generateImage(originalImage, referenceImage, fullPrompt);
      setEditedImageUrl(`data:image/png;base64,${base64Image}`);
    } catch (e) {
      console.error(e);
      setError('Error al generar la imagen. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, referenceImage, prompt, language, style, colorSource]);

  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-[var(--color-light-pink)] font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-dark-pink)] to-[var(--color-bright-pink)]">
            Publicaciones con IA
          </h1>
          <p className="mt-2 text-lg text-[var(--color-light-pink)] opacity-80 max-w-2xl mx-auto">
            Sube el logo de tu marca, describe tu publicación y deja que la IA genere un gráfico personalizado para redes sociales en segundos.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Input Column */}
          <div className="flex flex-col gap-6 bg-[var(--color-dark)] p-6 rounded-2xl border border-[var(--color-dark-pink)]">
            <div>
              <label className="block text-lg font-semibold mb-3">1. Sube el Logo de tu Marca</label>
              <ImageUploader onImageUpload={handleImageUpload} imageUrl={originalImageUrl} />
            </div>

            <div>
              <label htmlFor="prompt" className="block text-lg font-semibold mb-3">2. Describe la Publicación</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: 'Una publicación anunciando nuestra nueva colección de verano' o 'Un anuncio promocional con un 20% de descuento'."
                className="w-full h-32 p-3 bg-[var(--color-dark)] border border-[var(--color-dark-pink)] rounded-lg focus:ring-2 focus:ring-[var(--color-bright-pink)] focus:border-[var(--color-bright-pink)] transition-colors duration-200 resize-none placeholder-[var(--color-light-pink)] placeholder-opacity-50"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3">3. (Opcional) Sube una Imagen de Referencia</label>
              <ImageUploader onImageUpload={handleReferenceImageUpload} imageUrl={referenceImageUrl} />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="language" className="block text-lg font-semibold mb-3">Idioma</label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 bg-[var(--color-dark)] border border-[var(--color-dark-pink)] rounded-lg focus:ring-2 focus:ring-[var(--color-bright-pink)] focus:border-[var(--color-bright-pink)] transition-colors duration-200"
                  disabled={isLoading}
                >
                  <option value="Spanish">Español</option>
                  <option value="English">Inglés</option>
                  <option value="French">Francés</option>
                  <option value="German">Alemán</option>
                  <option value="Portuguese">Portugués</option>
                  <option value="Italian">Italiano</option>
                  <option value="Dutch">Holandés</option>
                </select>
              </div>
              <div>
                <label htmlFor="style" className="block text-lg font-semibold mb-3">Estilo Visual</label>
                <select
                  id="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-3 bg-[var(--color-dark)] border border-[var(--color-dark-pink)] rounded-lg focus:ring-2 focus:ring-[var(--color-bright-pink)] focus:border-[var(--color-bright-pink)] transition-colors duration-200"
                  disabled={isLoading}
                >
                  <option value="match">Coincidir con Estilo del Logo (Defecto)</option>
                  <option value="modern">Moderno y Geométrico</option>
                  <option value="elegant">Elegante y Minimalista</option>
                  <option value="playful">Juguetón y Divertido</option>
                  <option value="corporate">Corporativo y Profesional</option>
                </select>
              </div>
            </div>

            {referenceImage && (
              <div>
                  <label htmlFor="colorSource" className="block text-lg font-semibold mb-3">Fuente de Color</label>
                  <select
                    id="colorSource"
                    value={colorSource}
                    onChange={(e) => setColorSource(e.target.value as 'logo' | 'reference')}
                    className="w-full p-3 bg-[var(--color-dark)] border border-[var(--color-dark-pink)] rounded-lg focus:ring-2 focus:ring-[var(--color-bright-pink)] focus:border-[var(--color-bright-pink)] transition-colors duration-200"
                    disabled={isLoading}
                  >
                    <option value="logo">Usar Colores del Logo</option>
                    <option value="reference">Usar Colores de la Imagen de Referencia</option>
                  </select>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isLoading || !originalImage || !prompt}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-bright-pink)] hover:bg-[var(--color-dark-pink)] disabled:bg-transparent disabled:border disabled:border-[var(--color-dark-pink)] disabled:text-[var(--color-light-pink)] text-[var(--color-dark)] font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando...
                </>
              ) : (
                <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                  Generar Publicación
                </>
              )}
            </button>
          </div>

          {/* Output Column */}
          <div className="bg-[var(--color-dark)] p-6 rounded-2xl border border-[var(--color-dark-pink)]">
            <h2 className="text-lg font-semibold mb-3">Publicación Generada</h2>
            <ImageDisplay 
              imageUrl={editedImageUrl} 
              isLoading={isLoading} 
              error={error} 
            />
          </div>
        </main>
        <footer className="text-center py-4 mt-8">
          <p className="text-sm text-[var(--color-light-pink)] opacity-70">
            2025 eyeroniq &reg;
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;