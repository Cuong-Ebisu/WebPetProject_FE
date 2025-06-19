import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./OrderList.scss";
import clientApi from "../../client-api/rest-client";
import { formatCurrency, formatDay } from "../../utils/format";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const { t } = useTranslation();
  const [listOrder, setListOrder] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListOrder();
  }, []);

  const fetchListOrder = async () => {
    let order = clientApi.service("orders");
    try {
      let response = await order.find({});
      if (response.EC === 0) {
        setListOrder(response.DT);
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
      <div className="orderList">
        <div className="head-order">{t("Order List")}</div>
        <div className="bg">
          {listOrder?.length > 0 &&
            listOrder.map((item, index) => (
              <div className="list-product" key={index}>
                <div className="title">
                  <span>
                    {t("Estimated delivery")}:{" "}
                    {formatDay(item?.expectDeliveryDate?.from || 0) +
                      "  -  " +
                      formatDay(item?.expectDeliveryDate?.to || 0)}
                  </span>
                  <span className="status">
                    <FontAwesomeIcon className="me-2" icon={faBoxOpen} />
                    {t(item?.status)}
                  </span>
                </div>
                <div className="row justify-content-start">
                  {item?.orderDetail?.length > 0 &&
                    item?.orderDetail?.map((product, index) => (
                      <div className="product-item" key={index}>
                        <div className="item">
                          <img
                            src={
                              product?.product?.image ||
                              "https://res.cloudinary.com/degcwwwii/image/upload/v1732013626/PetCare/ncxgbjfl4cmvuzuyhseb.jpg"
                            }
                            alt="product"
                          />
                          <div className="info">
                            <div className="name mb-3">
                              {product?.product?.name ||
                                t("Product name")}
                            </div>
                            <div className="mb-2">
                              {t("Quantity")}
                              <span className="ms-3">
                                {product?.quantity || 0}
                              </span>
                            </div>
                            <div>
                              {t("Price")}
                              <span className="ms-2">
                                {formatCurrency(
                                  product?.product?.price || 0
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="footer">
                  <div className="total">
                    {item?.orderItems?.length} {t("items")}:{" "}
                    {formatCurrency(item?.totalAmount || 0)}
                  </div>
                  <div className="d-flex justify-content-center my-3">
                    <button
                      className="btn-view"
                      onClick={() =>
                        navigate(`/orderDetail/${item?._id}`)
                      }
                    >
                      {t("View detail")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderList;
