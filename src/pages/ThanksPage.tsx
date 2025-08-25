const ThanksPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-blue-950 mb-4">Thank You!</h1>
      <p className="text-lg text-gray-700 max-w-xl">
        Your feedback has been successfully submitted. We appreciate your time
        and value your input—it helps us continue improving the quality of care
        at our hospital.
      </p>

      <a
        href="/"
        className="mt-8 inline-block bg-blue-950 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-900 transition"
      >
        Return to Home
      </a>
    </div>
  );
};

export default ThanksPage;
