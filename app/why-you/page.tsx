export default function WhyYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-900 via-rose-800 to-red-900 text-white p-8">
      <div className="max-w-2xl text-center space-y-6 backdrop-blur-xl bg-white/10 p-10 rounded-3xl border border-white/20">
        <h1 className="text-4xl font-bold">Why You’re My Person 💖</h1>

        <ul className="space-y-3 text-lg">
          <li>• You make me feel safe.</li>
          <li>• You make me laugh.</li>
          <li>• You choose me every day.</li>
        </ul>

        <p className="text-pink-300">And I’ll always choose you too.</p>
      </div>
    </div>
  );
}
