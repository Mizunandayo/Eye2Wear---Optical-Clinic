can you modify the UI/UXof showpatientambherorder modal to a modern minimalistic modal? dont change the header (Icon, Set Order, Review and set order for customers and the close button), also dont change the modal background and rounded corners only modify the contents below it  
{showpatientorderambher && (

           <div className="overflow-y-auto h-auto px-10 bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
             <div className="  h-auto min-h-180  mb-7 mt-7 pl-5 pr-5 bg-white rounded-2xl w-full  animate-fadeInUp ">
                  <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                            <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <i className="bx bxs-receipt text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Set Order
            </h2>
            <p className="text-sm text-gray-500">Review and set order for customers</p>
          </div>
        </div>
                    <div onClick={() => {
                       setorderambherEmail('');
                       setorderambherprofilePicture('');
                       setorderambherfullName('');
                       setorderambherlastName('');
                       setorderambhermiddleName('');
                       setorderambherfirstName('');
                       setorderambhercontactNumber('');
                       setorderambherpickupplace('');
                       setorderambherdownPayment('');
                       setorderambhercustomFee('');
                       setorderambheramountPaid('');
                       setorderambherNotes('');
                       setactiveambherpickupnoworlater(null);
                       setambherCount(0); 
                       setambherpickupStatus('Later');
                       setambherproductsoldCount(0);
                       setselectedorderambherproduct(null);
                       setshowpatientorderambher(false);}} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"><i className="bx bx-x text-gray-600 text-xl "/></div>
                  </div>


                  <div className="gap-2 mt-3 w-full h-auto  flex items-start justify-center">



                  <div className=" p-2 w-[25%] max-h-145  ">  
                    <div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input onChange={(e) => setsearchpatientorderambherTerm(e.target.value)} value={searchpatientorderambherTerm} type="text" placeholder="Enter product name..." className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
                  <div className="mt-2 p-2 w-full max-h-138 overflow-y-auto  "> 
  {ambherloadingproducts ? (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <InventorySkeleton key={index} />
      ))}
    </div>
  ): ambherinventoryproducts.length === 0 ? (
    <div>No Products Found...</div> 
  ):(
    [...filteredAmbherProducts]
  .filter(product => 
    product.ambherinventoryproductname.toLowerCase().includes(searchpatientorderambherTerm.toLowerCase())
  )
    .sort((a, b) => {
      const aquant = a.ambherinventoryproductquantity || 0;
      const bquant = b.ambherinventoryproductquantity || 0;
      return bquant - aquant;
    }).map((product) => (


        <div key={product.ambherinventoryproductid} onClick={() => {
                                                            // Prevent selection if product is out of stock
                                                            if (product.ambherinventoryproductquantity === 0) {
                                                              return;
                                                            }
                                                            console.log('Selecting product:', product);
                                                             setselectedorderambherproduct(product);
                                                             setorderambhercurrentimageindex(0);
                                                             setambherCount(1);
                                                             setorderambherinventorycategorynamebox(product?.ambherinventoryproductcategory || '');
                                                             setorderambherinventoryproductname(product?.ambherinventoryproductname || '');
                                                             setorderambherinventoryproductbrand(product?.ambherinventoryproductbrand || '');
                                                             setorderambherinventoryproductmodelnumber(product?.ambherinventoryproductmodelnumber || '');
                                                             setorderambherinventoryproductdescription(product?.ambherinventoryproductdescription || '');
                                                             setorderambherinventoryproductnotes(product?.ambherinventoryproductnotes || '');
                                                             setorderambherinventoryproductprice(product?.ambherinventoryproductprice || 0);
                                                             setorderambherinventoryproductquantity(product?.ambherinventoryproductquantity || 0);
                                                             setorderambherinventoryproductimagepreviewimages(product?.ambherinventoryproductimagepreviewimages || []);}}    className={`${product.ambherinventoryproductquantity == 0 ? 'opacity-50 relative cursor-not-allowed' : ''} mb-2  items-center p-2 min-h-25 h-auto rounded-2xl border-1 hover:shadow-md hover:cursor-pointer transition-all duration-300 ease-in-out max-w-full`} >
             {product.ambherinventoryproductquantity == 0 && (
                            
                  <div className="absolute inset-0 flex items-center  justify-center"><h1 className="font-albertsans font-semibold bg-gray-200 text-lg  px-2 py-1 rounded-lg">Out of Stock</h1></div>
                    
              )}

                      <div  className="flex items-center">
                        <img src={product.ambherinventoryproductimagepreviewimages[0]} className="mr-2 w-18 h-18 rounded-md shrink-0"/>
                        <h1 className="ml-2 font-albertsans text-[#36454F] font-semibold text-[14px] break-words max-w-[200px] overflow-hidden">
                          {product.ambherinventoryproductname}
                        </h1>
                        </div>
                         <div className="w-full flex items-end justify-end  ">
                          <h1 className=" ml-2 font-albertsans font-medium text-[12px] break-words max-w-[200px] overflow-hidden">
                          Qty: {product.ambherinventoryproductquantity}
                        </h1>
                        </div>
                        
                      </div>
               
    ))
  )}


                      
                      
                  </div>

                   </div>
            <div className="w-[75%] min-h-100 h-auto ">

      {selectedorderambherproduct && (
               <div className="pb-20 motion-opacity-in-0  bg-[#fefefe] rounded-2xl w-full h-auto animate-fadeInUp ">



            <form className="flex flex-col  ml-15 mr-15 mt-5    pb-10" >
                  <div className=" flex justify-center items-start rounded-2xl w-full h-auto">
                    <div className=" pb-10 w-full h-full mr-15 rounded-2xl flex justify-center ">



                        <div className=" h-fit w-fit flex-none">

                  <div className=" relative">
                  

                  <img  className="mt-2 w-100 object-cover rounded-2xl h-100" src={(selectedorderambherproduct?.ambherinventoryproductimagepreviewimages?.[orderambhercurrentimageindex]) || defaultimageplaceholder}/>

                       {((selectedorderambherproduct?.ambherinventoryproductimagepreviewimages?.length || 0) > 1 || 
                         addambherinventoryproductimagepreviewimages?.length > 1) && (
                           <>
                             <div type="button" onClick={orderambherhandlepreviousimage}  className="cursor-pointer bg-opacity-50 hover:bg-opacity-75 rounded-2xl text-white p-2 absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-500"><i className="bx bx-chevron-left text-2xl" /></div>

                             <div type="button" onClick={orderambherhandlenextimage}  className="cursor-pointer rounded-2xl absolute bg-opacity-50 text-white p-2 transform -translate-y-1/2 bg-gray-500 hover:bg-opacity-75 right-2 top-1/2">  <i className="bx bx-chevron-right text-2xl" /></div>

                           </>
                         )}

                        {orderambherinventoryproductimagepreviewimages.length > 0 && (
                            <div className="overflow-x-auto flex gap-2 mt-2 p-4 border-y-1 rounded-2xl bg-[#fbfbfb]  items-center ">
                                {orderambherinventoryproductimagepreviewimages.map((preview, index) => (
                                    <div key={index} className="relative">
                                    <img 
                                        onClick={() => setorderambhercurrentimageindex(index)} 
                                        src={preview} 
                                        className={`rounded-lg cursor-pointer object-cover w-20 h-20 ${orderambhercurrentimageindex === index ? 'border-2 border-[#78b0d4]' : ''}`} 
                                    />
                                    </div>
                                ))}
                            </div>
                          )}

                       </div>
                        
                        

                        </div>



                    </div>
            
                    <div className="  w-full h-auto flex items-start mb-10 rounded-2xl min-w-0">
                          <div className=" w-[100%] h-auto  rounded-4xl">
                    
                    

                          <div className=" w-[100%] registration-container">

                      
                          <div className="flex items-center mx-1  w-fit  h-fit  mt-2 break-words min-w-0 "><h1 className="font-albertsans rounded-md py-1 px-2  rounded-1xl bg-[#F0F6FF] font-medium   text-[#0d0d0d]  min-w-0 break-words ">{orderambherinventorycategorynamebox}</h1>
                          <p className="font-albertsans ml-1">by</p>
                          <p className="font-albertsans ml-1 font-semibold  ">{orderambherinventoryproductbrand}</p>
                          </div>
                          
                       

                          <h1 className="font-albertsans mt-3 min-w-0 break-words h-fit w-full font-albertsans font-bold text-[#212121] text-[29px]">{orderambherinventoryproductname}</h1>
           

          
                    
                          <p className="mt-5 font-albertsans font-semibold text-[#478d12] text-[40px]">₱{Number(orderambherinventoryproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p>
                    
                          <p className="font-albertsans mt-6  font-medium text-[#020202] text-[18px]">Description</p>
                          <p className="font-albertsans font-semibold text-[#4b4b4b] mt-3">{orderambherinventoryproductdescription}</p>
                        
                      <div className="gap-4 mt-15 flex items-center">
                            <p className="font-albertsans font-semibold ">Quantity:</p>
                          <div className="w-auto h-10  flex items-center justify-between border-1 rounded-2xl">
                            <div   className={`font-bold h-full w-10 bg-gray-100 rounded-l-2xl flex items-center justify-center cursor-pointer select-none ${ambhercount <= 1 ? "opacity-50 cursor-not-allowed" : "active:bg-gray-200"}`} style={{ WebkitTapHighlightColor: 'transparent' }} type="button" onClick={() => setambherCount (c => Math.max(1, c - 1))}>-</div>

                                <input type="number" min="1" max={orderambherinventoryproductquantity}  value={ambhercount}
                                       onChange={(e) => {
                                         const ambhercountvalue = parseInt(e.target.value);
                                         if (!isNaN(ambhercountvalue)) {
                                           const clampedambhercountValue = Math.max(1, Math.min(orderambherinventoryproductquantity, ambhercountvalue));
                                           setambherCount(clampedambhercountValue);
                                         }
                                       }}
                                       className="w-16 text-center border-0 focus:outline-none font-semibold"/>
                                     
                            <div  className={`font-bold h-full w-10 bg-gray-100 rounded-r-2xl flex items-center justify-center cursor-pointer select-none  ${ambhercount >= orderambherinventoryproductquantity ? "opacity-50 cursor-not-allowed" : "active:bg-gray-200"}`} style={{ WebkitTapHighlightColor: 'transparent' }}  type="button" onClick={() => setambherCount ((c) => Math.min(c + 1, orderambherinventoryproductquantity))}>+</div> 
                           </div>
                                 <p className="font-albertsans font-semibold text-[#616161] text-[14px]">{orderambherinventoryproductquantity} pieces available </p>
                         </div>


                     
                          </div>
                  

                    
                          </div>


                    </div>
                  </div>
                   <div className=" border-1 mt-10 p-5 w-full h-auto rounded-md ">
                   <div className="w-full  flex items-center justify-center"><h1 className=" font-albertsans text-[#184d85] text-[25px] font-bold">Product Order Form</h1> </div>

                <div className="flex items-start justify-center mt-10">                  
                   <div className="pb-2  w-[100%] h-[100%]">
                   <div className="flex items-center gap-2  ">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Customer Email : </h1>
                      <div><input value={orderambherEmail} onChange={(e) => setorderambherEmail(e.target.value)} type="text" placeholder="Enter customer email..."   className="transition-all duration-300 ease-in-out  px-5 py-1.5 rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                    {orderambhercheckEmail && ( <p className="text-gray-500 text-sm ml-1">Checking email...</p>)}
                      {orderambheremailError && (<p className="text-red-500 text-sm ml-1">Email does not exist</p>)}
                         </div>
                       
                   </div>

                   <div className="flex items-center gap-2 mt-3">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Full Name : </h1>
                      <input  readOnly value={orderambherfullName} onChange={(e) => setorderambherfullName(e.target.value)} type="text"   className="transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] "></input>
                   </div>

                   <div className="flex items-center gap-2  mt-3">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Contact Number : </h1>
                      <input readOnly value={orderambhercontactNumber} onChange={(e) => setorderambhercontactNumber(e.target.value)} type="text"   className="transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>

                  <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Clinic Address : </h1>
                      <select  
                        value={orderambherpickupplace} 
                        onChange={(e) => setorderambherpickupplace(e.target.value)} 
                        className="transition-all duration-300 ease-in-out min-w-14 w-56 max-w-56 pl-5 pr-10 py-1.5 rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500 appearance-none"
                      >
                        <option value="">Select Clinic Address</option>
                        {clinicLocations
                          .filter(clinic => 
                            clinic.clinicType === (localStorage.getItem('staffclinic') || ownerownedclinic) && 
                            clinic.isActive && 
                            clinic.address?.fullAddress
                          )
                          .map((clinic, index) => (
                            <option key={clinic._id || index} value={clinic.address.fullAddress}>
                              {clinic.address.fullAddress}
                            </option>
                          ))
                        }
                      </select>
                   </div>                    

                  <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Custom Fee : </h1>
                      <input  value={orderambhercustomFee} onChange={(e) => setorderambhercustomFee(e.target.value)} type="text"   className=" transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>

                   <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Amount Paid : </h1>
                      <input  value={orderambheramountPaid} onChange={(e) => setorderambheramountPaid(e.target.value)}  type="text" placeholder="50% for downpayment"  className=" transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>
                  

                  {Number(orderambheramountPaid) >= Number(orderambhertotalwithFee) > 0 &&(
                      <div className="flex items-center gap-2  mt-3">
                              <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Pickup : </h1>
                              <div onClick={() => showambherpickupnoworlater('ambherorderpickupnow')}  className={`px-5 py-2 cursor-pointer mr-3 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-2xl   text-center flex justify-center items-center ${activeambherpickupnoworlater ==='ambherorderpickupnow' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeambherpickupnoworlater ==='ambherorderpickupnow' ? 'text-white' : ''}`}>Now</h1></div>
                              <div onClick={() => showambherpickupnoworlater('ambherorderpickuplater')}  className={`px-5 py-2 cursor-pointer ml-3 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-2xl  text-center flex justify-center items-center ${activeambherpickupnoworlater ==='ambherorderpickuplater' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeambherpickupnoworlater ==='ambherorderpickuplater' ? 'text-white' : ''}`}>Later</h1></div>
                      </div>
                  )}


                   <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Order Notes : </h1>
                      <textarea className=" transition-all duration-300 ease-in-out  w-56 px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500" value={orderambherNotes} ref={textarearef} rows={1} style={{minHeight:'30px'}} type="text"  onChange={(e) =>  {setorderambherNotes(e.target.value); adjusttextareaheight();}} />
                   </div>


                   </div>

                   <div className="flex flex-col justify-center items-start w-[100%] h-[100%]">                
                   <div className="flex justify-center items-start w-[100%] h-[100%]">
                       <div className=" gap-2 flex flex-col h-full w-full "> 
                          <h1 className="text-[15px] font-albertsans font-semibold">Item Price </h1>
                          <h1 className="text-[15px] font-albertsans font-semibold">Quantity </h1>
                          <h1 className="text-[15px] font-albertsans font-semibold">Subtotal </h1>
                          <h1 className="text-[15px] w-full font-albertsans font-semibold">Customization Fee </h1> 
                          <h1 className="text-[15px] border-b-1 pb-2 w-full font-albertsans font-semibold">Discount </h1>     
                          <h1 className=" font-albertsans font-semibold text-[19px] mt-5">Overall Total </h1>
                          <h1 className=" w-full font-albertsans font-semibold">Amount Paid </h1> 
                          {Number(orderambheramountPaid) > Number(orderambhertotalwithFee) ? (
                           <h1 className=" w-full font-albertsans font-semibold">Change </h1>   
                          ):(
                           <h1 className=" w-full font-albertsans font-semibold">Remaining Balance </h1>       
                          )}
                          
                         
                       </div>
                       <div className=" flex flex-col items-end gap-2  justify-end h-full w-full "> 
                          <h1 className="font-albertsans font-medium text-[#242424]">₱ {Number(orderambherinventoryproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})} </h1>
                          <h1 className="font-albertsans font-semibold">x {ambhercount}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderambherinventoryproductprice * ambhercount).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderambhercustomFee).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className=" font-albertsans font-medium">0</h1>     
                          <h1 className="font-albertsans font-bold text-[#478d12] text-[25px] mt-3">₱ {Number(orderambhertotalwithFee).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderambheramountPaid).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          {Number(orderambheramountPaid) > Number(orderambhertotalwithFee) ? (
                           <h1 className="font-albertsans font-medium">₱ {Number(orderambheramountpaidChange).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          ):(
                            <h1 className="font-albertsans font-medium">₱ {Number(orderambherremainingBalance).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          )}

                       </div> 


                   </div>

                  {(Number(orderambherremainingBalance) === 0 || Number(orderambheramountpaidChange) > 0) && activeambherpickupnoworlater==='ambherorderpickupnow' ? (
                    <div
                      onClick={(e) => submitpatientorderambher(e)} 
                      disabled={isSubmittingAmbherCompleteOrder}
                      className="w-full mt-10 p-2 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-2xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingAmbherCompleteOrder ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          <p className="font-bold font-albertsans text-white text-[18px]">Processing...</p>
                        </>
                      ) : (
                        <p className="font-bold font-albertsans text-white text-[18px] ml-2">Complete Order</p>
                      )}
                    </div>
                    ) : (
                   (Number(orderambheramountPaid) >= Number(orderambhertotalwithFee) * 0.50) || activeambherpickupnoworlater==='ambherorderpickuplater' ? (
                    <div
                      onClick={(e) => submitpatientpendingorderambher(e)}
                      disabled={isSubmittingAmbherPendingOrder}
                      className="w-full mt-10 p-2 hover:cursor-pointer hover:scale-103 bg-[#F08000] rounded-2xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingAmbherPendingOrder ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          <p className="font-bold font-albertsans text-white text-[18px]">Processing...</p>
                        </>
                      ) : (
                        <p className="font-bold font-albertsans text-white text-[18px] ml-2">Set as Pending Order</p>
                      )}
                    </div>
                    ) : null)}
                      



                </div>   
                </div> 
                   </div>

                  </form>
             </div>
      )}
     



                        
                  </div>


                  </div>
             </div>
           </div>


  )}