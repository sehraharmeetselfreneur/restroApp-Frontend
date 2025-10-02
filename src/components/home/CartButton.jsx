import React, { useEffect } from 'react'
import useAuthStore from '../../store/useAuthStore'
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const CartButton = () => {
    const { user, role } = useAuthStore();
    const navigate = useNavigate();

    let totalItems = 0;
    useEffect(() => {
      totalItems = user?.cart?.items?.reduce((sum, item) => sum+=item.quantity, 0)
    }, [user?.cart]);

    return (
        <div>
            {user && role === "Customer" && user?.cart?.items?.length > 0 &&
              <div className="fixed bottom-8 right-8 z-50">
                <button onClick={() => navigate("/cart")} className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8" />
                  {user?.cart?.items?.length > 0 &&
                      <span className="absolute -top-1 -right-0 bg-red-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {totalItems}
                      </span>
                  }
                </button>
              </div>
            }
        </div>
    )
}

export default CartButton
