function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          React + Vite + Tailwind
        </h1>
        <p className="text-gray-600 mb-6">
          프로젝트가 성공적으로 생성되었습니다!
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">React 18</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Vite</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Tailwind CSS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
