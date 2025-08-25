import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const App = () => {
  const services = [
    {
      title: "Prenatal Care",
      description: "High-quality care for expecting mothers.",
    },
    {
      title: "Gynecological Surgery",
      description: "Advanced minimally invasive procedures.",
    },
    {
      title: "Family Planning",
      description: "Personalized contraceptive advice and solutions.",
    },
    {
      title: "Infertility Treatment",
      description: "Comprehensive fertility services and support.",
    },
  ];

  const testimonials = [
    {
      name: "Jane Doe",
      feedback: "The care I received during my pregnancy was outstanding!",
    },
    {
      name: "Sarah Smith",
      feedback:
        "Expert guidance and compassionate care throughout my treatment.",
    },
    {
      name: "Emily Brown",
      feedback: "Highly recommend their services for any women's health needs.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gray-100">
        {/* Hero Section */}
        <section className="bg-blue-950 text-white py-16 px-8 text-center">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in">
            Obstetrics & Gynecology Care
          </h1>
          <p className="text-lg mb-8">
            Comprehensive care for women's health at every stage of life.
          </p>
          <a
            href="#services"
            className="px-6 py-3 bg-white text-blue-950 font-semibold rounded-lg hover:bg-gray-200 transition-all"
          >
            Explore Services
          </a>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transform transition duration-300"
              >
                <h3 className="text-xl font-semibold text-blue-950 mb-4">
                  {service.title}
                </h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-8 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-8">
            Patient Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transform transition duration-300"
              >
                <p className="italic">"{testimonial.feedback}"</p>
                <h3 className="mt-4 text-blue-950 font-semibold">
                  {testimonial.name}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-blue-950 text-white py-16 px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Book an Appointment?
          </h2>
          <p className="mb-8">
            Get the best care from our experienced specialists.
          </p>
          <a
            href="#"
            className="px-6 py-3 bg-white text-blue-950 font-semibold rounded-lg hover:bg-gray-200 transition-all"
          >
            Book Now
          </a>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default App;
