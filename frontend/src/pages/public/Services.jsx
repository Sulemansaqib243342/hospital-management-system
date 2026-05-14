export default function Services() {
  const departments = [
    { name: 'Cardiology', icon: 'ti-heart-rate-monitor', desc: 'Comprehensive care for your heart including diagnostics, treatment, and surgery.' },
    { name: 'Neurology', icon: 'ti-brain', desc: 'Advanced treatment for neurological disorders, stroke management, and neurosurgery.' },
    { name: 'Orthopedics', icon: 'ti-bone', desc: 'Specialized care for bones, joints, ligaments, tendons, and muscles.' },
    { name: 'Pediatrics', icon: 'ti-baby-carriage', desc: 'Compassionate healthcare for infants, children, and adolescents.' },
    { name: 'General Medicine', icon: 'ti-stethoscope', desc: 'Primary care, preventive medicine, and treatment of adult diseases.' },
    { name: 'Emergency Services', icon: 'ti-ambulance', desc: '24/7 trauma and emergency care equipped with modern life-saving tech.' },
  ];

  return (
    <div className="font-sans text-gray-800 bg-primary-50 min-h-screen">
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-600 text-xs font-bold tracking-wider mb-4 uppercase">
            What We Do
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">Our Specialties & Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">We offer a wide range of medical specialties and subspecialties, all supported by modern technology and expert medical staff to ensure you receive the best care.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, idx) => (
            <div key={idx} className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary-600/30 transition-all duration-300 group">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors shadow-sm">
                <i className={`ti ${dept.icon}`}></i>
              </div>
              <h3 className="text-xl font-bold text-primary-800 mb-3">{dept.name}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{dept.desc}</p>
              <button className="text-primary-600 font-semibold text-sm flex items-center gap-1 hover:text-primary-800 group-hover:gap-2 transition-all">
                Learn more <i className="ti ti-arrow-right"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
