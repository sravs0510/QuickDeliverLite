import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">QuickDeliver Lite</h3>
            <p className="mb-4">Fast, reliable, and efficient delivery service connecting customers with drivers.</p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a key={social} href="#" className="hover:text-white transition">
                  <span className="sr-only">{social}</span>
                  <div className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center">
                    {social.charAt(0).toUpperCase()}
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Features', 'How It Works', 'Pricing', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {['Help Center', 'Driver Resources', 'Customer Guides', 'FAQs', 'Blog'].map((resource) => (
                <li key={resource}>
                  <a href="#" className="hover:text-white transition">{resource}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Contact Us</h4>
            <address className="not-italic space-y-2">
              <div>123 Delivery St, City, Country</div>
              <div>+1 (555) 123-4567</div>
              <div>support@quickdeliver.com</div>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} QuickDeliver Lite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;