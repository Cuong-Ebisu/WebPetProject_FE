import { useContext, useEffect, useState } from "react";
import "./Checkout.scss"
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons/faPen";
import { Checkbox, Col, Form, Input, message, Radio, Row, Space } from "antd";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency, formatDay } from "../../utils/format";
import DropdownShip from "../Cart/DropdownShip";
import { faMoneyBill1Wave } from "@fortawesome/free-solid-svg-icons/faMoneyBill1Wave";
import { faLandmark } from "@fortawesome/free-solid-svg-icons/faLandmark";
import { faCreditCard } from "@fortawesome/free-regular-svg-icons";
import { faCcVisa } from "@fortawesome/free-brands-svg-icons/faCcVisa";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import clientApi from "../../client-api/rest-client";
import { useTranslation } from "react-i18next";

const optionPayment = [
    { value: 1, name: 'Pay when receiving goods ', },
    { value: 2, name: 'ZaloPay', },
    { value: 3, name: 'MoMo', }
];
const Checkout = () => {
    let { checkout } = useAppContext();
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [showTerms, setShowTerms] = useState(false);
    let [updateInfo, setUpdateInfo] = useState(false);
    let navigate = useNavigate();
    let carts = checkout.carts;
    let [totalPrice, setTotalPrice] = useState(checkout.totalPrice);
    let [shipment, setShipment] = useState(checkout.shipment);
    let [userOrder, setUserOrder] = useState(null);
    let [expectDeliveryDate, setExpectDeliveryDate] = useState(null);
    let [payment, setPayment] = useState(optionPayment[0]);
    let [agree, setAgree] = useState(false);
    let [viewOrder, setViewOrder] = useState(false);
    let [orderId, setOrderId] = useState(null);
    useEffect(() => {
        if (!checkout.allowCheckout) {
            navigate('/cart');
        }
        let user = clientApi.service('users');
        user.find().then((response) => {
            let _user = {
                fullName: response.DT.firstName + " " + response.DT.lastName,
                phoneNumber: response.DT?.phoneNumber,
                address: response.DT?.address, ward: response.DT?.ward, district: response.DT?.district, city: response.DT?.city
            };
            form.setFieldsValue({
                fullName: _user?.fullName,
                phoneNumber: _user?.phoneNumber,
                address: _user?.address,
                ward: _user?.ward,
                district: _user?.district,
                city: _user?.city
            });
            setUserOrder(_user);
        }).catch((error) => {
            console.log(error);
        })
        if (!userOrder?.phoneNumber || !userOrder?.address || !userOrder?.ward || !userOrder?.district || !userOrder?.city) {
            setUpdateInfo(true);
        } else {
            setUpdateInfo(false);
        }
    }, [])
    useEffect(() => {
        let date = new Date();
        if (shipment?.price === 2) {
            date.setDate(date.getDate() + 20);
        } else if (shipment?.price === 8) {
            date.setDate(date.getDate() + 5);
        } else if (shipment?.price === 20) {
            date.setDate(date.getDate() + 2);
        }
        setExpectDeliveryDate(date);
    }, [shipment])
    let handleUpdateInfo = () => {
        if (!updateInfo) {
            setUpdateInfo(true)
        } else {
            form.validateFields().then((values) => {
                console.log(values);
                setUserOrder(values);
                setUpdateInfo(false)
            }).catch((error) => {
                console.log(error)
            })
        }

    }
    // let handleCheckout = async () => {
    //     if (!agree) {
    //         message.error("You must agree to the terms");
    //         return;
    //     }
    //     if (!userOrder?.fullName || !userOrder?.phoneNumber || !userOrder?.address || !userOrder?.ward || !userOrder?.district || !userOrder?.city) {
    //         message.error("Please fill in the information");
    //         return;
    //     }
    //     if (updateInfo) {
    //         message.error("Please update the information");
    //         return;
    //     }
    //     let order = await clientApi.service('orders')
    //     try {
    //         let response = await order.create({
    //             paymentMethod: payment,
    //             shipmentMethod: shipment,
    //             expectDeliveryDate: { from: new Date(), to: expectDeliveryDate },
    //             orderUser: userOrder,
    //             totalPrice: totalPrice,
    //             totalAmount: totalPrice + totalPrice * 0.05 + shipment?.price,
    //             tax: totalPrice * 0.05,
    //         });
    //         if (response.EC === 0) {
    //             message.success("Order successfully");
    //             setOrderId(response.DT._id);
    //             setViewOrder(true);
    //         } else {
    //             message.error(response.EM);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    let handleCheckout = async () => {
        if (!agree) {
            message.error("You must agree to the terms");
            return;
        }
        if (!userOrder?.fullName || !userOrder?.phoneNumber || !userOrder?.address || !userOrder?.ward || !userOrder?.district || !userOrder?.city) {
            message.error("Please fill in the information");
            return;
        }
        if (updateInfo) {
            message.error("Please update the information");
            return;
        }

        let order = await clientApi.service('orders');
        try {
            let response = await order.create({
                paymentMethod: payment,
                shipmentMethod: shipment,
                expectDeliveryDate: { from: new Date(), to: expectDeliveryDate },
                orderUser: userOrder,
                totalPrice: totalPrice,
                totalAmount: totalPrice + totalPrice * 0.05 + shipment?.price,
                tax: totalPrice * 0.05,
            });

            if (response.EC === 0) {
                message.success("Order successfully");

                // Nếu phương thức thanh toán là MoMo, lấy URL thanh toán và chuyển hướng
                if (payment.value === 3 && response.DT.payUrl) {
                    // MoMo
                    const paymentUrl = response.DT.payUrl;
                    if (paymentUrl) {
                        window.location.href = paymentUrl;
                    } else {
                        console.error("MoMo payUrl undefined");
                        message.error("Error retrieving payment URL from MoMo.");
                    }
                } else if (payment.value === 2 && response.DT.payUrl) {
                    // ZaloPay
                    const paymentUrl = response.DT.payUrl;
                    if (paymentUrl) {
                        window.location.href = paymentUrl;
                    } else {
                        console.error("ZaloPay payUrl undefined");
                        message.error("Error retrieving payment URL from ZaloPay.");
                    }
                } else {
                    setOrderId(response.DT._id);
                    setViewOrder(true);
                }
            } else {
                message.error(response.EM);
            }
        } catch (err) {
            console.log(err);
        }
    }

    let handleChangePayment = (event) => {
        setPayment(optionPayment[event.target.value - 1]);
    }
    return (
        <>
            <Header />
            {!viewOrder ?
                <div className="checkout-content">
                    <div className="info-bg">
                        <div className="info">
                            <div className="title mb-4">{t('Recipient information')}</div>
                            {updateInfo ?
                                <div className="update">
                                    <Form
                                        form={form}
                                        initialValues={{}}
                                        onFinish={handleUpdateInfo}
                                    >
                                        <Row gutter={[16, 8]}>
                                            <Col span={12}>
                                                <Form.Item
                                                    rules={[{ required: true, message: t("Please input your full name!") }]}
                                                    name="fullName"
                                                >
                                                    <Input size="large" placeholder={t("Full name")} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    rules={[
                                                        { required: true, message: t("Please input your phone number!") },
                                                        {
                                                            pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                                                            message: t("Phone number is not valid")
                                                        }
                                                    ]}
                                                    name="phoneNumber"
                                                >
                                                    <Input size="large" placeholder={t("Phone number")} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item
                                                    rules={[{ required: true, message: t("Please input your address!") }]}
                                                    name="address"
                                                >
                                                    <Input size="large" placeholder={t("Address")} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={7}>
                                                <Form.Item
                                                    rules={[{ required: true, message: t("Please input your ward!") }]}
                                                    name="ward"
                                                >
                                                    <Input size="large" placeholder={t("Ward")} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={1}>
                                                <FontAwesomeIcon icon={faMinus} size="2xl" className="pt-2" color="#C4DACB" />
                                            </Col>
                                            <Col span={7}>
                                                <Form.Item
                                                    rules={[{ required: true, message: t("Please input your district!") }]}
                                                    name="district"
                                                >
                                                    <Input size="large" placeholder={t("District")} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={1}>
                                                <FontAwesomeIcon icon={faMinus} size="2xl" className="pt-2" color="#C4DACB" />
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    rules={[{ required: true, message: t("Please input your city!") }]}
                                                    name="city"
                                                >
                                                    <Input size="large" placeholder={t("City")} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                                :
                                <div className="view">
                                    <div className="mb-3"><span className="me-3">{userOrder?.fullName}</span><span>{userOrder?.phoneNumber}</span></div>
                                    <div className="mb-3">{userOrder?.address}</div>
                                    <div className="mb-5">{userOrder?.ward + ", " + userOrder?.district + ", " + userOrder?.city + ", Vietnam"}</div>

                                </div>
                            }
                            <div className="d-flex justify-content-center my-4" onClick={() => handleUpdateInfo()}>
                                <span className="btn-update-info d-flex justify-content-center align-items-center">{t('Update infomation')}
                                    <FontAwesomeIcon className="ms-3" size="xs" icon={faPen} color="#16423C" /></span>
                            </div>
                        </div>
                    </div>
                    <div className="list-product">
                        <div className="title">{t('Product list')}</div>
                        <div className="row justify-content-start ">
                            {carts?.length > 0 && carts.map((item, index) =>
                                <div className="product col-6" key={index}>
                                    <div className="item">
                                        <img src={item?.product?.image || "https://res.cloudinary.com/degcwwwii/image/upload/v1732013626/PetCare/ncxgbjfl4cmvuzuyhseb.jpg"} alt="product" />
                                        <div className="info">
                                            <div className="name mb-3">{item?.product?.name || "Product name"}</div>
                                            <div className="mb-2"> {t('Quantity')}:<span className="ms-3">{item?.quantity || 0}</span></div>
                                            <div>{t('Price')}:<span className="ms-2">{formatCurrency(item?.product?.price || 0)}</span></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg"></div>
                    <div className="shipment">
                        <div className="title">{t('Transportation')}</div>
                        <div className="mb-2">
                            <span>{t('From')}:</span>
                            <span className="ms-4"><b>123 Le Van Khuong Street, Hiep Thanh Ward, District 12, Ho Chi Minh City, Vietnam.</b></span>
                        </div>
                        <div className="mb-2">
                            <span>{t('Shipping method')}<DropdownShip click={(ship) => setShipment(ship)} color={"#16423C"} /> </span>
                            <span className="ms-4"> <b>{shipment?.name || "Inappropriate shipping method"}</b></span>
                        </div>
                        <div className="mb-2">
                            <span>{t('Expected delivery date')}:</span>
                            <span className="ms-4"><b>{formatDay(new Date()) + " - " + formatDay(expectDeliveryDate)}</b></span>
                        </div>
                        <div className="mb-2">
                            <span>{t('Price')}: </span>
                            <span className="ms-4"><b>{formatCurrency(shipment?.price || 0)}</b></span>
                        </div>
                    </div>
                    <div className="brief-bg">
                        <div className="brief w-100">
                            <div className="title">{t('Order summary')}</div>
                            <div className="mb-3 d-flex justify-content-between w-100">
                                <span>{t('Total')} ({carts?.length} {t('products')})</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>
                            <div className="mb-3 d-flex justify-content-between  w-100"><span>{shipment?.name}</span> <span>{formatCurrency(shipment?.price)}</span></div>
                            <div className="mb-3 d-flex justify-content-between  w-100">{t('Tax')} <span>{formatCurrency(totalPrice * 0.05)}</span></div>
                            <hr />
                            <div className="mt-3 d-flex justify-content-between  w-100">{t('Total price')} <span><b className="pe-2">{formatCurrency(totalPrice + totalPrice * 0.05 + shipment?.price)}</b></span> </div>

                        </div>
                    </div>
                    <div className="payment">
                        <div className="title">{t('Payment methods')}</div>
                        <Radio.Group
                            name="groupName"
                            onChange={(event) => handleChangePayment(event)}
                            value={payment.value}
                            className="payment-options"
                            size="large"
                        >
                            <div className="payment-option">
                                <div className="d-flex align-items-center">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faMoneyBill1Wave} />
                                    </span>
                                    <div className="pay-details">
                                        <div className="pay-title">{t('Pay when receiving goods')}</div>
                                        <div className="description">{t('You will pay when the goods are delivered to your address')}</div>
                                    </div>
                                </div>
                                <Radio value={1} />
                            </div>
                            <div className="payment-option">
                                <div className="d-flex align-items-center">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faCreditCard} />
                                    </span>
                                    <div className="pay-details">
                                        <div className="pay-title">{t('ZaloPay')}</div>
                                        <div className="description">{t('Fast, secure payments via ZaloPay.')}</div>
                                    </div>
                                </div>
                                <Radio value={2}></Radio>
                            </div>
                            <div className="payment-option">
                                <div className="d-flex align-items-center">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faLandmark} />
                                    </span>
                                    <div className="pay-details">
                                        <div className="pay-title">MoMo</div>
                                        <div className="description">{t('Convenient, secure payments with MoMo.')}</div>
                                    </div>
                                </div>
                                <Radio value={3} ></Radio>
                            </div>
                        </Radio.Group>
                    </div>
                    <div className="agree">
                        <Checkbox onChange={() => setAgree(!agree)}>
                            {t('I agree to all terms')}
                        </Checkbox>

                        {/* Dòng chữ nhỏ */}
                        <div
                            className="mt-2 text-muted"
                            style={{ fontSize: "0.9rem", cursor: "pointer" }}
                            onClick={() => setShowTerms(!showTerms)}
                        >
                            {t('View terms and conditions')}
                        </div>

                        {/* Phần điều khoản hiển thị khi showTerms = true */}
                        {showTerms && (
                            <div className="mt-2 p-2 border rounded bg-light" style={{ fontSize: "0.9rem" }}>
                                <p>{t('By using this service, you agree to our Terms and Conditions, including the return policy and privacy policy of our e-commerce platform.')}</p>
                                <ul>
                                    <li>{t('All orders are subject to availability and confirmation of the order price.')}</li>
                                    <li>{t('Shipping times may vary depending on availability and are subject to any delays resulting from postal delays or force majeure.')}</li>
                                    <li>{t('We reserve the right to refuse or cancel any orders at our discretion.')}</li>
                                </ul>
                            </div>
                        )}

                        <div className="d-flex justify-content-center mt-5">
                            <button className="btn-checkout" onClick={() => handleCheckout()}>
                                {t('Checkout')}
                                <FontAwesomeIcon className="ms-3" icon={faCartShopping} color="#C4DACB" size="sm" />
                            </button>
                        </div>
                    </div>
                    <div>
                    </div>
                </div> :
                <div className="view-order">
                    <div className="order">{t('Order')}</div>
                    <div className="bg"></div>
                    <div className="order-success">
                        <div className="title">{t('Order successfully')}</div>
                        <div className="content">{t('You will receive updates in your notification inbox.')}</div>
                        <div className="d-flex justify-content-center mt-5">
                            <button className="btn-view" onClick={() => navigate(`/orderDetail/${orderId}`)}>{t('View your order')}</button>
                        </div>
                    </div>
                </div>
            }
        </>

    );
}
export default Checkout;