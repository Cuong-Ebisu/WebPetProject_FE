import { useNavigate, useParams } from "react-router-dom";
import "./OrderDetail.scss";
import { useEffect, useState } from "react";
import clientApi from "../../client-api/rest-client";
import { message, Select } from "antd";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import OrderStatus from "./OrderProgress";
import { formatCurrency, formatDay, formatIOSDate } from "../../utils/format";
import { useTranslation } from "react-i18next";

const statusOrder = {
  ordered: 0,
  waitingship: 1,
  shipping: 2,
  delivered: 3,
  cancel: 4,
};

const OrderDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [isManager, setIsManager] = useState(false);
  const [orderDetail, setOrderDetail] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsManager(role === "manager");
  }, []);

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    let order = clientApi.service("orders");
    try {
      let response = await order.get(id);
      if (response.EC === 0) {
        setOrderDetail(response.DT);
      } else {
        message.error(response.EM);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async () => {
    if (orderDetail.status !== "ordered") {
      message.error(t("Can not cancel order"));
      return;
    }
    let order = clientApi.service("orders");
    try {
      let data = { ...orderDetail, status: "cancel" };
      let response = await order.patch(id, data);
      if (response.EC === 0) {
        message.success(t("Cancel order successfully"));
        navigate("/orderList");
      } else {
        message.error(response.EM);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    let order = clientApi.service("orders");
    try {
      let data = { ...orderDetail, status: newStatus };
      let response = await order.patch(id, data);
      if (response.EC === 0) {
        message.success(t("Order status updated successfully"));
        fetchOrderDetail(); // Refresh order details
      } else {
        message.error(response.EM);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div className="orderDetail">
        <div className="head-order">{t("Order")}</div>
        <div className="bg"></div>
        <div className="yourOrder">
          <div className="title">{t("Your ordered")}</div>
          <div className="expectDay">
            {t("Estimated delivery")}:{" "}
            {formatDay(orderDetail?.expectDeliveryDate?.from || 0) +
              " - " +
              formatDay(orderDetail?.expectDeliveryDate?.to || 0)}
          </div>
        </div>
        <div className="process-order">
          <OrderStatus value={statusOrder[orderDetail?.status || 1]} />
          {isManager && (
            <div className="status-dropdown-container">
              <Select
                value={orderDetail?.status}
                onChange={handleStatusChange}
                options={[
                  { label: t("Ordered"), value: "ordered" },
                  { label: t("Waiting for shipping"), value: "waitingship" },
                  { label: t("Shipping"), value: "shipping" },
                  { label: t("Delivered"), value: "delivered" },
                  { label: t("Cancel"), value: "cancel" },
                ]}
              />
            </div>
          )}
        </div>
        <div className="info-bg">
          <div className="info">
            <div className="title mb-4">{t("Recipient information")}</div>
            <div className="view">
              <div className="mb-3">
                <span className="me-3">{orderDetail?.orderUser?.fullName}</span>
                <span>{orderDetail?.orderUser?.phoneNumber}</span>
              </div>
              <div className="mb-3">{orderDetail?.orderUser?.address}</div>
              <div className="mb-5">
                {orderDetail?.orderUser?.ward +
                  ", " +
                  orderDetail?.orderUser?.district +
                  ", " +
                  orderDetail?.orderUser?.city +
                  ", Vietnam"}
              </div>
            </div>
          </div>
        </div>
        <div className="list-product">
          <div className="title">{t("Product list")}</div>
          <div className="row justify-content-start">
            {orderDetail?.orderItems?.length > 0 &&
              orderDetail?.orderItems?.map((item, index) => (
                <div className="product col-6" key={index}>
                  <div className="item">
                    <img
                      src={
                        item?.product?.image ||
                        "https://res.cloudinary.com/degcwwwii/image/upload/v1732013626/PetCare/ncxgbjfl4cmvuzuyhseb.jpg"
                      }
                      alt="product"
                    />
                    <div className="info">
                      <div className="name mb-3">
                        {item?.product?.name || t("Product name")}
                      </div>
                      <div className="mb-2">
                        {t("Quantity")}
                        <span className="ms-3">{item?.quantity || 0}</span>
                      </div>
                      <div>
                        {t("Price")}{" "}
                        <span className="ms-2">
                          {formatCurrency(item?.product?.price || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="brief-bg">
          <div className="brief w-100">
            <div className="title">{t("Order Overview")}</div>
            <div className="mb-3 d-flex justify-content-between w-100">
              <span>
                {t("Total")} ({orderDetail?.orderItems?.length} {t("products")})
              </span>
              <span>{formatCurrency(orderDetail?.totalPrice || 0)}</span>
            </div>
            <div className="mb-3 d-flex justify-content-between w-100">
              <span>{orderDetail?.shipmentMethod?.name}</span>{" "}
              <span>{formatCurrency(orderDetail?.shipmentMethod?.price)}</span>
            </div>
            <div className="mb-3 d-flex justify-content-between w-100">
              {t("Tax")}{" "}
              <span>{formatCurrency(orderDetail?.tax)}</span>
            </div>
            <hr />
            <div className="mt-3 d-flex justify-content-between w-100">
              {t("Total price")}{" "}
              <span>
                <b className="pe-2">
                  {formatCurrency(orderDetail?.totalAmount)}
                </b>
              </span>
            </div>
          </div>
        </div>
        <div className="detail">
          <div className="title">{t("Order detail")}</div>
          <div className="mb-2">
            <span>
              <b>{t("Order code")}: </b>
            </span>
            <span className="ms-4">{orderDetail?._id}</span>
          </div>
          <div className="mb-2">
            <span>
              <b>{t("Order date")}: </b>
            </span>
            <span className="ms-4">
              {formatIOSDate(orderDetail?.orderDate)}
            </span>
          </div>
          <div className="mb-2">
            <span>
              <b>{t("Payment method")}: </b>
            </span>
            <span className="ms-4">{orderDetail?.paymentMethod?.name}</span>
          </div>
        </div>
        <div className="cancel">
          <div className="d-flex justify-content-center mt-5">
            {orderDetail?.status === "ordered" && (
              <button className="btn-cancel" onClick={() => handleCancel()}>
                {t("Cancel order")}
              </button>
            )}
            {orderDetail?.status === "delivered" && (
              <button
                className="btn-review"
                onClick={() => navigate(`/orderReview/${id}`)}
              >
                {t("Review")}
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetail;
