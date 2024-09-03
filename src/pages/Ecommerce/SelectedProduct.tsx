import { FC, SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { LiaArrowLeftSolid } from "react-icons/lia";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import css from "classnames";
import { fetchProducts } from "../../apis/ecommerce";
import { iProduct } from "./Product";
import "./SelectedProduct.css";
import "./Ecommerce.css";
import { addProductHandler, updateProductHandler } from "./utils";
import { getCartItems } from "../../Redux/cartSlice";
import { useAppSelector } from "../../Redux/hooks";
import Price from "./components/Price";
import CountIndicator from "./components/CountIndicator";

interface iPrice {
  className?: string;
  text?: string;
  value: string | number;
}

const BackIconContainer = styled.div`
  cursor: pointer;
  padding-left: 1rem;

  &:hover {
    svg {
      color: #02020296;
    }
  }
`;

const SelectedProductWrapper = styled.div`
  max-width: 1200px;
  img {
    height: 70%;
    max-width: 100%;
    object-fit: contain;
  }

  .img-container {
    width: 300px;
    height: 350px;
    object-fit: contain;
  }

  .btn {
    border: none;
    background-color: teal;
    color: #fff;
    font-size: 24px;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    margin: 8px;
    cursor: pointer;
  }

  .title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .sku {
    span {
      font-weight: 700;
      color: #393939e0;
      background-color: #e1e0e0;
      padding: 2px 4px;
      margin-right: 4px;
    }
  }

  .only-price {
    margin-left: auto;
    margin-right: 1rem;
  }
`;

const ImgSelector = styled.div<{ imageurl: string }>`
  width: 36px;
  height: 42px;
  aspect-ratio: 3/2;
  border-radius: 4px;
  background-image: url(${({ imageurl }) => imageurl});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  margin: 1rem;

  &:hover {
    border: 1.5px solid #6c6b6b6f;
    background-color: #cccccc4d;
  }
`;

const PriceContainer = styled.div`
  width: max-content;
  .text {
    padding: 2px;
    margin-right: 1rem;
    border-right: 2px solid #a0a0a0;
    padding-right: 1.5rem;
    color: #666666;
  }

  .price-value {
    font-size: 32px;
  }
`;

const SelectedProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<iProduct | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const cartItems = useAppSelector(getCartItems)
  const countRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0)


  useEffect(() => {
    id &&
      fetchProducts(parseInt(id)).then((res) => {
        setProduct(res as iProduct);
      });
  }, [id]);



  const handleScroll = (e: any) => {
    //   const scrollY = window.scrollY //Don't get confused by what's scrolling - It's not the window
    //   const scrollTop = countRef?.current?.scrollTop
    //   console.log(`onScroll, window.scrollY: ${scrollY} myRef.scrollTop: ${scrollTop}`)
    // setScrollPosition(scrollTop as number)
    console.log(e.target.value)

  }

  const computeCountIndicator = useCallback(()=>{
return product && <CountIndicator product={product} cartItems={cartItems} />
            
  },[product,cartItems])


  return (
    <SelectedProductWrapper onScroll={handleScroll}>
      <BackIconContainer onClick={() => navigate("/e-commerce/products")}>
        <LiaArrowLeftSolid size={32} />
      </BackIconContainer>
      <Price className="only-price" value={product?.price as number} />
      {product && (
        <div className="fl g3">
          <div className="fl pt-2">
            <div>
              {product.images.map((imgUrl, index) => (
                <ImgSelector
                  key={index}
                  className={css({
                    "img-selector__active": index === activeImageIndex
                  })}
                  imageurl={imgUrl}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
            <div className="img-container">
              <img src={product.images[activeImageIndex]} alt={product.title} />
            </div>
          </div>
          <div className="product-content">
            <div className="title">{product.title}</div>
            <div className="sku">
              <span>SKU</span>
              {product.sku}
            </div>
            <div className="fl ac g-3 total-compute-section">
              {computeCountIndicator()}
                <Price text="total" value={product?.price *cartItems[product.id]?.count || product.price} />
            </div>

            <div className="add_wishlist_btn_container">
              <button className="btn" onClick={() => addProductHandler(product, cartItems)}>
                Add to Cart
              </button>
              {/* <button className="btn" onClick={handleBuyNow}>
                Buy Now
              </button> */}
            </div>
            <div className="subheading">Overview</div>
            <div className="content">{product.description}</div>
            {/* <div>{product.price}</div> */}
            {/* <button onClick={handleAddToCart}>Add to Cart</button>
            <button onClick={handleBuyNow}>Buy Now</button>
            <button onClick={handleAddToWishlist}>Add to Wishlist</button>
            <button onClick={handleShare}>Share <SlShareAlt /></button> */}
          </div>
        </div>
      )}
    </SelectedProductWrapper>
  );
};

export default SelectedProduct;
