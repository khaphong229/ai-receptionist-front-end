export const CustomerId = {
  getCustomerId: () => {
    const customerId = localStorage.getItem("customerId");
    return customerId;
  },
  setCustomerId: (customerId: string) => {
    localStorage.setItem("customerId", customerId);
  },
  deleteCustomerId: () => {
    localStorage.removeItem("customerId");
  },
};

export const CustomerInfo = {
  getCustomerInfo: () => {
    const customerInfo = localStorage.getItem("customerInfo");
    return customerInfo;
  },
  setCustomerInfo: (customerInfo: string) => {
    localStorage.setItem("customerInfo", customerInfo);
    // Dispatch a custom event when customer info is updated
    window.dispatchEvent(new Event("customerInfoUpdated"));
  },
  deleteCustomerInfo: () => {
    localStorage.removeItem("customerInfo");
    // Also dispatch the event when info is deleted
    window.dispatchEvent(new Event("customerInfoUpdated"));
  },
};
