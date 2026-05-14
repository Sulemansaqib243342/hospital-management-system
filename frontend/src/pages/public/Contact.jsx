export default function Contact() {
  return (
    <div className="font-sans text-gray-800 bg-primary-50 min-h-screen">
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-600 text-xs font-bold tracking-wider mb-4 uppercase">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">Contact SS pharmaceuticals</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">Have a question or need to book an appointment? Reach out to us using the details below or send us a message securely.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 flex items-start gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-md shadow-primary-800/20">
                <i className="ti ti-phone-call"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-800 mb-1">Emergency Call</h3>
                <p className="text-gray-600 mb-2 leading-relaxed">Available 24/7 for medical emergencies.</p>
                <p className="text-2xl font-bold text-primary-600">+92 3293109487</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 flex items-start gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                <i className="ti ti-mail"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-800 mb-1">Email Support</h3>
                <p className="text-gray-600 mb-2 leading-relaxed">For general inquiries and appointments.</p>
                <p className="text-lg font-medium text-gray-900">sulemansaqib34917@gmail.com</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 flex items-start gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                <i className="ti ti-map-pin"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-800 mb-1">Location</h3>
                <p className="text-gray-600 leading-relaxed">
                  123 Health Avenue, Medical City<br />
                  State, 12345
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
            <h2 className="text-2xl font-bold text-primary-800 mb-6">Send us a message</h2>
            <form className="space-y-5" onSubmit={e => { e.preventDefault(); alert('Message sent successfully!'); }}>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                  <input type="text" required className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                  <input type="text" required className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:bg-white transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input type="email" required className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                <textarea required rows="4" className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:bg-white transition-all"></textarea>
              </div>
              <button type="submit" className="w-full bg-primary-600 text-white rounded-xl px-4 py-3.5 font-bold hover:bg-primary-800 transition-all shadow-lg shadow-primary-800/20 mt-2 flex justify-center items-center gap-2">
                Send Message <i className="ti ti-send"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
