import { useState } from "react";
import { bre } from "../utils/bloomreach";
const brSDK = bre();

function UserOptions() {
  const [id, setId] = useState();

  return (
    <div>
      <h1 className="text-center text-3xl mb-5 text-white">
        Identify or anonymize your session
      </h1>
      <div>
        <button
          type="button"
          className="px-3 py-2 bg-red-500 text-black rounded mb-5 cursor-pointer"
          onClick={() => {
            brSDK?.anonymize();
          }}
        >
          Anonymize
        </button>
      </div>
      <div>
        <input
          type="text"
          className="input-field"
          onInput={(e) => {
            setId(e.target.value);
          }}
        />
        <button
          className="px-3 py-2 bg-green-500 text-black rounded ml-5 cursor-pointer"
          onClick={() => {
            brSDK?.identify({
              customer_id: id,
            });
          }}
        >
          Identify
        </button>
      </div>
    </div>
  );
}

export default UserOptions;
