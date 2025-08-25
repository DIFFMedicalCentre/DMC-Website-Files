import NavbarHome from "../components/NavbarHome";
import Footer from "../components/Footer";
import Counter from "../components/Counter";
import { Slide } from "react-slideshow-image";
import { Link } from "react-router-dom";
import "react-slideshow-image/dist/styles.css";
import PromoModal from "../components/PromoModal";
import Carousel from "../components/Blogpostcarousel";

const slideImages = [
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/4.jpg",
  "/5.jpg",
  "/6.jpg",
  "/7.jpg",
  "/8.jpg",
  "/9.jpg",
  "/10.jpg",
];

const servicesData = [
  { id: 1, title: "In-vitro fertilization (IVF)", icon: "🤰" },
  {
    id: 2,
    title: "Obstetrics & Gynecology",
    icon: "👶",
    url: "/obstetrics-gynecology",
  },
  { id: 3, title: "Paediatrics", icon: "🍼" },
  { id: 4, title: "Family Medicine & Therapy", icon: "👨‍⚕️🧘‍♂️" },
  { id: 8, title: "Dental Clinic", icon: "🦷" },
  { id: 8, title: "Endocrinology", icon: "🦋🩸" },
  { id: 12, title: "Physiotherapy & Rehabilitation", icon: "🧑‍🦽" },
  { id: 4, title: "Laboratory Services", icon: "🔬" },
  { id: 5, title: "Orthopaedics and Trauma", icon: "🩺" },
  { id: 6, title: "Rapid Response", icon: "🚑" },

  { id: 7, title: "Surgery", icon: "💉" },

  { id: 9, title: "Radiology", icon: "🖼️" },
  { id: 10, title: "Eye Clinic", icon: "👁️" },
  { id: 11, title: "Anaesthesia & Intensive Care", icon: "💊" },

  { id: 13, title: "E.N.T Clinic", icon: "👂" },
];

const Home = () => {
  return (
    <div>
      <NavbarHome />
      <PromoModal />
      <div className="slide-container">
        <Slide>
          {slideImages.map((image, index) => (
            <div key={index} className="w-full">
              <div
                className="flex items-center justify-center bg-cover bg-center w-full relative"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                  height: "100vh",
                }}
              >
                <img src={image} alt={`slide ${index}`} className="hidden" />
              </div>
            </div>
          ))}
        </Slide>
      </div>

      <div className="flex justify-center items-center flex-col container max-w-7xl p-5 m-auto">
        <div className="max-w-full flex flex-col justify-center items-center">
          <p className="text-5xl font-serif text-gray-800 text-center font-semibold">
            Welcome to DIFF Medical Centre
          </p>
          <p className="leading-9 text-center text-[1.5rem] pt-9">
            A renowned state of the Art Medical Facility We provide the most
            full medical services, so every person could have the opportunity to
            receive qualitative medical help. Our Hospitals have grown to
            provide a world-class facility for various treatments. We are among
            the most qualified Healthcare providers in Nigeria with over 13
            years of quality healthcare, training and experience.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="text-center py-10">
          <h1 className="text-5xl font-serif font-semibold text-gray-800">
            Our Services
          </h1>
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">
          {servicesData.map((service) => (
            <Link
              to={service.url || "#"} // Ensure to provide a fallback URL if `url` is undefined
              key={service.id}
              className="group"
            >
              <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-xl hover:border-blue-950 hover:border-2 h-[180px]">
                <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">
                  {service.icon}
                </div>
                <h2 className="text-xl font-semibold text-center text-gray-800">
                  {service.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-8">
          Our Achievements
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <Counter end={1000} title="Happy Clients" />
          <Counter end={500} title="Projects Completed" />
          <Counter end={50} title="Awards Won" />
        </div>
      </div>

      <div className="flex items-center justify-center m-11">
        <a
          href="/appointment"
          className="bg-gray-800 text-white rounded-md p-2 hover:bg-white hover:text-gray-800 font-bold border-2 shadow-md"
        >
          Book An Appointment with Us
        </a>
      </div>
      <div>
        <Carousel />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
