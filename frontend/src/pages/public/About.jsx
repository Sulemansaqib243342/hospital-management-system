export default function About() {
  return (
    <div className="font-sans text-gray-800">
      {/* Header Section */}
      <section className="bg-primary-50 py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-600 text-xs font-bold tracking-wider mb-4 uppercase">
            Who We Are
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">About SS pharmaceuticals</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">Dedicated to providing exceptional healthcare services with compassion, innovation, and clinical excellence.</p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/10 to-transparent rounded-3xl transform -translate-x-4 translate-y-4 -z-10"></div>
            <img src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Hospital Building" className="rounded-3xl shadow-xl w-full h-[450px] object-cover border-8 border-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary-800 mb-6 relative inline-block">
              Our History
              <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-primary-600 -mb-2 rounded-full"></span>
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
              Founded in 2008, SS pharmaceuticals started as a small clinic with a vision to provide accessible and quality healthcare to the community. Over the years, we have grown into a premier multi-specialty hospital, serving thousands of patients annually.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              Our journey has been fueled by a continuous commitment to medical excellence, investing in advanced technology, and bringing together some of the brightest medical minds. Today, we stand as a beacon of hope and healing in the region.
            </p>
            <div className="flex gap-4">
              <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 flex-1 text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">15+</div>
                <div className="text-sm font-medium text-gray-600">Years Experience</div>
              </div>
              <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 flex-1 text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">300+</div>
                <div className="text-sm font-medium text-gray-600">Beds Facility</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/50 hover:border-primary-600/30 transition-colors">
            <div className="w-14 h-14 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-8 shadow-md shadow-primary-800/20">
              <i className="ti ti-target"></i>
            </div>
            <h3 className="text-2xl font-bold text-primary-800 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              To improve the health and well-being of the communities we serve by providing high-quality, patient-centered care in a compassionate, safe, and technologically advanced environment.
            </p>
          </div>
          <div className="bg-primary-800 p-10 rounded-3xl shadow-lg shadow-primary-800/30 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/5 blur-2xl"></div>
            <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center text-2xl mb-8 backdrop-blur-sm border border-white/20">
              <i className="ti ti-eye"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-primary-100 leading-relaxed text-lg relative z-10">
              To be the trusted healthcare partner of choice, recognized globally for our clinical excellence, innovative medical solutions, and outstanding patient experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
