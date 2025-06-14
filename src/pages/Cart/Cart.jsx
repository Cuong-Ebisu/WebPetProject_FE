import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../../components/Header";
import "./Cart.scss";
import {
  faCaretUp,
  faCartShopping,
  faCircleMinus,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import clientApi from "../../client-api/rest-client";
import { message } from "antd";
import { formatCurrency } from "../../utils/format";
import DropdownShip from "./DropdownShip";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useTranslation } from "react-i18next";

const Cart = () => {
  const { t } = useTranslation();
  let { updateCheckout } = useAppContext();
  const navigate = useNavigate();
  let [carts, setCarts] = useState([]);
  let [checkout, setCheckout] = useState(true);
  let [totalQuantity, setTotalQuantity] = useState(0);
  let [totalPrice, setTotalPrice] = useState(0);
  let [shipping, setShipping] = useState({ name: t("cart.shipping.express"), price: 100000 });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    let cart = clientApi.service("cartItem");
    try {
      const response = await cart.find();
      if (response.EC === 0) {
        let _carts = response.DT;
        let _checkout = true;
        let totalPrice = 0;
        _carts.forEach((item) => {
          totalPrice += item.product.price * item.quantity;
          if (item.quantity === 0) {
            _checkout = false;
          }
        });
        setCheckout(_checkout);
        setTotalPrice(totalPrice);
        setTotalQuantity(_carts.length);
        setCarts(_carts);
      } else {
        message.error(response.EM);
      }
    } catch (err) {
      console.error("Error during cart:", err);
    }
  };

  let handleUpdate = async (item, type) => {
    let cart = clientApi.service("cartItem");
    try {
      let data = {};
      if (type === "minus") {
        data = { ...item, quantity: item.quantity - 1 };
      } else {
        data = { ...item, quantity: item.quantity + 1 };
      }
      const response = await cart.patch(item._id, data);
      if (response.EC === 0) {
        fetchCart();
      } else {
        message.error(response.EM);
      }
    } catch (err) {
      console.error("Error during cart:", err);
    }
  };

  let handleCheckout = async () => {
    if (checkout) {
      updateCheckout({
        allowCheckout: true,
        totalPrice,
        carts,
        shipment: shipping,
      });
      navigate("/checkout");
    } else {
      message.error(t("cart.outOfStock"));
    }
  };

  let handleDelete = async (item) => {
    let cart = clientApi.service("cartItem");
    try {
      const response = await cart.delete(item._id);
      if (response.EC === 0) {
        fetchCart();
      } else {
        message.error(response.EM);
      }
    } catch (err) {
      console.error("Error during cart:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="cart-content">
        <div className="head-cart">
          {t("cart.title")} ({totalQuantity} {t("cart.products")})
        </div>
        <div className="bg"></div>
        {carts.length > 0 ? (
          <div className="product">
            <div className="title">{t("cart.productList")}</div>
            <div className="product-cont row mt-4">
              <div className="left col-6">
                {carts.map((item, index) => (
                  <div className="item mt-3" key={index}>
                    <img
                      src={
                        item?.product?.image ||
                        "https://res.cloudinary.com/degcwwwii/image/upload/v1732013626/PetCare/ncxgbjfl4cmvuzuyhseb.jpg"
                      }
                      alt="product"
                    />
                    <div className="info">
                      <div className="name mb-3">
                        {item?.product?.name || t("cart.productName")}
                      </div>
                      <div className="mb-2">{t("cart.quantity")}</div>
                      {item?.quantity === 0 ? (
                        <div>
                          <span className="text-danger">
                            {t("cart.outOfStock")}
                          </span>
                        </div>
                      ) : (
                        <div className="update mb-2">
                          <FontAwesomeIcon
                            icon={faCircleMinus}
                            size="lg"
                            style={{ cursor: "pointer", color: "#16423C" }}
                            onClick={() => handleUpdate(item, "minus")}
                          />
                          <div className="number">{item?.quantity || 0}</div>
                          <FontAwesomeIcon
                            icon={faCirclePlus}
                            size="lg"
                            color="#16423C"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleUpdate(item, "add")}
                          />
                        </div>
                      )}
                      <div>
                        {t("cart.price")} <span className="ms-2">{formatCurrency(item?.product?.price || 0)}</span>
                      </div>
                      <div className="delete" onClick={() => handleDelete(item)}>
                        <FontAwesomeIcon
                          size="sm"
                          icon={faTrashCan}
                          style={{ cursor: "pointer", color: "#16423C" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="right col-4">
                <div className="brief px-4">{t("cart.orderSummary")}</div>
                <div className="mt-3 px-4 d-flex justify-content-between w-100">
                  <span>
                    {t("cart.total")} ({totalQuantity} {t("cart.products")})
                  </span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="mt-1 px-4 d-flex justify-content-between w-100">
                  <span>
                    {shipping.name}
                    <DropdownShip click={(ship) => setShipping(ship)} color={"#C4DACB"} />
                  </span>
                  <span>{formatCurrency(shipping.price)}</span>
                </div>
                <div className="mt-1 px-4 d-flex justify-content-between w-100">
                  {t("cart.tax")} <span>{formatCurrency(totalPrice * 0.05)}</span>
                </div>
                <hr />
                <div className="mt-2 px-4 d-flex justify-content-between w-100">
                  {t("cart.totalPrice")} <span><b>{formatCurrency(totalPrice + totalPrice * 0.05 + shipping.price)}</b></span>
                </div>
                <div className="btn-checkout" onClick={handleCheckout}>
                  {t("cart.checkout")}
                  <FontAwesomeIcon className="ms-2" icon={faCaretUp} rotation={90} color="#16423C" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-product">
            <div className="title">{t("cart.empty")}</div>
            <div className="btn-buy" onClick={() => navigate("/products")}> 
              <span className="px-4">
                {t("cart.startShopping")} 
                <FontAwesomeIcon className="ms-3" icon={faCartShopping} size="xs" color="#C4DACB" />
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="continute-cart">
        <div className="continute" onClick={() => navigate("/products")}>{t("cart.continueShopping")} <FontAwesomeIcon className="ms-4" icon={faCaretUp} rotation={90} color="#16423C" /></div>
      </div>
    </>
  );
};

export default Cart;
