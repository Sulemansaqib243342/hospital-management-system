import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-primary-50 py-20 lg:py-32 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 z-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary-100 text-primary-800 text-sm font-bold tracking-wide mb-6 uppercase">
              Excellence in Healthcare
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-800 leading-[1.15] mb-6">
              Your Health is Our <span className="text-primary-600">Top Priority</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              SS pharmaceuticals provides world-class medical services with state-of-the-art facilities and a team of dedicated professionals committed to your well-being.
            </p>
            <div className="flex gap-4">
              <Link to="/contact" className="bg-primary-600 text-white px-7 py-3.5 rounded-lg font-semibold hover:bg-primary-800 transition-all shadow-lg shadow-primary-600/20">
                Book Appointment
              </Link>
              <Link to="/services" className="bg-white text-primary-600 border-2 border-primary-100 px-7 py-3.5 rounded-lg font-semibold hover:border-primary-600 transition-all">
                Our Services
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/10 to-primary-400/10 rounded-3xl transform rotate-2 scale-105 z-0"></div>
            <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Hospital interior and staff" className="rounded-3xl shadow-2xl relative z-10 object-cover h-[450px] w-full border-4 border-white" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">Why Choose SS pharmaceuticals?</h2>
            <p className="text-lg text-gray-600">We combine cutting-edge technology with compassionate care to deliver the best healthcare experience for our patients.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-10 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <i className="ti ti-user-heart"></i>
              </div>
              <h3 className="text-xl font-bold text-primary-800 mb-3">Expert Doctors</h3>
              <p className="text-gray-600 leading-relaxed">Our team consists of highly qualified and experienced medical professionals from around the globe.</p>
            </div>
            <div className="p-10 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <i className="ti ti-microscope"></i>
              </div>
              <h3 className="text-xl font-bold text-primary-800 mb-3">Modern Technology</h3>
              <p className="text-gray-600 leading-relaxed">We utilize the latest medical equipment and technologies for accurate diagnoses and effective treatments.</p>
            </div>
            <div className="p-10 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <i className="ti ti-ambulance"></i>
              </div>
              <h3 className="text-xl font-bold text-primary-800 mb-3">24/7 Emergency Care</h3>
              <p className="text-gray-600 leading-relaxed">Our emergency department is open around the clock to provide immediate medical attention when you need it most.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          <div>
            <div className="text-5xl font-extrabold mb-3 text-white">15+</div>
            <div className="text-primary-100 font-semibold tracking-wide uppercase text-sm">Years of Excellence</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold mb-3 text-white">50+</div>
            <div className="text-primary-100 font-semibold tracking-wide uppercase text-sm">Specialist Doctors</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold mb-3 text-white">10k+</div>
            <div className="text-primary-100 font-semibold tracking-wide uppercase text-sm">Happy Patients</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold mb-3 text-white">24/7</div>
            <div className="text-primary-100 font-semibold tracking-wide uppercase text-sm">Emergency Service</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-6">Ready to prioritize your health?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">Schedule an appointment with our specialists today and take the first step towards a healthier life.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-800 transition-all shadow-xl shadow-primary-600/20">
            Contact Us Now <i className="ti ti-arrow-right"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}
