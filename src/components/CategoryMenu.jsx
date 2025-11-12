import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';

export default function CategoryMenu() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories/');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <ul className="flex overflow-x-auto space-x-4 py-3 scrollbar-hide">
          {categories.map((category) => (
            <li
              key={category.id}
              className="relative group shrink-0"
              onMouseEnter={() => setActiveCategory(category.id)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <div className="flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                <span className="text-xl">{category.icon}</span>
                <span className="text-gray-700 font-medium text-sm">{category.name}</span>
              </div>

              {/* Dropdown menu */}
              {category.subcategories && category.subcategories.length > 0 && activeCategory === category.id && (
                <div className="absolute left-0 top-full mt-0 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[250px] max-w-[300px] z-50">
                  <ul className="py-2 max-h-[400px] overflow-y-auto">
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory.id}>
                        <Link
                          to={`/services?category=${subcategory.id}`}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-[#F4B942] hover:text-white transition-colors text-sm"
                        >
                          <span className="text-lg">{subcategory.icon}</span>
                          <span>{subcategory.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
