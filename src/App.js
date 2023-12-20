import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import trash from "./assets/trash.png";
import check from "./assets/check.png";

const App = () => {
  const [shopItems, setShopItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartChanged, setCartChanged] = useState(false);

  useEffect(() => {
    // Load data from Local Storage when the component is rendered
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Update Local Storage when cartItems change
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    axios.get("http://localhost/car/KLTN/Test/shoes.php").then((res) => {
      setShopItems(res.data.shoes);
    });
  }, [cartChanged]);

  const addToCart = (item) => {
    const newItem = { ...item, inCart: 1, count: 1 };
    setCartItems((prevCartItems) => [...prevCartItems, newItem]);
    setCartChanged(!cartChanged);
  };

  const updateCart = (item, action) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((cartItem) =>
        cartItem.id === item.id
          ? {
              ...cartItem,
              count:
                action === "increment"
                  ? cartItem.count + 1
                  : Math.max(cartItem.count - 1, 1),
            }
          : cartItem
      )
    );

    if (action === "decrement" && item.count === 1) {
      trashCart(item.id);
    }
  };

  const trashCart = (itemId) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.id !== itemId)
    );
    setCartChanged(!cartChanged);
  };

  const total = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.count,
      0
    );
  };

  return (
    <div className="wrapper">
      {/* Left Screen */}
      <div className="screen -left">
        <div className="app-bar">
          <img
            className="logo"
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1315882/pngwave.png"
            alt="Logo"
          />
        </div>
        <div className="title">Picked items</div>
        <div className="shop-items">
          {shopItems.map((item, index) => (
            <div key={index} className="item">
              <div className="item-block">
                <div
                  className="image-area"
                  style={{ backgroundColor: item.color }}
                >
                  <img className="image" src={item.image} alt={item.name} />
                </div>
                <div className="name">{item.name}</div>
                <div className="description">{item.description}</div>
                <div className="inventory">{item.inventory}</div>

                <div className="bottom-area">
                  <div className="price">${item.price}</div>
                  {item.inCart === 0 || item.length === 0 ? (
                    <div
                      className={`button ${
                        item.inCart === "1" ? "-active" : ""
                      }`}
                      onClick={() => addToCart(item)}
                    >
                      ADD TO CART
                    </div>
                  ) : (
                    <img className="check" alt="check" src={check}></img>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Screen */}
      <div className="screen -right">
        <div className="app-bar">
          <img
            className="logo"
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1315882/pngwave.png"
            alt="Logo"
          />
        </div>
        <div className="header-cart">
           <div className="title">Your cart</div>
        <div className="total">
          <p>
        ${total()}
        </p>
        </div>
        </div>
        <div
          className="no-content"
          style={{ display: cartItems.length === 0 ? "block" : "none" }}
        >
          <p className="text">Your cart is empty.</p>
        </div>
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="left">
                <div className="cart-image">
                  <div className="image-wrapper">
                    <img className="image" src={item.image} alt={item.name} />
                  </div>
                </div>
              </div>
              <div className="right">
                <div className="name">{item.name}</div>
                <div className="price">${item.price}</div>
                <div className="count">
                  <button
                    className="button"
                    onClick={() => updateCart(item, "decrement")}
                  >
                    -
                  </button>
                  <div className="number">{item.count}</div>
                  <button
                    disabled={item.count === item.inventory}
                    className="button"
                    onClick={() => updateCart(item, "increment")}
                  >
                    +
                  </button>
                  <div className="trash">
                    <img
                      onClick={() => trashCart(item.id)}
                      alt="trash"
                      src={trash}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
