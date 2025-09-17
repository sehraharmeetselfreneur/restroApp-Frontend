import { useState } from 'react';
import { Utensils, Banknote, FileText, Settings, Home, Clock, Star, TrendingUp, MapPin, DollarSign, Package } from "lucide-react";

// The individual content components (to be rendered conditionally)
const Overview = () => {
    const ordersData = [
      {
        id: '1012',
        items: 2,
        price: '550',
        eta: '15 min',
        distance: '1.2 km',
        color: 'bg-green-500',
      },
      {
        id: '1011',
        items: 4,
        price: '820',
        eta: '20 min',
        distance: '2.5 km',
        color: 'bg-sky-500',
      },
      {
        id: '1010',
        items: 1,
        price: '240',
        eta: '10 min',
        distance: '0.8 km',
        color: 'bg-purple-500',
      },
      {
        id: '1009',
        items: 3,
        price: '675',
        eta: '18 min',
        distance: '1.5 km',
        color: 'bg-orange-500',
      },
    ];

    // 📦 Reusable component for a single order card
    const OrderCard = ({ order }) => (
      <div className="bg-slate-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 hover:bg-slate-700 transition-colors border border-slate-700">
        <div className="flex items-center gap-4">
          <div className={`text-white p-4 rounded-full ${order.color}`}>
            <Utensils size={24} />
          </div>
          <div>
            <p className="text-xl font-semibold text-white">Order #{order.id}</p>
            <p className="text-sm text-slate-400">{order.items} items | ₹{order.price}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <p>{order.eta} ETA</p>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <p>{order.distance} away</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
          <button className="px-4 py-2 rounded-lg bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition-colors">
            View Details
          </button>
          <button className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 font-semibold text-sm hover:bg-slate-600 transition-colors">
            Accept
          </button>
        </div>
      </div>
    );

    return (
    <div>
        <section id="overview" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="bg-white/5 backdrop-blur-sm shadow-xl rounded-2xl p-8 flex flex-col items-start space-y-2 border-4 border-slate-500 hover:border-orange-500 transition-colors">
                <div className="text-orange-500 bg-orange-500/10 p-3 rounded-full mb-2">
                    <Star size={24} />
                </div>
                <h2 className="text-sm text-slate-400 uppercase tracking-widest">Rating</h2>
                <p className="text-4xl font-extrabold text-orange-400">4.5 ⭐</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm shadow-xl rounded-2xl p-8 flex flex-col items-start space-y-2 border-4 border-slate-500 hover:border-orange-500 transition-colors">
                <div className="text-slate-500 bg-slate-500/10 p-3 rounded-full mb-2">
                    <Package size={24} />
                </div>
                <h2 className="text-sm text-slate-400 uppercase tracking-widest">Orders Today</h2>
                <p className="text-4xl font-extrabold text-slate-700">56</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm shadow-xl rounded-2xl p-8 flex flex-col items-start space-y-2 border-4 border-slate-500 hover:border-orange-500 transition-colors">
                <div className="text-green-400 bg-green-400/10 p-3 rounded-full mb-2">
                    <DollarSign size={24} />
                </div>
                <h2 className="text-sm text-slate-400 uppercase tracking-widest">Total Earnings</h2>
                <p className="text-4xl font-extrabold text-green-400">₹12,340</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm shadow-xl rounded-2xl p-8 flex flex-col justify-between items-start space-y-4 border-4 border-slate-500">
                <h2 className="text-sm text-slate-400 uppercase tracking-widest">Status</h2>
                <button className="w-full px-6 py-4 rounded-xl bg-orange-600 text-white font-semibold text-lg hover:bg-orange-700 transition-colors shadow-lg">
                    Open Now
                </button>
            </div>
        </section>

        {/* Orders */}
        <section className="bg-white/5 mt-10 backdrop-blur-sm shadow-xl rounded-2xl p-8 space-y-6 border-3 border-slate-500">
            <h2 className="text-2xl font-bold text-orange-500 flex items-center gap-3">
                <Package size={28} className="text-orange-500" /> Upcoming Orders
            </h2>
            <div className="space-y-6">
                {ordersData.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </section>
    </div>
    );
};

const RestaurantInfo = () => (
    <section className="bg-white/5 backdrop-blur-sm shadow-xl rounded-2xl p-8 space-y-6 border-3 border-slate-400">
        <h2 className="text-2xl font-bold text-orange-500 flex items-center gap-3">
            <Utensils size={28} className="text-orange-500" /> Restaurant Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
                <p className="text-sm text-slate-400">Name</p>
                <p className="text-xl font-bold text-slate-800">Spice Villa</p>
            </div>
            <div className="space-y-1">
                <p className="text-sm text-slate-400">Cuisines</p>
                <p className="text-xl font-bold text-slate-800">Indian, Chinese</p>
            </div>
            <div className="space-y-1">
                <p className="text-sm text-slate-400">Opening Time</p>
                <p className="text-xl font-bold text-slate-800">10:00 AM</p>
            </div>
            <div className="space-y-1">
                <p className="text-sm text-slate-400">Closing Time</p>
                <p className="text-xl font-bold text-slate-800">11:00 PM</p>
            </div>
            <div className="col-span-1 md:col-span-2 space-y-1">
                <p className="text-sm text-slate-400">Address</p>
                <p className="text-xl font-bold text-slate-800">
                    123 MG Road, Bangalore, Karnataka - 560001
                </p>
            </div>
        </div>
    </section>
);

const BankDetails = () => (
    <section className="bg-white/5 backdrop-blur-sm shadow-xl rounded-2xl p-8 space-y-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-orange-500 flex items-center gap-3">
            <Banknote size={28} className="text-orange-500" /> Bank Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
                <p className="text-sm text-slate-400">Account Holder</p>
                <p className="text-xl font-semibold text-slate-100">Rahul Sharma</p>
            </div>
            <div className="space-y-1">
                <p className="text-sm text-slate-400">Account Number</p>
                <p className="text-xl font-semibold text-slate-100">XXXX XXXX 1234</p>
            </div>
            <div className="space-y-1">
                <p className="text-sm text-slate-400">Bank</p>
                <p className="text-xl font-semibold text-slate-100">HDFC Bank</p>
            </div>
            <div className="space-y-1">
                <p className="text-sm text-slate-400">IFSC</p>
                <p className="text-xl font-semibold text-slate-100">HDFC0001234</p>
            </div>
            <div className="col-span-1 md:col-span-2 space-y-1">
                <p className="text-sm text-slate-400">UPI ID</p>
                <p className="text-xl font-semibold text-slate-100">spicevilla@upi</p>
            </div>
        </div>
    </section>
);

const Documents = () => (
    <section className="bg-white/5 backdrop-blur-sm shadow-xl rounded-2xl p-8 space-y-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-orange-500 flex items-center gap-3">
            <FileText size={28} className="text-orange-500" /> Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-slate-700 rounded-xl text-center hover:bg-white/10 transition">
                <p className="text-sm text-slate-400">FSSAI License</p>
                <p className="font-semibold text-orange-500 mt-2">Uploaded ✅</p>
            </div>
            <div className="p-6 border border-slate-700 rounded-xl text-center hover:bg-white/10 transition">
                <p className="text-sm text-slate-400">GST Certificate</p>
                <p className="font-semibold text-orange-500 mt-2">Uploaded ✅</p>
            </div>
            <div className="p-6 border border-slate-700 rounded-xl text-center hover:bg-white/10 transition">
                <p className="text-sm text-slate-400">PAN Card</p>
                <p className="font-semibold text-orange-500 mt-2">Uploaded ✅</p>
            </div>
        </div>
    </section>
);

const SettingsComponent = () => (
    <section className="bg-white/5 backdrop-blur-sm shadow-xl rounded-2xl p-8 space-y-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-orange-500 flex items-center gap-3">
            <Settings size={28} className="text-orange-500" /> Settings
        </h2>
        <button className="px-8 py-4 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition font-semibold text-lg">
            Update Profile
        </button>
    </section>
);

// Main Dashboard Component
const RestaurantDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <Overview />;
            case 'info':
                return <RestaurantInfo />;
            case 'bank':
                return <BankDetails />;
            case 'docs':
                return <Documents />;
            case 'settings':
                return <SettingsComponent />;
            default:
                return <Overview />;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-200 text-slate-100 font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-800 shadow-2xl p-8 flex flex-col space-y-10 border-r border-slate-700">
                <div className="flex items-center gap-3">
                    <Utensils className="w-8 h-8 text-orange-500" />
                    <h1 className="text-2xl font-bold text-orange-400">FlavorForge</h1>
                </div>
                <nav className="flex flex-col space-y-4 text-slate-400 font-medium">
                    <button onClick={() => setActiveTab('overview')} className={`
                        flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors
                        ${activeTab === 'overview' ? 'bg-slate-700 text-white shadow-inner' : ''}
                    `}>
                        <Home size={20} /> Overview
                    </button>
                    <button onClick={() => setActiveTab('info')} className={`
                        flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors
                        ${activeTab === 'info' ? 'bg-slate-700 text-white shadow-inner' : ''}
                    `}>
                        <Utensils size={20} /> Restaurant Info
                    </button>
                    <button onClick={() => setActiveTab('bank')} className={`
                        flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors
                        ${activeTab === 'bank' ? 'bg-slate-700 text-white shadow-inner' : ''}
                    `}>
                        <Banknote size={20} /> Bank Details
                    </button>
                    <button onClick={() => setActiveTab('docs')} className={`
                        flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors
                        ${activeTab === 'docs' ? 'bg-slate-700 text-white shadow-inner' : ''}
                    `}>
                        <FileText size={20} /> Documents
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={`
                        flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors
                        ${activeTab === 'settings' ? 'bg-slate-700 text-white shadow-inner' : ''}
                    `}>
                        <Settings size={20} /> Settings
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12 overflow-y-auto space-y-12">
                {renderContent()}
            </main>
        </div>
    );
};

export default RestaurantDashboardPage;