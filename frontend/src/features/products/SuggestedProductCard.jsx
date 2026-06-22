import { useNavigate } from "react-router-dom";

function SuggestedProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <li
      className="flex items-center gap-3 cursor-pointer hover:underline"
      onMouseDown={() => {
        navigate(`/products/${product.id}`);
      }}
    >
      <img src={product.imageUrl} className="w-10 h-10 object-cover"></img>
      <p>{product.title}</p>
    </li>
  );
}

export default SuggestedProductCard;
