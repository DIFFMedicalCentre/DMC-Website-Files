import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-cyan-950 text-white py-8 w-full">
      {/* Ensure no horizontal overflow */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Location */}
          <div>
            <h4 className="font-bold text-xl mb-4">Location</h4>
            <p>No. 10, DIFF Road,</p>
            <p>Off Oladipo Diya Road,</p>
            <p>Gudu District,</p>
            <p>Abuja - Nigeria.</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-xl mb-4">Services</h4>
            <ul className="space-y-2">
              <li>CT Scanning</li>
              <li>Surgical Procedures</li>
              <li>Emergency Care</li>
              <li>Outpatient Services</li>
              <li>Patient Assistance</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-xl mb-4">Contact Us</h4>
            <p className="font-bold">Phone:</p>
            <p>(+234) 815 087 1200</p>
            <p>(+234) 815 087 1300</p>
            <p>(+234) 704 025 7410</p>

            <p>Email: info@diffmedicalcentre.com</p>
            <p>Working Hours: Mon - Sun: 24 Hours</p>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-xl mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/diffmc?mibextid=LQQJ4d&mibextid=LQQJ4d"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="hover:text-blue-500"
              >
                <FaFacebookF size={24} />
              </a>
              <a
                href="https://youtube.com/@diffmedicalcentre?si=qM0WZvv1Uu7kFmbo"
                target="_blank"
                rel="noreferrer"
                aria-label="Youtube"
                className="hover:text-blue-400"
              >
                <FaYoutube size={24} />
              </a>
              <a
                href="https://instagram.com/diffmedicalcentre_ng"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-pink-500"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
          {/* ISO Section */}
          <div className="flex justify-center items-center">
            <img
              src="ISO.png"
              alt="ISO icon"
              className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain"
            />
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 text-center border-t border-gray-700 pt-4">
          <p>&copy; 2024 DIFF Medical Centre, Inc. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
