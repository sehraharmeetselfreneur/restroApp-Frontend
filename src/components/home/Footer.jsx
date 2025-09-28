import { Download, Facebook, Instagram, Mail, MapPin, Phone, Pizza, Twitter, Youtube } from 'lucide-react'
import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Company Info */}
                  <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                                <Pizza className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">EAT&GO</span>
                                <div className="text-sm text-gray-400">Premium Food Delivery</div>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6 max-w-md">
                            Your favorite restaurants, delivered to your doorstep. Experience the best food delivery service with premium quality and lightning-fast delivery.
                        </p>
                        <div className="flex space-x-4">
                            <Facebook className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <Twitter className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <Instagram className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <Youtube className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                        </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {['About Us', 'Careers', 'Partner With Us', 'Help & Support', 'Privacy Policy', 'Terms of Service'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                  </div>
                    
                  {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Contact Us</h4>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-orange-500" />
                                <span className="text-gray-300">+91 98765 43210</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-orange-500" />
                                <span className="text-gray-300">support@eatngo.com</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-orange-500 mt-1" />
                                <span className="text-gray-300">
                                    123 Food Street,<br />
                                    Faridabad, Haryana 121001
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                    
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-gray-400 text-center md:text-left">
                        © 2025 EAT&GO. All rights reserved. Made with ❤️ in India
                    </p>
                    <div className="flex items-center space-x-6 mt-4 md:mt-0">
                        <span className="text-gray-400">Available on:</span>
                        <div className="flex space-x-3">
                            <div className="bg-gray-800 rounded-lg px-3 py-2 flex items-center space-x-2 hover:bg-gray-700 transition-colors cursor-pointer">
                                <Download className="h-4 w-4" />
                                <span className="text-sm">iOS</span>
                            </div>
                            <div className="bg-gray-800 rounded-lg px-3 py-2 flex items-center space-x-2 hover:bg-gray-700 transition-colors cursor-pointer">
                                <Download className="h-4 w-4" />
                                <span className="text-sm">Android</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </footer>
    )
}

export default Footer
