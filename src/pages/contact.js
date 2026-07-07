export default function Contact() {
  return (
    <div className="flex w-full h-full bg-gradient-to-b from-white-100 to-white-300 justify-center items-center mt-40 px-8 py-16">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-indigo-700">
          Contactez-nous
        </h1>

        <p className="text-lg text-gray-700 mb-8">
          Notre équipe <strong>Starry Health</strong> est disponible pour répondre à vos
          questions et vous accompagner. Que vous soyez vendeur ou client, nous
          sommes à votre écoute.
        </p>

        <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
          <p className="text-lg text-gray-600">
            📞 Téléphone : <span className="font-medium">+243 970 000 000</span>
          </p>
          <p className="text-lg text-gray-600">
            💬 WhatsApp : <span className="font-medium">+243 970 000 000</span>
          </p>
          <p className="text-lg text-gray-600">
            📧 Email :{" "}
            <a
              href="mailto:contact@starryhealth.com"
              className="text-indigo-600 font-medium"
            >
              contact@starryhealth.com
            </a>
          </p>
          <p className="text-lg text-gray-600">
            🌐 Réseaux sociaux :
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="https://www.facebook.com/starryhealth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/starryhealth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 font-medium"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@starryhealth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black font-medium"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
