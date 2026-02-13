export default function MemoriesPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-900 via-orange-800 to-rose-900 text-white p-8">
      <div className="max-w-2xl text-center space-y-6 backdrop-blur-xl bg-white/10 p-10 rounded-3xl border border-white/20">
        <h1 className="text-4xl font-bold">Our Best Moments 📸</h1>
        <p className="text-lg">Little moments that became forever memories.</p>
        <ul className="space-y-3 text-lg">
          <li>• That first photo together.</li>
          <li>• Laughing until midnight.</li>
          <li>• Every adventure, big or small.</li>
        </ul>
        <p className="text-yellow-300">Let’s make more memories.</p>
      </div>
    </div>
  );
}
