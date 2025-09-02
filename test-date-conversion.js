// Test script to verify the date conversion logic
function convertNowToDate(pickupDate) {
    if (pickupDate === "Now") {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    return pickupDate;
}

// Test cases
console.log('Testing date conversion logic:');
console.log('Input: "Now" -> Output:', convertNowToDate("Now"));
console.log('Input: "2024-12-25" -> Output:', convertNowToDate("2024-12-25"));
console.log('Input: "Later" -> Output:', convertNowToDate("Later"));

// Expected format for today's date
const today = new Date();
const expectedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
console.log('Expected format for today:', expectedToday);
