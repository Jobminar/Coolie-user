import React, { useContext } from "react";
import "./ScheduleFooter.css"; // Use a different CSS file for ScheduleFooter
import { CartContext } from "../../context/CartContext";
import { OrdersContext } from "../../context/OrdersContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ScheduleFooter = ({ onNext }) => {
  const { totalItems, totalPrice } = useContext(CartContext);
  const { orderDetails, selectedAddressId, categoryIds, subCategoryIds } =
    useContext(OrdersContext);

  const handleProceedToCheckout = () => {
    const message = orderDetails
      .map((cart) =>
        cart.items
          .map((item) => {
            const scheduledDate =
              `${item.selectedDate} of this month at ${item.selectedTime}` ||
              item.scheduledDate;

            return `
              <p>
                <strong>${item.serviceId.name}</strong> has been scheduled on 
                ${scheduledDate}
              </p>
            `;
          })
          .join(""),
      )
      .join("");

    const items = orderDetails.flatMap((cart) =>
      cart.items.map((item) => ({
        ...item,
        scheduledDate:
          `${item.selectedDate}-${item.selectedMonth}-${item.selectedTime}` ||
          "Default Scheduled Date",
        selectedDate: item.selectedDate || "Default Date",
        selectedTime: item.selectedTime || "Default Time",
        selectedMonth: item.selectedMonth || "Default Month",
      })),
    );

    const orderData = {
      addressId: selectedAddressId,
      categoryIds: categoryIds,
      subCategoryIds: subCategoryIds,
      items: items,
    };

    console.log("Order Data on Proceed to Checkout:", orderData);

    confirmAlert({
      title: "Confirm to proceed",
      message: <div dangerouslySetInnerHTML={{ __html: message }} />,
      buttons: [
        {
          label: "Confirm",
          onClick: () => onNext("checkout"),
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className="schedule-total">
      <div className="schedule-total-info">
        <h5>{totalItems} Items</h5>
        <p>₹{totalPrice.toFixed(2)}</p>
      </div>
      <div className="schedule-total-button">
        <button
          className="proceed-to-checkout-btn"
          onClick={handleProceedToCheckout}
        >
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default ScheduleFooter;
