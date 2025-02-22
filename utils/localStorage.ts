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
