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
  },
  deleteCustomerInfo: () => {
    localStorage.removeItem("customerInfo");
  },
};
