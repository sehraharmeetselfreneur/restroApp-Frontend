import React, { useState, useEffect } from 'react';
import { 
  CreditCard,
  Smartphone,
  Wallet,
  Truck,
  CheckCircle,
  AlertCircle,
  Lock,
  Shield,
  ArrowLeft,
  Copy,
  Download,
  QrCode,
  Clock,
  Info,
  X,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/home/Navbar';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes for UPI

  // Mock order details
  const orderDetails = {
    orderId: 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    amount: 1420,
    items: 3,
    restaurant: 'The Spice Route'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let interval;
    if (showQR && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showQR, timer]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      if (formattedValue.replace(/\s/g, '').length > 16) return;
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
      if (formattedValue.replace('/', '').length > 4) return;
    } else if (name === 'cvv') {
      formattedValue = value.replace(/[^0-9]/gi, '').slice(0, 4);
    }

    setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handlePayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('merchant@upi');
    alert('UPI ID copied to clipboard!');
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      desc: 'Visa, Mastercard, Amex accepted',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      desc: 'PhonePe, Google Pay, Paytm',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      desc: 'FlavorForge Wallet Balance',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: Truck,
      desc: 'Pay when you receive',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your order has been confirmed and will be delivered soon.
          </p>
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-bold text-gray-800">{orderDetails.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="font-bold text-green-600">₹{orderDetails.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-bold text-gray-800 capitalize">{paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-bold text-green-600">Confirmed</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Track Order
            </button>
            <button className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300">
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      
      {/* Navbar */}
      <Navbar />
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 hover:text-white/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Secure Payment</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Complete Payment</h1>
        </div>
      </div>

      
    </div>
  );
};

export default PaymentPage;