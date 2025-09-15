import React, {useState, useEffect, useCallback} from "react";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';
import navlogo from  "../src/assets/images/navlogo.png";
import { useAuth } from "./hooks/patientuseAuth";
import useApiService from "./hooks/useApiService";
import useSmartCache from "./hooks/useSmartCache";
import starimage from "../src/assets/images/star.png"
import defaultimageplaceholder from "../src/assets/images/defaultimageplaceholder.png";
import heartblack from "../src/assets/images/heartblack.png";
import heartwhite from "../src/assets/images/heartwhite.png";
import heartfilled from "../src/assets/images/heartfilled.png";
import storeimage from "../src/assets/images/store.png";
import profileuser from "../src/assets/images/profile-user.png";
import logout from "../src/assets/images/logout.png";
import inquire from "../src/assets/images/inquire.png";
import find from "../src/assets/images/find.png";
import nextimage from "../src/assets/images/next.png";
import { AmbherinventorycategoryBox } from "./components/AmbherinventorycategoryBox";
import { BautistainventorycategoryBox } from "./components/BautistainventorycategoryBox";
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Footer from "./Footer";











// Skeleton Loading Components
const ProductCardSkeleton = () => (
  <div className="mr-3 mb-3 flex flex-col items-start justify-start w-[220px] h-auto shadow-md bg-white rounded-2xl animate-pulse">
    {/* Product image skeleton - matches h-45 */}
    <div className="w-full h-45 bg-gray-300 rounded-t-2xl"></div>
    
    {/* Category tag skeleton - matches bg-[#F0F6FF] rounded style */}
    <div className="mx-1 w-fit rounded-md py-1 px-2 mt-2 bg-gray-200 h-6 min-w-[60px]"></div>
    
    {/* Product name skeleton - matches ml-2 mt-2 layout */}
    <div className="w-full h-auto ml-2 mt-2 mr-2">
      <div className="h-5 bg-gray-300 rounded w-full max-w-[180px]"></div>
    </div>
    
    {/* Price skeleton - matches font-bold text-[18px] */}
    <div className="w-fit h-auto ml-2 mt-1">
      <div className="h-6 bg-gray-300 rounded w-20"></div>
    </div>
    
    {/* Sold count skeleton - matches mt-5 mb-5 */}
    <div className="w-full h-auto ml-2 mt-5 mb-5">
      <div className="h-4 bg-gray-300 rounded w-16"></div>
    </div>
  </div>
);

const CategorySkeleton = () => (
  <div className="animate-pulse">
    {/* Multiple category button skeletons matching the real layout */}
    {[...Array(5)].map((_, index) => (
      <div key={index} className="mt-3 w-57 border-2 rounded-3xl py-2 text-center flex justify-center items-center bg-gray-100">
        <div className="h-5 bg-gray-300 rounded w-20"></div>
        <div className="bg-gray-200 h-5 w-6 rounded-full ml-2"></div>
      </div>
    ))}
  </div>
);

const ProductGridSkeleton = () => (
  <div className="flex flex-wrap p-4">
    {[...Array(8)].map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

function PatientProducts(){


  const apiUrl = import.meta.env.VITE_API_URL;










  
  const [patientfirstname, setpatientfirstname] = useState('');
  const [patientlastname, setpatientlastname] = useState('');
  const [patientmiddlename, setpatientmiddlename] = useState('');
  const [patientemail, setpatientemail] = useState('');
  const [patientprofilepicture, setpatientprofilepicture] = useState('');
  const [showlogoutbtn, setshowlogoutbtn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showlogout = () => {
    setshowlogoutbtn(!showlogoutbtn);
  }



 const {handlelogout, fetchpatientdetails, showLogoutModal, confirmLogout, cancelLogout} = useAuth();
 const { 
   fetchAmbherCategories, 
   fetchBautistaCategories, 
   fetchAmbherProducts, 
   fetchBautistaProducts 
 } = useApiService();

 // Smart caching with real-time updates
 const { smartFetch, realtimeUpdates, CACHE_DURATIONS } = useSmartCache();

  //Retrieveing Data from useAuth Hook
  useEffect(() => {
    const loadpatient = async () => {

      try{

      const data = await fetchpatientdetails();
      if(data){
        setpatientfirstname(data.patientfirstname || '');
        setpatientmiddlename(data.patientmiddlename || '');
        setpatientlastname(data.patientlastname || '');
        setpatientemail(data.patientemail || '');
        setpatientprofilepicture(data.patientprofilepicture || '');
        localStorage.setItem("patientemail", data.patientemail);
      }
    }catch(error){

        console.error("Error fetching patient details", error);

    }
   }; loadpatient();
  }, []);






















 //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
 //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
 //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
 //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
 //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
 //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT

const [activeinventorytable, setactiveinventorytable] = useState('ambherinventorytable');

// Mobile filter states
const [showMobileFilters, setShowMobileFilters] = useState(false);

// View Order Modal states
const [selectedOrderForView, setSelectedOrderForView] = useState(null);
const [showViewOrderModal, setShowViewOrderModal] = useState(false);
const [viewOrderCurrentImageIndex, setViewOrderCurrentImageIndex] = useState(0);

const showinventorytable = (inventorytableid) => {
      setactiveinventorytable(inventorytableid);
};

// View Order Modal handlers
const handleViewOrder = (order) => {
  setSelectedOrderForView(order);
  setViewOrderCurrentImageIndex(0);
  setShowViewOrderModal(true);
};

const closeViewOrderModal = () => {
  setShowViewOrderModal(false);
  setSelectedOrderForView(null);
  setViewOrderCurrentImageIndex(0);
};

const nextViewOrderImage = () => {
  if (selectedOrderForView) {
    const images = selectedOrderForView.patientorderambherproductimage || selectedOrderForView.patientorderbautistaproductimage || [];
    if (viewOrderCurrentImageIndex < images.length - 1) {
      setViewOrderCurrentImageIndex(viewOrderCurrentImageIndex + 1);
    }
  }
};

const prevViewOrderImage = () => {
  if (viewOrderCurrentImageIndex > 0) {
    setViewOrderCurrentImageIndex(viewOrderCurrentImageIndex - 1);
  }
};


//AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL
//AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL
//AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL
//AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL
//AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL //AMBHER OPTICAL


const [activeambherinventorycategorytable, setactiveambherinventorycategorytable] = useState('all');
const showambherinventorycategory = (ambherinventorycategorytableid) => {
      setactiveambherinventorycategorytable(ambherinventorycategorytableid);
};

// Advanced filters state for Ambher
const [activeAmbherProductFilter, setActiveAmbherProductFilter] = useState('all');
const ambherProductFilters = [
    { id: 'polarized', label: 'Polarized' },
    { id: 'kids', label: 'Kids' },
    { id: 'adults', label: 'Adults' },
    { id: 'men', label: "Men's" },
    { id: 'women', label: "Women's" },
    { id: 'unisex', label: 'Unisex' }
];

const [ambherinventorycategorylist, setambherinventorycategorylist] = useState([]);
const [ambherloadingcategories, setambherloadingcategories] = useState(true);

  const [ambherinventoryproducts, setambherinventoryproducts] = useState([]);
  const [ambherloadingproducts, setambherloadingproducts] = useState(true);

          

          
          


//Fetching Bautista Inventory Categories
useEffect(() => {
  const fetchambhercategories = async () => {
    try{
      const response = await fetch(`/api/ambherinventorycategory`);
      if(!response.ok) throw new Error("Failed to fetch Bautista Inevntory Categories");



      const data = await response.json();
      setambherinventorycategorylist(data);
    
      console.log("Bautista categories", data);

    }catch(error){
      console.error("Error fetching ambher categories: ", error);
    }
  };
  fetchambhercategories();
}, []);



const fetchambherinventorycategories = useCallback(async () => {
  try{
    setambherloadingcategories(true);
    // Use cached category fetching
    const data = await fetchAmbherCategories();
    setambherinventorycategorylist(data || []);
  }catch(error){
    console.error("Fetching ambherinventorycategory failed", error);
  } finally {
    setambherloadingcategories(false);
  }
}, []);

useEffect(() => {
  fetchambherinventorycategories();
}, []);

          const [selectedambherproduct, setselectedambherproduct] = useState(null);




       
          
          //FETCHING PRODUCTS WITH SMART CACHING
          
            const fetchambherproducts = useCallback(async (forceRefresh = false) => {
              try{
                setambherloadingproducts(true);
                // Use smart cached product fetching
                const data = await smartFetch(
                  'ambherProducts',
                  () => fetchAmbherProducts(),
                  CACHE_DURATIONS.products,
                  forceRefresh
                );
                setambherinventoryproducts(data || []);
                setambherloadingproducts(false);

              }catch(error){
                console.error("Failed fetching products: ", error);
                setambherloadingproducts(false);
              }
              // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [smartFetch, CACHE_DURATIONS]);
          
          
            useEffect(() => {
              fetchambherproducts();
            }, [fetchambherproducts]);

// Listen for real-time product updates
useEffect(() => {
  if (realtimeUpdates.has('products')) {
    console.log('🛍️ Real-time products update detected, refreshing data...');
    fetchambherproducts(true); // Force refresh on real-time update
  }
}, [realtimeUpdates, fetchambherproducts]);
          
          
          
        





          const[showpatientambherviewproduct, setshowpatientambherviewproduct] = useState(false);
          const[showpatientorderambherscheduleandreview, setshowpatientorderambherscheduleandreview] = useState(false);
          const [ambherinventorycategorynamebox, setambherinventorycategorynamebox] = useState("");
          const [addambherinventoryproductname, setaddambherinventoryproductname] = useState("");
          const [addambherinventoryproductmodelnumber, setaddambherinventoryproductmodelnumber] = useState("");
          const [addambherinventoryproductbrand, setaddambherinventoryproductbrand] = useState("");
          const [addambherinventoryproductdescription, setaddambherinventoryproductdescription] = useState("");
          const [addambherinventoryproductprice, setaddambherinventoryproductprice] = useState();
          const [addambherinventoryproductquantity, setaddambherinventoryproductquantity] = useState();
          const [addambherinventoryproductimagepreviewimages, setaddambherinventoryproductimagepreviewimages] = useState([]);
          const [ambhercurrentimageindex, setambhercurrentimageindex] = useState(0);
  




  //PREVIOUS  IMAGE
          const ambherhandlepreviousimage = (e) => {
            e.preventDefault(); 
            if (selectedambherproduct) {
              if (!selectedambherproduct.ambherinventoryproductimagepreviewimages?.length) return;
              setambhercurrentimageindex(prev => prev === 0 ? selectedambherproduct.ambherinventoryproductimagepreviewimages.length - 1 : prev - 1 );
          
            } else {
              if (!addambherinventoryproductimagepreviewimages?.length) return;
              setambhercurrentimageindex(prev => prev === 0 ? addambherinventoryproductimagepreviewimages.length - 1 : prev - 1 );
            }
          };
          
          //NEXT IMAGE
          const ambherhandlenextimage = (e) => {
            e.preventDefault();
            if (selectedambherproduct) {
              if (!selectedambherproduct.ambherinventoryproductimagepreviewimages?.length) return;
              setambhercurrentimageindex(prev => prev === selectedambherproduct.ambherinventoryproductimagepreviewimages.length - 1 ? 0 : prev + 1 );
          
            } else {
              if (!addambherinventoryproductimagepreviewimages?.length) return;
              setambhercurrentimageindex(prev => prev === addambherinventoryproductimagepreviewimages.length - 1 ? 0 : prev + 1);
          
            }
          };

















  


//BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER
//BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER
//BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER
//BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER
//BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER //BAUTISTA EYE CENTER

const [activebautistainventorycategorytable, setactivebautistainventorycategorytable] = useState('all');
const showbautistainventorycategory = (bautistainventorycategorytableid) => {
      setactivebautistainventorycategorytable(bautistainventorycategorytableid);
};

// Advanced filters state for Bautista
const [activeBautistaProductFilter, setActiveBautistaProductFilter] = useState('all');
const bautistaProductFilters = [
    { id: 'polarized', label: 'Polarized' },
    { id: 'kids', label: 'Kids' },
    { id: 'adults', label: 'Adults' },
    { id: 'men', label: "Men's" },
    { id: 'women', label: "Women's" },
    { id: 'unisex', label: 'Unisex' }
];

const [bautistainventorycategorylist, setbautistainventorycategorylist] = useState([]);
const [bautistaloadingcategories, setbautistaloadingcategories] = useState(true);

          const[showpatientbautistaviewproduct, setshowpatientbautistaviewproduct] = useState(false);
          const[showpatientorderbautistascheduleandreview, setshowpatientorderbautistascheduleandreview] = useState(false);
          const [bautistainventorycategorynamebox, setbautistainventorycategorynamebox] = useState("");
          const [addbautistainventoryproductname, setaddbautistainventoryproductname] = useState("");
          const [addbautistainventoryproductmodelnumber, setaddbautistainventoryproductmodelnumber] = useState("");
          const [addbautistainventoryproductbrand, setaddbautistainventoryproductbrand] = useState("");
          const [addbautistainventoryproductdescription, setaddbautistainventoryproductdescription] = useState("");
          const [addbautistainventoryproductprice, setaddbautistainventoryproductprice] = useState();
          const [addbautistainventoryproductquantity, setaddbautistainventoryproductquantity] = useState();
          const [addbautistainventoryproductimagepreviewimages, setaddbautistainventoryproductimagepreviewimages] = useState([]);
          const [bautistacurrentimageindex, setbautistacurrentimageindex] = useState(0);
  
  const [bautistainventoryproducts, setbautistainventoryproducts] = useState([]);
  const [bautistaloadingproducts, setbautistaloadingproducts] = useState(true);


          


//Fetching Bautista Inventory Categories
useEffect(() => {
  const fetchbautistacategories = async () => {
    try{
      const response = await fetch(`/api/bautistainventorycategory`);
      if(!response.ok) throw new Error("Failed to fetch Bautista Inevntory Categories");



      const data = await response.json();
      setbautistainventorycategorylist(data);
    
      console.log("Bautista categories", data);

    }catch(error){
      console.error("Error fetching bautista categories: ", error);
    }
  };
  fetchbautistacategories();
}, []);



const fetchbautistainventorycategories = useCallback(async () => {
  try{
    setbautistaloadingcategories(true);
    // Use cached category fetching
    const data = await fetchBautistaCategories();
    setbautistainventorycategorylist(data || []);
  }catch(error){
    console.error("Fetching bautistainventorycategory failed", error);
  } finally {
    setbautistaloadingcategories(false);
  }
}, []);

useEffect(() => {
  fetchbautistainventorycategories();
}, []);

          const [selectedbautistaproduct, setselectedbautistaproduct] = useState(null);




       
          
          //FETCHING PRODUCTS
          
            const fetchbautistaproducts = useCallback(async () => {
              try{
                // Use cached product fetching
                const data = await fetchBautistaProducts();
                setbautistainventoryproducts(data || []);
                setbautistaloadingproducts(false);

              }catch(error){
                console.error("Failed fetching products: ", error);
                setbautistaloadingproducts(false);
              }
            }, []);
          
          
            useEffect(() => {
              fetchbautistaproducts();
            }, []);
          
          
          
        








  //PREVIOUS  IMAGE
          const bautistahandlepreviousimage = (e) => {
            e.preventDefault(); 
            if (selectedbautistaproduct) {
              if (!selectedbautistaproduct.bautistainventoryproductimagepreviewimages?.length) return;
              setbautistacurrentimageindex(prev => prev === 0 ? selectedbautistaproduct.bautistainventoryproductimagepreviewimages.length - 1 : prev - 1 );
          
            } else {
              if (!addbautistainventoryproductimagepreviewimages?.length) return;
              setbautistacurrentimageindex(prev => prev === 0 ? addbautistainventoryproductimagepreviewimages.length - 1 : prev - 1 );
            }
          };
          
          //NEXT IMAGE
          const bautistahandlenextimage = (e) => {
            e.preventDefault();
            if (selectedbautistaproduct) {
              if (!selectedbautistaproduct.bautistainventoryproductimagepreviewimages?.length) return;
              setbautistacurrentimageindex(prev => prev === selectedbautistaproduct.bautistainventoryproductimagepreviewimages.length - 1 ? 0 : prev + 1 );
          
            } else {
              if (!addbautistainventoryproductimagepreviewimages?.length) return;
              setbautistacurrentimageindex(prev => prev === addbautistainventoryproductimagepreviewimages.length - 1 ? 0 : prev + 1);
          
            }
          };










    

  //PRODUCT ORDERING  //PRODUCT ORDERING  //PRODUCT ORDERING  //PRODUCT ORDERING  //PRODUCT ORDERING


  //AMBHER OPTICAL
    const [ambhercount, setambherCount] = useState(1)
    const [ambherheartisHovered, setambherheartisHovered] =useState(false);
    const [ambherheartisClicked, setambherheartisClicked] =useState(false);     
    const [ambhershowheartToast, setambhershowheartToast] = useState(false);
    const [ambhershowtoastMessage, setambhershowtoastMessage] = useState("");
    const [ambhershowtoastmessageClosing, setambhershowtoastmessageClosing] = useState(false);


const ambherhearthandleClick = (e) => {
  e.preventDefault();
  toggleWishlist(e);
};

const getambherHeartImage = () => {
  const productId = selectedambherproduct?.ambherinventoryproductid;
  const isInWishList = wishlistItems.some(item => item.patientwishlistinventoryproductid === productId);

  return isInWishList ? heartfilled : (ambherheartisHovered ? heartwhite : heartblack);
}


useEffect(() => {
  if(ambhershowheartToast){
    const ambherhearttoasttimer = setTimeout(() => {
      setambhershowtoastmessageClosing(true); //
      setTimeout(() => setambhershowheartToast(false), 300);}, 4000);
  
    return () => clearTimeout(ambherhearttoasttimer);
  }
}, [ambhershowheartToast]);







  //BAUTISTA EYE CENTER 

    const [bautistacount, setbautistaCount] = useState(1)
    const [bautistaheartisHovered, setbautistaheartisHovered] =useState(false);
    const [bautistaheartisClicked, setbautistaheartisClicked] =useState(false);     
    const [bautistashowheartToast, setbautistashowheartToast] = useState(false);
    const [bautistashowtoastMessage, setbautistashowtoastMessage] = useState("");
    const [bautistashowtoastmessageClosing, setbautistashowtoastmessageClosing] = useState(false);

const bautistahearthandleClick = (e) => {
  e.preventDefault();
  toggleWishlist(e); // Use the unified toggle function
};

const getbautistaHeartImage = () => {
  const productId = selectedbautistaproduct?.bautistainventoryproductid;
  const isInWishList = wishlistItems.some(item => item.patientwishlistinventoryproductid === productId);

  return isInWishList ? heartfilled : (bautistaheartisHovered ? heartwhite : heartblack);
}


useEffect(() => {
  if(bautistashowheartToast){
    const bautistahearttoasttimer = setTimeout(() => {
      setbautistashowtoastmessageClosing(true); //
      setTimeout(() => setbautistashowheartToast(false), 300);}, 4000);
  
    return () => clearTimeout(bautistahearttoasttimer);
  }
}, [bautistashowheartToast]);












//WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS 
//WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS 
//WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS 
//WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS 
//WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS 
//WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS 
//WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS 
//WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS 
//WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS 
//WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS //WISHLIST VARIABLESSSS 


const [wishlistItems, setWishlistItems] = useState([]);
// Wishlist count feature temporarily disabled to prevent infinite loop
// const [wishlistCounts, setWishlistCounts] = useState({});







//FETCHING WISHLISTED ITEMSSS //FETCHING WISHLISTED ITEMSSS //FETCHING WISHLISTED ITEMSSS //FETCHING WISHLISTED ITEMSSS //FETCHING WISHLISTED ITEMSSS //FETCHING WISHLISTED ITEMSSS
useEffect(() => {
  const fetchWishlistItems = async () => {
    try{
      const response = await fetch(`/api/patientwishlistinventoryproduct/email/${patientemail}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('patienttoken')}`
        }
      });

      if(response.ok) {
        const data = await response.json();
        setWishlistItems(data);


        if(selectedambherproduct){
          const isInWishlist = data.some(item => item.patientwishlistinventoryproductid === selectedambherproduct.ambherinventoryproductid);
          setambherheartisClicked(isInWishlist);
        }

        if(selectedbautistaproduct){
          const isInWishlist = data.some(item => item.patientwishlistinventoryproductid === selectedbautistaproduct.bautistainventoryproductid);
          setbautistaheartisClicked(isInWishlist);
        }

      }
    }catch(error){
      console.error("Error fetching wishlist products:", error);
    }
  }; fetchWishlistItems();
}, [showpatientambherviewproduct, showpatientbautistaviewproduct, patientemail, selectedambherproduct, selectedbautistaproduct]);







//HANDLES ADD AND DELETE BUTTON FOR WISHLIST
const toggleWishlist = async (e) => {
  e.preventDefault();
  
  try {
    let productId;
    let isAmbher = false;
    let productData;

    if(selectedambherproduct) {
      productId = selectedambherproduct.ambherinventoryproductid;
      isAmbher = true;
      productData = {
        patientaccount: patientemail,
        patientwishlistprofilepicture: patientprofilepicture,
        patientwishlistlastname: patientlastname || "No Last Name",
        patientwishlistfirstname: patientfirstname || "No First Name",
        patientwishlistmiddlename: patientmiddlename || "No Middle Name",
        patientwishlistemail: patientemail || "No Email",
        clinicproduct: selectedambherproduct.ambherinventoryproductid,
        clinicproductmodel: selectedambherproduct.ambherinventoryproductmodelnumber,
        patientwishlistinventoryproductid: selectedambherproduct.ambherinventoryproductid,
        patientwishlistinventoryproductcategory: ambherinventorycategorynamebox || "No Category Name",
        patientwishlistinventoryproductname: addambherinventoryproductname || "No Product Name",
        patientwishlistinventoryproductbrand: addambherinventoryproductbrand || "No Brand",
        patientwishlistinventoryproductmodelnumber: addambherinventoryproductmodelnumber || "No Model",
        patientwishlistinventoryproductdescription: addambherinventoryproductdescription || "No Description",
        patientwishlistinventoryproductprice: addambherinventoryproductprice || 0,
        patientwishlistinventoryproductquantity: addambherinventoryproductquantity || 0,
        patientwishlistinventoryproductimagepreviewimages: addambherinventoryproductimagepreviewimages || [],
        clinicType: "ambher",
      };
    } else if (selectedbautistaproduct) {
      productId = selectedbautistaproduct.bautistainventoryproductid;
      isAmbher = false;
      productData = {
        patientaccount: patientemail,
        patientwishlistprofilepicture: patientprofilepicture,
        patientwishlistlastname: patientlastname || "No Last Name",
        patientwishlistfirstname: patientfirstname || "No First Name",
        patientwishlistmiddlename: patientmiddlename || "No Middle Name",
        patientwishlistemail: patientemail || "No Email",
        clinicproduct: selectedbautistaproduct.bautistainventoryproductid,
        clinicproductmodel: selectedbautistaproduct.bautistainventoryproductmodel || "No Model",
        patientwishlistinventoryproductid: selectedbautistaproduct.bautistainventoryproductid,
        patientwishlistinventoryproductcategory: bautistainventorycategorynamebox || "No Category Name",
        patientwishlistinventoryproductname: addbautistainventoryproductname || "No Product Name",
        patientwishlistinventoryproductbrand: addbautistainventoryproductbrand || "No Brand",
        patientwishlistinventoryproductmodelnumber: selectedbautistaproduct.bautistainventoryproductmodel || "No Model",
        patientwishlistinventoryproductdescription: addbautistainventoryproductdescription || "No Description",
        patientwishlistinventoryproductprice: addbautistainventoryproductprice || 0,
        patientwishlistinventoryproductquantity: addbautistainventoryproductquantity || 0,
        patientwishlistinventoryproductimagepreviewimages: addbautistainventoryproductimagepreviewimages || [],
        clinicType: "bautista",
      };
    } else {
      throw new Error("No product selected");
    }

    const isInWishlist = wishlistItems.some(item => 
      item.patientwishlistinventoryproductid === productId && 
      item.clinicType === (isAmbher ? 'ambher' : 'bautista')
    );

    if(isInWishlist) {
      // Find the wishlist item to get its _id
      const wishlistItem = wishlistItems.find(item => 
        item.patientwishlistinventoryproductid === productId && 
        item.clinicType === (isAmbher ? 'ambher' : 'bautista')
      );

      if (!wishlistItem) {
        throw new Error("Wishlist item not found");
      }

      const response = await fetch(`/api/patientwishlistinventoryproduct/${wishlistItem._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('patienttoken')}`
        }
      });

      if(!response.ok) {
        const errordata = await response.json();
        throw new Error(errordata.message || "Failed to delete wishlist product");
      }

      // Updates the wishlist products 
      setWishlistItems(prev => prev.filter(item => item._id !== wishlistItem._id));
      
      // Update heart state and show toast
      if (isAmbher) {
        setambherheartisClicked(false);
        setambhershowtoastMessage("Removed from Wishlist");
        setambhershowheartToast(true);
        setambhershowtoastmessageClosing(false);
      } else {
        setbautistaheartisClicked(false);
        setbautistashowtoastMessage("Removed from Wishlist");
        setbautistashowheartToast(true);
        setbautistashowtoastmessageClosing(false);
      }

      // Wishlist count feature temporarily disabled to prevent infinite loop  
      // const newCount = await fetchWishlistCounts(productId, isAmbher ? 'ambher' : 'bautista');
      // setWishlistCounts(prev => ({...prev, [productId]: newCount}));

    } else {
      // Add to wishlist
     
      const response = await fetch(`/api/patientwishlistinventoryproduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('patienttoken')}`
        },
        body: JSON.stringify(productData)
      });

      if(!response.ok) {
        const errordata = await response.json();
        throw new Error(errordata.message || "Failed to add to wishlist");
      }

      const newItem = await response.json();
      
      // Add the new item to the wishlist
      setWishlistItems(prev => [...prev, newItem]);

      // Update heart state and show toast
      if (isAmbher) {
        setambherheartisClicked(true);
        setambhershowtoastMessage("Added to Wishlist");
        setambhershowheartToast(true);
        setambhershowtoastmessageClosing(false);
      } else {
        setbautistaheartisClicked(true);
        setbautistashowtoastMessage("Added to Wishlist");
        setbautistashowheartToast(true);
        setbautistashowtoastmessageClosing(false);
      }

      // Wishlist count feature temporarily disabled to prevent infinite loop
      // const newCount = await fetchWishlistCounts(productId, isAmbher ? 'ambher' : 'bautista');
      // setWishlistCounts(prev => ({...prev, [productId]: newCount}));
    }

  } catch(error) {
    console.error("Error toggle wishlist: ", error);
    const errorMessage = error.message || "Wishlist toggle error";

    if (selectedambherproduct) {
      setambhershowtoastMessage(errorMessage);
      setambhershowheartToast(true);
      setambhershowtoastmessageClosing(false);
    } else if (selectedbautistaproduct) {
      setbautistashowtoastMessage(errorMessage);
      setbautistashowheartToast(true);
      setbautistashowtoastmessageClosing(false);
    }
  }
};















// Temporarily disable wishlist count fetching to prevent infinite loop
// const fetchWishlistCounts = async (productIds, clinicType) => {
//   try {
//     // Convert to string if it's an array
//     const idsParam = Array.isArray(productIds) ? productIds.join(',') : productIds;
    
//     const response = await fetch(
//       `/api/patientwishlistinventoryproduct/wishlist-count/${idsParam}/${clinicType}`,
//       {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('patienttoken')}`
//         }
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || "Failed to fetch wishlist counts");
//     }

//     const data = await response.json();
//     return data.count || 0;
//   } catch(error) {
//     console.error("Error fetching wishlist counts:", error);
//     return 0;
//   }
// };



//Automatically counts the wishlisted count per product in Ambher Optical
// Temporarily disabled to prevent infinite loop
// useEffect(() => {
//   if(selectedambherproduct) {
//     const fetchCount = async () => {
//       const count = await fetchWishlistCounts(selectedambherproduct.ambherinventoryproductid, 'ambher');
//       setWishlistCounts(prev => ({...prev, [selectedambherproduct.ambherinventoryproductid]: count}));
//     };
//     fetchCount();
//   }
// }, [selectedambherproduct]);

//Automatically counts the wishlisted count per product in Bautista Eye Center
// Temporarily disabled to prevent infinite loop
// useEffect(() => {
//   if(selectedbautistaproduct) {
//     const fetchCount = async () => {
//       const count = await fetchWishlistCounts(selectedbautistaproduct.bautistainventoryproductid, 'bautista');
//       setWishlistCounts(prev => ({...prev, [selectedbautistaproduct.bautistainventoryproductid]: count}));
//     };
//     fetchCount();
//   }
// }, [selectedbautistaproduct]);





















//PRODUCT FILTERING PROCESS //PRODUCT FILTERING PROCESS //PRODUCT FILTERING PROCESS //PRODUCT FILTERING PROCESS //PRODUCT FILTERING PROCESS //PRODUCT FILTERING PROCESS

const [pricesortingProducts, setpricesortingProducts] = useState('none');
const [quantitySortingProducts, setQuantitySortingProducts] = useState('none');
const [searchProducts, setsearchProducts] = useState('');




// Add these functions to handle price sorting
const sortproductsbyPrice = (products, sortOrder, productType) => {
  if(sortOrder === 'none') return products;

  return [...products].sort((a,b) =>{
    const priceA = productType === 'ambher' ? a.ambherinventoryproductprice : a.bautistainventoryproductprice;
    const priceB = productType === 'ambher' ? b.ambherinventoryproductprice : b.bautistainventoryproductprice;
    
    return sortOrder === 'Highesttolowest' ? priceB - priceA : priceA - priceB;
  });
};

// Add these functions to handle quantity sorting
const sortProductsByQuantity = (products, sortOrder, productType) => {
  if(sortOrder === 'none') return products;

  return [...products].sort((a, b) => {
    const quantityA = productType === 'ambher' ? a.ambherinventoryproductquantity : a.bautistainventoryproductquantity;
    const quantityB = productType === 'ambher' ? b.ambherinventoryproductquantity : b.bautistainventoryproductquantity;
    
    if (sortOrder === 'Highesttolowest') {
      return quantityB - quantityA;
    } else if (sortOrder === 'Lowesttohighest') {
      return quantityA - quantityB;
    } else if (sortOrder === 'OutOfStock') {
      // Out of stock items first, then by quantity descending
      if (quantityA === 0 && quantityB !== 0) return -1;
      if (quantityA !== 0 && quantityB === 0) return 1;
      if (quantityA === 0 && quantityB === 0) return 0;
      return quantityB - quantityA;
    } else if (sortOrder === 'LowStock') {
      // Filter and show only Low Stock items (4-6 quantity)
      const isLowStockA = quantityA >= 4 && quantityA <= 6;
      const isLowStockB = quantityB >= 4 && quantityB <= 6;
      if (isLowStockA && !isLowStockB) return -1;
      if (!isLowStockA && isLowStockB) return 1;
      if (isLowStockA && isLowStockB) return quantityA - quantityB; // Sort by quantity ascending within low stock
      return 0;
    } else if (sortOrder === 'CriticalStock') {
      // Filter and show only Critical Stock items (1-3 quantity)
      const isCriticalA = quantityA >= 1 && quantityA <= 3;
      const isCriticalB = quantityB >= 1 && quantityB <= 3;
      if (isCriticalA && !isCriticalB) return -1;
      if (!isCriticalA && isCriticalB) return 1;
      if (isCriticalA && isCriticalB) return quantityA - quantityB; // Sort by quantity ascending within critical stock
      return 0;
    }
    return 0;
  }).filter(product => {
    // Apply filtering for specific stock levels
    const quantity = productType === 'ambher' ? product.ambherinventoryproductquantity : product.bautistainventoryproductquantity;
    
    if (sortOrder === 'LowStock') {
      return quantity >= 4 && quantity <= 6;
    } else if (sortOrder === 'CriticalStock') {
      return quantity >= 1 && quantity <= 3;
    }
    return true; // For other sort orders, show all products
  });
};


//Ambher filtering products
const ambherfilteredproducts = () => {
  let filtered = ambherinventoryproducts.filter(product => {
    // Category filter
    const categoryMatch = activeambherinventorycategorytable === 'all' ||
      product.ambherinventoryproductcategory === activeambherinventorycategorytable;
    
    // Search filter
    const searchMatch = product.ambherinventoryproductname.toLowerCase().includes(searchProducts.toLowerCase()) ||
      product.ambherinventoryproductbrand.toLowerCase().includes(searchProducts.toLowerCase()) ||
      product.ambherinventoryproductdescription.toLowerCase().includes(searchProducts.toLowerCase());
    
    // Advanced filter
    let advancedMatch = true;
    if (activeAmbherProductFilter !== 'all') {
      const nameDesc = `${product.ambherinventoryproductname || ''} ${product.ambherinventoryproductdescription || ''}`.toLowerCase();
      if (activeAmbherProductFilter === 'polarized')
        advancedMatch = product.ambherinventoryproducttype?.toLowerCase().includes('polarized') || nameDesc.includes('polarized');
      else if (activeAmbherProductFilter === 'kids')
        advancedMatch = product.ambherinventoryproductfor?.toLowerCase().includes('kid') || nameDesc.includes('kid');
      else if (activeAmbherProductFilter === 'adults')
        advancedMatch = product.ambherinventoryproductfor?.toLowerCase().includes('adult') || nameDesc.includes('adult');
      else if (activeAmbherProductFilter === 'men')
        advancedMatch = product.ambherinventoryproductfor?.toLowerCase().includes('men') || nameDesc.includes('men');
      else if (activeAmbherProductFilter === 'women')
        advancedMatch = product.ambherinventoryproductfor?.toLowerCase().includes('women') || nameDesc.includes('women');
      else if (activeAmbherProductFilter === 'unisex')
        advancedMatch = product.ambherinventoryproductfor?.toLowerCase().includes('unisex') || nameDesc.includes('unisex');
    }
    
    return categoryMatch && searchMatch && advancedMatch;
  });
  
  // Apply stock-based sorting first (Normal → Low → Critical → Out of Stock)
  filtered.sort((a, b) => {
    const aQty = a.ambherinventoryproductquantity;
    const bQty = b.ambherinventoryproductquantity;
    
    // Define stock priority: Normal(7+) = 1, Low(4-6) = 2, Critical(1-3) = 3, Out(0) = 4
    const getStockPriority = (qty) => {
      if (qty === 0) return 4;      // Out of Stock - last
      if (qty <= 3) return 3;       // Critical Stock 
      if (qty <= 6) return 2;       // Low Stock
      return 1;                     // Normal Stock - first
    };
    
    return getStockPriority(aQty) - getStockPriority(bQty);
  });
  
  // Apply price sorting, then quantity sorting
  let sortedProducts = sortproductsbyPrice(filtered, pricesortingProducts, 'ambher');
  return sortProductsByQuantity(sortedProducts, quantitySortingProducts, 'ambher');
};





//Bautista filtering products
const bautistafilteredproducts = () => {
  let filtered = bautistainventoryproducts.filter(product => {
    // Category filter
    const categoryMatch = activebautistainventorycategorytable === 'all' ||
      product.bautistainventoryproductcategory === activebautistainventorycategorytable;
    
    // Search filter
    const searchMatch = product.bautistainventoryproductname.toLowerCase().includes(searchProducts.toLowerCase()) ||
      product.bautistainventoryproductbrand.toLowerCase().includes(searchProducts.toLowerCase()) ||
      product.bautistainventoryproductdescription.toLowerCase().includes(searchProducts.toLowerCase());
    
    // Advanced filter
    let advancedMatch = true;
    if (activeBautistaProductFilter !== 'all') {
      const nameDesc = `${product.bautistainventoryproductname || ''} ${product.bautistainventoryproductdescription || ''}`.toLowerCase();
      if (activeBautistaProductFilter === 'polarized')
        advancedMatch = product.bautistainventoryproducttype?.toLowerCase().includes('polarized') || nameDesc.includes('polarized');
      else if (activeBautistaProductFilter === 'kids')
        advancedMatch = product.bautistainventoryproductfor?.toLowerCase().includes('kid') || nameDesc.includes('kid');
      else if (activeBautistaProductFilter === 'adults')
        advancedMatch = product.bautistainventoryproductfor?.toLowerCase().includes('adult') || nameDesc.includes('adult');
      else if (activeBautistaProductFilter === 'men')
        advancedMatch = product.bautistainventoryproductfor?.toLowerCase().includes('men') || nameDesc.includes('men');
      else if (activeBautistaProductFilter === 'women')
        advancedMatch = product.bautistainventoryproductfor?.toLowerCase().includes('women') || nameDesc.includes('women');
      else if (activeBautistaProductFilter === 'unisex')
        advancedMatch = product.bautistainventoryproductfor?.toLowerCase().includes('unisex') || nameDesc.includes('unisex');
    }
    
    return categoryMatch && searchMatch && advancedMatch;
  });
  
  // Apply stock-based sorting first (Normal → Low → Critical → Out of Stock)
  filtered.sort((a, b) => {
    const aQty = a.bautistainventoryproductquantity;
    const bQty = b.bautistainventoryproductquantity;
    
    // Define stock priority: Normal(7+) = 1, Low(4-6) = 2, Critical(1-3) = 3, Out(0) = 4
    const getStockPriority = (qty) => {
      if (qty === 0) return 4;      // Out of Stock - last
      if (qty <= 3) return 3;       // Critical Stock 
      if (qty <= 6) return 2;       // Low Stock
      return 1;                     // Normal Stock - first
    };
    
    return getStockPriority(aQty) - getStockPriority(bQty);
  });
  
  // Apply price sorting, then quantity sorting
  let sortedProducts = sortproductsbyPrice(filtered, pricesortingProducts, 'bautista');
  return sortProductsByQuantity(sortedProducts, quantitySortingProducts, 'bautista');
};








//SUBMITTING PATIENT AMBHER and BAUTISTA ORDER PRODUCT
const [patientorderambherproductchosenpickupdate, setpatientorderambherproductchosenpickupdate] = useState("");
const [patientorderbautistaproductchosenpickupdate, setpatientorderbautistaproductchosenpickupdate] = useState("");
const [patientorderambherproductisClicked, setpatientorderambherproductisClicked] = useState(false);
const [patientorderambherproductToast, setpatientorderambherproductToast] = useState(false);
const [patientorderambherproductToastMessage, setpatientorderambherproductToastMessage] = useState("");
const [patientorderambherproductToastClosing, setpatientorderambherproductToastClosing] = useState(false);
const [patientorderbautistaproductisClicked, setpatientorderbautistaproductisClicked] = useState(false);
const [patientorderbautistaproductToast, setpatientorderbautistaproductToast] = useState(false);
const [patientorderbautistaproductToastMessage, setpatientorderbautistaproductToastMessage] = useState("");
const [patientorderbautistaproductToastClosing, setpatientorderbautistaproductToastClosing] = useState(false);
const [progressWidth, setProgressWidth] = useState('0%');   



// UseEffect for Product Orddering Toast
useEffect(() => {
  if (patientorderambherproductToast) {
    setProgressWidth('0%');
    setpatientorderambherproductToastClosing(false);

    const progresstimer = setTimeout(() => {
      setProgressWidth('100%');
    }, 50);

    // Close toast after 4 seconds
    const toasttimer = setTimeout(() => {
      setpatientorderambherproductToastClosing(true);
      setTimeout(() => {
        setpatientorderambherproductToast(false);
        setProgressWidth('0%');
      }, 300);
    }, 4000);

    return () => {
      clearTimeout(progresstimer);
      clearTimeout(toasttimer);
    }
  }else if(patientorderbautistaproductToast){
    setProgressWidth('0%');
    setpatientorderbautistaproductToastClosing(false);

    const progresstimer = setTimeout(() => {
      setProgressWidth('100%');
    }, 50);

    // Close toast after 4 seconds
    const toasttimer = setTimeout(() => {
      setpatientorderbautistaproductToastClosing(true);
      setTimeout(() => {
        setpatientorderbautistaproductToast(false);
        setProgressWidth('0%');
      }, 300);
    }, 4000);

    return () => {
      clearTimeout(progresstimer);
      clearTimeout(toasttimer);
    }
  }
}, [patientorderambherproductToast, patientorderbautistaproductToast]);








const getphilippineDate = () => {
  const now = new Date();
  return new Date(now.getTime() + (8 * 60 * 60 * 1000));
};
const dateinphNow = getphilippineDate();
const dateinphtomorrow = new Date(dateinphNow);
dateinphtomorrow.setDate(dateinphNow.getDate() + 1);
dateinphtomorrow.setHours(0,0,0,0);

// Calculate dates
const dateinphmaxdate = new Date(dateinphNow);
dateinphmaxdate.setDate(dateinphNow.getDate() + 30);
dateinphmaxdate.setHours(23,59,59,999);




//SUBMIT ORDER REQUEST FOR AMBHER OPTICAL //SUBMIT ORDER REQUEST FOR AMBHER OPTICAL //SUBMIT ORDER REQUEST FOR AMBHER OPTICAL
//SUBMIT ORDER REQUEST FOR AMBHER OPTICAL //SUBMIT ORDER REQUEST FOR AMBHER OPTICAL //SUBMIT ORDER REQUEST FOR AMBHER OPTICAL
const submitpatientorderambher = async (e) => {
  e.preventDefault();
  

  try {
    // Fetch patient demographic data
    const demographicResponse = await fetch(
      `/api/patientdemographics/patientemail/${patientemail}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('patienttoken')}`
        }
      }
    );

    if (!demographicResponse.ok) {
      const errorText = await demographicResponse.text();
      throw new Error(errorText || 'Failed to fetch patient data');
    }

    const demographicData = await demographicResponse.json();
    
    if (!demographicData.patientcontactnumber) {
      throw new Error('Patient contact number not found');
    }

    // Prepare order data
    const orderData = {
      patientprofilepicture: patientprofilepicture,
      patientlastname: patientlastname,
      patientfirstname: patientfirstname,
      patientmiddlename: patientmiddlename,
      patientemail: patientemail,
      patientcontactnumber: demographicData.patientcontactnumber,
      patientorderambherproductid: selectedambherproduct?.ambherinventoryproductid,
      patientorderambherproductname: addambherinventoryproductname,
      patientorderambherproductbrand: addambherinventoryproductbrand,
      patientorderambherproductmodelnumber: addambherinventoryproductmodelnumber,
      patientorderambherproductimage:addambherinventoryproductimagepreviewimages,
      patientorderambherproductprice: addambherinventoryproductprice,
      patientorderambherproductquantity: ambhercount,
      patientorderambherproductsubtotal: addambherinventoryproductprice * ambhercount,
      patientorderambherproducttotal: addambherinventoryproductprice * ambhercount,
      patientorderambherproductpaymentmethod: 'Cash on Pickup',
      patientorderambherproductchosenpickupdate: patientorderambherproductchosenpickupdate,
      patientorderambherproductchosenpickuptime: 'Default',
      patientorderambherstatus: 'Pending',
      patientorderambherhistory: [{
        status: 'Pending',
        changedAt: new Date(),
        changedBy: `${patientfirstname} ${patientlastname}`
      }]
    };

    console.log('Submitting order:', orderData);

    // Submit order
    const response = await fetch(`/api/patientorderambher`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('patienttoken')}`
      },
      body: JSON.stringify(orderData)
    });

    // Handle response
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(errorText || `Server error: ${response.status}`);
    }

    const result = await response.json();
        setpatientorderambherproductisClicked(true);
        setpatientorderambherproductToastMessage("Order Submitted Successfully!");
        
        setpatientorderambherproductToast(true);
        setpatientorderambherproductToastClosing(false);
    console.log('Order successful:', result);

    
    setpatientorderambherproductchosenpickupdate("");
    setshowpatientorderambherscheduleandreview(false);
    setambherCount(1);
    

  } catch (error) {
    console.error('Submission error:', error);
      setpatientorderambherproductToastMessage(error.message);
      setpatientorderambherproductToast(true);
      setpatientorderambherproductToastClosing(false);
  }
};  


const submitpatientorderbautista = async (e) => {
  e.preventDefault();
  

  try {
    // Fetch patient demographic data
    const demographicResponse = await fetch(
      `/api/patientdemographics/patientemail/${patientemail}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('patienttoken')}`
        }
      }
    );

    if (!demographicResponse.ok) {
      const errorText = await demographicResponse.text();
      throw new Error(errorText || 'Failed to fetch patient data');
    }

    const demographicData = await demographicResponse.json();
    
    if (!demographicData.patientcontactnumber) {
      throw new Error('Patient contact number not found');
    }

    // Prepare order data
    const orderData = {
      patientprofilepicture: patientprofilepicture,
      patientlastname: patientlastname,
      patientfirstname: patientfirstname,
      patientmiddlename: patientmiddlename,
      patientemail: patientemail,
      patientcontactnumber: demographicData.patientcontactnumber,
      patientorderbautistaproductid: selectedbautistaproduct?.bautistainventoryproductid,
      patientorderbautistaproductname: addbautistainventoryproductname,
      patientorderbautistaproductbrand: addbautistainventoryproductbrand,
      patientorderbautistaproductmodelnumber: addbautistainventoryproductmodelnumber,
      patientorderbautistaproductimage:addbautistainventoryproductimagepreviewimages,
      patientorderbautistaproductprice: addbautistainventoryproductprice,
      patientorderbautistaproductquantity: bautistacount,
      patientorderbautistaproductsubtotal: addbautistainventoryproductprice * bautistacount,
      patientorderbautistaproducttotal: addbautistainventoryproductprice * bautistacount,
      patientorderbautistaproductpaymentmethod: 'Cash on Pickup',
      patientorderbautistaproductchosenpickupdate: patientorderbautistaproductchosenpickupdate,
      patientorderbautistaproductchosenpickuptime: 'Default',
      patientorderbautistahistory: [{
        status: 'Pending',
        changedAt: new Date(),
        changedBy: `${patientfirstname} ${patientlastname}`
      }]
    };

    console.log('Submitting order:', orderData);

    // Submit order
    const response = await fetch(`/api/patientorderbautist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('patienttoken')}`
      },
      body: JSON.stringify(orderData)
    });

    // Handle response
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(errorText || `Server error: ${response.status}`);
    }

    const result = await response.json();
        setpatientorderbautistaproductisClicked(true);
        setpatientorderbautistaproductToastMessage("Order Submitted Successfully!");
        
        setpatientorderbautistaproductToast(true);
        setpatientorderbautistaproductToastClosing(false);
    console.log('Order successful:', result);

    
    setpatientorderbautistaproductchosenpickupdate("");
    setbautistaCount(1);
    

  } catch (error) {
    console.error('Submission error:', error);
      setpatientorderbautistaproductToastMessage(error.message);
      setpatientorderbautistaproductToast(true);
      setpatientorderbautistaproductToastClosing(false);
  }
};  






















//FETCHING AMBHERORDER and BAUTISTAORDER SOLD COUNT
const [ambherproductsoldCount, setambherproductsoldCount] = useState(0);
const [bautistaproductsoldCount, setbautistaproductsoldCount] = useState(0);
const [ambherproductsoldCounts, setambherproductsoldCounts] = useState(0);
const [bautistaproductsoldCounts, setbautistaproductsoldCounts] = useState(0);






//Fetching ambherproducts sold count  
useEffect(() => {
  const fetchSoldCount = async () => {
    if (!selectedambherproduct?.ambherinventoryproductid) return;

    try {
      const response = await fetch(`/api/patientorderambher/ambherproductsoldcount/${selectedambherproduct.ambherinventoryproductid}`);
      if (!response.ok) throw new Error("Failed to fetch sold count");
      const data = await response.json();
      setambherproductsoldCount(data.sold || 0);
    } catch (error) {
      console.error("Error fetching sold count:", error);
    }
  };

  fetchSoldCount();
}, [selectedambherproduct]);




//Fetching ambherproducts sold count for every card display 
useEffect(() => {
  const fetchAllSoldCounts = async () => {
    const counts = {};

    await Promise.all(
      ambherinventoryproducts.map(async (product) => {
        try {
          const response = await fetch(`/api/patientorderambher/ambherproductsoldcount/${product.ambherinventoryproductid}`);
          if (!response.ok) throw new Error("Failed to fetch");

          const data = await response.json();
          counts[product.ambherinventoryproductid] = data.sold || 0;
        } catch (error) {
          console.error("Error fetching sold count for", product.ambherinventoryproductid, error);
          counts[product.ambherinventoryproductid] = 0;
        }
      })
    );

    setambherproductsoldCounts(counts);
  };

  if (ambherinventoryproducts.length > 0) {
    fetchAllSoldCounts();
  }
}, [ambherinventoryproducts]);






//Fetching bautistaproducts sold count  
useEffect(() => {
  const fetchSoldCount = async () => {
    if (!selectedbautistaproduct?.bautistainventoryproductid) return;

    try {
      const response = await fetch(`/api/patientorderbautista/bautistaproductsoldcount/${selectedbautistaproduct.bautistainventoryproductid}`);
      if (!response.ok) throw new Error("Failed to fetch sold count");
      const data = await response.json();
      setbautistaproductsoldCount(data.sold || 0);
    } catch (error) {
      console.error("Error fetching sold count:", error);
    }
  };

  fetchSoldCount();
}, [selectedbautistaproduct]);






//Fetching bautistaproducts sold count for every card display 
useEffect(() => {
  const fetchAllSoldCounts = async () => {
    const counts = {};

    await Promise.all(
      bautistainventoryproducts.map(async (product) => {
        try {
          const response = await fetch(`/api/patientorderbautista/bautistaproductsoldcount/${product.bautistainventoryproductid}`);
          if (!response.ok) throw new Error("Failed to fetch");

          const data = await response.json();
          counts[product.bautistainventoryproductid] = data.sold || 0;
        } catch (error) {
          console.error("Error fetching sold count for", product.bautistainventoryproductid, error);
          counts[product.bautistainventoryproductid] = 0;
        }
      })
    );

    setbautistaproductsoldCounts(counts);
  };

  if (bautistainventoryproducts.length > 0) {
    fetchAllSoldCounts();
  }
}, [bautistainventoryproducts]);




































































  return (
    <>

     {/* NavBar */}
      <header className="fixed top-0 w-full backdrop-blur-lg bg-white/90 border-b border-white/20 shadow-lg z-50 transition-all duration-300">
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" flex justify-between items-center h-13">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src={navlogo} 
                alt="Eye2Wear Logo" 
                className="h-10 w-auto hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Navigation Links - Hidden on mobile */}
            <nav className="hidden lg:flex space-x-1">
              <Link 
                to="/patientlandingpage" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Home
              </Link>
              <Link 
                to="/patientdashboard" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Appointments
              </Link>
              <Link 
                to="/patientproducts" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Store
              </Link>
              <Link 
                to="/patientwishlist" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Wishlist
              </Link>
              <Link 
                to="/patientorders" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Orders
              </Link>
              <Link 
                to="/aboutpage" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                About
              </Link>
            </nav>

            {/* Profile Section */}
            {localStorage.getItem("patienttoken") ? (
              <div className="relative">
                <div 
                  onClick={showlogout}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                >
                  {!patientprofilepicture ? (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 animate-pulse flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
                    </div>
                  ) : (
                    <img 
                      src={patientprofilepicture} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-sky-200"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">{patientfirstname}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                {showlogoutbtn && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in-0 zoom-in-95">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        {!patientprofilepicture ? (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className="text-white" />
                          </div>
                        ) : (
                          <img 
                            src={patientprofilepicture} 
                            className="w-10 h-10 rounded-full object-cover"
                            alt="Profile"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{patientfirstname}</p>
                          <p className="text-xs text-gray-500">Patient Account</p>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to="/patientinformation" 
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-3 w-4 h-4" />
                      Demographic Profile
                    </Link>
                    
                    <div
                      onClick={handlelogout}
                      className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FontAwesomeIcon icon={faUserShield} className="mr-3 w-4 h-4" />
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/userlogin">
                <button className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>










    {/* First Section */} {/* First Section */} {/* First Section */} {/* First Section */}
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 pb-50 motion-preset-slide-up bg-cover bg-center min-h-[100vh] w-full flex justify-center align-center" >
    <div className="bg-cover bg-center h-auto w-full flex justify-center " >

      <div className="w-full h-auto flex flex-col justify-start items-start pt-3 p-2 sm:p-3">






              <div id="inventorymanagement" className="  pl-5 pr-5 pb-4 pt-8  transition-all duration-300  ease-in-out  w-[100%] h-full bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 " >   

              <div className=" flex items-center mt-8"><i className="bx bxs-shopping-bag text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Browse our Products</h1></div>

  <div className="flex flex-col sm:flex-row justify-start items-center mt-3 gap-3 h-auto">
 {/*<div onClick={() => showinventorytable('allinventorytable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeinventorytable ==='allinventorytable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#1f1f1f] ${activeinventorytable ==='allinventorytable' ? 'text-white' : ''}`}>All</h1></div>*/}
  <div onClick={() => showinventorytable('ambherinventorytable')}  className={`cursor-pointer w-full sm:w-auto hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl px-6 py-3 text-center flex justify-center items-center ${activeinventorytable ==='ambherinventorytable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#1f1f1f] ${activeinventorytable ==='ambherinventorytable' ? 'text-white' : ''}`}>Ambher Optical</h1></div>
  <div onClick={() => showinventorytable('bautistainventorytable')}  className={`cursor-pointer w-full sm:w-auto hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl px-6 py-3 text-center flex justify-center items-center ${activeinventorytable ==='bautistainventorytable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#1f1f1f] ${activeinventorytable ==='bautistainventorytable' ? 'text-white' : ''}`}>Bautista Eye Center</h1></div>
  
  </div>


                






          { activeinventorytable === 'ambherinventorytable' && ( <div id="ambherinventorytable" className="p-2  animate-fadeInUp flex flex-col lg:flex-row items-start  w-[100%] h-[83%] rounded-2xl mt-5" >

          <div className="p-3 rounded-2xl w-full lg:w-[20%] h-auto mb-4 lg:mb-0 lg:mr-2 overflow-y-auto overflow-x-hidden hidden lg:block">
                <div className="border-b-2 pb-3 flex items center w-full mt-7"><i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" /><h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Filter by category</h1></div>
                {activeambherinventorycategorytable !== 'all' && (
                  <div
                    className="text-center cursor-pointer px-4 py-1 rounded-2xl border border-[#2781af] bg-white text-[#2781af] font-medium transition-all duration-200 hover:bg-[#2781af] hover:text-white hover:shadow-md mt-2"
                    onClick={() => showambherinventorycategory('all')}
                  >
                    Clear filter
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  <div
                    onClick={() => showambherinventorycategory('all')}
                    className={`cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium flex items-center justify-center w-full
                      ${activeambherinventorycategorytable === 'all'
                        ? 'bg-[#2781af] rounded-2xl text-white'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    <span>All</span>
                    <span className="ml-2 bg-gray-200 text-gray-600 font-semibold px-2 rounded-full text-xs">
                      {ambherinventoryproducts.length}
                    </span>
                  </div>

                  {ambherloadingcategories ? (
                    <CategorySkeleton />
                  ) : (
                    ambherinventorycategorylist.map(category => {
                      const productcount = ambherinventoryproducts.filter(product =>
                        product.ambherinventoryproductcategory === category.ambherinventorycategoryname).length;
                      return(
                        <div key={category._id}
                          onClick={() => setactiveambherinventorycategorytable(category.ambherinventorycategoryname)}
                          className={`cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium flex items-center justify-center w-full
                            ${activeambherinventorycategorytable === category.ambherinventorycategoryname
                              ? 'bg-[#2781af] rounded-2xl text-white'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                        >
                          <span>{category.ambherinventorycategoryname}</span>
                          <span className="ml-2 bg-gray-200 text-gray-600 font-semibold px-2 rounded-full text-xs">
                            {productcount}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Advanced Filters for Ambher */}
                <div className="border-b-2 pb-3 flex items center w-full mt-7">
                  <i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" />
                  <h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Advanced Filters</h1>
                </div>
                {activeAmbherProductFilter !== 'all' && (
                  <div
                    className="text-center cursor-pointer px-4 py-1 rounded-2xl border border-[#2781af] bg-white text-[#2781af] font-medium transition-all duration-200 hover:bg-[#2781af] hover:text-white hover:shadow-md mt-2"
                    onClick={() => setActiveAmbherProductFilter('all')}
                  >
                    Clear filter
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  {ambherProductFilters.map(filter => {
                    // Count products matching this filter
                    const count = ambherinventoryproducts.filter(product => {
                      const nameDesc = `${product.ambherinventoryproductname || ''} ${product.ambherinventoryproductdescription || ''}`.toLowerCase();
                      if (filter.id === 'polarized')
                        return product.ambherinventoryproducttype?.toLowerCase().includes('polarized') || nameDesc.includes('polarized');
                      if (filter.id === 'kids')
                        return product.ambherinventoryproductfor?.toLowerCase().includes('kid') || nameDesc.includes('kid');
                      if (filter.id === 'adults')
                        return product.ambherinventoryproductfor?.toLowerCase().includes('adult') || nameDesc.includes('adult');
                      if (filter.id === 'men')
                        return product.ambherinventoryproductfor?.toLowerCase().includes('men') || nameDesc.includes('men');
                      if (filter.id === 'women')
                        return product.ambherinventoryproductfor?.toLowerCase().includes('women') || nameDesc.includes('women');
                      if (filter.id === 'unisex')
                        return product.ambherinventoryproductfor?.toLowerCase().includes('unisex') || nameDesc.includes('unisex');
                      return false;
                    }).length;
                    return (
                      <div key={filter.id}
                        className={`cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium flex items-center justify-center w-full
                          ${activeAmbherProductFilter === filter.id
                            ? 'bg-[#2781af] rounded-2xl text-white'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                        onClick={() => setActiveAmbherProductFilter(filter.id)}
                      >
                        <span>{filter.label}</span>
                        <span className="ml-2 bg-gray-200 text-gray-600 font-semibold px-2 rounded-full text-xs">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-b-2 pb-3 flex items center w-full mt-7"><i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" /><h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Filter by price</h1></div>
                {pricesortingProducts !== 'none' && (
                  <div
                    className="text-center cursor-pointer px-4 py-1 rounded-2xl border border-[#2781af] bg-white text-[#2781af] font-medium transition-all duration-200 hover:bg-[#2781af] hover:text-white hover:shadow-md mt-2"
                    onClick={() => setpricesortingProducts('none')}
                  >
                    Clear filter
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  <div
                    onClick={() => setpricesortingProducts('Highesttolowest')}
                    className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
                      ${pricesortingProducts === 'Highesttolowest'
                        ? 'bg-[#2781af] text-white border-[#2781af]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    Highest to Lowest
                  </div>

                  <div
                    onClick={() => setpricesortingProducts('Lowesttohighest')}
                    className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
                      ${pricesortingProducts === 'Lowesttohighest'
                        ? 'bg-[#2781af] text-white border-[#2781af]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    Lowest to Highest
                  </div>
                </div>

                {/* Quantity Filter Section */}
                <div className="border-b-2 pb-3 flex items center w-full mt-7">
                  <i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" />
                  <h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Filter by quantity</h1>
                </div>
                {quantitySortingProducts !== 'none' && (
                  <div
                    className="text-center cursor-pointer px-4 py-1 rounded-2xl border border-[#2781af] bg-white text-[#2781af] font-medium transition-all duration-200 hover:bg-[#2781af] hover:text-white hover:shadow-md mt-2"
                    onClick={() => setQuantitySortingProducts('none')}
                  >
                    Clear filter
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  <div
                    onClick={() => setQuantitySortingProducts('Highesttolowest')}
                    className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
                      ${quantitySortingProducts === 'Highesttolowest'
                        ? 'bg-[#2781af] text-white border-[#2781af]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    Highest to Lowest
                  </div>

                  <div
                    onClick={() => setQuantitySortingProducts('Lowesttohighest')}
                    className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
                      ${quantitySortingProducts === 'Lowesttohighest'
                        ? 'bg-[#2781af] text-white border-[#2781af]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    Lowest to Highest
                  </div>

                  <div
                    onClick={() => setQuantitySortingProducts('OutOfStock')}
                    className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
                      ${quantitySortingProducts === 'OutOfStock'
                        ? 'bg-[#2781af] text-white border-[#2781af]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    Out of Stock
                  </div>

                  <div
                    onClick={() => setQuantitySortingProducts('CriticalStock')}
                    className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
                      ${quantitySortingProducts === 'CriticalStock'
                        ? 'bg-[#2781af] text-white border-[#2781af]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    Critical Stock (1-3)
                  </div>

                  <div
                    onClick={() => setQuantitySortingProducts('LowStock')}
                    className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
                      ${quantitySortingProducts === 'LowStock'
                        ? 'bg-[#2781af] text-white border-[#2781af]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    Low Stock (4-6)
                  </div>


                </div>
 
            

          </div>
          <div className=" flex flex-col justify-start items-start  lg:ml-2 rounded-2xl w-full lg:w-[90%]  min-h-[540px] max-h-auto h-auto shadow-b-lg ">
              {/* Mobile Filter Button - Only show on small screens */}
              <div style={{ width: '100%', padding: '8px 16px' }} className="lg:hidden">
                <button 
                  onClick={() => setShowMobileFilters(true)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#2781af',
                    color: 'white',
                    borderRadius: '16px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#1e6a8f'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#2781af'}
                >
                  <i className="bx bx-filter" style={{ fontSize: '20px' }}></i>
                  Filters & Categories
                </button>
              </div>
              
              <div className="ml-2 lg:ml-6 flex flex-col sm:flex-row justify-center items-start sm:items-center mb-4">
                <h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-0 sm:mr-3 mb-2 sm:mb-0">Search: </h2>
                <div className="relative flex items-center justify-center gap-3 w-full  sm:flex-1">
                  <i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i>
                  <input 
                    value={searchProducts} 
                    onChange={(e) => setsearchProducts(e.target.value)} 
                    type="text" 
                    placeholder="Enter product name here..."   
                    className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
                  />
                </div>
              </div>
              <div className=" w-full rounded-2xl h-auto  flex flex-wrap content-start gap-3 pl-2 pt-2 ">
              {/* Updated product grid - 2 columns on mobile, flexible on larger screens */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 p-2 sm:p-4 w-full">
                {ambherloadingproducts ? (
                  <ProductGridSkeleton />
                ): ambherinventoryproducts.length === 0 ? (
                  <div className="w-full text-center py-8">
                    <p className="text-gray-500 text-lg">No Products Found...</p>
                  </div>
                ):(
                    ambherfilteredproducts().sort((a, b) => {
                    if (a.ambherinventoryproductquantity === 0 && b.ambherinventoryproductquantity !== 0) return 1;
                    if (a.ambherinventoryproductquantity !== 0 && b.ambherinventoryproductquantity === 0) return -1;
                    return 0; }) .map((product) => (
              <div key={product.ambherinventoryproductid} onClick={() => {setshowpatientambherviewproduct(true);
                                                                           setselectedambherproduct(product);
                                                                           setambhercurrentimageindex(0);
                                                                           setambherinventorycategorynamebox(product?.ambherinventoryproductcategory || '');
                                                                           setaddambherinventoryproductname(product?.ambherinventoryproductname || '');
                                                                           setaddambherinventoryproductmodelnumber(product?.ambherinventoryproductmodelnumber || '');
                                                                           setaddambherinventoryproductbrand(product?.ambherinventoryproductbrand || '');
                                                                           setaddambherinventoryproductdescription(product?.ambherinventoryproductdescription || '');
                                                                           setaddambherinventoryproductprice(product?.ambherinventoryproductprice || 0);
                                                                           setaddambherinventoryproductquantity(product?.ambherinventoryproductquantity || 0);
                
                                                                           setaddambherinventoryproductimagepreviewimages(product?.ambherinventoryproductimagepreviewimages || []);
       
              const isInWishList = wishlistItems.some(item => item.patientwishlistinventoryproductid === product.ambherinventoryproductid);
              setambherheartisClicked(isInWishList);    

                 }}  className="motion-preset-slide-up flex flex-col items-start justify-start w-full h-auto shadow-md bg-white rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-200 relative">
                <img src={product.ambherinventoryproductimagepreviewimages[0] || defaultimageplaceholder}  alt={product.ambherinventoryproductname} className={`w-full h-32 sm:h-40 md:h-45 object-cover rounded-t-2xl ${product.ambherinventoryproductquantity === 0 ? 'opacity-50': ''}`}/>
                
               {product.ambherinventoryproductquantity === 0 ? (<div className="top-2 right-2 absolute px-1 sm:px-2 py-1 rounded-md text-xs font-semibold bg-red-200"><h1 className="text-red-900 text-xs">Out of Stock</h1></div>): 
                 product.ambherinventoryproductquantity >= 1 && product.ambherinventoryproductquantity <= 3 ? (<div className="top-2 right-2 absolute px-1 sm:px-2 py-1 rounded-md text-xs font-semibold bg-orange-200"><h1 className="text-orange-900 text-xs">Critical Stock</h1></div>):
                 product.ambherinventoryproductquantity >= 4 && product.ambherinventoryproductquantity <= 6 ? (<div className="top-2 right-2 absolute px-1 sm:px-2 py-1 rounded-md text-xs font-semibold bg-yellow-200"><h1 className="text-yellow-900 text-xs">Low Stock</h1></div>): null}
                 
                <div className="p-2 sm:p-3 w-full flex flex-col">
                  <div className="w-fit rounded-md py-1 px-2 mb-2 bg-[#F0F6FF]">
                    <h1 className={`font-medium text-[#0d0d0d] text-xs sm:text-[13px] ${product.ambherinventoryproductquantity === 0 ? 'text-gray-400': ''}`}>{product.ambherinventoryproductcategory}</h1>
                  </div>
                  <div className="mb-1">
                    <h1 className={`font-semibold text-sm sm:text-[15px] line-clamp-2 ${product.ambherinventoryproductquantity === 0 ? 'text-gray-400': ''}`}>{product.ambherinventoryproductname}</h1>
                  </div>
                  <div className="mb-2">
                    <h1 className={`font-albertsans font-bold text-[#1f8126] text-sm sm:text-[18px] ${product.ambherinventoryproductquantity === 0 ? 'text-gray-400': ''}`}>₱ {product.ambherinventoryproductprice?.toLocaleString()}</h1>
                  </div>
                  <div className="mt-auto">
                    <h1 className={`font-albertsans font-medium text-[#4e4f4f] text-xs sm:text-[15px] ${product.ambherinventoryproductquantity === 0 ? 'text-gray-400': ''}`}>{ambherproductsoldCounts[product.ambherinventoryproductid] ?? 0} Sold</h1>
                  </div>
                </div>
              </div>
                  ))
                )}
              </div>

              
              

              </div>
          </div>

          </div>)}


      {/*Toast Message when wishlist button is clicked*/}
          {ambhershowheartToast && (
            <div className="top-4  -translate-x-1/2  z-100   left-1/2 transform fixed " >
                  <div key={ambherheartisClicked ? 'added' : 'removed'}  className={` ${ambhershowtoastmessageClosing ? 'motion-opacity-out-0' : 'motion-preset-bounce'}  flex items-center bg-white   rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`} >
                    {ambherheartisClicked ? (          
                       <span className="text-green-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle "></i></span>
                    ) : (
                      <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle "></i></span>
                    )}
                    {ambhershowtoastMessage}
                  </div>
           
            </div>
          )}



          {patientorderambherproductToast && (
            <div className=" bottom-4 right-8  z-101   transform fixed " >
                  <div key={patientorderambherproductisClicked ? 'added' : 'removed'}  className={` ${patientorderambherproductToastClosing ? 'motion-translate-x-out-100 motion-duration-[3s]  motion-ease-spring-smooth' : 'motion-preset-slide-left'}  flex items-center bg-white   rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`} >
                    {patientorderambherproductisClicked ? (          
                       <span className="text-green-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle "></i></span>
                    ) : (
                      <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle "></i></span>
                    )}
                    {patientorderambherproductToastMessage}

                    <div  className={`rounded-b-2xl absolute bottom-0 left-0 h-1 bg-green-500 `}  style={{width: progressWidth,transition: 'width 4s linear' }}/>

                  </div>
           
            </div>  
          )}




          {showpatientambherviewproduct && (

                         <div className="overflow-y-auto h-auto bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50 p-2 sm:p-4">
                           <div className="motion-opacity-in-0 mt-2 sm:mt-10 px-3 sm:px-5 py-4 bg-[#fefefe] rounded-2xl w-full max-w-6xl h-auto mb-10 animate-fadeInUp">
                                <div className="mt-2 sm:mt-5 flex justify-end items-center left-0 w-[100%] h-auto sm:h-[70px]">
                   
                                  <div onClick={() => {setambherCount(1); setselectedambherproduct(null); setshowpatientambherviewproduct(false)}} className="bg-[#333232] px-6 sm:px-10 py-2 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[30px] sm:text-[40px]"/></div>
                                </div>


                          <form className="flex flex-col px-2 sm:px-4 lg:px-15 mt-2 sm:mt-5 pb-6 sm:pb-10">
                                <div className="flex flex-col lg:flex-row justify-center items-start rounded-2xl w-full h-auto gap-4 lg:gap-6">
                                  <div className="w-full lg:w-auto flex justify-center">



                                      <div className="h-fit w-fit flex-none">
  
                                <div className="relative">
                                


                                 {addambherinventoryproductquantity === 0 &&(

                                <div className="flex items-center justify-end mb-2">
                                 <img  src={getambherHeartImage()} onClick={ambherhearthandleClick} onMouseEnter={() => !ambherheartisClicked && setambherheartisHovered(true)} onMouseLeave={() => !ambherheartisClicked && setambherheartisHovered(false)}  className={` ease-in-out duration-300 transition-all  border-1  w-8 h-8 sm:w-10 sm:h-10 p-2 rounded-2xl cursor-pointer ${ambherheartisClicked ? "bg-red-400" : "hover:bg-red-400"}`}/>
                                 <h1 className="ml-2 text-[15px] sm:text-[17px] font-semibold text-[#383838]">Wishlist</h1>     
                                </div>
                                 )}

                                <img className="mt-2 w-full max-w-[300px] sm:max-w-[400px] lg:w-120 object-cover rounded-2xl h-auto lg:h-120" src={(selectedambherproduct?.ambherinventoryproductimagepreviewimages?.[ambhercurrentimageindex]) || (addambherinventoryproductimagepreviewimages?.[ambhercurrentimageindex]) || defaultimageplaceholder}/>

                                     {((selectedambherproduct?.ambherinventoryproductimagepreviewimages?.length || 0) > 1 || 
                                       addambherinventoryproductimagepreviewimages?.length > 1) && (
                                         <>
                                           <div type="button" onClick={ambherhandlepreviousimage} className="bg-opacity-50 hover:bg-opacity-75 rounded-2xl text-white p-1 sm:p-2 absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-gray-500"><i className="bx bx-chevron-left text-lg sm:text-2xl" /></div>

                                           <div type="button" onClick={ambherhandlenextimage} className="rounded-2xl absolute bg-opacity-50 text-white p-1 sm:p-2 transform -translate-y-1/2 bg-gray-500 hover:bg-opacity-75 right-1 sm:right-2 top-1/2"><i className="bx bx-chevron-right text-lg sm:text-2xl" /></div>

                                         </>
                                       )}

                                      {addambherinventoryproductimagepreviewimages.length > 0 && (
                                          <div className="overflow-x-auto flex gap-2 mt-2 p-2 sm:p-4 border-y-1 rounded-2xl bg-[#fbfbfb] items-center">
                                            {addambherinventoryproductimagepreviewimages.map((preview, index) => (
                                                <div key={index} className="relative">
                                                <img onClick={() => setambhercurrentimageindex(index)} src={preview} className={`rounded-lg cursor-pointer object-cover w-16 h-16 sm:w-20 sm:h-20 ${ambhercurrentimageindex === index ? 'border-2 border-[#78b0d4]' : ''}`} />
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                     </div>
                                      
                                      

                                      </div>



                                  </div>

                                  <div className="w-full h-auto flex items-start mb-6 lg:mb-10 rounded-2xl min-w-0">
                                        <div className="w-[100%] h-auto rounded-4xl">
                                  
                                  
              
                                        <div className="w-[100%] registration-container">

                                    
                                        <div className="flex flex-wrap items-center mx-1 w-fit h-fit mt-2 break-words min-w-0"><h1 className="font-albertsans rounded-md py-1 px-2 rounded-1xl bg-[#F0F6FF] font-medium text-[#0d0d0d] min-w-0 break-words text-sm sm:text-base">{ambherinventorycategorynamebox}</h1>
                                        <p className="font-albertsans ml-1 text-sm sm:text-base">by</p>
                                        <p className="font-albertsans ml-1 font-semibold text-sm sm:text-base">{addambherinventoryproductbrand}</p>
                                        </div>
                                        
                                     

                                        <h1 className="font-albertsans mt-3 min-w-0 break-words h-fit w-full font-bold text-[#212121] text-[20px] sm:text-[24px] lg:text-[29px]">{addambherinventoryproductname}</h1>
                         
                                        <div className="mt-1 flex items-center">
                                          {/*
                                          <img src={starimage} className="w-5 h-5"/>
                                          <p className="font-albertsans ml-2 mt-1 text-[15px] font-semibold">4.8</p><span className="mt-1 text-[13px] pr-3 ml-2">(89 reviews)</span>
                                          */}
                                          <p className="mt-1 font-albertsans border-[#8c8c8c] pl-3 text-[12px] sm:text-[13px]">{ambherproductsoldCount} sold</p>
                                        </div>
                        
                                  
                                        <p className="mt-5 font-albertsans font-semibold text-[#478d12] text-[28px] sm:text-[35px] lg:text-[40px]">₱{Number(addambherinventoryproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p>
                                  
                                        <p className="font-albertsans mt-6 font-medium text-[#020202] text-[16px] sm:text-[18px]">Description</p>
                                        <p className="font-albertsans font-semibold text-[#4b4b4b] mt-3 text-sm sm:text-base">{addambherinventoryproductdescription}</p>
                                      
                                       

                                      {addambherinventoryproductquantity === 0 ? ( 
                                        <div className="bg-gray-400 py-2 px-3 rounded-md justify-center  gap-4 mt-15 flex items-center">
                                          <p className="font-albertsans font-semibold ">Out of Stock</p>
                                         </div>
                                       
                                      ):(
                                        <div className="gap-4 mt-15 flex items-center">
                                          <p className="font-albertsans font-semibold ">In Stock:</p>
                                          <p className="font-albertsans font-semibold text-[#616161] text-[14px]">{addambherinventoryproductquantity} pieces available </p>
                                         </div>
                                      )}    



                                           <div className="flex flex-col sm:flex-row w-full items-center justify-between mt-6 sm:mt-10 gap-2 sm:gap-0 p-3 sm:h-22 bg-[#fbfbfb] rounded-2xl">
                                              <div className="gap-1 sm:gap-2 h-auto sm:h-full w-full sm:w-40 flex items-center flex-col justify-center"><img src={find} className="w-6 h-6 sm:w-8 sm:h-8"/><p className="font-albertsans text-[11px] sm:text-[13px] font-medium text-center">Browse Products</p></div>
                                              <div className="gap-1 sm:gap-2 h-auto sm:h-full w-auto sm:w-30 hidden sm:flex items-center flex-col justify-center"><img src={nextimage} className="w-6 h-6 sm:w-8 sm:h-8"/></div>
                                              <div className="gap-1 sm:gap-2 h-auto sm:h-full w-full sm:w-auto sm:min-w-[160px] flex items-center flex-col justify-center"><img src={storeimage} className="w-6 h-6 sm:w-8 sm:h-8"/> <p className="font-albertsans text-[11px] sm:text-[13px] font-medium text-center whitespace-nowrap">Go to Ambher Optical</p></div>
                                              <div className="gap-1 sm:gap-2 h-auto sm:h-full w-auto sm:w-30 hidden sm:flex items-center flex-col justify-center"><img src={nextimage} className="w-6 h-6 sm:w-8 sm:h-8"/></div>
                                              <div className="gap-1 sm:gap-2 h-auto sm:h-full w-full sm:w-40 flex items-center flex-col justify-center"><img src={inquire} className="w-6 h-6 sm:w-8 sm:h-8"/><p className="font-albertsans text-[11px] sm:text-[13px] font-medium text-center">Inquire</p></div>
                                           </div>
                                   
                                        </div>
                                

                                  
                                        </div>


                                  </div>

                                </div>
                                {/*          
                                <div className="w-auto h-full  ">
                                  <h1 className="font-albertsans mt-8 text-[21px] font-semibold text-[#171717]">Product Ratings</h1>
                                  <div className="border-2 border-[#a0c1d1] flex items-center justify-between mt-2 w-full h-20 p-6 py-15 bg-[#f7fdff] rounded-2xl">
                                    <div>
                                    <h1 className="text-[20px] text-[#05415c]"><span className="text-[30px] font-semibold">4.9</span> out of 5</h1>
                                    <Stack spacing={1}>
                                      <Rating name="half-rating-read" defaultValue={4.5} precision={5} readOnly />
                                  </Stack>
                                    </div>

                                    <h1 className="text-[20px] text-[#05415c] ml-5 ">(89 Total Reviews)</h1>
                                  </div>
                                   
                              <div className="w-full h-auto bg-[#ffffff]">
                               <div className="border-b-2 py-5">
                                 <div className="px-2 mt-5 flex h-auto w-fit items-start">
                                   <div className="h-11 w-11 flex-shrink-0">
                                     <img 
                                       src={patientprofilepicture || 'default-profile.png'} 
                                       alt="Profile" 
                                       className="h-11 w-11 rounded-full object-cover"
                                     />
                                   </div>

                                   <div className="ml-3 flex flex-col pb-2">
                                     <h1 className="font-albertsans font-medium text-[#2b2b2b]">Francis Daniel M. Genese</h1>
                                     <Stack spacing={1}>
                                       <Rating name="half-rating-read" defaultValue={4.5} precision={5} readOnly size="small" />
                                     </Stack>
                                     <p className="ml-0 mt-1 text-[12px] font-semibold text-[#444444]">2025-06-24 22:04</p>
                                     <p className="text-[14px] font-albertsans mt-4">
                                       Vention has 100% legit cable wires and cable cords that you can use with your laptops, computers and gadgets. You will never regret purchasing equipment from his shop. Highly recommended for youtlr techie stuff. Thank you seller!
                                     </p>
                                   </div>

                                 </div>
                               </div>






                               
                              </div>
                                </div>
                                */}    
                                </form>
                           </div>
                         </div>
              

          )}










          { activeinventorytable === 'bautistainventorytable' && ( <div id="bautistainventorytable" className="p-2  animate-fadeInUp flex flex-col lg:flex-row items-start  w-[100%] h-[83%] rounded-2xl mt-5" >

          <div className="p-3 rounded-2xl w-full lg:w-[20%] h-auto mb-4 lg:mb-0 lg:mr-2 overflow-y-auto overflow-x-hidden hidden lg:block">
        
                <div className="border-b-2 pb-3 flex items center w-full mt-7"><i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" /><h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Filter by category</h1></div>
                {activebautistainventorycategorytable !== 'all' && (
                  <div
                    className="text-center cursor-pointer px-4 py-1 rounded-2xl border border-[#2781af] bg-white text-[#2781af] font-medium transition-all duration-200 hover:bg-[#2781af] hover:text-white hover:shadow-md mt-2"
                    onClick={() => showbautistainventorycategory('all')}
                  >
                    Clear filter
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  <div
                    onClick={() => showbautistainventorycategory('all')}
                    className={`cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium flex items-center justify-center w-full
                      ${activebautistainventorycategorytable === 'all'
                        ? 'bg-[#2781af] rounded-2xl text-white'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    <span>All</span>
                    <span className="ml-2 bg-gray-200 text-gray-600 font-semibold px-2 rounded-full text-xs">
                      {bautistainventoryproducts.length}
                    </span>
                  </div>

                  {bautistaloadingcategories ? (
                    <CategorySkeleton />
                  ) : (
                    bautistainventorycategorylist.map(category => {
                      const productcount = bautistainventoryproducts.filter(product =>
                        product.bautistainventoryproductcategory === category.bautistainventorycategoryname).length;
                      return(
                        <div key={category._id}
                          onClick={() => setactivebautistainventorycategorytable(category.bautistainventorycategoryname)}
                          className={`cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium flex items-center justify-center w-full
                            ${activebautistainventorycategorytable === category.bautistainventorycategoryname
                              ? 'bg-[#2781af] rounded-2xl text-white'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                        >
                          <span>{category.bautistainventorycategoryname}</span>
                          <span className="ml-2 bg-gray-200 text-gray-600 font-semibold px-2 rounded-full text-xs">
                            {productcount}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Advanced Filters for Bautista */}
                <div className="border-b-2 pb-3 flex items center w-full mt-7">
                  <i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" />
                  <h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Advanced Filters</h1>
                </div>
                {activeBautistaProductFilter !== 'all' && (
                  <div
                    className="text-center cursor-pointer px-4 py-1 rounded-2xl border border-[#2781af] bg-white text-[#2781af] font-medium transition-all duration-200 hover:bg-[#2781af] hover:text-white hover:shadow-md mt-2"
                    onClick={() => setActiveBautistaProductFilter('all')}
                  >
                    Clear filter
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  {bautistaProductFilters.map(filter => {
                    // Count products matching this filter
                    const count = bautistainventoryproducts.filter(product => {
                      const nameDesc = `${product.bautistainventoryproductname || ''} ${product.bautistainventoryproductdescription || ''}`.toLowerCase();
                      if (filter.id === 'polarized')
                        return product.bautistainventoryproducttype?.toLowerCase().includes('polarized') || nameDesc.includes('polarized');
                      if (filter.id === 'kids')
                        return product.bautistainventoryproductfor?.toLowerCase().includes('kid') || nameDesc.includes('kid');
                      if (filter.id === 'adults')
                        return product.bautistainventoryproductfor?.toLowerCase().includes('adult') || nameDesc.includes('adult');
                      if (filter.id === 'men')
                        return product.bautistainventoryproductfor?.toLowerCase().includes('men') || nameDesc.includes('men');
                      if (filter.id === 'women')
                        return product.bautistainventoryproductfor?.toLowerCase().includes('women') || nameDesc.includes('women');
                      if (filter.id === 'unisex')
                        return product.bautistainventoryproductfor?.toLowerCase().includes('unisex') || nameDesc.includes('unisex');
                      return false;
                    }).length;
                    return (
                      <div key={filter.id}
                        className={`cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium flex items-center justify-center w-full
                          ${activeBautistaProductFilter === filter.id
                            ? 'bg-[#2781af] rounded-2xl text-white'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                        onClick={() => setActiveBautistaProductFilter(filter.id)}
                      >
                        <span>{filter.label}</span>
                        <span className="ml-2 bg-gray-200 text-gray-600 font-semibold px-2 rounded-full text-xs">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-b-2 pb-3 flex items center w-full mt-7"><i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" /><h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Filter by price</h1></div>
                {pricesortingProducts !== 'none' && (
                  <div
                    className="text-center cursor-pointer px-4 py-1 rounded-2xl border border-[#2781af] bg-white text-[#2781af] font-medium transition-all duration-200 hover:bg-[#2781af] hover:text-white hover:shadow-md mt-2"
                    onClick={() => setpricesortingProducts('none')}
                  >
                    Clear filter
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  <div
                    onClick={() => setpricesortingProducts('Highesttolowest')}
                    className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
                      ${pricesortingProducts === 'Highesttolowest'
                        ? 'bg-[#2781af] text-white border-[#2781af]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    Highest to Lowest
                  </div>

                  <div
                    onClick={() => setpricesortingProducts('Lowesttohighest')}
                    className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
                      ${pricesortingProducts === 'Lowesttohighest'
                        ? 'bg-[#2781af] text-white border-[#2781af]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    Lowest to Highest
                  </div>
                </div>

                {/* Quantity Filter Section */}
                <div className="border-b-2 pb-3 flex items center w-full mt-7">
                  <i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" />
                  <h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Filter by quantity</h1>
                </div>
                {quantitySortingProducts !== 'none' && (
                  <div
                    className="text-center cursor-pointer px-4 py-1 rounded-2xl border border-[#2781af] bg-white text-[#2781af] font-medium transition-all duration-200 hover:bg-[#2781af] hover:text-white hover:shadow-md mt-2"
                    onClick={() => setQuantitySortingProducts('none')}
                  >
                    Clear filter
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  <div
                    onClick={() => setQuantitySortingProducts('Highesttolowest')}
                    className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
                      ${quantitySortingProducts === 'Highesttolowest'
                        ? 'bg-[#2781af] text-white border-[#2781af]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    Highest to Lowest
                  </div>

                  <div
                    onClick={() => setQuantitySortingProducts('Lowesttohighest')}
                    className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
                      ${quantitySortingProducts === 'Lowesttohighest'
                        ? 'bg-[#2781af] text-white border-[#2781af]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    Lowest to Highest
                  </div>

                  <div
                    onClick={() => setQuantitySortingProducts('OutOfStock')}
                    className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
                      ${quantitySortingProducts === 'OutOfStock'
                        ? 'bg-[#2781af] text-white border-[#2781af]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    Out of Stock
                  </div>

                
                  <div
                    onClick={() => setQuantitySortingProducts('CriticalStock')}
                    className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
                      ${quantitySortingProducts === 'CriticalStock'
                        ? 'bg-[#2781af] text-white border-[#2781af]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    Critical Stock (1-3)
                  </div>

                  <div
                    onClick={() => setQuantitySortingProducts('LowStock')}
                    className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
                      ${quantitySortingProducts === 'LowStock'
                        ? 'bg-[#2781af] text-white border-[#2781af]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  >
                    Low Stock (4-6)
                  </div>

                </div>




            
            {/*<div className=""> <bautistainventorycategoryBox value={bautistainventorycategorynamebox} loading={loadingbautistainventorycategorylist} onChange={(e) => setbautistainventorycategorynamebox(e.target.value)} categories={bautistainventorycategorylist}/></div>*/}

          </div>
          <div className=" flex flex-col justify-start items-start  lg:ml-2 rounded-2xl w-full lg:w-[90%]  min-h-[540px] max-h-auto h-auto shadow-b-lg ">
              {/* Mobile Filter Button - Only show on small screens */}
              <div style={{ width: '100%', padding: '8px 16px' }} className="lg:hidden">
                <button 
                  onClick={() => setShowMobileFilters(true)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#2781af',
                    color: 'white',
                    borderRadius: '16px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#1e6a8f'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#2781af'}
                >
                  <i className="bx bx-filter" style={{ fontSize: '20px' }}></i>
                  Filters & Categories
                </button>
              </div>
              
              <div className="ml-2 lg:ml-6 flex flex-col sm:flex-row justify-center items-start sm:items-center mb-4">
                <h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-0 sm:mr-3 mb-2 sm:mb-0">Search: </h2>
                <div className="relative flex items-center justify-center gap-3 w-full sm:flex-1">
                  <i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i>
                  <input 
                    value={searchProducts} 
                    onChange={(e) => setsearchProducts(e.target.value)} 
                    type="text" 
                    placeholder="Enter product name here..."   
                    className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
                  />
                </div>
              </div>

              <div className=" w-[100%] rounded-2xl h-auto  flex flex-wrap content-start gap-3 pl-2 pt-2 ">
                

              {/* Updated product grid - 2 columns on mobile, flexible on larger screens */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 p-2 sm:p-4 w-full">
                {bautistaloadingproducts ? (
                  <ProductGridSkeleton />
                ): bautistainventoryproducts.length === 0 ? (
                  <div className="w-full text-center py-8">
                    <p className="text-gray-500 text-lg">No Products Found...</p>
                  </div>
                ):(
                    bautistafilteredproducts().sort((a, b) => {
                    if (a.bautistainventoryproductquantity === 0 && b.bautistainventoryproductquantity !== 0) return 1;
                    if (a.bautistainventoryproductquantity !== 0 && b.bautistainventoryproductquantity === 0) return -1;
                    return 0; }) .map((product) => (
              <div key={product.bautistainventoryproductid} onClick={() => {setshowpatientbautistaviewproduct(true);
                                                                           setselectedbautistaproduct(product);
                                                                           setbautistacurrentimageindex(0);
                                                                           setbautistainventorycategorynamebox(product?.bautistainventoryproductcategory || '');
                                                                           setaddbautistainventoryproductname(product?.bautistainventoryproductname || '');
                                                                           setaddbautistainventoryproductbrand(product?.bautistainventoryproductbrand || '');
                                                                           setaddbautistainventoryproductmodelnumber(product?.bautistainventoryproductmodelnumber || ''); 
                                                                           setaddbautistainventoryproductdescription(product?.bautistainventoryproductdescription || '');
                                                                           setaddbautistainventoryproductprice(product?.bautistainventoryproductprice || 0);
                                                                           setaddbautistainventoryproductquantity(product?.bautistainventoryproductquantity || 0);
                                                                           setaddbautistainventoryproductimagepreviewimages(product?.bautistainventoryproductimagepreviewimages || []);
              
              const isInWishList = wishlistItems.some(item => item.patientwishlistinventoryproductid === product.bautistainventoryproductid);
              setbautistaheartisClicked(isInWishList);    
              
              }} className="motion-preset-slide-up flex flex-col items-start justify-start w-full h-auto shadow-md bg-white rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-200 relative">
                <img src={product.bautistainventoryproductimagepreviewimages[0] || defaultimageplaceholder}  alt={product.bautistainventoryproductname} className={`w-full h-32 sm:h-40 md:h-45 object-cover rounded-t-2xl ${product.bautistainventoryproductquantity === 0 ? 'opacity-50': ''}`}/>
                
               {product.bautistainventoryproductquantity === 0 ? (<div className="top-2 right-2 absolute px-1 sm:px-2 py-1 rounded-md text-xs font-semibold bg-red-200"><h1 className="text-red-900 text-xs">Out of Stock</h1></div>): 
                 product.bautistainventoryproductquantity >= 1 && product.bautistainventoryproductquantity <= 3 ? (<div className="top-2 right-2 absolute px-1 sm:px-2 py-1 rounded-md text-xs font-semibold bg-orange-200"><h1 className="text-orange-900 text-xs">Critical Stock</h1></div>):
                 product.bautistainventoryproductquantity >= 4 && product.bautistainventoryproductquantity <= 6 ? (<div className="top-2 right-2 absolute px-1 sm:px-2 py-1 rounded-md text-xs font-semibold bg-yellow-200"><h1 className="text-yellow-900 text-xs">Low Stock</h1></div>): null}
                 
                <div className="p-2 sm:p-3 w-full flex flex-col">
                  <div className="w-fit rounded-md py-1 px-2 mb-2 bg-[#F0F6FF]">
                    <h1 className={`font-medium text-[#0d0d0d] text-xs sm:text-[13px] ${product.bautistainventoryproductquantity === 0 ? 'text-gray-400': ''}`}>{product.bautistainventoryproductcategory}</h1>
                  </div>
                  <div className="mb-1">
                    <h1 className={`font-semibold text-sm sm:text-[15px] line-clamp-2 ${product.bautistainventoryproductquantity === 0 ? 'text-gray-400': ''}`}>{product.bautistainventoryproductname}</h1>
                  </div>
                  <div className="mb-2">
                    <h1 className={`font-albertsans font-bold text-[#1f8126] text-sm sm:text-[18px] ${product.bautistainventoryproductquantity === 0 ? 'text-gray-400': ''}`}>₱ {product.bautistainventoryproductprice?.toLocaleString()}</h1>
                  </div>
                  <div className="mt-auto">
                    <h1 className={`font-albertsans font-medium text-[#4e4f4f] text-xs sm:text-[15px] ${product.bautistainventoryproductquantity === 0 ? 'text-gray-400': ''}`}>{bautistaproductsoldCounts[product.bautistainventoryproductid] ?? 0} Sold</h1>
                  </div>
                </div>
              </div>
                  ))
                )}
              </div>

              
              

              </div>
          </div>

          </div>)}


      {/*Toast Message when wishlist button is clicked*/}
          {bautistashowheartToast && (
            <div className="top-4  -translate-x-1/2  z-100   left-1/2 transform fixed " >
                  <div key={bautistaheartisClicked ? 'added' : 'removed'}  className={` ${bautistashowtoastmessageClosing ? 'motion-opacity-out-0' : 'motion-preset-bounce'}  flex items-center bg-white   rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`} >
                    {bautistaheartisClicked ? (          
                       <span className="text-green-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle "></i></span>
                    ) : (
                      <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle "></i></span>
                    )}
                    {bautistashowtoastMessage}
                  </div>
           
            </div>
          )}




          {showpatientbautistaviewproduct && (

                         <div className="overflow-y-auto h-auto bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50 p-2 sm:p-4">
                           <div className="motion-opacity-in-0 mt-2 sm:mt-10 px-3 sm:px-5 py-4 bg-[#fefefe] rounded-2xl w-full max-w-6xl h-auto mb-10 animate-fadeInUp">
                                <div className="mt-2 sm:mt-5 flex justify-end items-center left-0 w-[100%] h-auto sm:h-[70px]">
                   
                                  <div onClick={() => {setbautistaCount(1); setselectedbautistaproduct(null);setshowpatientbautistaviewproduct(false)}} className="bg-[#333232] px-6 sm:px-10 py-2 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[30px] sm:text-[40px]"/></div>
                                </div>


                          <form className="flex flex-col px-2 sm:px-4 lg:px-15 mt-2 sm:mt-5 pb-6 sm:pb-10">
                                <div className="flex flex-col lg:flex-row justify-center items-start rounded-2xl w-full h-auto gap-4 lg:gap-6">
                                  <div className="w-full lg:w-auto flex justify-center">



                                      <div className="h-fit w-fit flex-none">
  
                                <div className="relative">
                                


                                <div className="flex items-center justify-end mb-2">
                                 {addbautistainventoryproductquantity === 0 && (
                                   <>
                                     <img src={getbautistaHeartImage()} onClick={bautistahearthandleClick} onMouseEnter={() => !bautistaheartisClicked && setbautistaheartisHovered(true)} onMouseLeave={() => !bautistaheartisClicked && setbautistaheartisHovered(false)} className={`ease-in-out duration-300 transition-all border-1 w-8 h-8 sm:w-10 sm:h-10 p-2 rounded-2xl cursor-pointer ${bautistaheartisClicked ? "bg-red-400" : "hover:bg-red-400"}`}/>
                                     <h1 className="ml-2 text-[15px] sm:text-[17px] font-semibold text-[#383838]">Wishlist</h1>
                                   </>
                                 )}
                                </div>




                                <img className="mt-2 w-full max-w-[300px] sm:max-w-[400px] lg:w-120 object-cover rounded-2xl h-auto lg:h-120" src={(selectedbautistaproduct?.bautistainventoryproductimagepreviewimages?.[bautistacurrentimageindex]) || (addbautistainventoryproductimagepreviewimages?.[bautistacurrentimageindex]) || defaultimageplaceholder}/>

                                     {((selectedbautistaproduct?.bautistainventoryproductimagepreviewimages?.length || 0) > 1 || 
                                       addbautistainventoryproductimagepreviewimages?.length > 1) && (
                                         <>
                                           <div type="button" onClick={bautistahandlepreviousimage} className="bg-opacity-50 hover:bg-opacity-75 rounded-2xl text-white p-1 sm:p-2 absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-gray-500"><i className="bx bx-chevron-left text-lg sm:text-2xl" /></div>

                                           <div type="button" onClick={bautistahandlenextimage} className="rounded-2xl absolute bg-opacity-50 text-white p-1 sm:p-2 transform -translate-y-1/2 bg-gray-500 hover:bg-opacity-75 right-1 sm:right-2 top-1/2"><i className="bx bx-chevron-right text-lg sm:text-2xl" /></div>

                                         </>
                                       )}

                                      {addbautistainventoryproductimagepreviewimages.length > 0 && (
                                          <div className="overflow-x-auto flex gap-2 mt-2 p-2 sm:p-4 border-y-1 rounded-2xl bg-[#fbfbfb] items-center">
                                            {addbautistainventoryproductimagepreviewimages.map((preview, index) => (
                                                <div key={index} className="relative">
                                                <img onClick={() => setbautistacurrentimageindex(index)} src={preview} className={`rounded-lg cursor-pointer object-cover w-16 h-16 sm:w-20 sm:h-20 ${bautistacurrentimageindex === index ? 'border-2 border-[#78b0d4]' : ''}`} />
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                     </div>
                                      
                                      

                                      </div>



                                  </div>

                                  <div className="w-full h-auto flex items-start mb-6 lg:mb-10 rounded-2xl min-w-0">
                                        <div className="w-[100%] h-auto rounded-4xl">
                                  
                                  
              
                                               <div className="w-[100%] registration-container">

                                    
                                        <div className="flex flex-wrap items-center mx-1 w-fit h-fit mt-2 break-words min-w-0"><h1 className="font-albertsans rounded-md py-1 px-2 rounded-1xl bg-[#F0F6FF] font-medium text-[#0d0d0d] min-w-0 break-words text-sm sm:text-base">{bautistainventorycategorynamebox}</h1>
                                        <p className="font-albertsans ml-1 text-sm sm:text-base">by</p>
                                        <p className="font-albertsans ml-1 font-semibold text-sm sm:text-base">{addbautistainventoryproductbrand}</p>
                                        </div>
                                        
                                     

                                        <h1 className="font-albertsans mt-3 min-w-0 break-words h-fit w-full font-bold text-[#212121] text-[20px] sm:text-[24px] lg:text-[29px]">{addbautistainventoryproductname}</h1>
                         
                                        <div className="mt-1 flex items-center">
                                          {/* 
                                          <img src={starimage} className="w-5 h-5"/>
                                          <p className="font-albertsans ml-2 mt-1 text-[15px] font-semibold">4.8</p><span className="mt-1 text-[13px] pr-3 ml-2">(89 reviews)</span>
                                          */} 
                                          <p className="mt-1 font-albertsans border-l-2 border-[#8c8c8c] pl-3 text-[12px] sm:text-[13px]">{bautistaproductsoldCount} sold</p>
                                        </div>
                        
                                  
                                        <p className="mt-5 font-albertsans font-semibold text-[#478d12] text-[28px] sm:text-[35px] lg:text-[40px]">₱{Number(addbautistainventoryproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p>
                                  
                                        <p className="font-albertsans mt-6 font-medium text-[#020202] text-[16px] sm:text-[18px]">Description</p>
                                        <p className="font-albertsans font-semibold text-[#4b4b4b] mt-3 text-sm sm:text-base">{addbautistainventoryproductdescription}</p>
                                      
                                       

                                      {addbautistainventoryproductquantity === 0 ? ( 
                                        <div className="bg-gray-400 py-2 px-3 rounded-md justify-center gap-4 mt-6 sm:mt-15 flex items-center">
                                          <p className="font-albertsans font-semibold">Out of Stock</p>
                                         </div>
                                       
                                      ):(
                                        <div className="gap-4 mt-6 sm:mt-15 flex items-center">
                                          <p className="font-albertsans font-semibold">In Stock:</p>
                                          <p className="font-albertsans font-semibold text-[#616161] text-[13px] sm:text-[14px]">{addbautistainventoryproductquantity} pieces available</p>
                                         </div>
                                      )}    



                                           <div className="flex flex-col sm:flex-row w-full items-center justify-between mt-6 sm:mt-10 gap-2 sm:gap-0 p-3 sm:h-22 bg-[#fbfbfb] rounded-2xl">
                                              <div className="gap-1 sm:gap-2 h-auto sm:h-full w-full sm:w-40 flex items-center flex-col justify-center"><img src={find} className="w-6 h-6 sm:w-8 sm:h-8"/><p className="font-albertsans text-[11px] sm:text-[13px] font-medium text-center">Browse Products</p></div>
                                              <div className="gap-1 sm:gap-2 h-auto sm:h-full w-auto sm:w-30 hidden sm:flex items-center flex-col justify-center"><img src={nextimage} className="w-6 h-6 sm:w-8 sm:h-8"/></div>
                                              <div className="gap-1 sm:gap-2 h-auto sm:h-full w-full sm:w-auto sm:min-w-[160px] flex items-center flex-col justify-center"><img src={storeimage} className="w-6 h-6 sm:w-8 sm:h-8"/> <p className="font-albertsans text-[11px] sm:text-[13px] font-medium text-center whitespace-nowrap">Go to Bautista Eye Center</p></div>
                                              <div className="gap-1 sm:gap-2 h-auto sm:h-full w-auto sm:w-30 hidden sm:flex items-center flex-col justify-center"><img src={nextimage} className="w-6 h-6 sm:w-8 sm:h-8"/></div>
                                              <div className="gap-1 sm:gap-2 h-auto sm:h-full w-full sm:w-40 flex items-center flex-col justify-center"><img src={inquire} className="w-6 h-6 sm:w-8 sm:h-8"/><p className="font-albertsans text-[11px] sm:text-[13px] font-medium text-center">Inquire</p></div>
                                           </div>
                                   
                                        </div>
                                

                                  
                                        </div>


                                  </div>

                                </div>
                                  {/*        
                                <div className="w-auto h-full  ">
                                  <h1 className="font-albertsans mt-8 text-[21px] font-semibold text-[#171717]">Product Ratings</h1>
                                  <div className="border-2 border-[#a0c1d1] flex items-center justify-between mt-2 w-full h-20 p-6 py-15 bg-[#f7fdff] rounded-2xl">
                                    <div>
                                    <h1 className="text-[20px] text-[#05415c]"><span className="text-[30px] font-semibold">4.9</span> out of 5</h1>
                                    <Stack spacing={1}>
                                      <Rating name="half-rating-read" defaultValue={4.5} precision={5} readOnly />
                                  </Stack>
                                    </div>

                                    <h1 className="text-[20px] text-[#05415c] ml-5 ">(89 Total Reviews)</h1>
                                  </div>
                                   
                              <div className="w-full h-auto bg-[#ffffff]">
                               <div className="border-b-2 py-5">
                                 <div className="px-2 mt-5 flex h-auto w-fit items-start">
                                   <div className="h-11 w-11 flex-shrink-0">
                                     <img 
                                       src={patientprofilepicture || 'default-profile.png'} 
                                       alt="Profile" 
                                       className="h-11 w-11 rounded-full object-cover"
                                     />
                                   </div>

                                   <div className="ml-3 flex flex-col pb-2">
                                     <h1 className="font-albertsans font-medium text-[#2b2b2b]">Francis Daniel M. Genese</h1>
                                     <Stack spacing={1}>
                                       <Rating name="half-rating-read" defaultValue={4.5} precision={5} readOnly size="small" />
                                     </Stack>
                                     <p className="ml-0 mt-1 text-[12px] font-semibold text-[#444444]">2025-06-24 22:04</p>
                                     <p className="text-[14px] font-albertsans mt-4">
                                       Vention has 100% legit cable wires and cable cords that you can use with your laptops, computers and gadgets. You will never regret purchasing equipment from his shop. Highly recommended for youtlr techie stuff. Thank you seller!
                                     </p>
                                   </div>

                                 </div>
                               </div>






                               
                              </div>
                                </div>
                                */}
                                </form>
                           </div>
                         </div>
              

          )}

          {patientorderbautistaproductToast && (
            <div className=" bottom-4 right-8  z-101   transform fixed " >
                  <div key={patientorderbautistaproductisClicked ? 'added' : 'removed'}  className={` ${patientorderbautistaproductToastClosing ? 'motion-translate-x-out-100 motion-duration-[3s]  motion-ease-spring-smooth' : 'motion-preset-slide-left'}  flex items-center bg-white   rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`} >
                    {patientorderbautistaproductisClicked ? (          
                       <span className="text-green-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle "></i></span>
                    ) : (
                      <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle "></i></span>
                    )}
                    {patientorderbautistaproductToastMessage}

                    <div  className={`rounded-b-2xl absolute bottom-0 left-0 h-1 bg-green-500 `}  style={{width: progressWidth,transition: 'width 4s linear' }}/>

                  </div>
           
            </div>  
          )}







              </div> 

       </div>
      

      </div>

















      
        </section>

      {/* View Order Modal */}
      {showViewOrderModal && selectedOrderForView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
              <button 
                onClick={closeViewOrderModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className="bx bx-x text-3xl"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Product Images Gallery */}
              <div className="relative">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Product Images</h3>
                {((selectedOrderForView.patientorderambherproductimage || selectedOrderForView.patientorderbautistaproductimage) && 
                  (selectedOrderForView.patientorderambherproductimage?.length > 0 || selectedOrderForView.patientorderbautistaproductimage?.length > 0)) ? (
                  <div className="relative">
                    <img 
                      src={(selectedOrderForView.patientorderambherproductimage || selectedOrderForView.patientorderbautistaproductimage)[viewOrderCurrentImageIndex]} 
                      alt="Product" 
                      className="w-full h-80 object-cover rounded-xl shadow-lg"
                    />
                    {(selectedOrderForView.patientorderambherproductimage?.length > 1 || selectedOrderForView.patientorderbautistaproductimage?.length > 1) && (
                      <>
                        <button 
                          onClick={prevViewOrderImage}
                          disabled={viewOrderCurrentImageIndex === 0}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 disabled:bg-opacity-50 disabled:cursor-not-allowed text-gray-800 p-3 rounded-full shadow-lg transition-all"
                        >
                          <i className="bx bx-chevron-left text-xl"></i>
                        </button>
                        <button 
                          onClick={nextViewOrderImage}
                          disabled={viewOrderCurrentImageIndex === (selectedOrderForView.patientorderambherproductimage?.length || selectedOrderForView.patientorderbautistaproductimage?.length) - 1}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 disabled:bg-opacity-50 disabled:cursor-not-allowed text-gray-800 p-3 rounded-full shadow-lg transition-all"
                        >
                          <i className="bx bx-chevron-right text-xl"></i>
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                          {viewOrderCurrentImageIndex + 1} / {(selectedOrderForView.patientorderambherproductimage?.length || selectedOrderForView.patientorderbautistaproductimage?.length)}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-80 bg-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-gray-500">No images available</span>
                  </div>
                )}
              </div>

              {/* Order Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Product Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 font-medium">Product Name:</span>
                      <p className="text-gray-800 font-semibold">{selectedOrderForView.patientorderambherproductname || selectedOrderForView.patientorderbautistaproductname}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Quantity:</span>
                      <p className="text-gray-800">x{selectedOrderForView.patientorderambherproductquantity || selectedOrderForView.patientorderbautistaproductquantity}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Unit Price:</span>
                      <p className="text-gray-800">₱{Number(selectedOrderForView.patientorderambherproductprice || selectedOrderForView.patientorderbautistaproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Total Price:</span>
                      <p className="text-green-600 font-bold text-lg">₱{((selectedOrderForView.patientorderambherproductprice || selectedOrderForView.patientorderbautistaproductprice) * (selectedOrderForView.patientorderambherproductquantity || selectedOrderForView.patientorderbautistaproductquantity)).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Order Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 font-medium">Order ID:</span>
                      <p className="text-gray-800 font-mono text-sm">{selectedOrderForView.patientorderambherid || selectedOrderForView.patientorderbautistaid}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Date Ordered:</span>
                      <p className="text-gray-800">{new Date(selectedOrderForView.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Status:</span>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                        {selectedOrderForView.patientorderambherstatus || selectedOrderForView.patientorderbautistastatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Pickup:</span>
                      <p className="text-gray-800">
                        {(selectedOrderForView.patientorderambherproductpickupstatus || selectedOrderForView.patientorderbautistaproductpickupstatus) === 'Now' 
                          ? `Completed (${new Date(selectedOrderForView.createdAt).toLocaleDateString()})` 
                          : 'To be scheduled'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Clinic:</span>
                      <p className="text-gray-800">
                        {selectedOrderForView.patientorderambherid ? 'Ambher Optical' : 'Bautista Eye Center'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <span className="text-blue-600 font-medium">Amount Paid</span>
                    <p className="text-blue-800 font-bold text-lg">₱{Number(selectedOrderForView.patientorderambheramountpaid || selectedOrderForView.patientorderbautistaamountpaid).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <span className="text-green-600 font-medium">Total Amount</span>
                    <p className="text-green-800 font-bold text-lg">₱{Number(selectedOrderForView.patientorderambherproducttotal || selectedOrderForView.patientorderbautistaproducttotal).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${Number(selectedOrderForView.patientorderambheramountpaid || selectedOrderForView.patientorderbautistaamountpaid) < Number(selectedOrderForView.patientorderambherproducttotal || selectedOrderForView.patientorderbautistaproducttotal) ? 'bg-yellow-50' : 'bg-green-50'}`}>
                    <span className={`font-medium ${Number(selectedOrderForView.patientorderambheramountpaid || selectedOrderForView.patientorderbautistaamountpaid) < Number(selectedOrderForView.patientorderambherproducttotal || selectedOrderForView.patientorderbautistaproducttotal) ? 'text-yellow-600' : 'text-green-600'}`}>
                      Payment Status
                    </span>
                    <p className={`font-bold text-lg ${Number(selectedOrderForView.patientorderambheramountpaid || selectedOrderForView.patientorderbautistaamountpaid) < Number(selectedOrderForView.patientorderambherproducttotal || selectedOrderForView.patientorderbautistaproducttotal) ? 'text-yellow-800' : 'text-green-800'}`}>
                      {Number(selectedOrderForView.patientorderambheramountpaid || selectedOrderForView.patientorderbautistaamountpaid) < Number(selectedOrderForView.patientorderambherproducttotal || selectedOrderForView.patientorderbautistaproducttotal) ? 'Down Payment' : 'Fully Paid'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Order Notes</h3>
                <div className="bg-gray-50 p-4 rounded-lg min-h-24">
                  {selectedOrderForView.patientorderambherproductdescription || selectedOrderForView.patientorderbautistaproductdescription ? (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedOrderForView.patientorderambherproductdescription || selectedOrderForView.patientorderbautistaproductdescription}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">No order notes available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



            <Footer />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#111827'
            }}>
              Confirm Logout
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '24px'
            }}>
              Are you sure you want to log out? You will need to sign in again to access your account.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={cancelLogout}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: 99
        }}>
          <div style={{
            backgroundColor: 'white',
            width: '100%',
            maxHeight: '80vh',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            paddingBottom: '16px',
            paddingLeft: '16px',
            paddingRight: '16px',

            overflowY: 'auto',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              paddingBottom: '12px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#363636',
                margin: 0
              }}>Filters & Categories</h2>
              <button 
                onClick={() => setShowMobileFilters(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <i className="bx bx-x" style={{ fontSize: '24px', color: '#6b7280' }}></i>
              </button>
            </div>
            
            {/* Filter content - Dynamic based on active inventory table */}
            {activeinventorytable === 'ambherinventorytable' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Category Filter */}
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#363636',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px'
                  }}>
                    <i className="bx bx-category" style={{ marginRight: '8px' }}></i>
                    Filter by Category
                  </h3>
                  
                  {activeambherinventorycategorytable !== 'all' && (
                    <button
                      onClick={() => showambherinventorycategory('all')}
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        cursor: 'pointer',
                        padding: '8px 16px',
                        borderRadius: '16px',
                        border: '2px solid #2781af',
                        backgroundColor: 'white',
                        color: '#2781af',
                        fontWeight: '500',
                        marginBottom: '12px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#2781af';
                        e.target.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.color = '#2781af';
                      }}
                    >
                      Clear filter
                    </button>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => showambherinventorycategory('all')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: activeambherinventorycategorytable === 'all' ? '#2781af' : 'white',
                        color: activeambherinventorycategorytable === 'all' ? 'white' : '#374151'
                      }}
                    >
                      <span>All</span>
                      <span style={{
                        backgroundColor: '#e5e7eb',
                        color: '#6b7280',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '12px'
                      }}>
                        {ambherinventoryproducts.length}
                      </span>
                    </button>

                    {ambherinventorycategorylist.map(category => {
                      const productcount = ambherinventoryproducts.filter(product =>
                        product.ambherinventoryproductcategory === category.ambherinventorycategoryname).length;
                      const isActive = activeambherinventorycategorytable === category.ambherinventorycategoryname;
                      return(
                        <button 
                          key={category._id}
                          onClick={() => setactiveambherinventorycategorytable(category.ambherinventorycategoryname)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            border: '1px solid #d1d5db',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            backgroundColor: isActive ? '#2781af' : 'white',
                            color: isActive ? 'white' : '#374151'
                          }}
                        >
                          <span>{category.ambherinventorycategoryname}</span>
                          <span style={{
                            backgroundColor: '#e5e7eb',
                            color: '#6b7280',
                            fontWeight: '600',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '12px'
                          }}>
                            {productcount}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Advanced Filters */}
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#363636',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px'
                  }}>
                    <i className="bx bx-filter-alt" style={{ marginRight: '8px' }}></i>
                    Advanced Filters
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => setActiveAmbherProductFilter('all')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: activeAmbherProductFilter === 'all' ? '#2781af' : 'white',
                        color: activeAmbherProductFilter === 'all' ? 'white' : '#374151'
                      }}
                    >
                      All Products
                    </button>

                    {ambherProductFilters.map(filter => (
                      <button 
                        key={filter.id}
                        onClick={() => setActiveAmbherProductFilter(filter.id)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '16px',
                          border: '1px solid #d1d5db',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          backgroundColor: activeAmbherProductFilter === filter.id ? '#2781af' : 'white',
                          color: activeAmbherProductFilter === filter.id ? 'white' : '#374151'
                        }}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter by Price */}
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#363636',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px'
                  }}>
                    <i className="bx bx-money" style={{ marginRight: '8px' }}></i>
                    Filter by Price
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => setpricesortingProducts('none')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: pricesortingProducts === 'none' ? '#2781af' : 'white',
                        color: pricesortingProducts === 'none' ? 'white' : '#374151'
                      }}
                    >
                      No Sorting
                    </button>

                    <button
                      onClick={() => setpricesortingProducts('Highesttolowest')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: pricesortingProducts === 'Highesttolowest' ? '#2781af' : 'white',
                        color: pricesortingProducts === 'Highesttolowest' ? 'white' : '#374151'
                      }}
                    >
                      Highest to Lowest
                    </button>

                    <button
                      onClick={() => setpricesortingProducts('Lowesttohighest')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: pricesortingProducts === 'Lowesttohighest' ? '#2781af' : 'white',
                        color: pricesortingProducts === 'Lowesttohighest' ? 'white' : '#374151'
                      }}
                    >
                      Lowest to Highest
                    </button>
                  </div>
                </div>

                {/* Filter by Quantity */}
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#363636',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px'
                  }}>
                    <i className="bx bx-package" style={{ marginRight: '8px' }}></i>
                    Filter by Quantity
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => setQuantitySortingProducts('none')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: quantitySortingProducts === 'none' ? '#2781af' : 'white',
                        color: quantitySortingProducts === 'none' ? 'white' : '#374151'
                      }}
                    >
                      No Sorting
                    </button>

                    <button
                      onClick={() => setQuantitySortingProducts('Highesttolowest')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: quantitySortingProducts === 'Highesttolowest' ? '#2781af' : 'white',
                        color: quantitySortingProducts === 'Highesttolowest' ? 'white' : '#374151'
                      }}
                    >
                      Highest to Lowest
                    </button>

                    <button
                      onClick={() => setQuantitySortingProducts('Lowesttohighest')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: quantitySortingProducts === 'Lowesttohighest' ? '#2781af' : 'white',
                        color: quantitySortingProducts === 'Lowesttohighest' ? 'white' : '#374151'
                      }}
                    >
                      Lowest to Highest
                    </button>

                    <button
                      onClick={() => setQuantitySortingProducts('OutOfStock')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: quantitySortingProducts === 'OutOfStock' ? '#2781af' : 'white',
                        color: quantitySortingProducts === 'OutOfStock' ? 'white' : '#374151'
                      }}
                    >
                      Out of Stock
                    </button>

                    <button
                      onClick={() => setQuantitySortingProducts('CriticalStock')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: quantitySortingProducts === 'CriticalStock' ? '#2781af' : 'white',
                        color: quantitySortingProducts === 'CriticalStock' ? 'white' : '#374151'
                      }}
                    >
                      Critical Stock (1-3)
                    </button>

                    <button
                      onClick={() => setQuantitySortingProducts('LowStock')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: quantitySortingProducts === 'LowStock' ? '#2781af' : 'white',
                        color: quantitySortingProducts === 'LowStock' ? 'white' : '#374151'
                      }}
                    >
                      Low Stock (4-6)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Bautista Category Filter */}
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#363636',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px'
                  }}>
                    <i className="bx bx-category" style={{ marginRight: '8px' }}></i>
                    Filter by Category
                  </h3>
                  
                  {activebautistainventorycategorytable !== 'all' && (
                    <button
                      onClick={() => showbautistainventorycategory('all')}
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        cursor: 'pointer',
                        padding: '8px 16px',
                        borderRadius: '16px',
                        border: '2px solid #2781af',
                        backgroundColor: 'white',
                        color: '#2781af',
                        fontWeight: '500',
                        marginBottom: '12px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#2781af';
                        e.target.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.color = '#2781af';
                      }}
                    >
                      Clear filter
                    </button>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => showbautistainventorycategory('all')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: activebautistainventorycategorytable === 'all' ? '#2781af' : 'white',
                        color: activebautistainventorycategorytable === 'all' ? 'white' : '#374151'
                      }}
                    >
                      <span>All</span>
                      <span style={{
                        backgroundColor: '#e5e7eb',
                        color: '#6b7280',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '12px'
                      }}>
                        {bautistainventoryproducts.length}
                      </span>
                    </button>

                    {bautistainventorycategorylist.map(category => {
                      const productcount = bautistainventoryproducts.filter(product =>
                        product.bautistainventoryproductcategory === category.bautistainventorycategoryname).length;
                      const isActive = activebautistainventorycategorytable === category.bautistainventorycategoryname;
                      return(
                        <button 
                          key={category._id}
                          onClick={() => setactivebautistainventorycategorytable(category.bautistainventorycategoryname)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            border: '1px solid #d1d5db',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            backgroundColor: isActive ? '#2781af' : 'white',
                            color: isActive ? 'white' : '#374151'
                          }}
                        >
                          <span>{category.bautistainventorycategoryname}</span>
                          <span style={{
                            backgroundColor: '#e5e7eb',
                            color: '#6b7280',
                            fontWeight: '600',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '12px'
                          }}>
                            {productcount}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Bautista Advanced Filters */}
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#363636',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px'
                  }}>
                    <i className="bx bx-filter-alt" style={{ marginRight: '8px' }}></i>
                    Advanced Filters
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => setActiveBautistaProductFilter('all')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: activeBautistaProductFilter === 'all' ? '#2781af' : 'white',
                        color: activeBautistaProductFilter === 'all' ? 'white' : '#374151'
                      }}
                    >
                      All Products
                    </button>

                    {bautistaProductFilters.map(filter => (
                      <button 
                        key={filter.id}
                        onClick={() => setActiveBautistaProductFilter(filter.id)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '16px',
                          border: '1px solid #d1d5db',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          backgroundColor: activeBautistaProductFilter === filter.id ? '#2781af' : 'white',
                          color: activeBautistaProductFilter === filter.id ? 'white' : '#374151'
                        }}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter by Price */}
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#363636',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px'
                  }}>
                    <i className="bx bx-money" style={{ marginRight: '8px' }}></i>
                    Filter by Price
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => setpricesortingProducts('none')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: pricesortingProducts === 'none' ? '#2781af' : 'white',
                        color: pricesortingProducts === 'none' ? 'white' : '#374151'
                      }}
                    >
                      No Sorting
                    </button>

                    <button
                      onClick={() => setpricesortingProducts('Highesttolowest')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: pricesortingProducts === 'Highesttolowest' ? '#2781af' : 'white',
                        color: pricesortingProducts === 'Highesttolowest' ? 'white' : '#374151'
                      }}
                    >
                      Highest to Lowest
                    </button>

                    <button
                      onClick={() => setpricesortingProducts('Lowesttohighest')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: pricesortingProducts === 'Lowesttohighest' ? '#2781af' : 'white',
                        color: pricesortingProducts === 'Lowesttohighest' ? 'white' : '#374151'
                      }}
                    >
                      Lowest to Highest
                    </button>
                  </div>
                </div>

                {/* Filter by Quantity */}
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#363636',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px'
                  }}>
                    <i className="bx bx-package" style={{ marginRight: '8px' }}></i>
                    Filter by Quantity
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => setQuantitySortingProducts('none')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: quantitySortingProducts === 'none' ? '#2781af' : 'white',
                        color: quantitySortingProducts === 'none' ? 'white' : '#374151'
                      }}
                    >
                      No Sorting
                    </button>

                    <button
                      onClick={() => setQuantitySortingProducts('Highesttolowest')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: quantitySortingProducts === 'Highesttolowest' ? '#2781af' : 'white',
                        color: quantitySortingProducts === 'Highesttolowest' ? 'white' : '#374151'
                      }}
                    >
                      Highest to Lowest
                    </button>

                    <button
                      onClick={() => setQuantitySortingProducts('Lowesttohighest')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: quantitySortingProducts === 'Lowesttohighest' ? '#2781af' : 'white',
                        color: quantitySortingProducts === 'Lowesttohighest' ? 'white' : '#374151'
                      }}
                    >
                      Lowest to Highest
                    </button>

                    <button
                      onClick={() => setQuantitySortingProducts('OutOfStock')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: quantitySortingProducts === 'OutOfStock' ? '#2781af' : 'white',
                        color: quantitySortingProducts === 'OutOfStock' ? 'white' : '#374151'
                      }}
                    >
                      Out of Stock
                    </button>

                    <button
                      onClick={() => setQuantitySortingProducts('CriticalStock')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: quantitySortingProducts === 'CriticalStock' ? '#2781af' : 'white',
                        color: quantitySortingProducts === 'CriticalStock' ? 'white' : '#374151'
                      }}
                    >
                      Critical Stock (1-3)
                    </button>

                    <button
                      onClick={() => setQuantitySortingProducts('LowStock')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: quantitySortingProducts === 'LowStock' ? '#2781af' : 'white',
                        color: quantitySortingProducts === 'LowStock' ? 'white' : '#374151'
                      }}
                    >
                      Low Stock (4-6)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Apply Filters Button */}
            <div style={{
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'white',
              paddingTop: '16px',
              marginTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button 
                onClick={() => setShowMobileFilters(false)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#2781af',
                  color: 'white',
                  borderRadius: '16px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1e6a8f'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#2781af'}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </>
   )
  }
        
export default PatientProducts