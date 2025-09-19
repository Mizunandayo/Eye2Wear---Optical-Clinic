 {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end', 
            gap: '1rem', 
            marginTop: '2rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid #f3f4f6' 
          }}>
            {selectedbautistaproduct && (
              <button 
                type="button"
                onClick={() => {setshowdeletebautistaproduct(true); setselecteddeletebautistaproduct(selectedbautistaproduct);}}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  borderRadius: '0.75rem',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#fee2e2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#fef2f2'}
              >
                Delete Product
              </button>
            )}
            <button 
              type="button"
              onClick={() => {setshowaddbautistainventoryproductdialog(false); resetaddbautistainventoryproductdialog();}}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                borderRadius: '0.75rem',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={bautistainventoryproductissubmitting} 
              style={{
                padding: '0.75rem 2rem',
                background: bautistainventoryproductissubmitting 
                  ? '#484848' 
                  : '#6AA84F',
                color: 'white',
                borderRadius: '0.75rem',
                border: 'none',
                fontWeight: '500',
                cursor: bautistainventoryproductissubmitting ? 'not-allowed' : 'pointer',
                opacity: bautistainventoryproductissubmitting ? 0.5 : 1,
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                if (!bautistainventoryproductissubmitting) {
                  e.target.style.background = '#5f9747';
                }
              }}
              onMouseLeave={(e) => {
                if (!bautistainventoryproductissubmitting) {
                  e.target.style.background = '#6AA84F';
                }
              }}
            >
              {bautistainventoryproductissubmitting 
                ? (selectedbautistaproduct ? "Updating..." : "Adding...") 
                : (selectedbautistaproduct ? "Update Product" : "Add Product")
              }
            </button>